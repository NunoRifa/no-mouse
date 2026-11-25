(() => {
  const port = chrome.runtime.connect({ name: 'nomouse-readonly-document' });
  const generation = crypto.randomUUID();
  let locationAtEnrollment = location.href;
  let closed = false;
  const interval = setInterval(() => {
    if (location.href !== locationAtEnrollment) {
      locationAtEnrollment = '';
      close();
    }
  }, 250);
  function close() {
    if (closed) return;
    closed = true; clearInterval(interval); port.disconnect();
    window.removeEventListener('pagehide', close);
  }
  window.addEventListener('pagehide', close, { once: true });
  port.onDisconnect.addListener(close);
  port.onMessage.addListener(message => { if (message?.type === 'release') close(); });
  port.postMessage({ type: 'documentReady', generation });
})();
