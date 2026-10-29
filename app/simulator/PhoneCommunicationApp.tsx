"use client";

import { useEffect, useRef, useState } from "react";
import { phrases } from "./phrases";
import { publishStorageFallback, SIMULATOR_CHANNEL, SIMULATOR_STORAGE_KEY, type SimulatorMessage } from "./channel";

export default function PhoneCommunicationApp() {
  const channelRef = useRef<BroadcastChannel | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
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
    };
  }, []);

  const selectPhrase = (index: number) => {
    setSelectedIndex(index);
    const message: SimulatorMessage = { type: "phrase-selected", id: `${Date.now()}-${Math.random()}`, phraseIndex: index, phrase: phrases[index].label };
    channelRef.current?.postMessage(message);
    publishStorageFallback(message);
  };

  return (
    <main className="phone-app-page" aria-label="Amplify phone communication app">
      <div className="sim-phone sim-phone-standalone">
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
          <div className={`phone-app-link-status ${connected ? "phone-link-connected" : ""}`} aria-live="polite"><i />{selectedIndex !== null ? `Sent: ${phrases[selectedIndex].label}` : connected ? "Demo board connected" : "Waiting for demo board"}</div>
          <div className="sim-phone-home" />
        </div>
      </div>
    </main>
  );
}
