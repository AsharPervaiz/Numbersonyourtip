#!/usr/bin/env node
/* SEMrush keyword research, from the command line.
 *
 *   node scripts/semrush.mjs units
 *   node scripts/semrush.mjs kw "payments on account"
 *   node scripts/semrush.mjs related "self assessment deadline" --limit 30
 *   node scripts/semrush.mjs broad "how much mulch" --db us
 *   node scripts/semrush.mjs ours                     (our own ranking pages)
 *
 * The key is read from .env.local, which is gitignored. Never pass it on the
 * command line — it would end up in the shell history.
 *
 * SEMrush bills this API in API units, charged per row returned, separately
 * from the subscription. Every command below prints what it spent, and asks
 * for the smallest useful number of rows by default.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_DB = "uk"; // the site's tax, VAT and energy content is UK-facing
const API = "https://api.semrush.com/";

/* ── key ─────────────────────────────────────────────────────────────── */

function readKey() {
  const envFile = path.join(ROOT, ".env.local");
  if (fs.existsSync(envFile)) {
    for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*SEMRUSH_API_KEY\s*=\s*(.+?)\s*$/);
      if (m) return m[1].replace(/^["']|["']$/g, "");
    }
  }
  if (process.env.SEMRUSH_API_KEY) return process.env.SEMRUSH_API_KEY;
  console.error(
    "No SEMRUSH_API_KEY found.\n\n" +
      "Add this line to .env.local (which is already gitignored):\n" +
      "  SEMRUSH_API_KEY=your_key_here\n",
  );
  process.exit(1);
}

/* ── request ─────────────────────────────────────────────────────────── */

async function call(params, { raw = false } = {}) {
  const url = new URL(API);
  for (const [k, v] of Object.entries({ ...params, key: readKey() })) {
    url.searchParams.set(k, v);
  }
  const res = await fetch(url);
  const body = (await res.text()).trim();

  if (body.startsWith("ERROR")) {
    const msg = body.replace(/^ERROR\s*/, "");
    if (/NOTHING FOUND/i.test(msg)) return [];
    if (/API units balance is zero|LIMIT EXCEEDED/i.test(msg)) {
      console.error(
        "\nSEMrush says the API unit balance is exhausted.\n" +
          "API units are bought separately from the subscription.\n",
      );
      process.exit(2);
    }
    if (/WRONG KEY|invalid key/i.test(msg)) {
      console.error("\nSEMrush rejected the key. Check .env.local.\n");
      process.exit(2);
    }
    throw new Error("SEMrush: " + msg);
  }
  if (raw) return body;

  const [head, ...rows] = body.split("\n");
  const cols = head.split(";").map((c) => c.trim());
  return rows.filter(Boolean).map((r) => {
    const cells = r.split(";");
    return Object.fromEntries(cols.map((c, i) => [c, cells[i]]));
  });
}

/* ── output ──────────────────────────────────────────────────────────── */

const n = (v) => (v == null || v === "" ? "—" : Number(v).toLocaleString());

function table(rows, spec) {
  if (!rows.length) return console.log("  (no results)");
  const widths = spec.map(([h, , w]) => w ?? h.length);
  console.log(
    "  " + spec.map(([h], i) => h.padEnd(widths[i])).join("  "),
  );
  console.log("  " + spec.map((_, i) => "-".repeat(widths[i])).join("  "));
  for (const r of rows) {
    console.log(
      "  " +
        spec
          .map(([, f], i) => String(f(r)).slice(0, widths[i]).padEnd(widths[i]))
          .join("  "),
    );
  }
  console.log(`\n  ${rows.length} rows (${rows.length} API units)`);
}

/* A keyword is interesting to this site when real people search it and the
   page-one incumbents are beatable. Volume alone has been the trap. */
const verdict = (r) => {
  const vol = Number(r.Nq || 0);
  const kd = Number(r.Kd ?? NaN);
  if (!vol) return "no volume";
  if (!Number.isNaN(kd)) {
    if (kd < 30) return vol > 100 ? "WORTH IT" : "easy, thin";
    if (kd < 50) return vol > 300 ? "possible" : "marginal";
    return "too hard";
  }
  return vol > 200 ? "check KD" : "low volume";
};

const KW_COLS = [
  ["keyword", (r) => r.Ph, 46],
  ["volume", (r) => n(r.Nq), 8],
  ["KD", (r) => (r.Kd ?? "—"), 5],
  ["results", (r) => n(r.Nr), 12],
  ["CPC", (r) => (r.Cp ? Number(r.Cp).toFixed(2) : "—"), 6],
  ["verdict", (r) => verdict(r), 11],
];

/* ── commands ────────────────────────────────────────────────────────── */

const [, , cmd, phrase, ...rest] = process.argv;
const flag = (name, fallback) => {
  const i = rest.indexOf("--" + name);
  return i === -1 ? fallback : rest[i + 1];
};
const db = flag("db", DEFAULT_DB);
const limit = Number(flag("limit", 20));

const COLS = "Ph,Nq,Cp,Co,Nr,Td";

switch (cmd) {
  case "units": {
    const res = await fetch(
      `https://www.semrush.com/users/countapiunits.html?key=${readKey()}`,
    );
    console.log("API units remaining:", (await res.text()).trim());
    break;
  }

  case "kw": {
    if (!phrase) throw new Error('usage: kw "some phrase"');
    console.log(`\nOverview — "${phrase}" (${db})\n`);
    const rows = await call({
      type: "phrase_this",
      phrase,
      database: db,
      export_columns: COLS,
    });
    const kd = await call({
      type: "phrase_kdi",
      phrase,
      database: db,
      export_columns: "Ph,Kd",
    }).catch(() => []);
    for (const r of rows) r.Kd = kd.find((k) => k.Ph === r.Ph)?.Kd;
    table(rows, KW_COLS);
    break;
  }

  case "related": {
    if (!phrase) throw new Error('usage: related "some phrase"');
    console.log(`\nRelated to "${phrase}" (${db}), top ${limit}\n`);
    const rows = await call({
      type: "phrase_related",
      phrase,
      database: db,
      export_columns: COLS,
      display_limit: limit,
      display_sort: "nq_desc",
    });
    const kd = await call({
      type: "phrase_kdi",
      phrase: rows.map((r) => r.Ph).join(";"),
      database: db,
      export_columns: "Ph,Kd",
    }).catch(() => []);
    for (const r of rows) r.Kd = kd.find((k) => k.Ph === r.Ph)?.Kd;
    rows.sort((a, b) => Number(a.Kd ?? 99) - Number(b.Kd ?? 99));
    table(rows, KW_COLS);
    break;
  }

  case "broad": {
    if (!phrase) throw new Error('usage: broad "some phrase"');
    console.log(`\nPhrases containing "${phrase}" (${db}), top ${limit}\n`);
    const rows = await call({
      type: "phrase_fullsearch",
      phrase,
      database: db,
      export_columns: COLS,
      display_limit: limit,
      display_sort: "nq_desc",
    });
    const kd = await call({
      type: "phrase_kdi",
      phrase: rows.map((r) => r.Ph).join(";"),
      database: db,
      export_columns: "Ph,Kd",
    }).catch(() => []);
    for (const r of rows) r.Kd = kd.find((k) => k.Ph === r.Ph)?.Kd;
    rows.sort((a, b) => Number(a.Kd ?? 99) - Number(b.Kd ?? 99));
    table(rows, KW_COLS);
    break;
  }

  /* What we already rank for, and where. This is the one that speaks to the
     impressions-without-clicks problem: anything sitting past position 10
     collects impressions and earns nothing. */
  case "ours": {
    const domain = phrase || "numbersonyourtip.com";
    console.log(`\nOrganic positions for ${domain} (${db}), top ${limit}\n`);
    const rows = await call({
      type: "domain_organic",
      domain,
      database: db,
      export_columns: "Ph,Po,Nq,Ur,Tr,Kd",
      display_limit: limit,
      display_sort: "tr_desc",
    });
    table(rows, [
      ["keyword", (r) => r.Ph, 40],
      ["pos", (r) => r.Po, 4],
      ["volume", (r) => n(r.Nq), 8],
      ["page", (r) => (r.Ur || "").replace(/^https?:\/\/[^/]+/, ""), 38],
      ["note", (r) => (Number(r.Po) > 10 ? "page 2+, no clicks" : ""), 18],
    ]);
    break;
  }

  default:
    console.log(
      [
        "",
        "  node scripts/semrush.mjs units",
        '  node scripts/semrush.mjs kw "phrase"            keyword overview + difficulty',
        '  node scripts/semrush.mjs related "phrase"       semantically related terms',
        '  node scripts/semrush.mjs broad "phrase"         phrases containing it',
        "  node scripts/semrush.mjs ours                   what this site ranks for, and where",
        "",
        "  --db uk|us   (default uk)      --limit 20",
        "",
      ].join("\n"),
    );
}
