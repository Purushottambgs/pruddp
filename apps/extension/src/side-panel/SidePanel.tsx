import { useEffect, useState } from "react";

type Tab = "reviews" | "price" | "buy";

interface DetectedProduct {
  asin: string | null;
  name: string | null;
  url: string;
}

const TABS: { id: Tab; label: string }[] = [
  { id: "reviews", label: "Reviews" },
  { id: "price", label: "Price" },
  { id: "buy", label: "Buy" },
];

export function SidePanel() {
  const [activeTab, setActiveTab] = useState<Tab>("reviews");
  const [product, setProduct] = useState<DetectedProduct | null>(null);

  useEffect(() => {
    // Load any stored product on mount
    chrome.storage.local.get("currentProduct", (result) => {
      if (result["currentProduct"]) {
        setProduct(result["currentProduct"] as DetectedProduct);
      }
    });

    // Listen for product updates from the service worker
    const listener = (message: { type: string; payload: DetectedProduct }) => {
      if (message.type === "PRODUCT_UPDATED") {
        setProduct(message.payload);
      }
    };
    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f8fafc",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #e2e8f0",
          backgroundColor: "#fff",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 18 }}>
          <span style={{ color: "#6366f1" }}>Pru</span>ddo
        </div>
        {product?.name && (
          <div
            style={{
              marginTop: 4,
              fontSize: 12,
              color: "#64748b",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {product.name}
          </div>
        )}
      </div>

      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #e2e8f0",
          backgroundColor: "#fff",
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: "10px 0",
              fontSize: 13,
              fontWeight: 500,
              border: "none",
              backgroundColor: "transparent",
              cursor: "pointer",
              color: activeTab === tab.id ? "#6366f1" : "#64748b",
              borderBottom: activeTab === tab.id ? "2px solid #6366f1" : "2px solid transparent",
              transition: "all 0.15s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, padding: 16 }}>
        {!product ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: 200,
              gap: 8,
              color: "#94a3b8",
              textAlign: "center",
              fontSize: 13,
            }}
          >
            <div style={{ fontSize: 32 }}>🛒</div>
            <p>Navigate to an Amazon product page to see reviews, prices, and trust scores.</p>
          </div>
        ) : (
          <TabContent tab={activeTab} product={product} />
        )}
      </div>
    </div>
  );
}

function TabContent({
  tab,
  product,
}: {
  tab: Tab;
  product: DetectedProduct;
}) {
  if (tab === "reviews") {
    return (
      <div>
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            border: "1px solid #e2e8f0",
            padding: 16,
            marginBottom: 12,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
            Trust Score
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 40, fontWeight: 700, color: "#10b981" }}>87</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#10b981" }}>Great Buy</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>Based on 12,847 reviews</div>
            </div>
          </div>
        </div>
        <p style={{ fontSize: 12, color: "#94a3b8" }}>
          ASIN: {product.asin ?? "Unknown"} — Full analysis loads when API is connected.
        </p>
      </div>
    );
  }

  if (tab === "price") {
    return (
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          border: "1px solid #e2e8f0",
          padding: 16,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
          Best Price
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, color: "#10b981" }}>$279.99</div>
        <div style={{ fontSize: 12, color: "#64748b" }}>Amazon · In stock</div>
        <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 12 }}>Price history chart will appear here.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: 12,
        border: "1px solid #e2e8f0",
        padding: 16,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
        Where to Buy
      </div>
      <a
        href={`https://www.amazon.com/dp/${product.asin ?? ""}?tag=pruddo-20`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block",
          backgroundColor: "#6366f1",
          color: "#fff",
          borderRadius: 8,
          padding: "10px 16px",
          textDecoration: "none",
          fontSize: 14,
          fontWeight: 600,
          textAlign: "center",
        }}
      >
        Buy on Amazon →
      </a>
    </div>
  );
}
