// src/lib/sheetsLoader.js
// Sheets API取得・パース・セッションキャッシュ

const SHEETS_ID = "1S9U_AR4dM8tKTUTKx3_wAJBLW5x4zB3h7annjv7z8iw";

let sessionCache = null; // セッション中は再取得しない

export function clearCache() {
  sessionCache = null;
}

/**
 * 直近200行のdataRowsを返す。セッションキャッシュがあればそれを使う。
 * @param {string} apiKey - Sheets API key
 * @returns {Promise<string[][]|null>}
 */
export async function loadDataRows(apiKey) {
  if (sessionCache) return sessionCache;

  const range = encodeURIComponent("データ入力!A:S");
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_ID}/values/${range}?key=${apiKey}`
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || `HTTP ${res.status}`);

  const rows = data.values || [];
  if (rows.length < 2) return null;

  // ヘッダー除く直近200行
  const dataRows = rows.slice(1).slice(-200);
  sessionCache = dataRows;
  return dataRows;
}
