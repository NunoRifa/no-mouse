using System.Text.Json;
using NoMouse.BrowserBridge;

// ponytail: local read-only prototype; browser registration requires an exact
// origin allowlist file. This is not authentication against same-user malware.
var check = args.Length == 1 && args[0] == "--stdio-check";
if (!check)
{
    try
    {
        var path = Path.Combine(AppContext.BaseDirectory, "allowed-origins.json");
        var allowed = JsonSerializer.Deserialize<string[]>(File.ReadAllText(path));
        if (args.Length < 1 || allowed is null || !allowed.Contains(args[0]) ||
            !System.Text.RegularExpressions.Regex.IsMatch(args[0], "\\Achrome-extension://[a-p]{32}/\\z"))
            throw new InvalidDataException();
    }
    catch (Exception ex) when (ex is IOException or UnauthorizedAccessException or JsonException or InvalidDataException)
    {
        Console.Error.WriteLine("origin_not_allowed");
        return 2;
    }
}

var session = new Session();
try
{
    using var input = Console.OpenStandardInput();
    using var output = Console.OpenStandardOutput();
    while (await Protocol.ReadFrameAsync(input, CancellationToken.None) is { } document)
    {
        using (document)
            await Protocol.WriteFrameAsync(output, session.Handle(document.RootElement), CancellationToken.None);
    }
    return 0;
}
catch (Exception ex) when (ex is IOException or InvalidDataException or JsonException or System.Text.DecoderFallbackException)
{
    Console.Error.WriteLine("invalid_frame");
    return 1;
}
