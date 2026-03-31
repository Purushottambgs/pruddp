// Pruddo Content Script — Amazon product page detection
// Vanilla TypeScript only — no React, no framework.

interface DetectedProduct {
  asin: string | null;
  name: string | null;
  url: string;
}

function detectAmazonProduct(): DetectedProduct | null {
  const url = window.location.href;

  // Only run on Amazon product (DP) pages
  const dpMatch =
    url.match(/\/dp\/([A-Z0-9]{10})/) ??
    url.match(/\/product\/([A-Z0-9]{10})/);

  if (!dpMatch) return null;

  const asin = dpMatch[1] ?? null;
  const titleEl = document.getElementById("productTitle");
  const name = titleEl?.textContent?.trim() ?? null;

  return { asin, name, url };
}

function init() {
  const product = detectAmazonProduct();
  if (!product) return;

  chrome.runtime.sendMessage(
    { type: "PRODUCT_DETECTED", payload: product },
    () => {
      if (chrome.runtime.lastError) {
        // Extension not available yet — ignore
      }
    }
  );
}

// Run on initial load
init();

// Re-run on SPA navigation (Amazon uses history API)
let lastUrl = window.location.href;
new MutationObserver(() => {
  if (window.location.href !== lastUrl) {
    lastUrl = window.location.href;
    init();
  }
}).observe(document.body, { subtree: true, childList: true });
