// Pruddo Service Worker — Manifest V3
// All API calls from the extension go through here, not from content scripts.

chrome.action.onClicked.addListener((tab) => {
  if (tab.id == null) return;
  chrome.sidePanel.open({ tabId: tab.id });
});

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "PRODUCT_DETECTED") {
    // Store the detected product info and notify the side panel
    chrome.storage.local.set({ currentProduct: message.payload }, () => {
      // Broadcast to side panel
      chrome.runtime.sendMessage({
        type: "PRODUCT_UPDATED",
        payload: message.payload,
      });
    });
    sendResponse({ ok: true });
  }
  return true; // Keep the message channel open for async response
});
