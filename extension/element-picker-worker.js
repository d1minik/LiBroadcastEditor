chrome.runtime.onMessage.addListener((request, sender, respond) => {
  if (request.action !== 'bc-picker:open-popup' || !sender.tab?.active || sender.frameId !== 0) return;

  (async () => {
    try {
      await chrome.action.openPopup({ windowId: sender.tab.windowId });
      respond({ ok: true });
    } catch {
      respond({ ok: false });
    }
  })();
  return true;
});
