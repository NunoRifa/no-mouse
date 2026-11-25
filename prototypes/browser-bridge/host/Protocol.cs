using System.Buffers.Binary;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace NoMouse.BrowserBridge;

internal static class Protocol
{
    internal const int MaxBytes = 65536;
    private static readonly UTF8Encoding Utf8 = new(false, true);

    internal static async Task<JsonDocument?> ReadFrameAsync(Stream input, CancellationToken cancellationToken)
    {
        var prefix = new byte[4];
        var first = await input.ReadAsync(prefix.AsMemory(0, 1), cancellationToken);
        if (first == 0) return null;
        await input.ReadExactlyAsync(prefix.AsMemory(1), cancellationToken);
        var size = BinaryPrimitives.ReadUInt32LittleEndian(prefix);
        if (size is 0 or > MaxBytes) throw new InvalidDataException();
        var bytes = new byte[(int)size];
        await input.ReadExactlyAsync(bytes, cancellationToken);
        return JsonDocument.Parse(Utf8.GetString(bytes), new JsonDocumentOptions { MaxDepth = 8 });
    }

    internal static async Task WriteFrameAsync(Stream output, object value, CancellationToken cancellationToken)
    {
        var bytes = JsonSerializer.SerializeToUtf8Bytes(value);
        if (bytes.Length > MaxBytes) throw new InvalidDataException();
        var prefix = new byte[4];
        BinaryPrimitives.WriteUInt32LittleEndian(prefix, (uint)bytes.Length);
        await output.WriteAsync(prefix, cancellationToken);
        await output.WriteAsync(bytes, cancellationToken);
        await output.FlushAsync(cancellationToken);
    }
}

internal sealed class Session
{
    private readonly string connectionId = Guid.NewGuid().ToString("N");
    private readonly string epoch = Guid.NewGuid().ToString("N");
    private readonly Dictionary<string, Target> targets = [];
    private readonly HashSet<string> retired = [];
    private readonly HashSet<string> requests = [];
    private bool connected;
    private int revision;

    private sealed record Target(string enrollmentId, string generation, string service, string label, string status, string targetHandle);

    private static string Text(JsonElement value, string name)
    {
        if (!value.TryGetProperty(name, out var item) || item.ValueKind != JsonValueKind.String) throw new InvalidDataException();
        return item.GetString()!;
    }

    private static string Id(JsonElement value, string name)
    {
        var text = Text(value, name);
        if (!Regex.IsMatch(text, "\\A[A-Za-z0-9_-]{1,64}\\z", RegexOptions.CultureInvariant)) throw new InvalidDataException();
        return text;
    }

    private static void Fields(JsonElement value, params string[] allowed)
    {
        if (value.ValueKind != JsonValueKind.Object) throw new InvalidDataException();
        var names = value.EnumerateObject().Select(p => p.Name).ToArray();
        if (names.Length != allowed.Length || names.Distinct().Count() != names.Length || names.Any(n => !allowed.Contains(n))) throw new InvalidDataException();
    }

    internal object Handle(JsonElement value)
    {
        string? requestId = null;
        object Error(string code) => new { version = 1, type = "error", requestId, code };
        object Snapshot() => new { version = 1, type = "snapshot", requestId, connectionId, epoch, revision, targets = targets.Values.ToArray() };
        try
        {
            if (value.ValueKind != JsonValueKind.Object) return Error("invalid_message");
            requestId = Id(value, "requestId");
            if (!value.TryGetProperty("version", out var version) || !version.TryGetInt32(out var number) || number != 1) return Error("invalid_message");
            var type = Id(value, "type");
            var names = value.EnumerateObject().Select(p => p.Name).ToArray();
            if (names.Distinct().Count() != names.Length) return Error("invalid_message");
            if (requests.Count >= 4096) throw new IOException("request_limit");
            if (!requests.Add(requestId)) return Error("replayed_request");
            if (type == "hello")
            {
                Fields(value, "version", "type", "requestId", "browser");
                if (Text(value, "browser") != "chrome") return Error("invalid_message");
                if (connected) return Error("already_connected");
                connected = true;
                return new { version = 1, type = "helloAck", requestId, connectionId, epoch, mode = "read-only" };
            }
            if (!connected) return Error("handshake_required");
            if (type is not ("targetUpsert" or "targetRemove" or "snapshotRequest")) return Error("unsupported_operation");
            if (type == "targetUpsert") Fields(value, "version", "type", "requestId", "epoch", "enrollmentId", "generation", "service", "label", "status");
            if (type == "targetRemove") Fields(value, "version", "type", "requestId", "epoch", "enrollmentId", "generation", "reason");
            if (type == "snapshotRequest") Fields(value, "version", "type", "requestId", "epoch");
            if (Id(value, "epoch") != epoch) return Error("stale_connection");
            if (type == "snapshotRequest") return Snapshot();
            var id = Id(value, "enrollmentId");
            var generation = Id(value, "generation");
            if (type == "targetRemove")
            {
                if (Text(value, "reason") is not ("navigation" or "closed" or "revoked" or "disconnected" or "released")) return Error("invalid_message");
                if (!targets.TryGetValue(id, out var old) || old.generation != generation) return Error("stale_target");
                targets.Remove(id);
                retired.Add(id);
            }
            else
            {
                var label = Text(value, "label");
                if (Text(value, "service") != "youtube" || Text(value, "status") != "registered" || !Regex.IsMatch(label, "\\AYouTube — Tab [1-9][0-9]{0,5}\\z", RegexOptions.CultureInvariant)) return Error("invalid_message");
                if (retired.Contains(id) || (targets.TryGetValue(id, out var previous) && previous.generation != generation)) return Error("stale_target");
                if (!targets.ContainsKey(id) && targets.Count >= 50) return Error("target_limit");
                var handle = targets.TryGetValue(id, out var existing) ? existing.targetHandle : Guid.NewGuid().ToString("N");
                targets[id] = new Target(id, generation, "youtube", label, "registered", handle);
            }
            revision++;
            return Snapshot();
        }
        catch (Exception ex) when (ex is InvalidDataException or InvalidOperationException or FormatException)
        {
            return Error("invalid_message");
        }
    }
}
