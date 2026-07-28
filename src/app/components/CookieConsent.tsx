"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, Settings } from "lucide-react";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (!cookieConsent) {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    setPreferences({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    });
    localStorage.setItem("cookieConsent", "all");
    setShowBanner(false);
    setShowSettings(false);
  };

  const rejectAll = () => {
    setPreferences({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    });
    localStorage.setItem("cookieConsent", "necessary");
    setShowBanner(false);
    setShowSettings(false);
  };

  const savePreferences = () => {
    localStorage.setItem("cookieConsent", JSON.stringify(preferences));
    setShowBanner(false);
    setShowSettings(false);
  };

  const openSettings = () => {
    setShowSettings(true);
    setShowBanner(false);
  };

  const toggleFloatingIcon = () => {
    setShowSettings(true);
  };

  // Floating Icon (when consent given)
  if (!showBanner && !showSettings && localStorage.getItem("cookieConsent")) {
    return (
      <div
        onClick={toggleFloatingIcon}
        style={{
          position: "fixed",
          bottom: "30px",
          left: "30px",
          zIndex: 999,
          cursor: "pointer",
          backgroundColor: "#1b3066",
          color: "white",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
          transition: "all 0.3s ease",
          border: "2px solid white",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.backgroundColor = "#2a4088";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.backgroundColor = "#1b3066";
        }}
      >
        <Cookie size={30} />
      </div>
    );
  }

  if (!showBanner && !showSettings) return null;

  return (
    <>
      {/* Floating Settings Icon */}
      <div
        onClick={openSettings}
        style={{
          position: "fixed",
          bottom: "30px",
          left: "30px",
          zIndex: 999,
          cursor: "pointer",
          backgroundColor: "#1b3066",
          color: "white",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          transition: "all 0.3s ease",
          border: "2px solid white",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.backgroundColor = "#2a4088";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.backgroundColor = "#1b3066";
        }}
      >
        <Settings size={24} />
      </div>

      {/* Compact Banner */}
      {(showBanner || showSettings) && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "90%",
            maxWidth: "1000px",
            backgroundColor: "white",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            zIndex: 1000,
            padding: "16px 24px",
            borderRadius: "16px",
            border: "1px solid #eaeaea",
          }}
        >
          {!showSettings ? (
            // Compact Initial Banner
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  flex: 1,
                  minWidth: "250px",
                }}
              >
                <div style={{ fontSize: "28px", lineHeight: 1 }}>🍪</div>
                <div>
                  <span
                    style={{ fontSize: "14px", color: "#333", lineHeight: 1.4 }}
                  >
                    We use cookies to enhance your experience. By continuing,
                    you agree to our{" "}
                    <Link
                      href="/privacy-policy/"
                      style={{
                        color: "#1b3066",
                        textDecoration: "underline",
                        fontWeight: 500,
                      }}
                    >
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button
                  onClick={rejectAll}
                  style={{
                    padding: "8px 16px",
                    border: "1px solid #1b3066",
                    backgroundColor: "white",
                    color: "#1b3066",
                    borderRadius: "30px",
                    cursor: "pointer",
                    fontWeight: 500,
                    fontSize: "14px",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f0f2f8";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "white";
                  }}
                >
                  Reject
                </button>
                <button
                  onClick={openSettings}
                  style={{
                    padding: "8px 16px",
                    border: "1px solid #1b3066",
                    backgroundColor: "white",
                    color: "#1b3066",
                    borderRadius: "30px",
                    cursor: "pointer",
                    fontWeight: 500,
                    fontSize: "14px",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f0f2f8";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "white";
                  }}
                >
                  Customize
                </button>
                <button
                  onClick={acceptAll}
                  style={{
                    padding: "8px 20px",
                    border: "none",
                    backgroundColor: "#1b3066",
                    color: "white",
                    borderRadius: "30px",
                    cursor: "pointer",
                    fontWeight: 500,
                    fontSize: "14px",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#2a4088";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#1b3066";
                  }}
                >
                  Accept
                </button>
              </div>
            </div>
          ) : (
            // Compact Settings Panel
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#1b3066",
                    margin: 0,
                  }}
                >
                  Cookie Preferences
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "20px",
                    cursor: "pointer",
                    color: "#666",
                  }}
                >
                  ✕
                </button>
              </div>

              <p
                style={{
                  fontSize: "13px",
                  marginBottom: "16px",
                  color: "#666",
                }}
              >
                Customize your cookie preferences. Necessary cookies are always
                enabled.
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  marginBottom: "20px",
                }}
              >
                {/* Cookie Options - Compact */}
                {[
                  {
                    key: "necessary",
                    label: "Necessary",
                    desc: "Required for basic functions",
                    disabled: true,
                  },
                  {
                    key: "functional",
                    label: "Functional",
                    desc: "Enhanced functionality",
                  },
                  {
                    key: "analytics",
                    label: "Analytics",
                    desc: "Usage analysis",
                  },
                  {
                    key: "marketing",
                    label: "Marketing",
                    desc: "Personalized ads",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: "14px" }}>{item.label}</strong>
                      <p
                        style={{
                          fontSize: "11px",
                          color: "#666",
                          margin: "2px 0 0",
                        }}
                      >
                        {item.desc}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={
                        preferences[item.key as keyof typeof preferences]
                      }
                      disabled={item.disabled}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          [item.key]: e.target.checked,
                        })
                      }
                      style={{
                        width: "18px",
                        height: "18px",
                        cursor: item.disabled ? "not-allowed" : "pointer",
                        accentColor: "#1b3066",
                      }}
                    />
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={acceptAll}
                  style={{
                    padding: "8px 16px",
                    border: "none",
                    backgroundColor: "#1b3066",
                    color: "white",
                    borderRadius: "30px",
                    cursor: "pointer",
                    fontWeight: 500,
                    fontSize: "13px",
                  }}
                >
                  Accept All
                </button>
                <button
                  onClick={savePreferences}
                  style={{
                    padding: "8px 16px",
                    border: "1px solid #1b3066",
                    backgroundColor: "white",
                    color: "#1b3066",
                    borderRadius: "30px",
                    cursor: "pointer",
                    fontWeight: 500,
                    fontSize: "13px",
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
