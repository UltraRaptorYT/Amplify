"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { phrases } from "./phrases";
import PhoneCommunicationApp from "./PhoneCommunicationApp";

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
    }, 2200);
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
        window.setTimeout(roam, 900);
        return;
      }
      setCursorIndex(index);
      setSelectedIndex(index);
      setSearching(false);
      setPopupIndex(index);
      speak(phrases[index].label);
    };
    window.setTimeout(roam, reduceMotion ? 0 : 350);
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
        <p>{phoneMode ? "Tap a phrase on the companion app to see the cursor find it on the board. The selected word will appear and be spoken aloud." : "A communication board can make simple messages easier to share. Choose a phrase in the companion app and watch it appear here."}</p>
      </section>

      <section className="simulator-layout with-phone" aria-label={phoneMode ? "Phone communication simulator" : "Communication board simulator with companion app"}>
        <div className="board-panel">
          <div className="board-toolbar"><div><span className="toolbar-dot" /> AMPLIFY / MESSAGE BOARD</div><span>{phrases.length} MESSAGES</span></div>
          <div className="communication-board" ref={boardRef}>
            <div className="communication-grid">
              {phrases.map((phrase, index) => <div className={`communication-tile tile-${phrase.color} ${selectedIndex === index ? "tile-selected" : ""}`} key={phrase.label} ref={(element) => { tileRefs.current[index] = element; }}>
                <span className="tile-picture" aria-hidden="true">{phrase.icon}</span>
                <span className="tile-word">{phrase.label}</span>
              </div>)}
            </div>
            <motion.div className={`board-cursor ${searching ? "cursor-searching" : ""}`} aria-hidden="true" animate={{ x: cursorPoint.x - 15, y: cursorPoint.y - 15 }} transition={reduceMotion ? { duration: 0 } : searching ? { duration: .95, ease: "easeInOut" } : { duration: 1.55, ease: "easeInOut" }}><span /></motion.div>
          </div>
          <div className="board-status"><span className={searching ? "status-waiting" : ""} />{searching ? "Finding your message…" : phoneMode ? "Phone connected · simulated selection" : "Selection preview · simulated cursor"}</div>
        </div>

        <PhoneCommunicationApp selectedIndex={selectedIndex} searching={searching} onSelect={selectPhrase} />
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
