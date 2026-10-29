"use client";

import { phrases } from "./phrases";

export default function PhoneCommunicationApp({
  selectedIndex,
  searching,
  onSelect,
}: {
  selectedIndex: number | null;
  searching: boolean;
  onSelect: (index: number) => void;
}) {
  return (
    <aside className="phone-column" aria-label="Amplify companion app">
      <div className="phone-caption"><span>AMPLIFY COMPANION</span><span><i /> CONNECTED</span></div>
      <div className="sim-phone">
        <div className="sim-phone-island" />
        <div className="sim-phone-screen">
          <div className="sim-phone-status"><span>9:41</span><span>•••</span></div>
          <div className="sim-phone-brand"><span className="sim-brand-icon">a</span> amplify <span className="phone-user">A</span></div>
          <div className="phone-greeting">What would you like to say?</div>
          <div className="phone-hint">TAP A WORD TO SELECT IT</div>
          <div className="phone-word-grid">
            {phrases.map((phrase, index) => <button type="button" key={phrase.label} className={`phone-word-button phone-tile-${phrase.color} ${selectedIndex === index ? "phone-word-active" : ""}`} onClick={() => onSelect(index)} disabled={searching} aria-pressed={selectedIndex === index}>
              <span aria-hidden="true">{phrase.icon}</span><b>{phrase.label}</b>
            </button>)}
          </div>
          <div className="sim-phone-home" />
        </div>
      </div>
      <p className="phone-caption-note">Tap any phrase. The board cursor will find and speak it.</p>
    </aside>
  );
}
