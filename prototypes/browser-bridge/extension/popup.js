const status = document.querySelector('#status');
const targets = document.querySelector('#targets');
const permission = { origins: ['https://www.youtube.com/*'] };
async function refresh() {
  const result = await chrome.runtime.sendMessage({ type: 'status' });
  status.textContent = result.connected ? 'Host terhubung — baca-saja' : 'Host terputus — tidak ada target aktif';
  targets.replaceChildren();
  for (const target of result.targets) {
    const li = document.createElement('li');
    li.append(document.createTextNode(target.label + ' '));
    const button = document.createElement('button');
    button.textContent = 'Lepas';
    button.addEventListener('click', () => perform({ type: 'release', enrollmentId: target.enrollmentId }));
    li.append(button); targets.append(li);
  }
}
async function perform(message) {
  try {
    const response = await chrome.runtime.sendMessage(message);
    if (response?.error) throw new Error(response.error);
    await refresh();
  } catch { status.textContent = 'Operasi gagal. Periksa host, izin, lalu coba lagi.'; }
}
document.querySelector('#connect').addEventListener('click', () => perform({ type: 'connect' }));
document.querySelector('#enroll').addEventListener('click', async () => {
  // Start the permission request synchronously in the user gesture.
  let navigationChanged = false;
  const navigation = (_tabId, info) => { if (info.status === 'loading' || info.url !== undefined) navigationChanged = true; };
  chrome.tabs.onUpdated.addListener(navigation);
  const before = chrome.tabs.query({ active: true, currentWindow: true });
  const grant = chrome.permissions.request(permission);
  try {
    const [tabs, granted] = await Promise.all([before, grant]);
    if (!granted) { status.textContent = 'Izin ditolak; tidak ada tab didaftarkan.'; return; }
    const current = await chrome.tabs.query({ active: true, currentWindow: true });
    if (navigationChanged || !tabs[0] || tabs[0].id !== current[0]?.id) throw new Error('tab_changed');
    await perform({ type: 'enroll', tabId: tabs[0].id });
  } catch { status.textContent = 'Tab berubah atau izin gagal. Daftarkan kembali tab yang dipilih.'; }
  finally { chrome.tabs.onUpdated.removeListener(navigation); }
});
document.querySelector('#revoke').addEventListener('click', async () => {
  try { await chrome.permissions.remove(permission); await perform({ type: 'revoke' }); }
  catch { status.textContent = 'Pencabutan izin gagal.'; }
});
chrome.runtime.onMessage.addListener(message => { if (message?.type === 'changed') refresh().catch(() => {}); });
refresh().catch(() => { status.textContent = 'Coordinator belum tersedia.'; });
