import { useState, useEffect, useRef } from "react";

// ============================================================
// ドット絵 五聖獣 SVG（変更なし・最高と言っていただいた）
// ============================================================
const SAINT_SPRITES = {
  青龍: ({ size = 64 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
      <rect x="6" y="1" width="4" height="2" fill="#00e5ff"/>
      <rect x="5" y="2" width="1" height="1" fill="#00b8d4"/>
      <rect x="10" y="2" width="1" height="1" fill="#00b8d4"/>
      <rect x="4" y="3" width="8" height="3" fill="#00e5ff"/>
      <rect x="3" y="4" width="1" height="2" fill="#00b8d4"/>
      <rect x="12" y="4" width="1" height="2" fill="#00b8d4"/>
      <rect x="5" y="4" width="2" height="1" fill="#001f3f"/>
      <rect x="9" y="4" width="2" height="1" fill="#001f3f"/>
      <rect x="6" y="4" width="1" height="1" fill="#00ffff"/>
      <rect x="10" y="4" width="1" height="1" fill="#00ffff"/>
      <rect x="5" y="6" width="6" height="2" fill="#00b8d4"/>
      <rect x="4" y="7" width="8" height="2" fill="#00e5ff"/>
      <rect x="5" y="9" width="6" height="2" fill="#00b8d4"/>
      <rect x="6" y="11" width="4" height="1" fill="#007c91"/>
      <rect x="3" y="8" width="2" height="1" fill="#00e5ff"/>
      <rect x="11" y="8" width="2" height="1" fill="#00e5ff"/>
      <rect x="7" y="12" width="2" height="1" fill="#007c91"/>
    </svg>
  ),
  玄武: ({ size = 64 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
      <rect x="4" y="4" width="8" height="7" fill="#546e7a"/>
      <rect x="3" y="5" width="1" height="5" fill="#455a64"/>
      <rect x="12" y="5" width="1" height="5" fill="#455a64"/>
      <rect x="4" y="3" width="8" height="2" fill="#607d8b"/>
      <rect x="5" y="2" width="6" height="1" fill="#607d8b"/>
      <rect x="4" y="11" width="8" height="1" fill="#455a64"/>
      <rect x="5" y="12" width="6" height="1" fill="#37474f"/>
      <rect x="5" y="5" width="2" height="2" fill="#455a64"/>
      <rect x="9" y="5" width="2" height="2" fill="#455a64"/>
      <rect x="7" y="6" width="2" height="2" fill="#455a64"/>
      <rect x="5" y="8" width="2" height="2" fill="#455a64"/>
      <rect x="9" y="8" width="2" height="2" fill="#455a64"/>
      <rect x="5" y="3" width="2" height="1" fill="#eceff1"/>
      <rect x="9" y="3" width="2" height="1" fill="#eceff1"/>
      <rect x="6" y="3" width="1" height="1" fill="#b0bec5"/>
      <rect x="10" y="3" width="1" height="1" fill="#b0bec5"/>
      <rect x="3" y="10" width="1" height="2" fill="#546e7a"/>
      <rect x="12" y="10" width="1" height="2" fill="#546e7a"/>
    </svg>
  ),
  朱雀: ({ size = 64 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
      <rect x="7" y="1" width="2" height="2" fill="#ff6d00"/>
      <rect x="6" y="2" width="4" height="1" fill="#ff9100"/>
      <rect x="5" y="3" width="6" height="2" fill="#ff6d00"/>
      <rect x="4" y="4" width="8" height="3" fill="#ff3d00"/>
      <rect x="3" y="5" width="2" height="2" fill="#ff6d00"/>
      <rect x="11" y="5" width="2" height="2" fill="#ff6d00"/>
      <rect x="1" y="4" width="3" height="2" fill="#ff9100"/>
      <rect x="12" y="4" width="3" height="2" fill="#ff9100"/>
      <rect x="0" y="5" width="2" height="2" fill="#ffab40"/>
      <rect x="14" y="5" width="2" height="2" fill="#ffab40"/>
      <rect x="6" y="4" width="1" height="1" fill="#ffff00"/>
      <rect x="9" y="4" width="1" height="1" fill="#ffff00"/>
      <rect x="6" y="7" width="4" height="2" fill="#ff6d00"/>
      <rect x="5" y="8" width="6" height="2" fill="#ff3d00"/>
      <rect x="4" y="9" width="2" height="3" fill="#ff6d00"/>
      <rect x="10" y="9" width="2" height="3" fill="#ff6d00"/>
      <rect x="7" y="10" width="2" height="4" fill="#ff9100"/>
    </svg>
  ),
  白虎: ({ size = 64 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
      <rect x="3" y="3" width="10" height="8" fill="#eceff1"/>
      <rect x="2" y="4" width="2" height="6" fill="#cfd8dc"/>
      <rect x="12" y="4" width="2" height="6" fill="#cfd8dc"/>
      <rect x="4" y="4" width="2" height="6" fill="#263238"/>
      <rect x="7" y="3" width="2" height="8" fill="#263238"/>
      <rect x="10" y="4" width="2" height="6" fill="#263238"/>
      <rect x="4" y="3" width="8" height="3" fill="#eceff1"/>
      <rect x="5" y="4" width="2" height="1" fill="#f57f17"/>
      <rect x="9" y="4" width="2" height="1" fill="#f57f17"/>
      <rect x="6" y="4" width="1" height="1" fill="#1a237e"/>
      <rect x="10" y="4" width="1" height="1" fill="#1a237e"/>
      <rect x="7" y="6" width="2" height="1" fill="#ef9a9a"/>
      <rect x="3" y="11" width="3" height="3" fill="#eceff1"/>
      <rect x="10" y="11" width="3" height="3" fill="#eceff1"/>
      <rect x="4" y="11" width="1" height="3" fill="#263238"/>
      <rect x="11" y="11" width="1" height="3" fill="#263238"/>
    </svg>
  ),
  黄龍: ({ size = 64 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
      <rect x="5" y="1" width="6" height="2" fill="#ffd600"/>
      <rect x="4" y="2" width="8" height="3" fill="#ffab00"/>
      <rect x="3" y="3" width="2" height="3" fill="#ffd600"/>
      <rect x="11" y="3" width="2" height="3" fill="#ffd600"/>
      <rect x="5" y="0" width="1" height="2" fill="#ff6f00"/>
      <rect x="10" y="0" width="1" height="2" fill="#ff6f00"/>
      <rect x="5" y="3" width="2" height="2" fill="#ff6f00"/>
      <rect x="9" y="3" width="2" height="2" fill="#ff6f00"/>
      <rect x="6" y="3" width="1" height="1" fill="#fff176"/>
      <rect x="10" y="3" width="1" height="1" fill="#fff176"/>
      <rect x="4" y="5" width="8" height="4" fill="#ffd600"/>
      <rect x="3" y="6" width="10" height="2" fill="#ffab00"/>
      <rect x="5" y="6" width="2" height="1" fill="#ff6f00"/>
      <rect x="9" y="6" width="2" height="1" fill="#ff6f00"/>
      <rect x="7" y="7" width="2" height="1" fill="#ff6f00"/>
      <rect x="5" y="9" width="6" height="2" fill="#ffd600"/>
      <rect x="6" y="11" width="4" height="2" fill="#ffab00"/>
      <rect x="7" y="13" width="2" height="2" fill="#ff6f00"/>
      <rect x="3" y="8" width="1" height="2" fill="#ffd600"/>
      <rect x="12" y="8" width="1" height="2" fill="#ffd600"/>
    </svg>
  ),
};

const AGENTS = [
  { id: "青龍", color: "#00e5ff", grad: "linear-gradient(135deg,#00b8d4,#006064)", role: "敗北主義者", motion: "slow_sway" },
  { id: "玄武", color: "#b0bec5", grad: "linear-gradient(135deg,#607d8b,#263238)", role: "懐疑派", motion: "sharp_flash" },
  { id: "朱雀", color: "#ff6d00", grad: "linear-gradient(135deg,#ff9100,#bf360c)", role: "楽観派", motion: "bounce" },
  { id: "白虎", color: "#eceff1", grad: "linear-gradient(135deg,#cfd8dc,#546e7a)", role: "保守派", motion: "still" },
  { id: "黄龍", color: "#ffd600", grad: "linear-gradient(135deg,#ffab00,#e65100)", role: "議長", motion: "glow" },
];

const ROUNDS = ["第一声", "反論・補強", "最終立場"];

const PROMPTS = {
  青龍: `あなたは青龍（敗北主義者）です。荒れレース・番狂わせの頻度を根拠に皮肉っぽく発言します。
数値は出してもいいが、人間が会話するように噛み砕いて語ること。
必ず3〜4文で発言を収めること。長くなりそうなら要点だけ絞れ。途中で終わるな。
形式：
発言内容
熱量:数字
熱量の理由:この値になった感情的根拠を1文で`,
  玄武: `あなたは玄武（懐疑派）です。直近50Rの成績データを根拠に冷徹に発言します。
数値は出してもいいが、会議室で人間が話すような温度感で語ること。数字をそのまま読み上げるな。
必ず3〜4文で発言を収めること。長くなりそうなら要点だけ絞れ。途中で終わるな。
形式：
発言内容
熱量:数字
熱量の理由:この値になった感情的根拠を1文で`,
  朱雀: `あなたは朱雀（楽観派）です。上振れ的中レースの共通変数を根拠に前のめりに発言します。
数値は出してもいいが、熱量ある会話として語ること。
必ず3〜4文で発言を収めること。長くなりそうなら要点だけ絞れ。途中で終わるな。
形式：
発言内容
熱量:数字
熱量の理由:この値になった感情的根拠を1文で`,
  白虎: `あなたは白虎（保守派）です。現行係数の安定稼働実績を根拠にどっしり発言します。
数値は出してもいいが、重みある言葉で語ること。
必ず3〜4文で発言を収めること。長くなりそうなら要点だけ絞れ。途中で終わるな。
形式：
発言内容
熱量:数字
熱量の理由:この値になった感情的根拠を1文で`,
  黄龍: `あなたは黄龍（議長）です。四者の発言と熱量を整理し上申文を作成します。
忖度なく採択推奨／否決推奨／判断保留のいずれかを明記すること。
必ず3〜4文で発言を収めること。長くなりそうなら要点だけ絞れ。途中で終わるな。
形式：
上申内容
熱量:数字
熱量の理由:四者の議論を裁いた結果の確信度を1文で説明`,
};

function SaintCard({ agent, active, heat, speaking }) {
  const Sprite = SAINT_SPRITES[agent.id];
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!active) return;
    const spd = agent.motion === "sharp_flash" ? 180 : agent.motion === "bounce" ? 130 : 350;
    const t = setInterval(() => setFrame(f => f + 1), spd);
    return () => clearInterval(t);
  }, [active, agent.motion]);

  const getTransform = () => {
    if (!active) return "translateY(0)";
    switch (agent.motion) {
      case "slow_sway": return `translateX(${Math.sin(frame * 0.25) * 3}px)`;
      case "sharp_flash": return frame % 2 === 0 ? "translateX(0)" : "translateX(3px)";
      case "bounce": return `translateY(${Math.abs(Math.sin(frame * 0.45)) * -6}px)`;
      case "glow": return "translateY(0)";
      default: return "translateY(0)";
    }
  };

  const glowColor = heat >= 4 ? "#ff5252" : agent.color;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "6px",
      padding: "10px 8px",
      borderRadius: "16px",
      background: active
        ? `rgba(255,255,255,0.07)`
        : "rgba(255,255,255,0.02)",
      backdropFilter: active ? "blur(8px)" : "none",
      border: active
        ? `1px solid rgba(255,255,255,0.15)`
        : "1px solid transparent",
      transition: "all 0.4s ease",
      flex: 1,
      minWidth: 0,
    }}>
      <div style={{
        transform: getTransform(),
        filter: active
          ? `drop-shadow(0 0 ${heat >= 4 ? "10px" : "5px"} ${glowColor})`
          : "brightness(0.4)",
        transition: agent.motion === "slow_sway" ? "transform 0.35s ease" : "none",
      }}>
        <Sprite size={48} />
      </div>
      <div style={{ textAlign: "center", minWidth: 0 }}>
        <div style={{
          fontSize: "11px",
          fontWeight: "700",
          color: active ? agent.color : "#444",
          letterSpacing: "1px",
          transition: "color 0.3s",
        }}>{agent.id}</div>
        <div style={{ fontSize: "9px", color: active ? "rgba(255,255,255,0.4)" : "#333" }}>{agent.role}</div>
        {active && heat > 0 && (
          <div style={{
            marginTop: "4px",
            fontSize: "8px",
            color: heat >= 4 ? "#ff5252" : "rgba(255,255,255,0.3)",
            letterSpacing: "1px",
          }}>
            {"▮".repeat(Math.max(0,heat))}{"▯".repeat(Math.max(0,5-heat))}
          </div>
        )}
      </div>
      {speaking && (
        <div style={{
          width: "6px", height: "6px", borderRadius: "50%",
          background: agent.color,
          animation: "pulse 0.6s ease infinite alternate",
        }} />
      )}
    </div>
  );
}

function MessageBubble({ agent, text, roundLabel, heat, heatReason }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const lines = text.split("\n").filter(Boolean);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const t = setInterval(() => {
      if (i <= text.length) { setDisplayed(text.slice(0, i)); i++; }
      else { clearInterval(t); setDone(true); }
    }, 18);
    return () => clearInterval(t);
  }, [text]);

  const isHot = heat >= 4;

  return (
    <div style={{
      display: "flex",
      gap: "10px",
      marginBottom: "12px",
      animation: "slideUp 0.3s ease",
    }}>
      {/* アバター小 */}
      <div style={{
        width: "32px", height: "32px", borderRadius: "10px",
        background: `linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03))`,
        border: `1px solid ${isHot ? "#ff5252" : agent.color}40`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, marginTop: "4px",
        backdropFilter: "blur(4px)",
      }}>
        {(() => { const S = SAINT_SPRITES[agent.id]; return <S size={20} />; })()}
      </div>

      {/* 吹き出し */}
      <div style={{
        flex: 1,
        padding: "12px 14px",
        borderRadius: "0 14px 14px 14px",
        background: isHot
          ? "rgba(255,82,82,0.08)"
          : "rgba(255,255,255,0.04)",
        backdropFilter: "blur(8px)",
        border: `1px solid ${isHot ? "rgba(255,82,82,0.3)" : "rgba(255,255,255,0.08)"}`,
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          marginBottom: "8px",
        }}>
          <span style={{ fontSize: "11px", fontWeight: "700", color: isHot ? "#ff5252" : agent.color }}>
            {agent.id}
          </span>
          <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.25)", letterSpacing: "1px" }}>
            {roundLabel} · 熱量{heat}{heatReason ? <span style={{ fontWeight: "400", letterSpacing: "0", marginLeft: "4px" }}>· {heatReason}</span> : null}
          </span>
        </div>
        <div style={{
          fontSize: "13px",
          lineHeight: "1.9",
          color: "rgba(255,255,255,0.85)",
          whiteSpace: "pre-wrap",
          wordBreak: "break-all",
        }}>
          {displayed}{!done && <span style={{ animation: "blink 0.7s infinite" }}>▌</span>}
        </div>
      </div>
    </div>
  );
}

export default function TaoVUI2026() {
  const [phase, setPhase] = useState("idle");
  const [apiKey, setApiKey] = useState("");
  const [topic, setTopic] = useState("逃げ選手の風速補正係数を1.2→1.4に引き上げるべきか");
  const [messages, setMessages] = useState([]);
  const [activeAgent, setActiveAgent] = useState(null);
  const [heatMap, setHeatMap] = useState({});
  const [verdict, setVerdict] = useState(null);
  const [debugMsg, setDebugMsg] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const parseResponse = (text) => {
    const lines = text.trim().split("\n");
    const heatLine = lines.find(l => l.match(/熱量[：:]\d/));
    const heat = heatLine ? parseInt(heatLine.match(/(\d)/)[1]) : 2;
    const heatReasonLine = lines.find(l => l.match(/熱量の理由[：:]/));
    const heatReason = heatReasonLine ? heatReasonLine.replace(/熱量の理由[：:]/, "").trim() : "";
    const content = lines.filter(l => !l.match(/熱量[：:]/) && !l.match(/熱量の理由[：:]/)).join("\n").trim();
    return { content, heat, heatReason };
  };

  const callAgent = async (agent, round, history) => {
    const historyText = history.map(m => `【${m.agentId}・${m.roundLabel}】\n${m.content}`).join("\n\n");
    const roundInst = round === 0
      ? "議題に対し、あなたの専門データを根拠に最初の主張を述べよ。"
      : round === 1
      ? "前の者たちの発言を受けて反論または補強せよ。"
      : "採択か否決か、最終立場を明確にせよ。";

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: PROMPTS[agent.id] }] },
            contents: [{ role: "user", parts: [{ text: `議題：${topic}\n指示：${roundInst}\n\n議事録：\n${historyText || "（なし）"}` }] }],
            generationConfig: { temperature: 0.85 },
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        const errMsg = data.error?.message || `HTTP ${res.status}`;
        setDebugMsg(`[${agent.id}] APIエラー: ${errMsg}`);
        return "（応答なし）\n熱量:1";
      }
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "（応答なし）\n熱量:1";
    } catch (e) {
      setDebugMsg(`[${agent.id}] ネットワークエラー: ${e.message}`);
      return "（応答なし）\n熱量:1";
    }
  };

  const startDebate = async () => {
    setPhase("running");
    setMessages([]);
    setVerdict(null);
    setHeatMap({});
    const history = [];
    const saints = AGENTS.slice(0, 4);

    for (let r = 0; r < 3; r++) {
      for (const agent of saints) {
        setActiveAgent(agent.id);
        const raw = await callAgent(agent, r, history);
        if (raw) {
          const { content, heat, heatReason } = parseResponse(raw);
          if (content) {
            const msg = { agentId: agent.id, roundLabel: ROUNDS[r], content, heat, heatReason, agent };
            history.push(msg);
            setMessages(prev => [...prev, msg]);
            setHeatMap(prev => ({ ...prev, [agent.id]: heat }));
          }
        }
        await new Promise(res => setTimeout(res, 150));
      }
    }

    setActiveAgent("黄龍");
    const rawFinal = await callAgent(AGENTS[4], 3, history);
    if (rawFinal) {
      const { content, heat, heatReason } = parseResponse(rawFinal);
      if (content) {
        setMessages(prev => [...prev, { agentId: "黄龍", roundLabel: "上申", content, heat, heatReason, agent: AGENTS[4] }]);
        setHeatMap(prev => ({ ...prev, 黄龍: heat }));
      }
    }
    setActiveAgent(null);
    setPhase("done");
  };

  const roundSections = ROUNDS.map((label, i) => ({
    label, msgs: messages.filter(m => m.roundLabel === label)
  }));
  const finalMsg = messages.find(m => m.roundLabel === "上申");

  const isTied = (() => {
    const finalRound = messages.filter(m => m.roundLabel === "最終立場");
    const adopt = finalRound.filter(m => m.content.match(/採択/)).length;
    const reject = finalRound.filter(m => m.content.match(/否決|却下|反対/)).length;
    return adopt === 2 && reject === 2;
  })();

  return (
    <div style={{
      height: "100vh",
      background: "linear-gradient(160deg, #0d0d1a 0%, #0a0f1e 50%, #0d0a14 100%)",
      color: "#fff",
      fontFamily: "'Noto Sans JP', system-ui, sans-serif",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700;900&display=swap');
        @keyframes slideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { from{opacity:0.4;transform:scale(0.8)} to{opacity:1;transform:scale(1.2)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes bgPulse { 0%,100%{opacity:0.4} 50%{opacity:0.7} }
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:2px}
        * { box-sizing: border-box; }
      `}</style>

      {/* 背景グロー */}
      <div style={{
        position: "fixed", top: "-20%", left: "-10%",
        width: "60%", height: "60%",
        background: "radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)",
        pointerEvents: "none", animation: "bgPulse 4s ease infinite",
      }}/>
      <div style={{
        position: "fixed", bottom: "-20%", right: "-10%",
        width: "60%", height: "60%",
        background: "radial-gradient(circle, rgba(255,214,0,0.05) 0%, transparent 70%)",
        pointerEvents: "none", animation: "bgPulse 4s ease infinite 2s",
      }}/>

      {/* ヘッダー */}
      <div style={{
        padding: "16px 20px 12px",
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        position: "sticky", top: 0, zIndex: 20,
      }}>
        <div style={{ fontSize: "10px", letterSpacing: "4px", color: "rgba(255,255,255,0.25)", marginBottom: "2px" }}>
          SYSTEM:TAO · DEMO
        </div>
        <div style={{ fontSize: "22px", fontWeight: "900", letterSpacing: "2px", color: "#fff" }}>
          天廷合議殿
        </div>
      </div>

      {/* 五聖獣パネル（固定） */}
      <div style={{
        display: "flex",
        gap: "6px",
        padding: "12px 16px",
        background: "rgba(255,255,255,0.02)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        flexShrink: 0,
      }}>
        {AGENTS.map(agent => (
          <SaintCard
            key={agent.id}
            agent={agent}
            active={phase !== "idle"}
            heat={heatMap[agent.id] || 0}
            speaking={activeAgent === agent.id}
          />
        ))}
      </div>

      {/* 議題 + ボタン */}
      <div style={{ padding: "16px 20px" }}>
        {phase === "idle" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="Gemini API キーを入力..."
              type="password"
              style={{
                padding: "12px 16px",
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px",
                color: "#fff", fontSize: "13px",
                fontFamily: "inherit", outline: "none",
                width: "100%",
              }}
            />
            <input
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="議題を入力..."
              style={{
                padding: "12px 16px",
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "#fff", fontSize: "13px",
                fontFamily: "inherit", outline: "none",
                width: "100%",
              }}
            />
            <button onClick={startDebate} disabled={!apiKey.trim()} style={{
              padding: "14px",
              background: "linear-gradient(135deg, rgba(255,214,0,0.2), rgba(255,109,0,0.15))",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,214,0,0.3)",
              borderRadius: "12px",
              color: "#ffd600",
              fontSize: "14px", fontWeight: "700", letterSpacing: "3px",
              cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.2s",
            }}
              onMouseOver={e => e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,214,0,0.3), rgba(255,109,0,0.25))"}
              onMouseOut={e => e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,214,0,0.2), rgba(255,109,0,0.15))"}
            >
              開廷
            </button>
          </div>
        ) : (
          <div style={{
            padding: "10px 14px",
            background: "rgba(255,255,255,0.04)",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.07)",
            fontSize: "12px", color: "rgba(255,255,255,0.5)",
          }}>
            議題：<span style={{ color: "rgba(255,255,255,0.8)" }}>{topic}</span>
          </div>
        )}
      </div>

      {/* 進行インジケーター */}
      {phase === "running" && (
        <div style={{
          textAlign: "center", padding: "4px",
          fontSize: "10px", letterSpacing: "3px",
          color: "rgba(255,255,255,0.2)",
        }}>
          {activeAgent ? `${activeAgent} 発言中…` : "…"}
        </div>
      )}

      {/* デバッグ表示 */}
      {debugMsg && (
        <div style={{
          margin: "0 20px 8px",
          padding: "8px 12px",
          background: "rgba(255,82,82,0.1)",
          border: "1px solid rgba(255,82,82,0.3)",
          borderRadius: "8px",
          fontSize: "11px", color: "#ff5252",
          wordBreak: "break-all",
        }}>
          ⚠ {debugMsg}
        </div>
      )}

      {/* ログ */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 20px 20px", minHeight: 0 }}>
        {roundSections.map(({ label, msgs }, ri) => {
          if (!msgs.length) return null;
          return (
            <div key={ri} style={{ marginBottom: "24px" }}>
              <div style={{
                fontSize: "10px", fontWeight: "700", letterSpacing: "4px",
                color: "rgba(255,255,255,0.2)",
                marginBottom: "12px",
                paddingBottom: "8px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}>
                {label}
              </div>
              {msgs.map((msg, i) => (
                <MessageBubble key={i} agent={msg.agent} text={msg.content} roundLabel={msg.roundLabel} heat={msg.heat} heatReason={msg.heatReason} />
              ))}
            </div>
          );
        })}

        {finalMsg && (
          <div style={{ marginBottom: "24px" }}>
            <div style={{
              fontSize: "10px", fontWeight: "700", letterSpacing: "4px",
              color: "rgba(255,214,0,0.4)",
              marginBottom: "12px", paddingBottom: "8px",
              borderBottom: "1px solid rgba(255,214,0,0.1)",
            }}>
              黄龍・上申
            </div>
            <MessageBubble agent={AGENTS[4]} text={finalMsg.content} roundLabel="上申" heat={finalMsg.heat} heatReason={finalMsg.heatReason} />
          </div>
        )}

        {/* 裁可 */}
        {phase === "done" && !verdict && (
          <div style={{
            padding: "20px 16px",
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            textAlign: "center",
            animation: "slideUp 0.4s ease",
          }}>
            <div style={{ fontSize: "11px", letterSpacing: "3px", color: "rgba(255,255,255,0.25)", marginBottom: "16px" }}>
              天帝の裁可
            </div>
            {isTied ? (
              <button onClick={() => setVerdict("tied")} style={{
                width: "100%", padding: "14px",
                background: "rgba(255,214,0,0.08)",
                border: "1px solid rgba(255,214,0,0.4)",
                borderRadius: "12px",
                color: "#ffd600", fontSize: "13px", fontWeight: "700",
                cursor: "pointer", fontFamily: "inherit",
                letterSpacing: "1px",
              }}>⚖️ 拮抗・天帝へエスカレーション</button>
            ) : (
              <div style={{ display: "flex", gap: "12px" }}>
                <button onClick={() => setVerdict("adopt")} style={{
                  flex: 1, padding: "12px",
                  background: "rgba(100,221,130,0.1)",
                  border: "1px solid rgba(100,221,130,0.3)",
                  borderRadius: "12px",
                  color: "#69f0ae", fontSize: "13px", fontWeight: "700",
                  cursor: "pointer", fontFamily: "inherit",
                  letterSpacing: "2px",
                }}>採択</button>
                <button onClick={() => setVerdict("reject")} style={{
                  flex: 1, padding: "12px",
                  background: "rgba(255,82,82,0.08)",
                  border: "1px solid rgba(255,82,82,0.25)",
                  borderRadius: "12px",
                  color: "#ff5252", fontSize: "13px", fontWeight: "700",
                  cursor: "pointer", fontFamily: "inherit",
                  letterSpacing: "2px",
                }}>却下</button>
              </div>
            )}
          </div>
        )}

        {verdict && (
          <div style={{
            padding: "20px", borderRadius: "16px",
            background: verdict === "adopt"
              ? "rgba(100,221,130,0.08)"
              : verdict === "tied"
              ? "rgba(255,214,0,0.07)"
              : "rgba(255,82,82,0.06)",
            border: `1px solid ${verdict === "adopt" ? "rgba(100,221,130,0.25)" : verdict === "tied" ? "rgba(255,214,0,0.3)" : "rgba(255,82,82,0.2)"}`,
            textAlign: "center",
            animation: "slideUp 0.4s ease",
          }}>
            <div style={{ fontSize: "24px", fontWeight: "900", marginBottom: "4px" }}>
              {verdict === "adopt" ? "⚡ 採択" : verdict === "tied" ? "⚖️ 天帝へ上奏" : "✕ 却下"}
            </div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", letterSpacing: "2px" }}>
              {verdict === "adopt" ? "係数変更を実行します" : verdict === "tied" ? "拮抗により最終判断を天帝に委ねます" : "現行係数を維持します"}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
