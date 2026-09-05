"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.min.css";

interface TZEntry {
  city: string;
  country: string;
  tz: string;
  region: string;
  cc: string;
}

const ALL_ZONES: TZEntry[] = [
  {
    city: "New York",
    country: "United States",
    tz: "America/New_York",
    region: "Americas",
    cc: "us",
  },
  {
    city: "Los Angeles",
    country: "United States",
    tz: "America/Los_Angeles",
    region: "Americas",
    cc: "us",
  },
  {
    city: "Chicago",
    country: "United States",
    tz: "America/Chicago",
    region: "Americas",
    cc: "us",
  },
  {
    city: "Denver",
    country: "United States",
    tz: "America/Denver",
    region: "Americas",
    cc: "us",
  },
  {
    city: "Phoenix",
    country: "United States",
    tz: "America/Phoenix",
    region: "Americas",
    cc: "us",
  },
  {
    city: "Anchorage",
    country: "United States",
    tz: "America/Anchorage",
    region: "Americas",
    cc: "us",
  },
  {
    city: "Honolulu",
    country: "United States",
    tz: "Pacific/Honolulu",
    region: "Americas",
    cc: "us",
  },
  {
    city: "Toronto",
    country: "Canada",
    tz: "America/Toronto",
    region: "Americas",
    cc: "ca",
  },
  {
    city: "Vancouver",
    country: "Canada",
    tz: "America/Vancouver",
    region: "Americas",
    cc: "ca",
  },
  {
    city: "Montreal",
    country: "Canada",
    tz: "America/Montreal",
    region: "Americas",
    cc: "ca",
  },
  {
    city: "Mexico City",
    country: "Mexico",
    tz: "America/Mexico_City",
    region: "Americas",
    cc: "mx",
  },
  {
    city: "São Paulo",
    country: "Brazil",
    tz: "America/Sao_Paulo",
    region: "Americas",
    cc: "br",
  },
  {
    city: "Buenos Aires",
    country: "Argentina",
    tz: "America/Argentina/Buenos_Aires",
    region: "Americas",
    cc: "ar",
  },
  {
    city: "Bogotá",
    country: "Colombia",
    tz: "America/Bogota",
    region: "Americas",
    cc: "co",
  },
  {
    city: "Lima",
    country: "Peru",
    tz: "America/Lima",
    region: "Americas",
    cc: "pe",
  },
  {
    city: "Santiago",
    country: "Chile",
    tz: "America/Santiago",
    region: "Americas",
    cc: "cl",
  },
  {
    city: "Caracas",
    country: "Venezuela",
    tz: "America/Caracas",
    region: "Americas",
    cc: "ve",
  },
  {
    city: "London",
    country: "United Kingdom",
    tz: "Europe/London",
    region: "Europe",
    cc: "gb",
  },
  {
    city: "Paris",
    country: "France",
    tz: "Europe/Paris",
    region: "Europe",
    cc: "fr",
  },
  {
    city: "Berlin",
    country: "Germany",
    tz: "Europe/Berlin",
    region: "Europe",
    cc: "de",
  },
  {
    city: "Amsterdam",
    country: "Netherlands",
    tz: "Europe/Amsterdam",
    region: "Europe",
    cc: "nl",
  },
  {
    city: "Brussels",
    country: "Belgium",
    tz: "Europe/Brussels",
    region: "Europe",
    cc: "be",
  },
  {
    city: "Madrid",
    country: "Spain",
    tz: "Europe/Madrid",
    region: "Europe",
    cc: "es",
  },
  {
    city: "Rome",
    country: "Italy",
    tz: "Europe/Rome",
    region: "Europe",
    cc: "it",
  },
  {
    city: "Zurich",
    country: "Switzerland",
    tz: "Europe/Zurich",
    region: "Europe",
    cc: "ch",
  },
  {
    city: "Vienna",
    country: "Austria",
    tz: "Europe/Vienna",
    region: "Europe",
    cc: "at",
  },
  {
    city: "Stockholm",
    country: "Sweden",
    tz: "Europe/Stockholm",
    region: "Europe",
    cc: "se",
  },
  {
    city: "Oslo",
    country: "Norway",
    tz: "Europe/Oslo",
    region: "Europe",
    cc: "no",
  },
  {
    city: "Copenhagen",
    country: "Denmark",
    tz: "Europe/Copenhagen",
    region: "Europe",
    cc: "dk",
  },
  {
    city: "Helsinki",
    country: "Finland",
    tz: "Europe/Helsinki",
    region: "Europe",
    cc: "fi",
  },
  {
    city: "Warsaw",
    country: "Poland",
    tz: "Europe/Warsaw",
    region: "Europe",
    cc: "pl",
  },
  {
    city: "Prague",
    country: "Czech Republic",
    tz: "Europe/Prague",
    region: "Europe",
    cc: "cz",
  },
  {
    city: "Budapest",
    country: "Hungary",
    tz: "Europe/Budapest",
    region: "Europe",
    cc: "hu",
  },
  {
    city: "Bucharest",
    country: "Romania",
    tz: "Europe/Bucharest",
    region: "Europe",
    cc: "ro",
  },
  {
    city: "Athens",
    country: "Greece",
    tz: "Europe/Athens",
    region: "Europe",
    cc: "gr",
  },
  {
    city: "Istanbul",
    country: "Turkey",
    tz: "Europe/Istanbul",
    region: "Europe",
    cc: "tr",
  },
  {
    city: "Moscow",
    country: "Russia",
    tz: "Europe/Moscow",
    region: "Europe",
    cc: "ru",
  },
  {
    city: "Kyiv",
    country: "Ukraine",
    tz: "Europe/Kiev",
    region: "Europe",
    cc: "ua",
  },
  {
    city: "Lisbon",
    country: "Portugal",
    tz: "Europe/Lisbon",
    region: "Europe",
    cc: "pt",
  },
  {
    city: "Dublin",
    country: "Ireland",
    tz: "Europe/Dublin",
    region: "Europe",
    cc: "ie",
  },
  { city: "Dubai", country: "UAE", tz: "Asia/Dubai", region: "Asia", cc: "ae" },
  {
    city: "Riyadh",
    country: "Saudi Arabia",
    tz: "Asia/Riyadh",
    region: "Asia",
    cc: "sa",
  },
  {
    city: "Kuwait City",
    country: "Kuwait",
    tz: "Asia/Kuwait",
    region: "Asia",
    cc: "kw",
  },
  {
    city: "Doha",
    country: "Qatar",
    tz: "Asia/Qatar",
    region: "Asia",
    cc: "qa",
  },
  {
    city: "Karachi",
    country: "Pakistan",
    tz: "Asia/Karachi",
    region: "Asia",
    cc: "pk",
  },
  {
    city: "Mumbai",
    country: "India",
    tz: "Asia/Kolkata",
    region: "Asia",
    cc: "in",
  },
  {
    city: "Delhi",
    country: "India",
    tz: "Asia/Kolkata",
    region: "Asia",
    cc: "in",
  },
  {
    city: "Dhaka",
    country: "Bangladesh",
    tz: "Asia/Dhaka",
    region: "Asia",
    cc: "bd",
  },
  {
    city: "Colombo",
    country: "Sri Lanka",
    tz: "Asia/Colombo",
    region: "Asia",
    cc: "lk",
  },
  {
    city: "Kathmandu",
    country: "Nepal",
    tz: "Asia/Kathmandu",
    region: "Asia",
    cc: "np",
  },
  {
    city: "Bangkok",
    country: "Thailand",
    tz: "Asia/Bangkok",
    region: "Asia",
    cc: "th",
  },
  {
    city: "Jakarta",
    country: "Indonesia",
    tz: "Asia/Jakarta",
    region: "Asia",
    cc: "id",
  },
  {
    city: "Singapore",
    country: "Singapore",
    tz: "Asia/Singapore",
    region: "Asia",
    cc: "sg",
  },
  {
    city: "Kuala Lumpur",
    country: "Malaysia",
    tz: "Asia/Kuala_Lumpur",
    region: "Asia",
    cc: "my",
  },
  {
    city: "Ho Chi Minh City",
    country: "Vietnam",
    tz: "Asia/Ho_Chi_Minh",
    region: "Asia",
    cc: "vn",
  },
  {
    city: "Manila",
    country: "Philippines",
    tz: "Asia/Manila",
    region: "Asia",
    cc: "ph",
  },
  {
    city: "Hong Kong",
    country: "China",
    tz: "Asia/Hong_Kong",
    region: "Asia",
    cc: "hk",
  },
  {
    city: "Shanghai",
    country: "China",
    tz: "Asia/Shanghai",
    region: "Asia",
    cc: "cn",
  },
  {
    city: "Beijing",
    country: "China",
    tz: "Asia/Shanghai",
    region: "Asia",
    cc: "cn",
  },
  {
    city: "Taipei",
    country: "Taiwan",
    tz: "Asia/Taipei",
    region: "Asia",
    cc: "tw",
  },
  {
    city: "Seoul",
    country: "South Korea",
    tz: "Asia/Seoul",
    region: "Asia",
    cc: "kr",
  },
  {
    city: "Tokyo",
    country: "Japan",
    tz: "Asia/Tokyo",
    region: "Asia",
    cc: "jp",
  },
  {
    city: "Osaka",
    country: "Japan",
    tz: "Asia/Tokyo",
    region: "Asia",
    cc: "jp",
  },
  {
    city: "Tashkent",
    country: "Uzbekistan",
    tz: "Asia/Tashkent",
    region: "Asia",
    cc: "uz",
  },
  {
    city: "Almaty",
    country: "Kazakhstan",
    tz: "Asia/Almaty",
    region: "Asia",
    cc: "kz",
  },
  {
    city: "Tehran",
    country: "Iran",
    tz: "Asia/Tehran",
    region: "Asia",
    cc: "ir",
  },
  {
    city: "Kabul",
    country: "Afghanistan",
    tz: "Asia/Kabul",
    region: "Asia",
    cc: "af",
  },
  {
    city: "Cairo",
    country: "Egypt",
    tz: "Africa/Cairo",
    region: "Africa",
    cc: "eg",
  },
  {
    city: "Nairobi",
    country: "Kenya",
    tz: "Africa/Nairobi",
    region: "Africa",
    cc: "ke",
  },
  {
    city: "Lagos",
    country: "Nigeria",
    tz: "Africa/Lagos",
    region: "Africa",
    cc: "ng",
  },
  {
    city: "Johannesburg",
    country: "South Africa",
    tz: "Africa/Johannesburg",
    region: "Africa",
    cc: "za",
  },
  {
    city: "Casablanca",
    country: "Morocco",
    tz: "Africa/Casablanca",
    region: "Africa",
    cc: "ma",
  },
  {
    city: "Accra",
    country: "Ghana",
    tz: "Africa/Accra",
    region: "Africa",
    cc: "gh",
  },
  {
    city: "Addis Ababa",
    country: "Ethiopia",
    tz: "Africa/Addis_Ababa",
    region: "Africa",
    cc: "et",
  },
  {
    city: "Sydney",
    country: "Australia",
    tz: "Australia/Sydney",
    region: "Pacific",
    cc: "au",
  },
  {
    city: "Melbourne",
    country: "Australia",
    tz: "Australia/Melbourne",
    region: "Pacific",
    cc: "au",
  },
  {
    city: "Brisbane",
    country: "Australia",
    tz: "Australia/Brisbane",
    region: "Pacific",
    cc: "au",
  },
  {
    city: "Perth",
    country: "Australia",
    tz: "Australia/Perth",
    region: "Pacific",
    cc: "au",
  },
  {
    city: "Adelaide",
    country: "Australia",
    tz: "Australia/Adelaide",
    region: "Pacific",
    cc: "au",
  },
  {
    city: "Auckland",
    country: "New Zealand",
    tz: "Pacific/Auckland",
    region: "Pacific",
    cc: "nz",
  },
  {
    city: "Fiji",
    country: "Fiji",
    tz: "Pacific/Fiji",
    region: "Pacific",
    cc: "fj",
  },
  { city: "UTC", country: "Universal", tz: "UTC", region: "UTC", cc: "un" },
];

const REGION_ORDER = ["Americas", "Europe", "Asia", "Africa", "Pacific", "UTC"];

function Flag({ cc, size = 22 }: { cc: string; size?: number }) {
  if (cc === "un")
    return (
      <span
        style={{
          fontSize: size * 0.85,
          lineHeight: 1,
          display: "inline-flex",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        🌐
      </span>
    );
  const h = Math.round(size * 0.67);
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={`https://flagcdn.com/w${size * 2}/${cc.toLowerCase()}.png`}
      width={size}
      height={h}
      alt={cc.toUpperCase()}
      style={{
        borderRadius: 2,
        objectFit: "cover",
        flexShrink: 0,
        display: "inline-block",
        border: "1px solid rgba(0,0,0,0.1)",
        verticalAlign: "middle",
      }}
      loading="lazy"
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = "none";
      }}
    />
  );
}

function formatInTZ(date: Date, tz: string, opts: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-US", { ...opts, timeZone: tz }).format(
    date,
  );
}
function getOffset(tz: string, date: Date): string {
  try {
    const utcMs = Date.parse(date.toLocaleString("en-US", { timeZone: "UTC" }));
    const tzMs = Date.parse(date.toLocaleString("en-US", { timeZone: tz }));
    const diff = Math.round((tzMs - utcMs) / 60000);
    const sign = diff >= 0 ? "+" : "-";
    const abs = Math.abs(diff);
    const h = Math.floor(abs / 60)
      .toString()
      .padStart(2, "0");
    const m = (abs % 60).toString().padStart(2, "0");
    return `UTC${sign}${h}:${m}`;
  } catch {
    return "UTC";
  }
}
function getHourIn(date: Date, tz: string): number {
  return parseInt(formatInTZ(date, tz, { hour: "numeric", hour12: false }));
}
function getTimeOfDayClass(date: Date, tz: string): string {
  const h = getHourIn(date, tz);
  if (h >= 6 && h < 12) return "tz-morning";
  if (h >= 12 && h < 18) return "tz-afternoon";
  if (h >= 18 && h < 22) return "tz-evening";
  return "tz-night";
}

const TOD_PALETTE: Record<
  string,
  {
    face: string;
    rim: string;
    hour: string;
    min: string;
    sec: string;
    dot: string;
    tick: string;
    num: string;
  }
> = {
  "tz-morning": {
    face: "#fffbeb",
    rim: "#fde68a",
    hour: "#92400e",
    min: "#b45309",
    sec: "#f59e0b",
    dot: "#92400e",
    tick: "#d97706",
    num: "#78350f",
  },
  "tz-afternoon": {
    face: "#eff6ff",
    rim: "#bfdbfe",
    hour: "#1e3a8a",
    min: "#2563eb",
    sec: "#3b82f6",
    dot: "#1e3a8a",
    tick: "#60a5fa",
    num: "#1e40af",
  },
  "tz-evening": {
    face: "#fff7ed",
    rim: "#fed7aa",
    hour: "#9a3412",
    min: "#ea580c",
    sec: "#f97316",
    dot: "#9a3412",
    tick: "#fb923c",
    num: "#7c2d12",
  },
  "tz-night": {
    face: "#1e1b4b",
    rim: "#3730a3",
    hour: "#c7d2fe",
    min: "#818cf8",
    sec: "#6366f1",
    dot: "#e0e7ff",
    tick: "#4f46e5",
    num: "#a5b4fc",
  },
};

function AnalogClock({
  date,
  tz,
  todClass,
  size = 120,
}: {
  date: Date;
  tz: string;
  todClass: string;
  size?: number;
}) {
  const p = TOD_PALETTE[todClass] || TOD_PALETTE["tz-afternoon"];
  const cx = size / 2,
    cy = size / 2,
    r = size / 2 - 5;
  const hStr = formatInTZ(date, tz, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const [hh, mm, ss] = hStr.split(":").map(Number);
  const secDeg = ss * 6;
  const minDeg = mm * 6 + ss * 0.1;
  const hourDeg = ((hh % 12) + mm / 60) * 30;
  const pt = (deg: number, radius: number) => {
    const rad = (deg - 90) * (Math.PI / 180);
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };
  const handPath = (
    deg: number,
    tipR: number,
    baseW: number,
    tailR: number,
  ) => {
    const tip = pt(deg, tipR);
    const left = pt(deg - 90, baseW / 2);
    const right = pt(deg + 90, baseW / 2);
    const tail = pt(deg + 180, tailR);
    return `M ${left.x} ${left.y} Q ${cx} ${cy} ${right.x} ${right.y} L ${tip.x} ${tip.y} Z M ${cx} ${cy} L ${tail.x} ${tail.y}`;
  };
  const minuteDots = Array.from({ length: 60 }, (_, i) => {
    const isMajor = i % 5 === 0;
    const dotR = isMajor ? 2.2 : 1.1;
    const ringR = r - dotR - 2;
    const { x, y } = pt(i * 6, ringR);
    return (
      <circle
        key={i}
        cx={x}
        cy={y}
        r={dotR}
        fill={isMajor ? p.tick : p.tick}
        opacity={isMajor ? 0.9 : 0.35}
      />
    );
  });
  const nums = [12, 3, 6, 9].map((n, i) => {
    const { x, y } = pt(i * 90, r - 18);
    return (
      <text
        key={n}
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size * 0.082}
        fontWeight="700"
        fill={p.num}
        fontFamily="system-ui,-apple-system,sans-serif"
      >
        {n}
      </text>
    );
  });
  const secTip = pt(secDeg, r * 0.74);
  const secTail = pt(secDeg + 180, r * 0.18);
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ overflow: "visible" }}
    >
      <defs>
        <radialGradient
          id={`face-${tz.replace(/\//g, "_")}`}
          cx="40%"
          cy="35%"
          r="65%"
        >
          <stop offset="0%" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.04" />
        </radialGradient>
        <filter
          id={`shadow-${tz.replace(/\//g, "_")}`}
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="3"
            floodColor="#000"
            floodOpacity="0.12"
          />
        </filter>
      </defs>
      <circle cx={cx} cy={cy} r={r + 4} fill={p.rim} opacity="0.4" />
      <circle
        cx={cx}
        cy={cy}
        r={r + 2}
        fill="none"
        stroke={p.rim}
        strokeWidth={2.5}
      />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={p.face}
        filter={`url(#shadow-${tz.replace(/\//g, "_")})`}
      />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={`url(#face-${tz.replace(/\//g, "_")})`}
      />
      {minuteDots}
      {nums}
      <path
        d={handPath(hourDeg, r * 0.44, 5.5, r * 0.1)}
        fill={p.hour}
        strokeLinejoin="round"
      />
      <path
        d={handPath(minDeg, r * 0.63, 3.8, r * 0.13)}
        fill={p.min}
        strokeLinejoin="round"
      />
      <line
        x1={secTail.x}
        y1={secTail.y}
        x2={secTip.x}
        y2={secTip.y}
        stroke={p.sec}
        strokeWidth={1.4}
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r={5.5} fill={p.dot} />
      <circle cx={cx} cy={cy} r={2.5} fill={p.sec} />
      <circle cx={cx} cy={cy} r={1} fill="#fff" opacity="0.6" />
    </svg>
  );
}

type Tab = "converter" | "world";
const DEFAULT_WORLD: string[] = [
  "America/New_York",
  "Europe/London",
  "Europe/Paris",
  "Asia/Dubai",
  "Asia/Karachi",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
];

const ABBR_ZONES = [
  { abbr: "UTC", full: "Coordinated Universal Time", tz: "UTC" },
  { abbr: "GMT", full: "Greenwich Mean Time", tz: "Europe/London" },
  { abbr: "EST", full: "Eastern Standard Time", tz: "America/New_York" },
  { abbr: "EDT", full: "Eastern Daylight Time", tz: "America/New_York" },
  { abbr: "CST", full: "Central Standard Time", tz: "America/Chicago" },
  { abbr: "CDT", full: "Central Daylight Time", tz: "America/Chicago" },
  { abbr: "MST", full: "Mountain Standard Time", tz: "America/Denver" },
  { abbr: "MDT", full: "Mountain Daylight Time", tz: "America/Denver" },
  { abbr: "PST", full: "Pacific Standard Time", tz: "America/Los_Angeles" },
  { abbr: "PDT", full: "Pacific Daylight Time", tz: "America/Los_Angeles" },
  { abbr: "AKST", full: "Alaska Standard Time", tz: "America/Anchorage" },
  { abbr: "HST", full: "Hawaii Standard Time", tz: "Pacific/Honolulu" },
  { abbr: "AST", full: "Atlantic Standard Time", tz: "America/Halifax" },
  { abbr: "NST", full: "Newfoundland Standard Time", tz: "America/St_Johns" },
  { abbr: "BRT", full: "Brasília Time", tz: "America/Sao_Paulo" },
  { abbr: "ART", full: "Argentina Time", tz: "America/Argentina/Buenos_Aires" },
  { abbr: "WET", full: "Western European Time", tz: "Europe/Lisbon" },
  { abbr: "CET", full: "Central European Time", tz: "Europe/Paris" },
  { abbr: "CEST", full: "Central European Summer Time", tz: "Europe/Paris" },
  { abbr: "EET", full: "Eastern European Time", tz: "Europe/Athens" },
  { abbr: "MSK", full: "Moscow Standard Time", tz: "Europe/Moscow" },
  { abbr: "TRT", full: "Turkey Time", tz: "Europe/Istanbul" },
  { abbr: "AST", full: "Arabia Standard Time", tz: "Asia/Riyadh" },
  { abbr: "GST", full: "Gulf Standard Time", tz: "Asia/Dubai" },
  { abbr: "EAT", full: "East Africa Time", tz: "Africa/Nairobi" },
  { abbr: "CAT", full: "Central Africa Time", tz: "Africa/Lagos" },
  { abbr: "WAT", full: "West Africa Time", tz: "Africa/Lagos" },
  {
    abbr: "SAST",
    full: "South Africa Standard Time",
    tz: "Africa/Johannesburg",
  },
  { abbr: "PKT", full: "Pakistan Standard Time", tz: "Asia/Karachi" },
  { abbr: "IST", full: "India Standard Time", tz: "Asia/Kolkata" },
  { abbr: "NPT", full: "Nepal Time", tz: "Asia/Kathmandu" },
  { abbr: "BST", full: "Bangladesh Standard Time", tz: "Asia/Dhaka" },
  { abbr: "ICT", full: "Indochina Time", tz: "Asia/Bangkok" },
  { abbr: "WIB", full: "Western Indonesia Time", tz: "Asia/Jakarta" },
  { abbr: "CST", full: "China Standard Time", tz: "Asia/Shanghai" },
  { abbr: "SGT", full: "Singapore Time", tz: "Asia/Singapore" },
  { abbr: "MYT", full: "Malaysia Time", tz: "Asia/Kuala_Lumpur" },
  { abbr: "HKT", full: "Hong Kong Time", tz: "Asia/Hong_Kong" },
  { abbr: "JST", full: "Japan Standard Time", tz: "Asia/Tokyo" },
  { abbr: "KST", full: "Korea Standard Time", tz: "Asia/Seoul" },
  {
    abbr: "AEST",
    full: "Australian Eastern Standard",
    tz: "Australia/Brisbane",
  },
  { abbr: "AEDT", full: "Australian Eastern Daylight", tz: "Australia/Sydney" },
  { abbr: "ACST", full: "Australian Central Standard", tz: "Australia/Darwin" },
  { abbr: "AWST", full: "Australian Western Standard", tz: "Australia/Perth" },
  { abbr: "NZST", full: "New Zealand Standard Time", tz: "Pacific/Auckland" },
  { abbr: "NZDT", full: "New Zealand Daylight Time", tz: "Pacific/Auckland" },
  { abbr: "FJT", full: "Fiji Time", tz: "Pacific/Fiji" },
];

function AbbrConverter({
  now,
  use24h,
  sourceDate,
}: {
  now: Date;
  use24h: boolean;
  sourceDate: Date;
}) {
  const [search, setSearch] = useState("");
  const [selectedAbbr, setSelectedAbbr] = useState<
    (typeof ABBR_ZONES)[0] | null
  >(null);
  const [copied, setCopied] = useState("");
  const filtered = ABBR_ZONES.filter(
    (z) =>
      z.abbr.toLowerCase().includes(search.toLowerCase()) ||
      z.full.toLowerCase().includes(search.toLowerCase()),
  );
  const fmtTime = (tz: string) => {
    const d = isNaN(sourceDate.getTime()) ? now : sourceDate;
    return formatInTZ(d, tz, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: use24h ? "2-digit" : "numeric",
      minute: "2-digit",
      hour12: !use24h,
    });
  };
  const copyVal = (v: string) => {
    navigator.clipboard.writeText(v);
    setCopied(v);
    setTimeout(() => setCopied(""), 1200);
  };
  return (
    <div className="abbr-wrap">
      <div className="tz-section-label" style={{ marginBottom: 10 }}>
        <i className="fa-solid fa-clock-rotate-left"></i> Timezone Abbreviation
        Reference
      </div>
      <p className="abbr-desc">
        Search any abbreviation (EST, IST, JST, CET…) to see its full name, UTC
        offset, and the converted time based on your selected date above.
      </p>
      <div className="abbr-search-wrap">
        <i className="fa-solid fa-magnifying-glass abbr-search-icon"></i>
        <input
          className="abbr-search"
          placeholder="Search abbreviation or timezone name… e.g. EST, IST, PST"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelectedAbbr(null);
          }}
        />
        {search && (
          <button
            className="abbr-clear"
            onClick={() => {
              setSearch("");
              setSelectedAbbr(null);
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}
      </div>
      {selectedAbbr && (
        <div className="abbr-detail">
          <div className="abbr-detail-left">
            <span className="abbr-detail-code">{selectedAbbr.abbr}</span>
            <span className="abbr-detail-full">{selectedAbbr.full}</span>
            <span className="abbr-detail-offset">
              {getOffset(selectedAbbr.tz, now)}
            </span>
          </div>
          <div className="abbr-detail-right">
            <span className="abbr-detail-time">{fmtTime(selectedAbbr.tz)}</span>
            <button
              className="abbr-copy-btn"
              onClick={() => copyVal(fmtTime(selectedAbbr.tz))}
            >
              <i
                className={`fa-${copied === fmtTime(selectedAbbr.tz) ? "solid fa-check" : "regular fa-copy"}`}
              ></i>
              {copied === fmtTime(selectedAbbr.tz) ? " Copied!" : " Copy"}
            </button>
          </div>
        </div>
      )}
      <div className="abbr-grid">
        {(search ? filtered : ABBR_ZONES).map((z, i) => (
          <button
            key={z.abbr + i}
            className={`abbr-chip${selectedAbbr?.abbr === z.abbr && selectedAbbr?.tz === z.tz ? " abbr-chip-active" : ""}`}
            onClick={() =>
              setSelectedAbbr(
                selectedAbbr?.abbr === z.abbr && selectedAbbr?.tz === z.tz
                  ? null
                  : z,
              )
            }
          >
            <span className="abbr-chip-code">{z.abbr}</span>
            <span className="abbr-chip-offset">{getOffset(z.tz, now)}</span>
          </button>
        ))}
        {search && filtered.length === 0 && (
          <div className="abbr-empty">No matching abbreviations found.</div>
        )}
      </div>
    </div>
  );
}

const FAQ_DATA = [
  {
    q: "Why did my recurring meeting shift by an hour?",
    a: "One location changed its clocks and the other did not, or they changed on different dates. A call agreed as 15:00 in one city and 10:00 in another stays correct only while the gap between them holds — and that gap moves when either place starts or ends daylight saving. Agree the meeting in one anchor location and let everyone convert, rather than fixing two local times as if they were permanently linked.",
  },
  {
    q: "Is the time difference between two cities always the same?",
    a: "No. It changes during the year depending on whether each place observes daylight saving and when it switches. Two cities normally five hours apart can be four or six for a few weeks. Northern and Southern hemisphere locations shift in opposite directions, so a European and an Australian city can move by two hours rather than one.",
  },
  {
    q: "Are all time zones a whole number of hours from UTC?",
    a: "No. Half-hour offsets are used across South Asia, parts of Australia and Newfoundland, so a time on the hour in one place lands on the half hour in the other. Forty-five-minute offsets exist in Nepal and the Chatham Islands. The total spread across the world also exceeds 24 hours, which is why three calendar dates can be in use at once.",
  },
  {
    q: "What does CST actually mean?",
    a: "It depends who wrote it. CST is used for Central Standard Time in North America, China Standard Time and Cuba Standard Time — readings that can be thirteen hours apart. IST covers India, Ireland and Israel; BST covers Britain and Bangladesh. Abbreviations are not standardised, so name the city or give the UTC offset when it matters.",
  },
  {
    q: "Should I write EST or EDT?",
    a: "They are different offsets an hour apart, so it depends on the date. EST is standard time and EDT is the summer offset, which means writing EST in July is technically wrong and usually indicates the writer meant current local time. Naming the city sidesteps the distinction entirely, since the reader's software knows which applies on that date.",
  },
  {
    q: "Does everyone in one country share the same time?",
    a: "Not necessarily, and the exceptions run both ways. Some countries span several zones and split accordingly, so saying you are in the US or Australia narrows the answer only to a range of several hours. Others cover a wide longitudinal range and use a single official time as a matter of policy, which means the sun rises at very different clock times across them.",
  },
  {
    q: "How do I write a time so nobody misreads it?",
    a: "Use the 24-hour clock to avoid the AM and PM confusion around midnight and midday, name the city rather than an abbreviation, and include the date. Thursday 14:00 in London is unambiguous to anyone. 2pm BST requires the reader to know which BST you mean and whether summer time applies on that date.",
  },
  {
    q: "Why does a meeting land on a different day for some people?",
    a: "Because the spread of world time zones is greater than 24 hours, so a single instant falls on different calendar dates in different places. A Friday afternoon call in one city can be Saturday morning in another. Always check the date alongside the hour when scheduling across a wide spread, since no amount of goodwill fixes a weekend.",
  },
  {
    q: "What is the best way to schedule across many time zones?",
    a: "Collect each participant's acceptable window in their own local time, convert them all into one reference zone, and look for the overlap. Where none exists, rotate the inconvenience between meetings rather than permanently assigning it to whoever is furthest away. Send calendar invitations rather than written times, since a calendar entry carries the underlying instant and converts itself.",
  },
];

export default function TimezoneTool() {
  const [tab, setTab] = useState<Tab>("world");
  const [now, setNow] = useState(new Date());
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [use24h, setUse24h] = useState(false);
  const [fromTZ, setFromTZ] = useState("America/New_York");
  const [toRows, setToRows] = useState<string[]>([
    "Europe/London",
    "Asia/Karachi",
    "Asia/Tokyo",
  ]);
  const [inputDate, setInputDate] = useState(() => {
    const d = new Date();
    d.setSeconds(0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [addSearch, setAddSearch] = useState("");
  const [addDropOpen, setAddDropOpen] = useState(false);
  const [fromSearch, setFromSearch] = useState("");
  const [fromDropOpen, setFromDropOpen] = useState(false);
  const [worldTZs, setWorldTZs] = useState<string[]>(DEFAULT_WORLD);
  const [worldSearch, setWorldSearch] = useState("");
  const [worldDropOpen, setWorldDropOpen] = useState(false);
  const [worldFilter, setWorldFilter] = useState("All");
  const [copiedCity, setCopiedCity] = useState("");

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const sourceDate = new Date(inputDate);

  const fmtConverted = useCallback(
    (toTZ: string) => {
      if (isNaN(sourceDate.getTime())) return "—";
      return formatInTZ(sourceDate, toTZ, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: !use24h,
      });
    },
    [inputDate, fromTZ, use24h],
  );
  const fmtLive = (tz: string) =>
    formatInTZ(now, tz, {
      hour: use24h ? "2-digit" : "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: !use24h,
    });
  const fmtCard = (tz: string) =>
    formatInTZ(now, tz, {
      hour: use24h ? "2-digit" : "numeric",
      minute: "2-digit",
      hour12: !use24h,
    });
  const fmtSecs = (tz: string) => {
    const s = formatInTZ(now, tz, { second: "2-digit", hour12: false });
    return `:${s}`;
  };

  const addToRow = (tz: string) => {
    if (!toRows.includes(tz)) setToRows((p) => [...p, tz]);
    setAddSearch("");
    setAddDropOpen(false);
  };
  const removeRow = (tz: string) => setToRows((p) => p.filter((t) => t !== tz));
  const filteredForAdd = ALL_ZONES.filter(
    (z) =>
      !toRows.includes(z.tz) &&
      z.tz !== fromTZ &&
      (z.city.toLowerCase().includes(addSearch.toLowerCase()) ||
        z.country.toLowerCase().includes(addSearch.toLowerCase()) ||
        z.tz.toLowerCase().includes(addSearch.toLowerCase())),
  ).slice(0, 40);
  const filteredForFrom = ALL_ZONES.filter(
    (z) =>
      z.city.toLowerCase().includes(fromSearch.toLowerCase()) ||
      z.country.toLowerCase().includes(fromSearch.toLowerCase()) ||
      z.tz.toLowerCase().includes(fromSearch.toLowerCase()),
  ).slice(0, 40);
  const addWorldTZ = (tz: string) => {
    if (!worldTZs.includes(tz)) setWorldTZs((p) => [...p, tz]);
    setWorldSearch("");
    setWorldDropOpen(false);
  };
  const removeWorldTZ = (tz: string) =>
    setWorldTZs((p) => p.filter((t) => t !== tz));
  const filteredWorld = ALL_ZONES.filter(
    (z) =>
      !worldTZs.includes(z.tz) &&
      (worldFilter === "All" || z.region === worldFilter) &&
      (z.city.toLowerCase().includes(worldSearch.toLowerCase()) ||
        z.country.toLowerCase().includes(worldSearch.toLowerCase())),
  ).slice(0, 50);
  const copyTime = (tz: string) => {
    navigator.clipboard.writeText(fmtLive(tz));
    setCopiedCity(tz);
    setTimeout(() => setCopiedCity(""), 1200);
  };
  const getMeta = (tz: string): TZEntry =>
    ALL_ZONES.find((z) => z.tz === tz) || {
      city: tz.split("/")[1]?.replace(/_/g, " ") || tz,
      country: "",
      cc: "un",
      region: "",
      tz,
    };

  const addRef = useRef<HTMLDivElement>(null);
  const fromRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (addRef.current && !addRef.current.contains(e.target as Node))
        setAddDropOpen(false);
      if (fromRef.current && !fromRef.current.contains(e.target as Node))
        setFromDropOpen(false);
      if (worldRef.current && !worldRef.current.contains(e.target as Node))
        setWorldDropOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const fromMeta = getMeta(fromTZ);
  const HourToggle = () => (
    <div className="tz-hour-toggle">
      <button
        className={`tz-hour-btn${!use24h ? " tz-hour-active" : ""}`}
        onClick={() => setUse24h(false)}
      >
        12h
      </button>
      <button
        className={`tz-hour-btn${use24h ? " tz-hour-active" : ""}`}
        onClick={() => setUse24h(true)}
      >
        24h
      </button>
    </div>
  );

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_DATA.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <>
      <div className="single-page-padding tz-root">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        <h1>
          Time Zone Converter and World Clock — 80+
          Cities
        </h1>
        <p>
          Convert times between any cities instantly — PKT to EST, IST to PST,
          GMT to IST, EST to JST, and more. Keep a live multiple time zone clock
          online for all your key locations with analog clocks, DST support, and
          12/24h toggle.
        </p>

        <div className="tz-topbar">
          <div className="tz-switcher">
            <button
              className={`tz-switcher-btn${tab === "world" ? " tz-switcher-active" : ""}`}
              onClick={() => setTab("world")}
            >
              <i className="fa-solid fa-globe"></i>
              <span>World Clock</span>
            </button>
            <button
              className={`tz-switcher-btn${tab === "converter" ? " tz-switcher-active" : ""}`}
              onClick={() => setTab("converter")}
            >
              <i className="fa-solid fa-right-left"></i>
              <span>Converter</span>
            </button>
          </div>
          <HourToggle />
        </div>

        {/* ════════ CONVERTER ════════ */}
        {tab === "converter" && (
          <div className="calc-card tz-converter">
            <div className="tz-section-label">
              <i className="fa-solid fa-location-dot"></i> Convert from
            </div>
            <div className="tz-from-row">
              <div className="tz-dropdown-wrap" ref={fromRef}>
                <button
                  className="tz-city-select-btn"
                  onClick={() => {
                    setFromDropOpen((o) => !o);
                    setFromSearch("");
                  }}
                >
                  <Flag cc={fromMeta.cc} size={22} />
                  <div className="tz-city-select-text">
                    <span className="tz-city-name">{fromMeta.city}</span>
                    <span className="tz-city-sub">
                      {fromMeta.country} · {getOffset(fromTZ, now)}
                    </span>
                  </div>
                  <i
                    className={`fa-solid fa-chevron-down tz-chev${fromDropOpen ? " tz-chev-open" : ""}`}
                  ></i>
                </button>
                {fromDropOpen && (
                  <div className="tz-dropdown">
                    <div className="tz-drop-search-wrap">
                      <i className="fa-solid fa-magnifying-glass"></i>
                      <input
                        autoFocus
                        className="tz-drop-search"
                        placeholder="Search city or country…"
                        value={fromSearch}
                        onChange={(e) => setFromSearch(e.target.value)}
                      />
                    </div>
                    <div className="tz-drop-list">
                      {filteredForFrom.map((z) => (
                        <button
                          key={z.tz + z.city}
                          className="tz-drop-item"
                          onClick={() => {
                            setFromTZ(z.tz);
                            setFromDropOpen(false);
                          }}
                        >
                          <Flag cc={z.cc} size={18} />
                          <span className="tz-drop-city">{z.city}</span>
                          <span className="tz-drop-country">{z.country}</span>
                          <span className="tz-drop-offset">
                            {getOffset(z.tz, now)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="tz-datetime-wrap">
                <input
                  type="datetime-local"
                  className="tz-datetime-input"
                  value={inputDate}
                  onChange={(e) => setInputDate(e.target.value)}
                />
              </div>
              <div className="tz-live-hint">
                <div className="tz-live-dot" />
                <span>
                  {fmtLive(fromTZ)}
                  <span className="tz-live-label"> live</span>
                </span>
              </div>
            </div>
            <div className="tz-arrow-divider">
              <div className="tz-arrow-line" />
              <div className="tz-arrow-icon">
                <i className="fa-solid fa-angles-down"></i>
              </div>
              <div className="tz-arrow-line" />
            </div>
            <div className="tz-section-label">
              <i className="fa-solid fa-map-pin"></i> Converted times
            </div>
            <div className="tz-to-rows">
              {toRows.map((tz) => {
                const meta = getMeta(tz);
                const day =
                  getHourIn(sourceDate, tz) >= 6 &&
                  getHourIn(sourceDate, tz) < 20;
                return (
                  <div key={tz} className="tz-to-row">
                    <Flag cc={meta.cc} size={22} />
                    <div className="tz-to-info">
                      <span className="tz-to-city">{meta.city}</span>
                      <span className="tz-to-country">
                        {meta.country} · {getOffset(tz, now)}
                      </span>
                    </div>
                    <div className="tz-to-result">
                      <span
                        className={`tz-tod-badge ${day ? "tz-tod-day" : "tz-tod-night"}`}
                      >
                        <i
                          className={`fa-solid ${day ? "fa-sun" : "fa-moon"}`}
                        ></i>
                      </span>
                      <span className="tz-to-time">{fmtConverted(tz)}</span>
                    </div>
                    <button
                      className="tz-remove-btn"
                      onClick={() => removeRow(tz)}
                      title="Remove"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="tz-add-row" ref={addRef}>
              <div
                className={`tz-add-input-wrap${addDropOpen ? " tz-add-open" : ""}`}
              >
                <i className="fa-solid fa-plus tz-add-icon"></i>
                <input
                  className="tz-add-input"
                  placeholder="Add a city to compare…"
                  value={addSearch}
                  onFocus={() => setAddDropOpen(true)}
                  onChange={(e) => {
                    setAddSearch(e.target.value);
                    setAddDropOpen(true);
                  }}
                />
              </div>
              {addDropOpen && filteredForAdd.length > 0 && (
                <div className="tz-dropdown tz-add-dropdown">
                  <div className="tz-drop-list">
                    {filteredForAdd.map((z) => (
                      <button
                        key={z.tz + z.city}
                        className="tz-drop-item"
                        onClick={() => addToRow(z.tz)}
                      >
                        <Flag cc={z.cc} size={18} />
                        <span className="tz-drop-city">{z.city}</span>
                        <span className="tz-drop-country">{z.country}</span>
                        <span className="tz-drop-offset">
                          {getOffset(z.tz, now)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="tz-quick-add">
              <span className="tz-quick-label">Quick add:</span>
              {[
                { label: "London", tz: "Europe/London", cc: "gb" },
                { label: "Dubai", tz: "Asia/Dubai", cc: "ae" },
                { label: "Mumbai", tz: "Asia/Kolkata", cc: "in" },
                { label: "Singapore", tz: "Asia/Singapore", cc: "sg" },
                { label: "Tokyo", tz: "Asia/Tokyo", cc: "jp" },
                { label: "Sydney", tz: "Australia/Sydney", cc: "au" },
              ]
                .filter((p) => !toRows.includes(p.tz) && p.tz !== fromTZ)
                .slice(0, 5)
                .map((p) => (
                  <button
                    key={p.tz}
                    className="preset-pill tz-quick-pill"
                    onClick={() => addToRow(p.tz)}
                  >
                    <Flag cc={p.cc} size={14} /> {p.label}
                  </button>
                ))}
            </div>
            <AbbrConverter now={now} use24h={use24h} sourceDate={sourceDate} />
          </div>
        )}

        {/* ════════ WORLD CLOCK ════════ */}
        {tab === "world" && (
          <div className="tz-world-shell">
            <div className="calc-card tz-world-toolbar">
              <div className="tz-live-badge">
                <div className="tz-live-dot" />
                <span className="tz-live-text">
                  {now.toUTCString().replace("GMT", "UTC")}
                </span>
              </div>
              <div className="tz-world-toolbar-right">
                <div className="tz-region-pills">
                  {["All", ...REGION_ORDER].map((r) => {
                    const count =
                      r === "All"
                        ? worldTZs.length
                        : worldTZs.filter((tz) => getMeta(tz).region === r)
                            .length;
                    return (
                      <button
                        key={r}
                        className={`preset-pill${worldFilter === r ? " active" : ""}`}
                        onClick={() => setWorldFilter(r)}
                      >
                        {r}
                        {count > 0 && (
                          <span className="tz-pill-count">{count}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <div
                  className="tz-dropdown-wrap"
                  ref={worldRef}
                  style={{ position: "relative" }}
                >
                  <button
                    className="tz-add-city-btn"
                    onClick={() => {
                      setWorldDropOpen((o) => !o);
                      setWorldSearch("");
                    }}
                  >
                    <i className="fa-solid fa-plus"></i> Add city
                  </button>
                  {worldDropOpen && (
                    <div className="tz-dropdown tz-world-dropdown">
                      <div className="tz-drop-search-wrap">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input
                          autoFocus
                          className="tz-drop-search"
                          placeholder="Search city or country…"
                          value={worldSearch}
                          onChange={(e) => setWorldSearch(e.target.value)}
                        />
                      </div>
                      <div className="tz-drop-list">
                        {filteredWorld.map((z) => (
                          <button
                            key={z.tz + z.city}
                            className="tz-drop-item"
                            onClick={() => addWorldTZ(z.tz)}
                          >
                            <Flag cc={z.cc} size={18} />
                            <span className="tz-drop-city">{z.city}</span>
                            <span className="tz-drop-country">{z.country}</span>
                            <span className="tz-drop-offset">
                              {getOffset(z.tz, now)}
                            </span>
                          </button>
                        ))}
                        {filteredWorld.length === 0 && (
                          <div className="tz-drop-empty">No cities found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="tz-cards-grid">
              {worldTZs
                .filter((tz) => {
                  if (worldFilter === "All") return true;
                  return getMeta(tz).region === worldFilter;
                })
                .sort((a, b) => {
                  const offA =
                    Date.parse(now.toLocaleString("en-US", { timeZone: a })) -
                    Date.parse(
                      now.toLocaleString("en-US", { timeZone: "UTC" }),
                    );
                  const offB =
                    Date.parse(now.toLocaleString("en-US", { timeZone: b })) -
                    Date.parse(
                      now.toLocaleString("en-US", { timeZone: "UTC" }),
                    );
                  return offA - offB;
                })
                .map((tz) => {
                  const meta = getMeta(tz);
                  const todClass = getTimeOfDayClass(now, tz);
                  const timeDisp = fmtCard(tz);
                  const secsDisp = fmtSecs(tz);
                  const dateStr = formatInTZ(now, tz, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  });
                  const offset = getOffset(tz, now);
                  const h24 = parseInt(
                    formatInTZ(now, tz, {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    }).split(":")[0],
                  );
                  const mm = parseInt(
                    formatInTZ(now, tz, { minute: "2-digit", hour12: false }),
                  );
                  const ss = parseInt(
                    formatInTZ(now, tz, { second: "2-digit", hour12: false }),
                  );
                  const dayPct = ((h24 * 3600 + mm * 60 + ss) / 86400) * 100;
                  return (
                    <div key={tz} className={`tz-card ${todClass}`}>
                      <div className="tz-card-header">
                        <div className="tz-card-city-row">
                          <Flag cc={meta.cc} size={20} />
                          <div>
                            <div className="tz-card-city">{meta.city}</div>
                            <div className="tz-card-country">
                              {meta.country}
                            </div>
                          </div>
                        </div>
                        <div className="tz-card-tools">
                          <button
                            className="tz-card-icon-btn"
                            title="Copy time"
                            onClick={() => copyTime(tz)}
                          >
                            <i
                              className={`fa-${copiedCity === tz ? "solid fa-check" : "regular fa-copy"}`}
                            ></i>
                          </button>
                          <button
                            className="tz-card-icon-btn"
                            title="Remove"
                            onClick={() => removeWorldTZ(tz)}
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                      </div>
                      <div className="tz-card-body">
                        <AnalogClock
                          date={now}
                          tz={tz}
                          todClass={todClass}
                          size={116}
                        />
                        <div className="tz-card-digital">
                          <div className="tz-card-time-row">
                            <span className="tz-card-time">{timeDisp}</span>
                            <span className="tz-card-secs">{secsDisp}</span>
                          </div>
                          <div className="tz-card-date">{dateStr}</div>
                          <div className="tz-card-offset-badge">{offset}</div>
                          <div
                            className="tz-day-bar"
                            title={`${Math.round(dayPct)}% through the day`}
                          >
                            <div
                              className="tz-day-fill"
                              style={{ width: `${dayPct}%` }}
                            />
                            <div
                              className="tz-day-thumb"
                              style={{ left: `${Math.min(dayPct, 98)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="tz-card-tz-name">{tz}</div>
                    </div>
                  );
                })}
              {worldFilter !== "All" &&
                worldTZs.filter((tz) => getMeta(tz).region === worldFilter)
                  .length === 0 && (
                  <div className="tz-filter-empty">
                    <i
                      className="fa-solid fa-globe"
                      style={{
                        fontSize: "1.5rem",
                        color: "#ccc",
                        display: "block",
                        marginBottom: 8,
                      }}
                    ></i>
                    No {worldFilter} cities added yet.
                    <button
                      className="tz-text-link"
                      onClick={() => {
                        setWorldDropOpen(true);
                        setWorldSearch("");
                        setWorldFilter(worldFilter);
                      }}
                    >
                      Add one <i className="fa-solid fa-plus"></i>
                    </button>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* ── SEO Content ── */}

        <h2>Why Scheduling Across Zones Goes Wrong</h2>
        <p>
          Converting a single time between two places is arithmetic. Scheduling
          a recurring meeting across them is not, and almost every failure comes
          from one of four assumptions that feel safe and are not.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>The assumption</th>
                <th>Why it fails</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>A zone has a fixed offset from UTC</td>
                <td>
                  Daylight saving moves it twice a year in many places, and not
                  at all in others
                </td>
              </tr>
              <tr>
                <td>Offsets are whole hours</td>
                <td>
                  Several zones are offset by 30 or even 45 minutes
                </td>
              </tr>
              <tr>
                <td>An abbreviation identifies a zone</td>
                <td>
                  The same letters are used by different zones on different
                  continents
                </td>
              </tr>
              <tr>
                <td>A country has one time</td>
                <td>
                  Some large countries span several zones; others deliberately
                  use one
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Offsets Are Not Fixed</h2>
        <p>
          The gap between two places changes during the year, and it changes by
          different amounts depending on whether each place observes daylight
          saving and when it switches.
        </p>
        <p>
          Two cities that are five hours apart for most of the year can be four
          or six hours apart for a few weeks, because their clock changes fall on
          different dates. The Northern and Southern hemispheres shift in
          opposite directions, so the gap between a European and an Australian
          city can move by two hours rather than one.
        </p>
        <p>
          The practical consequence is the recurring-meeting problem. A call set
          for 15:00 in one city and 10:00 in another stays correct until one of
          them changes its clocks, at which point the meeting silently moves an
          hour for one participant. Anyone who has arrived an hour early to a
          standing call in late March or October has met this.
        </p>
        <p>
          The reliable fix is to agree the meeting in one anchor location and let
          everyone else convert, rather than agreeing two local times as if they
          were permanently linked.
        </p>

        <h2>Not Every Zone Is a Whole Hour Off</h2>
        <p>
          The assumption that offsets come in whole hours is built into a
          surprising amount of mental arithmetic, and it breaks in several parts
          of the world.
        </p>
        <ul className="custom-list">
          <li>
            <strong>Half-hour offsets</strong> are used across South Asia, in
            parts of Australia, and in Newfoundland among others. A meeting time
            that lands on the hour in one place lands on the half hour in the
            other.
          </li>
          <li>
            <strong>Forty-five-minute offsets</strong> exist too, in Nepal and in
            the Chatham Islands. These are rare enough that many scheduling
            habits simply do not account for them.
          </li>
          <li>
            <strong>Offsets beyond twelve hours</strong> exist on both sides, so
            the total spread across the world is more than 24 hours. At certain
            moments three different calendar dates are in use simultaneously.
          </li>
        </ul>

        <h2>Abbreviations Are Ambiguous</h2>
        <p>
          Zone abbreviations look precise and are not standardised. Several are
          used by more than one zone.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Abbreviation</th>
                <th>Can mean</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>CST</td>
                <td>
                  Central Standard Time in North America, China Standard Time,
                  or Cuba Standard Time
                </td>
              </tr>
              <tr>
                <td>IST</td>
                <td>India, Ireland, or Israel Standard Time</td>
              </tr>
              <tr>
                <td>BST</td>
                <td>British Summer Time or Bangladesh Standard Time</td>
              </tr>
              <tr>
                <td>AMT</td>
                <td>Amazon Time or Armenia Time</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Where precision matters, name the city or use the UTC offset for the
          specific date. &quot;14:00 UTC&quot; is unambiguous; &quot;2pm
          CST&quot; is not, and the difference between the readings can be
          thirteen hours.
        </p>
        <p>
          There is a second trap in the standard-versus-summer distinction. EST
          and EDT are different offsets an hour apart, so writing EST during
          summer is technically wrong and frequently means the writer meant the
          current local time rather than standard time.
        </p>

        <h2>Country Does Not Mean Time Zone</h2>
        <p>
          Some countries span many zones and split accordingly; others span many
          and use a single time anyway, as a matter of policy. China is the
          best-known example of a country covering a wide longitudinal range on
          one official time, which means the sun rises at very different clock
          times across it.
        </p>
        <p>
          The reverse case matters just as much for scheduling. In countries with
          several zones, saying you are &quot;in the US&quot; or &quot;in
          Australia&quot; narrows the answer to a range of several hours rather
          than pinning it down. Always exchange cities rather than countries.
        </p>

        <h2>Finding a Time That Works for Everyone</h2>
        <p>
          For two or three locations, a workable window is usually findable. For
          more than that, someone is going to be inconvenienced, and the useful
          question becomes who and how often.
        </p>
        <ul className="custom-list">
          <li>
            List each participant&apos;s acceptable window in their own local
            time, then convert all of them into one reference zone and look for
            the overlap.
          </li>
          <li>
            Where no overlap exists, rotate the inconvenience between meetings
            rather than fixing it permanently on whoever is furthest away.
          </li>
          <li>
            Watch the date, not just the hour. A Friday afternoon call in one
            place can be Saturday morning in another, which no amount of goodwill
            fixes.
          </li>
          <li>
            Send invitations from a calendar rather than as written times. A
            calendar entry carries the underlying instant and converts itself;
            text does not.
          </li>
        </ul>

        <h2>Writing a Time So It Cannot Be Misread</h2>
        <p>
          When a time has to be communicated as text, three habits remove almost
          all ambiguity.
        </p>
        <p>
          Use the 24-hour clock, which eliminates the midnight and midday
          confusion that AM and PM create. Name the city rather than an
          abbreviation. And include the date, since the same instant can fall on
          different days for different readers.
        </p>
        <p>
          &quot;Thursday 14:00 in London&quot; can be converted by anyone
          without ambiguity. &quot;2pm BST&quot; requires the reader to know
          which BST you mean and whether summer time is in effect on that date.
        </p>
        <p>
          For durations and elapsed time rather than clock conversions, the{" "}
          <Link href="/time-calculator/" className="my-link">
            time calculator
          </Link>{" "}
          handles the arithmetic, and the{" "}
          <Link href="/days-between-calculator/" className="my-link">
            days between dates calculator
          </Link>{" "}
          covers spans measured in days.
        </p>
        <h2>Time Zone Questions</h2>
        {FAQ_DATA.map(({ q, a }, i) => {
          const isOpen = openFAQ === i;
          return (
            <div className="faq-item" key={i}>
              <h3
                onClick={() => setOpenFAQ(isOpen ? null : i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpenFAQ(isOpen ? null : i);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${i}`}
              >
                {q}
                <i
                  className={`fa-solid fa-chevron-down${isOpen ? " rotate" : ""}`}
                  aria-hidden="true"
                />
              </h3>
              <div
                id={`faq-answer-${i}`}
                className={`faq-answer-wrap ${isOpen ? "open" : ""}`}
                aria-hidden={!isOpen}
              >
                <div className="faq-answer-inner">
                  <p>{a}</p>
                </div>
              </div>
            </div>
          );
        })}

      </div>
    </>
  );
}
