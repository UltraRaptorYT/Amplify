"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { phrases } from "./phrases";
import { publishStorageFallback, SIMULATOR_CHANNEL, SIMULATOR_STORAGE_KEY, type SimulatorMessage } from "./channel";

function speak(message: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.rate = 0.82;
  window.speechSynthesis.speak(utterance);
}

export default function PhoneCommunicationApp() {
  const reduceMotion = useReducedMotion();
  const channelRef = useRef<BroadcastChannel | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [popupIndex, setPopupIndex] = useState<number | null>(null);
  const [connected, setConnected] = useState(false);
  const [speechAvailable, setSpeechAvailable] = useState(false);

  useEffect(() => {
    setSpeechAvailable("speechSynthesis" in window);
    const channel = "BroadcastChannel" in window ? new BroadcastChannel(SIMULATOR_CHANNEL) : null;
    channelRef.current = channel;
    if (channel) channel.onmessage = (event: MessageEvent<SimulatorMessage>) => {
      if (event.data.type === "demo-pong") setConnected(true);
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key !== SIMULATOR_STORAGE_KEY || !event.newValue) return;
      try {
        const message = JSON.parse(event.newValue) as SimulatorMessage;
        if (message.type === "demo-pong") setConnected(true);
      } catch { /* Ignore malformed local demo events. */ }
    };
    window.addEventListener("storage", onStorage);
    const sendPing = () => {
      const message: SimulatorMessage = { type: "phone-ping", id: `${Date.now()}-${Math.random()}` };
      channel?.postMessage(message);
      publishStorageFallback(message);
    };
    sendPing();
    const pingInterval = window.setInterval(sendPing, 1800);
    return () => {
      window.clearInterval(pingInterval);
      channel?.close();
      channelRef.current = null;
      window.removeEventListener("storage", onStorage);
      window.speechSynthesis?.cancel();
    };
  }, []);

  const selectPhrase = (index: number) => {
    setSelectedIndex(index);
    setPopupIndex(index);
    const message: SimulatorMessage = { type: "phrase-selected", id: `${Date.now()}-${Math.random()}`, phraseIndex: index, phrase: phrases[index].label };
    channelRef.current?.postMessage(message);
    publishStorageFallback(message);
    speak(phrases[index].label);
  };

  const closePopup = () => {
    setPopupIndex(null);
    window.speechSynthesis?.cancel();
  };

  return (
    <main className="simulator-page phone-app-page">
      <header className="sim-header">
        <a className="sim-brand" href="/"><span className="sim-brand-icon">a</span> amplify <i>/</i> companion app</a>
        <a className="board-phone-link" href="/demo" target="_blank" rel="noreferrer">Open communication board <span>↗</span></a>
      </header>

      <section className="phone-app-intro">
        <div className="sim-eyebrow"><span /> AMPLIFY COMPANION · SIMULATED</div>
        <h1>Choose a word.<br /><em>Be understood.</em></h1>
        <p>Tap a phrase to send it to the communication board open in your other tab.</p>
      </section>

      <section className="phone-app-stage" aria-label="Amplify companion app simulator">
        <div className="phone-app-aside">
          <div className={`connection-badge ${connected ? "is-connected" : ""}`}><i /> {connected ? "BOARD CONNECTED" : "LOOKING FOR BOARD"}</div>
          <h2>Your words,<br />within reach.</h2>
          <p>This companion app sends each selected phrase to the Amplify demo board in another tab. It uses a local browser connection only.</p>
          <div className="phone-app-note"><span>01</span><p>Open <a href="/demo" target="_blank" rel="noreferrer">the board page</a> in another tab.</p></div>
          <div className="phone-app-note"><span>02</span><p>Choose a phrase on this phone app.</p></div>
          <div className="phone-app-note"><span>03</span><p>Watch the board cursor move to your message.</p></div>
        </div>

        <div className="phone-column">
          <div className="phone-caption"><span>AMPLIFY COMPANION</span><span><i className={connected ? "" : "connection-muted"} /> {connected ? "BOARD LINKED" : "NO BOARD YET"}</span></div>
          <div className="sim-phone">
            <div className="sim-phone-island" />
            <div className="sim-phone-screen">
              <div className="sim-phone-status"><span>9:41</span><span>•••</span></div>
              <div className="sim-phone-brand"><span className="sim-brand-icon">a</span> amplify <span className="phone-user">A</span></div>
              <div className="phone-greeting">What would you like to say?</div>
              <div className="phone-hint">TAP A WORD TO SELECT IT</div>
              <div className="phone-word-grid">
                {phrases.map((phrase, index) => <button type="button" key={phrase.label} className={`phone-word-button phone-tile-${phrase.color} ${selectedIndex === index ? "phone-word-active" : ""}`} onClick={() => selectPhrase(index)} aria-pressed={selectedIndex === index}>
                  <span aria-hidden="true">{phrase.icon}</span><b>{phrase.label}</b>
                </button>)}
              </div>
              <div className="sim-phone-home" />
            </div>
          </div>
          <p className="phone-caption-note">{connected ? "Connected to the board in your other tab." : "Open /demo in another tab to connect this app."}</p>
        </div>
      </section>

      <footer className="sim-footer"><span>AMPLIFY / GIVING EVERYONE A VOICE</span><a href="/demo">Communication board <span>↗</span></a><span>SIMULATED MESSAGES · PROTOTYPE CONCEPT</span></footer>

      <AnimatePresence>
        {popupIndex !== null && <motion.div className="message-overlay" role="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) closePopup(); }}>
          <motion.section className="message-popup" role="dialog" aria-modal="true" aria-labelledby="popup-title" initial={reduceMotion ? false : { opacity: 0, y: 14, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: .98 }} transition={{ duration: .2 }}>
            <button className="popup-close" type="button" onClick={closePopup} aria-label="Close message">×</button>
            <div className={`popup-symbol tile-${phrases[popupIndex].color}`} aria-hidden="true">{phrases[popupIndex].icon}</div>
            <span className="popup-kicker">{connected ? "SENT TO COMMUNICATION BOARD" : "MESSAGE SELECTED"}</span>
            <h2 id="popup-title">{phrases[popupIndex].label}</h2>
            <p>{speechAvailable ? "This message is being spoken aloud using your device’s speech feature." : "Your phrase was selected. This browser does not support spoken messages."}</p>
            {speechAvailable && <button className="speak-again" type="button" onClick={() => speak(phrases[popupIndex].label)}><span aria-hidden="true">◖))</span> Say it again</button>}
            <div className="popup-disclaimer">Local demo message · No real signals used</div>
          </motion.section>
        </motion.div>}
      </AnimatePresence>
    </main>
  );
}
