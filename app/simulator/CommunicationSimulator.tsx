"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { phrases } from "./phrases";
import { publishStorageFallback, SIMULATOR_CHANNEL, SIMULATOR_STORAGE_KEY, type SimulatorMessage } from "./channel";

export default function CommunicationSimulator() {
  const reduceMotion = useReducedMotion();
  const boardRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const lastMessageId = useRef("");
  const connectionTimer = useRef<number | null>(null);
  const [cursorIndex, setCursorIndex] = useState(0);
  const [cursorPoint, setCursorPoint] = useState({ x: 0, y: 0 });
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [phoneConnected, setPhoneConnected] = useState(false);

  const updateCursorPoint = useCallback((index: number) => {
    const board = boardRef.current;
    const tile = tileRefs.current[index];
    if (!board || !tile) return;
    const boardRect = board.getBoundingClientRect();
    const tileRect = tile.getBoundingClientRect();
    setCursorPoint({ x: tileRect.left - boardRect.left + tileRect.width / 2, y: tileRect.top - boardRect.top + tileRect.height / 2 });
  }, []);

  const acceptMessage = useCallback((message: SimulatorMessage) => {
    if (message.type === "phone-ping") {
      setPhoneConnected(true);
      const reply: SimulatorMessage = { type: "demo-pong", id: message.id };
      channelRef.current?.postMessage(reply);
      publishStorageFallback(reply);
      if (connectionTimer.current) window.clearTimeout(connectionTimer.current);
      connectionTimer.current = window.setTimeout(() => setPhoneConnected(false), 5500);
      return;
    }
    if (message.type !== "phrase-selected" || message.id === lastMessageId.current) return;
    lastMessageId.current = message.id;
    const index = Math.max(0, Math.min(phrases.length - 1, message.phraseIndex));
    setSelectedIndex(index);
    setCursorIndex(index);
    setPhoneConnected(true);
  }, []);

  useEffect(() => {
    updateCursorPoint(cursorIndex);
    const resizeObserver = new ResizeObserver(() => updateCursorPoint(cursorIndex));
    if (boardRef.current) resizeObserver.observe(boardRef.current);
    const onResize = () => updateCursorPoint(cursorIndex);
    window.addEventListener("resize", onResize);
    return () => { resizeObserver.disconnect(); window.removeEventListener("resize", onResize); };
  }, [cursorIndex, updateCursorPoint]);

  useEffect(() => {
    if (selectedIndex !== null || reduceMotion) return;
    const interval = window.setInterval(() => setCursorIndex((current) => {
      let next = Math.floor(Math.random() * phrases.length);
      if (next === current) next = (next + 1) % phrases.length;
      return next;
    }), 2600);
    return () => window.clearInterval(interval);
  }, [selectedIndex, reduceMotion]);

  useEffect(() => {
    const channel = "BroadcastChannel" in window ? new BroadcastChannel(SIMULATOR_CHANNEL) : null;
    channelRef.current = channel;
    if (channel) channel.onmessage = (event: MessageEvent<SimulatorMessage>) => acceptMessage(event.data);
    const onStorage = (event: StorageEvent) => {
      if (event.key !== SIMULATOR_STORAGE_KEY || !event.newValue) return;
      try { acceptMessage(JSON.parse(event.newValue) as SimulatorMessage); } catch { /* Ignore malformed local demo events. */ }
    };
    window.addEventListener("storage", onStorage);
    return () => { channel?.close(); channelRef.current = null; window.removeEventListener("storage", onStorage); if (connectionTimer.current) window.clearTimeout(connectionTimer.current); };
  }, [acceptMessage]);

  return (
    <main className="simulator-page board-demo-page">
      <header className="sim-header">
        <a className="sim-brand" href="/"><span className="sim-brand-icon">a</span> amplify <i>/</i> communication board</a>
        <a className="board-phone-link" href="/phone/demo" target="_blank" rel="noreferrer">Open phone app <span>↗</span></a>
      </header>

      <section className="sim-intro board-intro">
        <div className="sim-eyebrow"><span /> SIMULATED COMMUNICATION BOARD</div>
        <h1>Everyday words.<br /><em>At your fingertips.</em></h1>
        <p>Keep the phone app open in another tab. Tap a phrase there and watch the board select and speak it here.</p>
      </section>

      <section className="board-only-layout" aria-label="Communication board">
        <div className="board-panel board-only-panel">
          <div className="board-toolbar"><div><span className="toolbar-dot" /> AMPLIFY / MESSAGE BOARD</div><span>{phrases.length} MESSAGES</span></div>
          <div className="communication-board" ref={boardRef}>
            <div className="communication-grid">
              {phrases.map((phrase, index) => <div className={`communication-tile tile-${phrase.color} ${selectedIndex === index ? "tile-selected" : ""}`} key={phrase.label} ref={(element) => { tileRefs.current[index] = element; }}>
                <span className="tile-picture" aria-hidden="true">{phrase.icon}</span><span className="tile-word">{phrase.label}</span>
              </div>)}
            </div>
            <motion.div className={`board-cursor ${selectedIndex !== null ? "cursor-selected" : ""}`} aria-hidden="true" animate={{ x: cursorPoint.x - 15, y: cursorPoint.y - 15 }} transition={reduceMotion ? { duration: 0 } : { duration: selectedIndex === null ? 2 : 1.8, ease: "easeInOut" }}><span /></motion.div>
          </div>
          <div className="board-status"><span className={phoneConnected ? "status-connected" : "status-disconnected"} />{selectedIndex !== null ? `Selected from phone · “${phrases[selectedIndex].label}”` : phoneConnected ? "Phone app connected · waiting for a phrase" : "Waiting for the phone app to connect"}</div>
        </div>
      </section>

      <footer className="sim-footer"><span>AMPLIFY / GIVING EVERYONE A VOICE</span><a href="/">Back to Amplify <span>↗</span></a><span>SIMULATED MESSAGES · PROTOTYPE CONCEPT</span></footer>
    </main>
  );
}
