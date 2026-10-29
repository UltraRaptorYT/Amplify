"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FormEvent, useState } from "react";

const choices = [
  { label: "Yes", mark: "YES", signal: "Focused attention", position: { x: 78, y: 19 }, color: "mint" },
  { label: "No", mark: "NO", signal: "Intentional blink", position: { x: 73, y: 77 }, color: "blue" },
  { label: "Help", mark: "HELP", signal: "Gaze selection", position: { x: 27, y: 73 }, color: "orange" },
  { label: "I’m okay", mark: "OK", signal: "Relaxed focus", position: { x: 26, y: 25 }, color: "violet" },
] as const;

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return diagonal ? (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="arrow-icon"><path d="M5 15 15 5M6 5h9v9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="arrow-icon"><path d="M3.5 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><span /><span /><span /></span>;
}

function HeadsetIllustration() {
  return (
    <svg className="headset-art" viewBox="0 0 660 470" role="img" aria-label="Illustration of the lightweight Amplify wearable headset concept">
      <defs>
        <linearGradient id="band" x1="135" x2="512" y1="88" y2="321" gradientUnits="userSpaceOnUse"><stop stopColor="#EAF8F5"/><stop offset=".45" stopColor="#B8D6D3"/><stop offset="1" stopColor="#7EABA8"/></linearGradient>
        <linearGradient id="shell" x1="175" x2="466" y1="199" y2="360" gradientUnits="userSpaceOnUse"><stop stopColor="#FCFFFF"/><stop offset=".55" stopColor="#C8DBD9"/><stop offset="1" stopColor="#88ADAA"/></linearGradient>
        <linearGradient id="lens" x1="265" x2="422" y1="264" y2="336" gradientUnits="userSpaceOnUse"><stop stopColor="#143C42"/><stop offset="1" stopColor="#265C61"/></linearGradient>
        <filter id="shadow" x="77" y="37" width="510" height="411" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation="16"/></filter>
      </defs>
      <ellipse cx="326" cy="378" fill="#163D3D" opacity=".17" rx="207" ry="32" filter="url(#shadow)"/>
      <path d="M144 295c-26-68-22-154 29-206 40-41 102-62 173-55 80 8 143 56 166 125 11 33 10 68-1 99" fill="none" stroke="#608B89" strokeLinecap="round" strokeWidth="27"/>
      <path d="M144 285c-26-68-22-154 29-206 40-41 102-62 173-55 80 8 143 56 166 125 11 33 10 68-1 99" fill="none" stroke="url(#band)" strokeLinecap="round" strokeWidth="21"/>
      <path d="M151 272c-8 12-17 28-21 43-4 16 5 34 22 39l35 9c16 4 33-4 38-20l8-25-82-46ZM481 272c8 12 17 28 21 43 4 16-5 34-22 39l-35 9c-16 4-33-4-38-20l-8-25 82-46Z" fill="#B7CFCC" stroke="#83A9A6" strokeWidth="4"/>
      <path d="M186 219c36-22 77-33 132-33s97 11 137 33c13 7 23 20 27 35l16 55c4 14-3 29-17 35-49 21-105 32-163 32-59 0-115-11-164-32-14-6-21-21-17-35l16-55c4-15 14-28 33-35Z" fill="url(#shell)" stroke="#A5C3C0" strokeWidth="3"/>
      <path d="M254 241c20-8 41-12 64-12s44 4 65 12l29 12c9 4 13 14 10 23l-9 30c-2 8-9 14-17 14H240c-8 0-15-6-17-14l-9-30c-3-9 1-19 10-23l30-12Z" fill="url(#lens)" stroke="#D3E4E2" strokeWidth="4"/>
      <path d="M264 253c15-5 32-8 54-8 21 0 38 3 54 8" stroke="#90C8BD" strokeLinecap="round" strokeWidth="3" opacity=".7"/>
      <circle cx="241" cy="282" r="5" fill="#7EE0C0"/><circle cx="419" cy="282" r="5" fill="#7EE0C0"/>
      <path d="m285 338-7 26m108-26 7 26" stroke="#8AAEAB" strokeWidth="7" strokeLinecap="round"/>
      <circle cx="174" cy="330" r="4" fill="#54C9B4"/><circle cx="491" cy="330" r="4" fill="#54C9B4"/>
      <path d="M113 169h42m-21-21v42M498 122h30m-15-15v30" stroke="#7EB8AE" strokeWidth="2" opacity=".6"/>
      <circle cx="113" cy="169" r="26" fill="#E8F5F0" opacity=".5"/><circle cx="528" cy="122" r="19" fill="#E8F5F0" opacity=".55"/>
    </svg>
  );
}

function SignalDemo() {
  const [active, setActive] = useState(0);
  const choice = choices[active];
  const reduceMotion = useReducedMotion();

  return (
    <div className="demo-shell">
      <div className="demo-topline">
        <div><span className="live-dot" /> <span>LIVE SIMULATION</span></div>
        <span className="demo-top-note">A glimpse of a more connected moment</span>
      </div>
      <div className="demo-content">
        <div className="signal-board" aria-label="Simulated signal map">
          <div className="board-label"><span>AMPLIFY SIGNAL MAP</span><span>CONCEPT / 01</span></div>
          <div className="board-grid">
            <svg className="signal-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <path d="M26 25 78 19 73 77 27 73Z" fill="none" stroke="#234744" strokeOpacity=".13" strokeWidth=".45" strokeDasharray="1.2 1.8" />
              <path d={`M50 50 Q${(50 + choice.position.x) / 2} 50 ${choice.position.x} ${choice.position.y}`} fill="none" stroke="#68D6B4" strokeOpacity=".72" strokeWidth=".75" strokeDasharray="1.5 1.6" />
            </svg>
            <div className="board-center"><BrandMark /><span>INTENT<br />DETECTED</span></div>
            {choices.map((item, index) => (
              <div key={item.mark} className={`signal-node signal-node-${index} ${index === active ? "selected" : ""}`}>
                <span className="node-pulse" /><span className="node-label">{item.mark}</span>
              </div>
            ))}
            <motion.div
              className={`signal-cursor cursor-${choice.color}`}
              initial={false}
              animate={{ left: `${choice.position.x}%`, top: `${choice.position.y}%` }}
              transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 95, damping: 17, mass: 0.75 }}
              aria-hidden="true"
            ><span /></motion.div>
            <div className="board-coordinates">EEG · EYE TRACKING · ON DEVICE</div>
          </div>
        </div>

        <div className="demo-phone-wrap">
          <div className="phone-label"><span>YOUR COMPANION APP</span><span>CONNECTED <i /></span></div>
          <div className="phone">
            <div className="phone-island" />
            <div className="phone-screen">
              <div className="phone-head"><span>9:41</span><span className="phone-status"><i /> <i /> <i /></span></div>
              <div className="app-greeting"><div className="app-brand"><BrandMark /><span>amplify</span></div><span className="app-avatar">A</span></div>
              <div className="app-overline">YOUR MESSAGE BOARD</div>
              <div className="message-card">
                <div className="message-wave"><span /><span /><span /><span /><span /><span /><span /></div>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={choice.mark} className="message-copy" initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -5 }} transition={{ duration: .2 }}>
                    <span>MESSAGE READY</span><strong>{choice.label}</strong>
                  </motion.div>
                </AnimatePresence>
                <div className="message-check">✓</div>
              </div>
              <div className="signal-reading"><span className="reading-indicator" /><span>Signal detected</span><b>{choice.signal}</b></div>
              <div className="app-prompt"><span>Tap to try a message</span><span>SIMULATED</span></div>
              <div className="phrase-grid">
                {choices.map((item, index) => <button key={item.mark} type="button" onClick={() => setActive(index)} aria-pressed={active === index} className={`phrase-button ${active === index ? "phrase-active" : ""}`}><span className={`phrase-icon icon-${item.color}`}>{item.mark === "HELP" ? "!" : item.mark === "OK" ? "✓" : item.mark === "YES" ? "↗" : "—"}</span>{item.label}</button>)}
              </div>
              <div className="phone-home" />
            </div>
          </div>
          <div className="phone-footnote">Choose a phrase on the phone to move the signal.</div>
        </div>
      </div>
      <div className="demo-foot"><span><b>01</b> Signal captured</span><span className="demo-foot-line" /><span><b>02</b> Intent interpreted</span><span className="demo-foot-line" /><span><b>03</b> Message shared</span><span className="simulated-note">All interactions use simulated data</span></div>
    </div>
  );
}

export default function Home() {
  const [submitted, setSubmitted] = useState(false);
  const [requestDemo, setRequestDemo] = useState(false);
  const reduceMotion = useReducedMotion();
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }
  const reveal = reduceMotion ? {} : { initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.16 }, transition: { duration: .65, ease: [0.22, 1, 0.36, 1] as const } };

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Amplify home"><BrandMark /><span>amplify</span></a>
        <nav className="desktop-nav" aria-label="Main navigation"><a href="#how-it-works">How it works</a><a href="#experience">Experience</a><a href="#about">Our vision</a></nav>
        <a className="header-cta" href="#waitlist">Get early access <Arrow diagonal /></a>
      </header>

      <section className="hero section-wrap" id="top">
        <motion.div className="hero-copy" initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, ease: [0.22, 1, 0.36, 1] }}>
          <div className="eyebrow"><span className="eyebrow-line" /> A NEW WAY TO BE HEARD</div>
          <h1>Giving<br />everyone <em>a voice.</em></h1>
          <p className="hero-description">A little more independence. A little more connection. Amplify is exploring a new way for people with speech impairments to express what matters.</p>
          <div className="hero-actions"><a href="#experience" className="button-primary">Explore the experience <Arrow /></a><a href="#how-it-works" className="text-link">Get to know Amplify <span>↓</span></a></div>
          <div className="hero-caption"><span className="caption-icon">✳</span><span>Built around the person.<br /><b>Designed for everyday life.</b></span></div>
        </motion.div>
        <motion.div className="hero-visual" initial={reduceMotion ? false : { opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .9, delay: .12, ease: [0.22, 1, 0.36, 1] }}>
          <div className="visual-glow" />
          <div className="visual-label"><span>AMPLIFY / FORM STUDY</span><span>001 — 026</span></div>
          <div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" />
          <HeadsetIllustration />
          <div className="visual-chip"><span className="chip-dot" /><span>NON-INVASIVE<br /><b>WEARABLE CONCEPT</b></span></div>
          <div className="visual-spec">SIGNALS IN. <span>MEANING OUT.</span></div>
        </motion.div>
        <div className="hero-bottom"><span>COMMUNICATION, REIMAGINED</span><span className="hero-bottom-line" /><span>SCROLL TO EXPLORE&nbsp; ↓</span></div>
      </section>

      <section className="belief-band" id="about"><div className="belief-inner"><span className="belief-index">A BETTER WAY TO CONNECT</span><p>Communication is more than words.<br /><em>It’s being understood.</em></p><span className="belief-mark"><BrandMark /></span></div></section>

      <section className="experience-section section-wrap" id="experience">
        <motion.div className="section-heading" {...reveal}><div><div className="eyebrow"><span className="eyebrow-line" /> A SMALL MOMENT, MADE POSSIBLE</div><h2>From intention<br />to <em>connection.</em></h2></div><p>Imagine a thought, a glance, a blink — and the right words appear. Explore a simulated interaction below.</p></motion.div>
        <motion.div {...reveal}><SignalDemo /></motion.div>
        <p className="concept-disclaimer">This interactive experience is a product concept using simulated signals and messages. It does not interpret real brain or eye activity.</p>
      </section>

      <section className="steps-section" id="how-it-works">
        <div className="section-wrap steps-inner">
          <motion.div className="steps-heading" {...reveal}><div className="eyebrow eyebrow-light"><span className="eyebrow-line" /> THE IDEA, IN THREE STEPS</div><h2>Technology that<br />listens <em>differently.</em></h2><p>We’re exploring how familiar signals could help turn intention into communication.</p></motion.div>
          <div className="steps-list">
            {[
              { n: "01", title: "Pick up the signals", body: "A lightweight headset concept pairs non-invasive brain-signal sensing with eye tracking." , tag: "SENSE" },
              { n: "02", title: "Find the intention", body: "On-device AI explores patterns that may correspond to a person’s chosen message." , tag: "INTERPRET" },
              { n: "03", title: "Share what matters", body: "A companion app presents simple phrases that can be spoken aloud or shared." , tag: "EXPRESS" },
            ].map((step, index) => <motion.article key={step.n} className="step-row" {...(reduceMotion ? {} : { initial: { opacity: 0, x: 16 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true, amount: .4 }, transition: { duration: .5, delay: index * .12 } })}><div className="step-number">{step.n}</div><div className="step-content"><span>{step.tag}</span><h3>{step.title}</h3><p>{step.body}</p></div><div className={`step-symbol step-symbol-${index}`} aria-hidden="true">{index === 0 ? <svg viewBox="0 0 48 48"><path d="M7 25c5-15 10 15 15 0s10-15 15 0 5 10 5 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="24" cy="24" r="19" fill="none" stroke="currentColor" strokeOpacity=".24"/></svg> : index === 1 ? <svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" strokeOpacity=".24"/><path d="M24 8v32M8 24h32M13 13l22 22m0-22L13 35" stroke="currentColor" strokeOpacity=".6"/><circle cx="24" cy="24" r="5" fill="currentColor"/></svg> : <svg viewBox="0 0 48 48"><path d="M10 24h28M24 10v28" stroke="currentColor" strokeWidth="1.5"/><circle cx="24" cy="24" r="17" fill="none" stroke="currentColor" strokeOpacity=".28"/><circle cx="24" cy="24" r="9" fill="none" stroke="currentColor"/></svg>}</div></motion.article>)}
          </div>
          <div className="steps-footnote"><span>*</span> This is an early-stage concept. Actual sensing, interpretation and performance are still being researched.</div>
        </div>
      </section>

      <section className="people-section section-wrap">
        <motion.div className="people-heading" {...reveal}><div><div className="eyebrow"><span className="eyebrow-line" /> MORE THAN A DEVICE</div><h2>Made for the<br /><em>whole care circle.</em></h2></div><p>Every interaction includes more than one person. We’re designing with the people who make communication possible every day.</p></motion.div>
        <div className="people-grid">
          {[
            { n: "01", title: "For individuals", body: "More ways to express preferences, needs and personality, with greater independence and dignity.", label: "YOUR VOICE, YOUR WAY", icon: "person" },
            { n: "02", title: "For caregivers", body: "A clearer window into everyday needs can make shared moments feel more natural and connected.", label: "CLOSER CONNECTION", icon: "care" },
            { n: "03", title: "For care teams", body: "A concept designed to complement person-centered care and support more meaningful interactions.", label: "CARE, IN CONTEXT", icon: "careteam" },
          ].map((item, index) => <motion.article className="people-card" key={item.n} {...(reduceMotion ? {} : { initial: { opacity: 0, y: 14 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: .3 }, transition: { duration: .55, delay: index * .1 } })}><div className={`people-icon people-icon-${item.icon}`} aria-hidden="true">{item.icon === "person" ? <svg viewBox="0 0 48 48"><circle cx="24" cy="17" r="7"/><path d="M10 40c1-9 6-14 14-14s13 5 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> : item.icon === "care" ? <svg viewBox="0 0 48 48"><path d="M24 39S9 30 9 19c0-9 11-12 15-3 4-9 15-6 15 3 0 11-15 20-15 20Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M17 24h5l3-6 4 12 3-6h4" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg> : <svg viewBox="0 0 48 48"><circle cx="24" cy="16" r="6" fill="none" stroke="currentColor" strokeWidth="1.8"/><circle cx="11" cy="22" r="4" fill="none" stroke="currentColor" strokeWidth="1.8"/><circle cx="37" cy="22" r="4" fill="none" stroke="currentColor" strokeWidth="1.8"/><path d="M12 39c1-7 5-11 12-11s11 4 12 11M3 38c.5-5 3-8 8-8m34 8c-.5-5-3-8-8-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>}</div><span className="card-index">{item.n} / {item.label}</span><h3>{item.title}</h3><p>{item.body}</p><div className="card-rule" /></motion.article>)}
        </div>
      </section>

      <section className="product-section">
        <div className="section-wrap product-inner">
          <motion.div className="product-copy" {...reveal}><div className="eyebrow"><span className="eyebrow-line" /> INTRODUCING THE CONCEPT</div><h2>Thoughtful tech.<br /><em>Human first.</em></h2><p>A non-invasive wearable, imagined to feel considered, comfortable and quietly at home in everyday life.</p><div className="product-specs"><div><span>FORM</span><b>Lightweight headset</b></div><div><span>INPUT</span><b>Brain + eye signals</b></div><div><span>OUTPUT</span><b>Companion app</b></div></div><a href="#waitlist" className="text-link product-link">Follow the journey <Arrow /></a></motion.div>
          <motion.div className="product-visual" {...(reduceMotion ? {} : { initial: { opacity: 0, scale: .97 }, whileInView: { opacity: 1, scale: 1 }, viewport: { once: true, amount: .2 }, transition: { duration: .7 } })}><div className="product-visual-top"><span>AMPLIFY / DEVICE STUDY</span><span>FIG. 001</span></div><HeadsetIllustration /><div className="product-note note-one"><span>01</span><b>Soft-fit arc</b><i /></div><div className="product-note note-two"><span>02</span><b>Signal interface</b><i /></div><div className="product-visual-bottom"><span>EARLY-STAGE PROTOTYPE CONCEPT</span><span>DESIGN STUDY / 2026</span></div></motion.div>
        </div>
      </section>

      <section className="waitlist-section" id="waitlist"><div className="waitlist-orb orb-a"/><div className="waitlist-orb orb-b"/><motion.div className="waitlist-inner" {...reveal}><div className="eyebrow eyebrow-light"><span className="eyebrow-line" /> THE NEXT CHAPTER STARTS WITH YOU</div><h2>Let’s make room<br />for <em>every voice.</em></h2><p>We’re building Amplify with the community it’s meant to serve. Join us for updates, feedback opportunities and the first look at what comes next.</p><form className="waitlist-form" onSubmit={handleSubmit}><label className="sr-only" htmlFor="waitlist-email">Your email address</label><input id="waitlist-email" type="email" placeholder={requestDemo ? "Your email for a demo request" : "Your email address"} required/><button type="submit">{submitted ? "Request noted" : requestDemo ? "Request a demo" : "Join the waitlist"}<Arrow /></button></form><div className={`form-feedback ${submitted ? "form-feedback-visible" : ""}`} aria-live="polite">{submitted ? "Thanks for exploring Amplify. This prototype does not send or store requests yet." : "No spam, just meaningful progress."}</div><a className="demo-request" href="#waitlist" onClick={() => { setRequestDemo(true); setSubmitted(false); }}>Interested in a conversation? <span>Request a demo <Arrow diagonal /></span></a></motion.div><div className="waitlist-bottom"><span>AMPLIFY / GIVING EVERYONE A VOICE</span><span>AN IDEA WE’RE BUILDING TOGETHER&nbsp; ↗</span></div></section>

      <footer className="site-footer"><a className="wordmark" href="#top"><BrandMark /><span>amplify</span></a><p>Communication is human.<br />Let’s make it more possible.</p><div className="footer-right"><span>© 2026 AMPLIFY CONCEPT</span><span>INDEPENDENT RESEARCH & DESIGN PROJECT</span></div></footer>
      <div className="medical-note">Amplify is a research-stage concept, not an approved medical device. No real signals are collected or interpreted on this page.</div>
    </main>
  );
}
