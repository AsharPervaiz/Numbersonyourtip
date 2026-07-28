"use client";

import dynamic from "next/dynamic";

// Dynamically import CookieConsent with ssr: false (only works in client component)
const CookieConsent = dynamic(() => import("./CookieConsent"), {
  ssr: false, // This is allowed here because it's a client component
});

export default function CookieConsentWrapper() {
  return <CookieConsent />;
}
