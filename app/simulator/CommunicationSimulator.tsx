"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const phrases = [
  { label: "I, me, mine", icon: "🚶", color: "yellow" },
  { label: "want", icon: "🙋", color: "green" },
  { label: "go", icon: "➜", color: "green" },
  { label: "look, see", icon: "👀", color: "blue" },
  { label: "what", icon: "📦?", color: "white" },
  { label: "something’s wrong", icon: "🤕", color: "pink" },
  { label: "you, your", icon: "🧍‍♂️🧍", color: "yellow" },
  { label: "help", icon: "🖐️", color: "green" },
  { label: "stop", icon: "🛑", color: "green" },
  { label: "choose", icon: "☝️🍒", color: "green" },
  { label: "good", icon: "👍", color: "blue" },
  { label: "say it again", icon: "💬↶", color: "pink" },
  { label: "finish", icon: "🙅", color: "green" },
  { label: "like", icon: "💗", color: "green" },
  { label: "wait", icon: "🚶⏸", color: "green" },
  { label: "turn", icon: "⟲", color: "green" },
  { label: "different", icon: "🔷△", color: "blue" },
  { label: "out", icon: "↗", color: "white" },
  { label: "more", icon: "⟳", color: "blue" },
  { label: "not", icon: "╱", color: "white" },
  { label: "hurt", icon: "🤕", color: "green" },
  { label: "play", icon: "⚽", color: "green" },
  { label: "same", icon: "🔹🔹", color: "blue" },
  { label: "whoops", icon: "💭", color: "white" },
  { label: "water", icon: "💧", color: "blue" },
  { label: "eat", icon: "🍽️", color: "yellow" },
  { label: "bathroom", icon: "🚻", color: "blue" },
  { label: "yes", icon: "✓", color: "green" },
  { label: "no", icon: "✕", color: "white" },
] as const;

type PhraseIndex = number;

function speak(message: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.rate = 0.88;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

export default function CommunicationSimulator({ phoneMode = false }: { phoneMode?: boolean }) {
  const reduceMotion = useReducedMotion();
  const boardRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [cursorIndex, setCursorIndex] = useState(0);
  const [cursorPoint, setCursorPoint] = useState({ x: 0, y: 0 });
  const [selectedIndex, setSelectedIndex] = useState<PhraseIndex | null>(null);
  const [popupIndex, setPopupIndex] = useState<PhraseIndex | null>(null);
  const [searching, setSearching] = useState(false);
  const [speechAvailable, setSpeechAvailable] = useState(false);
  const runId = useRef(0);

  const updateCursorPoint = useCallback((index: number) => {
    const board = boardRef.current;
    const tile = tileRefs.current[index];
    if (!board || !tile) return;
    const boardRect = board.getBoundingClientRect();
    const tileRect = tile.getBoundingClientRect();
    setCursorPoint({
      x: tileRect.left - boardRect.left + tileRect.width / 2,
      y: tileRect.top - boardRect.top + tileRect.height / 2,
    });
  }, []);

  useEffect(() => {
    updateCursorPoint(cursorIndex);
    const resizeObserver = new ResizeObserver(() => updateCursorPoint(cursorIndex));
    if (boardRef.current) resizeObserver.observe(boardRef.current);
    const onResize = () => updateCursorPoint(cursorIndex);
    window.addEventListener("resize", onResize);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [cursorIndex, updateCursorPoint]);

  useEffect(() => {
    if (phoneMode || reduceMotion) return;
    const interval = window.setInterval(() => {
      setCursorIndex((current) => {
        let next = Math.floor(Math.random() * phrases.length);
        if (phrases.length > 1 && next === current) next = (next + 1) % phrases.length;
        return next;
      });
    }, 850);
    return () => window.clearInterval(interval);
  }, [phoneMode, reduceMotion]);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);
  useEffect(() => setSpeechAvailable("speechSynthesis" in window), []);

  const selectPhrase = (index: PhraseIndex) => {
    if (searching) return;
    const currentRun = ++runId.current;
    setSearching(true);
    setPopupIndex(null);
    const wanderCount = reduceMotion ? 0 : 3;
    let step = 0;
    const roam = () => {
      if (runId.current !== currentRun) return;
      if (step < wanderCount) {
        let next = Math.floor(Math.random() * phrases.length);
        if (next === index) next = (next + 1) % phrases.length;
        setCursorIndex(next);
        step += 1;
        window.setTimeout(roam, 310);
        return;
      }
      setCursorIndex(index);
      setSelectedIndex(index);
      setSearching(false);
      setPopupIndex(index);
      speak(phrases[index].label);
    };
    window.setTimeout(roam, reduceMotion ? 0 : 160);
  };

  const closePopup = () => {
    setPopupIndex(null);
    window.speechSynthesis?.cancel();
  };

  return (
    <main className={`simulator-page ${phoneMode ? "phone-demo-page" : "board-demo-page"}`}>
      <header className="sim-header">
        <a className="sim-brand" href="/"><span className="sim-brand-icon">a</span> amplify <i>/</i> simulator</a>
        <nav aria-label="Simulator navigation">
          {phoneMode ? <a href="/demo">Communication board</a> : <a href="/phone/demo">Open phone demo <span>↗</span></a>}
        </nav>
      </header>

      <section className="sim-intro">
        <div className="sim-eyebrow"><span /> SIMULATED COMMUNICATION BOARD</div>
        <h1>{phoneMode ? <>A word can open<br /><em>a conversation.</em></> : <>Everyday words.<br /><em>At your fingertips.</em></>}</h1>
        <p>{phoneMode ? "Tap a phrase on the phone to see the cursor find it on the board. The selected word will appear and be spoken aloud." : "A communication board can make simple messages easier to share. Watch the selection cursor explore, then try the phone controls."}</p>
      </section>

      <section className={`simulator-layout ${phoneMode ? "with-phone" : ""}`} aria-label={phoneMode ? "Phone communication simulator" : "Communication board simulator"}>
        <div className="board-panel">
          <div className="board-toolbar"><div><span className="toolbar-dot" /> AMPLIFY / MESSAGE BOARD</div><span>{phrases.length} MESSAGES</span></div>
          <div className="communication-board" ref={boardRef}>
            <div className="communication-grid">
              {phrases.map((phrase, index) => <div className={`communication-tile tile-${phrase.color} ${selectedIndex === index ? "tile-selected" : ""}`} key={phrase.label} ref={(element) => { tileRefs.current[index] = element; }}>
                <span className="tile-picture" aria-hidden="true">{phrase.icon}</span>
                <span className="tile-word">{phrase.label}</span>
              </div>)}
            </div>
            <motion.div className={`board-cursor ${searching ? "cursor-searching" : ""}`} aria-hidden="true" animate={{ x: cursorPoint.x - 15, y: cursorPoint.y - 15 }} transition={reduceMotion ? { duration: 0 } : searching ? { type: "spring", stiffness: 170, damping: 18 } : { type: "spring", stiffness: 85, damping: 14 }}><span /></motion.div>
          </div>
          <div className="board-status"><span className={searching ? "status-waiting" : ""} />{searching ? "Finding your message…" : phoneMode ? "Phone connected · simulated selection" : "Selection preview · simulated cursor"}</div>
        </div>

        {phoneMode ? <aside className="phone-column" aria-label="Phone controls">
          <div className="phone-caption"><span>AMPLIFY COMPANION</span><span><i /> CONNECTED</span></div>
          <div className="sim-phone">
            <div className="sim-phone-island" />
            <div className="sim-phone-screen">
              <div className="sim-phone-status"><span>9:41</span><span>•••</span></div>
              <div className="sim-phone-brand"><span className="sim-brand-icon">a</span> amplify <span className="phone-user">A</span></div>
              <div className="phone-greeting">What would you like to say?</div>
              <div className="phone-hint">TAP A WORD TO SELECT IT</div>
              <div className="phone-word-grid">
                {phrases.map((phrase, index) => <button type="button" key={phrase.label} className={`phone-word-button phone-tile-${phrase.color} ${selectedIndex === index ? "phone-word-active" : ""}`} onClick={() => selectPhrase(index)} disabled={searching} aria-pressed={selectedIndex === index}>
                  <span aria-hidden="true">{phrase.icon}</span><b>{phrase.label}</b>
                </button>)}
              </div>
              <div className="sim-phone-home" />
            </div>
          </div>
          <p className="phone-caption-note">Tap any phrase. The board cursor will find and speak it.</p>
        </aside> : <aside className="board-instructions">
          <div className="instruction-icon" aria-hidden="true">✳</div>
          <span className="instruction-kicker">A SIMULATED EXPERIENCE</span>
          <h2>See the selection<br />come to life.</h2>
          <p>The cursor wanders through the board to show how a message could be selected. Try the phone demo to choose a word yourself.</p>
          <a className="sim-cta" href="/phone/demo">Try the phone demo <span>→</span></a>
          <div className="instruction-divider" />
          <div className="instruction-foot"><span className="signal-led" /> All messages and signals are simulated.</div>
        </aside>}
      </section>

      <footer className="sim-footer"><span>AMPLIFY / GIVING EVERYONE A VOICE</span><a href="/">Back to Amplify <span>↗</span></a><span>PROTOTYPE CONCEPT · NOT A MEDICAL DEVICE</span></footer>

      <AnimatePresence>
        {popupIndex !== null && <motion.div className="message-overlay" role="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) closePopup(); }}>
          <motion.section className="message-popup" role="dialog" aria-modal="true" aria-labelledby="popup-title" initial={reduceMotion ? false : { opacity: 0, y: 14, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: .98 }} transition={{ duration: .2 }}>
            <button className="popup-close" type="button" onClick={closePopup} aria-label="Close message">×</button>
            <div className={`popup-symbol tile-${phrases[popupIndex].color}`} aria-hidden="true">{phrases[popupIndex].icon}</div>
            <span className="popup-kicker">MESSAGE SELECTED</span>
            <h2 id="popup-title">{phrases[popupIndex].label}</h2>
            <p>{speechAvailable ? "This message is being spoken aloud using your device’s speech feature." : "This browser does not support spoken messages, but your selection is shown here."}</p>
            {speechAvailable && <button className="speak-again" type="button" onClick={() => speak(phrases[popupIndex].label)}><span aria-hidden="true">◖))</span> Say it again</button>}
            <div className="popup-disclaimer">Simulated message · No real signals used</div>
          </motion.section>
        </motion.div>}
      </AnimatePresence>
    </main>
  );
}
