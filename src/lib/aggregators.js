// src/lib/aggregators.js
// 各集計関数（天雲指数・開催場・季節・級別・風速）

// 列インデックス (0始まり)
// A=0(レース日), B=1(開催場), C=2(天雲指数), G=6(晴天令T/F), H=7(荒天令T/F)
// I=8(総合判定), N=13(3連単), O=14(3連複), P=15(2車単), Q=16(級別), S=18(風向・風速)

const pct = (n, d) => d === 0 ? "0%" : `${Math.round(n / d * 100)}%`;

const isSunHit  = r => (r[6] || "") === "T";
const isRainHit = r => (r[7] || "") === "T";

// ── 基本サマリー（常に含まれる） ────────────────────────────────
export function buildBaseSection(dataRows) {
  const N = dataRows.length;
  const sunHit   = dataRows.filter(isSunHit);
  const rainHit  = dataRows.filter(isRainHit);
  const judgeHit = dataRows.filter(r => (r[8] || "").includes("🎯的中")).length;
  return {
    text: `【直近${N}R成績サマリー】
総レース数: ${N}
的中率（晴天令）: ${pct(sunHit.length, N)} (${sunHit.length}/${N})
的中率（荒天令）: ${pct(rainHit.length, N)} (${rainHit.length}/${N})
総合判定 採択率: ${pct(judgeHit, N)}`,
    sunHit,
    rainHit,
    N,
  };
}

// ── 天雲指数別（C列: "0"/"33"/"66"/"100"） ─────────────────────
export function buildTenunSection(dataRows) {
  const groups = { "0": [], "33": [], "66": [], "100": [] };
  dataRows.forEach(r => {
    const key = (r[2] || "").trim();
    if (groups[key]) groups[key].push(r);
  });
  const sp = k => pct(groups[k].filter(isSunHit).length,  groups[k].length);
  const rp = k => pct(groups[k].filter(isRainHit).length, groups[k].length);
  return `天雲指数別的中率（晴天令）:
  0: ${sp("0")} / 33: ${sp("33")} / 66: ${sp("66")} / 100: ${sp("100")}
天雲指数別的中率（荒天令）:
  0: ${rp("0")} / 33: ${rp("33")} / 66: ${rp("66")} / 100: ${rp("100")}`;
}

// ── 開催場別（B列） ─────────────────────────────────────────────
export function buildVenueSection(dataRows) {
  const map = {};
  dataRows.forEach(r => {
    const v = (r[1] || "不明").trim();
    if (!map[v]) map[v] = { sun: 0, rain: 0, total: 0 };
    map[v].total++;
    if (isSunHit(r))  map[v].sun++;
    if (isRainHit(r)) map[v].rain++;
  });
  const list = Object.entries(map).filter(([, v]) => v.total >= 3);
  const top3 = (sort) => [...list].sort(sort).slice(0, 3)
    .map(([name, v]) => `${name} ${pct(v[sort === sortSun ? "sun" : "rain"], v.total)}`).join(", ");
  const sortSun  = (a, b) => b[1].sun  / b[1].total - a[1].sun  / a[1].total;
  const sortRain = (a, b) => b[1].rain / b[1].total - a[1].rain / a[1].total;
  const t3Sun  = [...list].sort(sortSun).slice(0, 3).map(([n, v]) => `${n} ${pct(v.sun, v.total)}`).join(", ");
  const t3Rain = [...list].sort(sortRain).slice(0, 3).map(([n, v]) => `${n} ${pct(v.rain, v.total)}`).join(", ");
  return `開催場別的中率TOP3（晴天令）:
  ${t3Sun || "データ不足"}
開催場別的中率TOP3（荒天令）:
  ${t3Rain || "データ不足"}`;
}

// ── 季節別（A列のレース日から月を抽出） ────────────────────────
// 春:3-5月 / 夏:6-8月 / 秋:9-11月 / 冬:12-2月
export function buildSeasonSection(dataRows) {
  const groups = { "春(3-5月)": [], "夏(6-8月)": [], "秋(9-11月)": [], "冬(12-2月)": [] };
  dataRows.forEach(r => {
    const raw = (r[0] || "").trim(); // 例: "2025/12/05"
    const m = parseInt(raw.split("/")[1] || "0", 10);
    const key = (m >= 3 && m <= 5) ? "春(3-5月)"
              : (m >= 6 && m <= 8) ? "夏(6-8月)"
              : (m >= 9 && m <= 11) ? "秋(9-11月)"
              : (m === 12 || m <= 2) ? "冬(12-2月)"
              : null;
    if (key) groups[key].push(r);
  });
  const lines = Object.entries(groups).map(([label, rows]) => {
    if (!rows.length) return null;
    return `  ${label}(${rows.length}件): 晴天令 ${pct(rows.filter(isSunHit).length, rows.length)} / 荒天令 ${pct(rows.filter(isRainHit).length, rows.length)}`;
  }).filter(Boolean).join("\n");
  return `季節別的中率:\n${lines || "  データ不足"}`;
}

// ── 級別（Q列: "S級"/"A級"/"Aチャレ"など） ─────────────────────
export function buildGradeSection(dataRows) {
  const map = {};
  dataRows.forEach(r => {
    const key = (r[16] || "不明").trim();
    if (!map[key]) map[key] = [];
    map[key].push(r);
  });
  const lines = Object.entries(map)
    .filter(([, rows]) => rows.length >= 3)
    .sort((a, b) => b[1].length - a[1].length)
    .map(([label, rows]) =>
      `  ${label}(${rows.length}件): 晴天令 ${pct(rows.filter(isSunHit).length, rows.length)} / 荒天令 ${pct(rows.filter(isRainHit).length, rows.length)}`
    ).join("\n");
  return `級別的中率:\n${lines || "  データ不足"}`;
}

// ── 風速別（S列: "（方向 X.Xm）"） ─────────────────────────────
export function buildWindSection(dataRows) {
  const groups = { "無風(0m)": [], "弱風(1-2m)": [], "中風(3-4m)": [], "強風(5m+)": [] };
  dataRows.forEach(r => {
    const raw = (r[18] || "").trim();
    const m = parseFloat((raw.match(/(\d+\.?\d*)m/) || [])[1] || "0");
    const key = m === 0 ? "無風(0m)" : m <= 2 ? "弱風(1-2m)" : m <= 4 ? "中風(3-4m)" : "強風(5m+)";
    groups[key].push(r);
  });
  const lines = Object.entries(groups).map(([label, rows]) => {
    if (!rows.length) return null;
    return `  ${label}(${rows.length}件): 晴天令 ${pct(rows.filter(isSunHit).length, rows.length)} / 荒天令 ${pct(rows.filter(isRainHit).length, rows.length)}`;
  }).filter(Boolean).join("\n");
  return `風速帯別的中率:\n${lines || "  データ不足"}`;
}

// ── オッズ（N=13, O=14, P=15） ── 基本サマリーに含める ─────────
export function buildOddsLine(sunHit) {
  const avg = (col) => {
    const vals = sunHit.map(r => parseFloat((r[col] || "").replace(",", ""))).filter(v => !isNaN(v) && v > 0);
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : null;
  };
  return [["3連単", avg(13)], ["3連複", avg(14)], ["2車単", avg(15)]]
    .map(([n, v]) => `${n} ${v ? v + "倍" : "データなし"}`).join(" / ");
}
