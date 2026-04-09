'use client'

// ─────────────────────────────────────────────────────────────────────────────
// LessonEngine.jsx — CPA Lesson Engine  (v3 — full redesign)
//
// ARCHITECTURE:
//   Root keeps all nav state. Renders:
//     ┌─ TopBar (sticky, progress + back + close) ──────────────────┐
//     │  Scrollable slide content (no nav buttons inside slides)    │
//     └─ BottomBar (sticky, audio + Next/Complete) ─────────────────┘
//
// Practice questions manage their own confirm/next flow inline,
// but still live within the same scroll+bottomBar shell.
//
// BODY TEXT: 18px Nunito 700, color #1A1A1A, line-height 1.8 — high contrast.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { LearniiBuddy } from '@/components/mascot/LearniiBuddy'

// ─── TOKENS ───────────────────────────────────────────────────────────────────
const C = {
  white:    '#FFFFFF',
  surface:  '#F7F8FA',
  green:    '#6DC77A',
  greenDk:  '#52B362',
  greenLt:  '#EBF9EE',
  blue:     '#2D3CE6',
  blueLt:   '#EEF0FF',
  dark:     '#1A1A1A',
  text:     '#1A1A1A',     // true black for maximum readability
  body:     '#1F1F1F',     // body text — near-black, never grey
  muted:    '#888888',
  border:   '#EBEBEB',
  bgPill:   '#EFEFEF',
  red:      '#E63946',
  redLt:    '#FFF0F1',
}
const F = "'Nunito', sans-serif"
const LETTERS = ['A', 'B', 'C', 'D']

const SLIDE_EMOTION = {
  topic_intro:       'excited',
  hook:              'curious',
  definition:        'teaching',
  concept:           'teaching',
  visual:            'curious',
  formula:           'teaching',
  worked_example:    'teaching',
  try_it:            'thinking',
  practice_question: 'thinking',
  lesson_complete:   'celebrating',
}

const SUCCESS_MSGS = [
  "Yes! Exactly right! 🎉",
  "That's it! You've got it. ✨",
  "Perfect — you nailed that! 🔥",
  "Brilliant thinking. 💡",
  "Nailed it! Keep going! ⚡",
]
const WRONG_MSGS = [
  "Not quite — but you're close. Try again.",
  "Almost! Think carefully and try once more.",
  "That's okay — let's think again. You've got this!",
]

// ─── PRIMITIVES ───────────────────────────────────────────────────────────────

// Readable body text — 18px, weight 700, true black, generous line-height
function Body({ children, style = {} }) {
  return (
    <div style={{
      fontSize: '18px', fontWeight: 700, color: C.body,
      lineHeight: 1.8, fontFamily: F, ...style,
    }}>
      {children}
    </div>
  )
}

// Slide section label — small uppercase muted
function Label({ children }) {
  return (
    <div style={{
      fontSize: '11px', fontWeight: 900, color: C.muted,
      textTransform: 'uppercase', letterSpacing: '1.1px',
      fontFamily: F, marginBottom: '8px',
    }}>
      {children}
    </div>
  )
}

// Blue highlight / callout box
function Callout({ children }) {
  return (
    <div style={{
      background: C.blueLt, borderLeft: `4px solid ${C.blue}`,
      borderRadius: '0 14px 14px 0', padding: '14px 16px', margin: '12px 0',
    }}>
      <div style={{ fontSize: '16px', fontWeight: 800, color: C.dark, fontFamily: F, lineHeight: 1.65 }}>
        {children}
      </div>
    </div>
  )
}

// Step card (worked example / try it)
function StepCard({ step, index }) {
  const isObj = typeof step === 'object' && step !== null
  return (
    <div style={{ background: C.white, borderRadius: '14px', padding: '12px 14px', marginBottom: '8px', border: `1px solid ${C.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: C.green, color: C.white, fontSize: '12px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: F }}>
          {index + 1}
        </div>
        <div style={{ fontSize: '11px', fontWeight: 800, color: C.greenDk, textTransform: 'uppercase', letterSpacing: '0.6px', fontFamily: F }}>
          {isObj ? step.label : `Step ${index + 1}`}
        </div>
      </div>
      <div style={{ fontSize: '17px', fontWeight: 700, color: C.body, fontFamily: F, background: C.surface, borderRadius: '10px', padding: '10px 14px', marginLeft: '36px', lineHeight: 1.6 }}>
        {isObj ? step.line : step}
      </div>
    </div>
  )
}

// ─── TOP BAR ─────────────────────────────────────────────────────────────────
// ← back (always) | progress segments | ✕ close

function TopBar({ current, total, onBack, onClose, xp }) {
  const btn = {
    width: '38px', height: '38px', borderRadius: '11px', border: 'none',
    background: C.bgPill, cursor: 'pointer', display: 'flex',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    fontFamily: F, fontSize: '16px', color: C.dark, transition: 'background 0.15s',
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '14px 20px 10px', background: C.white,
      borderBottom: `1px solid ${C.border}`,
      position: 'sticky', top: 0, zIndex: 20,
    }}>
      {/* ← Back */}
      <button style={btn} onClick={onBack} aria-label="Previous"
        onMouseEnter={e => e.currentTarget.style.background = '#E2E2E2'}
        onMouseLeave={e => e.currentTarget.style.background = C.bgPill}
      >←</button>

      {/* Progress segments */}
      <div style={{ flex: 1, display: 'flex', gap: '4px' }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            flex: i === current ? 2 : 1, height: '5px', borderRadius: '3px',
            background: i < current ? C.green : i === current ? C.blue : C.bgPill,
            transition: 'all 0.3s ease',
          }} />
        ))}
      </div>

      {/* XP chip — shown once earned */}
      {xp > 0 && (
        <div style={{ background: C.blueLt, borderRadius: '50px', padding: '4px 10px', fontSize: '12px', fontWeight: 800, color: C.blue, fontFamily: F, flexShrink: 0 }}>
          ⭐ {xp}
        </div>
      )}

      {/* ✕ Close */}
      <button style={{ ...btn, fontWeight: 700 }} onClick={onClose} aria-label="Close lesson"
        onMouseEnter={e => e.currentTarget.style.background = '#E2E2E2'}
        onMouseLeave={e => e.currentTarget.style.background = C.bgPill}
      >✕</button>
    </div>
  )
}

// ─── BOTTOM BAR ───────────────────────────────────────────────────────────────
// Sticky at bottom. Left: 🎙 audio button. Right: Continue / Complete.
// Practice questions pass `hideNext` and render their own action row.

function BottomBar({ onNext, isLast, hideNext = false }) {
  const [audioTip, setAudioTip] = useState(false)

  return (
    <div style={{
      display: 'flex', gap: '12px', alignItems: 'center',
      padding: '14px 20px',
      paddingBottom: 'max(28px, env(safe-area-inset-bottom, 28px))',
      background: C.white, borderTop: `1px solid ${C.border}`,
      position: 'sticky', bottom: 0, zIndex: 20,
    }}>
      {/* 🎙 Audio — coming soon */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <button
          onClick={() => { setAudioTip(true); setTimeout(() => setAudioTip(false), 2400) }}
          aria-label="Listen to this lesson"
          style={{
            width: '54px', height: '54px', borderRadius: '27px',
            background: C.dark, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          {/* Headphones icon */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M3 9.5C3 5.91 7.03 3 12 3s9 2.91 9 6.5v5c0 1.38-1.12 2.5-2.5 2.5H17a1.5 1.5 0 0 1-1.5-1.5v-3A1.5 1.5 0 0 1 17 11h1.5V9.5C18.5 7.01 15.59 5 12 5S5.5 7.01 5.5 9.5V11H7a1.5 1.5 0 0 1 1.5 1.5v3A1.5 1.5 0 0 1 7 17H5.5A2.5 2.5 0 0 1 3 14.5v-5z" fill="white"/>
          </svg>
        </button>
        {audioTip && (
          <div style={{
            position: 'absolute', bottom: '62px', left: '50%', transform: 'translateX(-50%)',
            background: C.dark, color: C.white, fontFamily: F, fontWeight: 700,
            fontSize: '11px', padding: '7px 13px', borderRadius: '8px',
            whiteSpace: 'nowrap', zIndex: 30,
          }}>
            🎙️ Audio coming soon
            <div style={{ position: 'absolute', bottom: '-4px', left: '50%', transform: 'translateX(-50%)', width: '8px', height: '8px', background: C.dark, clipPath: 'polygon(0 0,100% 0,50% 100%)' }} />
          </div>
        )}
      </div>

      {/* Next / Complete button */}
      {!hideNext && (
        <button
          onClick={onNext}
          style={{
            flex: 1, height: '54px', borderRadius: '16px', border: 'none',
            background: isLast ? C.blue : C.green,
            color: C.white, fontFamily: F, fontWeight: 900, fontSize: '16px',
            cursor: 'pointer', letterSpacing: '0.2px',
            transition: 'background 0.2s, transform 0.1s',
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          onMouseEnter={e => e.currentTarget.style.background = isLast ? '#1E2BC0' : C.greenDk}
          onMouseLeave={e => e.currentTarget.style.background = isLast ? C.blue : C.green}
        >
          {isLast ? 'Complete Lesson ✓' : 'Continue →'}
        </button>
      )}
    </div>
  )
}

// ─── MASCOT COMPANION ─────────────────────────────────────────────────────────

function MascotCompanion({ emotion, message }) {
  const expr =
    emotion === 'excited'     ? 'excited'     :
    emotion === 'teaching'    ? 'proud'        :
    emotion === 'curious'     ? 'question'     :
    emotion === 'encouraging' ? 'encouraging'  :
    emotion === 'celebrating' ? 'celebrating'  :
    emotion === 'thinking'    ? 'thinking'     : 'excited'

  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
      <div style={{ flexShrink: 0, transition: 'all 0.3s ease' }}>
        <LearniiBuddy size={60} expression={expr} />
      </div>
      {message && (
        <div style={{ background: C.surface, borderRadius: '0 16px 16px 16px', padding: '12px 15px', flex: 1, border: `1.5px solid ${C.border}` }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#333', fontFamily: F, lineHeight: 1.55 }}>
            {message}
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 1 — TOPIC INTRO
// Title at top. Mascot intro below. No CPA method tags.
// ─────────────────────────────────────────────────────────────────────────────

function SlideTopicIntro({ slide }) {
  const { topicTitle, mascotLine } = slide.content
  return (
    <div style={{ padding: '28px 20px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title — top */}
      <div>
        <div style={{ fontSize: '12px', fontWeight: 900, color: C.muted, textTransform: 'uppercase', letterSpacing: '1.2px', fontFamily: F, marginBottom: '10px' }}>
          Today&apos;s Lesson
        </div>
        <div style={{ fontSize: '32px', fontWeight: 900, color: C.text, fontFamily: F, lineHeight: 1.2 }}>
          {topicTitle}
        </div>
      </div>

      {/* Mascot intro — below title */}
      <MascotCompanion emotion="excited" message={mascotLine} />

      <div style={{ flex: 1 }} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 2 — HOOK
// ─────────────────────────────────────────────────────────────────────────────

function SlideHook({ slide, onNext }) {
  const { scenario, question, options } = slide.content
  const [selected, setSelected] = useState(null)

  // Hook uses its own Continue button because it's conditional on selection
  return (
    <div style={{ padding: '20px 20px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <MascotCompanion emotion="curious" message="Look at this real-life situation — there's no wrong answer, just thinking!" />

      <div style={{ background: C.blueLt, borderRadius: '18px', padding: '16px 18px', border: `1.5px solid ${C.blue}22` }}>
        <Label>Real-Life Scenario</Label>
        <Body>{scenario}</Body>
      </div>

      <div style={{ fontSize: '18px', fontWeight: 800, color: C.text, fontFamily: F }}>{question}</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {options.map((opt, i) => (
          <div key={opt.id}>
            <div onClick={() => setSelected(opt.id)} style={{
              borderRadius: '14px', padding: '13px 16px', cursor: 'pointer',
              background: selected === opt.id ? C.blueLt : C.surface,
              border: `1.5px solid ${selected === opt.id ? C.blue : C.border}`,
              display: 'flex', gap: '12px', alignItems: 'center', transition: 'all 0.2s',
            }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '9px', background: selected === opt.id ? C.blue : C.bgPill, color: selected === opt.id ? C.white : '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 900, fontFamily: F, flexShrink: 0 }}>
                {LETTERS[i]}
              </div>
              <Body style={{ fontSize: '16px' }}>{opt.label}</Body>
            </div>
            {selected === opt.id && (
              <div style={{ background: C.surface, borderRadius: '0 0 14px 14px', padding: '13px 16px', marginTop: '-4px', borderTop: `1px solid ${C.border}` }}>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#444', fontFamily: F, lineHeight: 1.65 }}>{opt.explanation}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Hook has its own continue — only shows after selection */}
      {selected && (
        <button onClick={onNext} style={{ marginTop: '4px', padding: '16px', borderRadius: '16px', border: 'none', background: C.green, color: C.white, fontFamily: F, fontWeight: 900, fontSize: '16px', cursor: 'pointer', width: '100%' }}>
          Continue →
        </button>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 3 — DEFINITION
// ─────────────────────────────────────────────────────────────────────────────

function SlideDefinition({ slide }) {
  const { term, plainDefinition, simpleExample } = slide.content
  return (
    <div style={{ padding: '20px 20px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <MascotCompanion emotion="teaching" message={`Let me explain what "${term}" means in plain terms.`} />

      <div>
        <Label>Definition</Label>
        <div style={{ display: 'inline-flex', background: C.blueLt, borderRadius: '12px', padding: '8px 18px', marginBottom: '14px' }}>
          <span style={{ fontSize: '22px', fontWeight: 900, color: C.blue, fontFamily: F }}>{term}</span>
        </div>
        <Body>{plainDefinition}</Body>
      </div>

      <div style={{ background: C.surface, borderRadius: '16px', padding: '16px 18px', border: `1px solid ${C.border}` }}>
        <Label>Example</Label>
        <Body style={{ fontSize: '16px' }}>{simpleExample}</Body>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 4 — CONCEPT
// ─────────────────────────────────────────────────────────────────────────────

function SlideConcept({ slide }) {
  const { heading, body, callout } = slide.content
  return (
    <div style={{ padding: '20px 20px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <MascotCompanion emotion="teaching" message="Here's a key idea I want you to understand well." />
      <div style={{ fontSize: '24px', fontWeight: 900, color: C.text, fontFamily: F, lineHeight: 1.25 }}>{heading}</div>
      <Body>{body}</Body>
      {callout && <Callout>{callout}</Callout>}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 5 — FORMULA
// ─────────────────────────────────────────────────────────────────────────────

function SlideFormula({ slide }) {
  const { formula, formulaVariants, componentBreakdown } = slide.content
  return (
    <div style={{ padding: '20px 20px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <MascotCompanion emotion="teaching" message="Here's the formula — learn all its forms, not just one." />

      <div style={{ background: C.blue, borderRadius: '22px', padding: '24px', textAlign: 'center' }}>
        <Label>The Formula</Label>
        <div style={{ fontSize: '34px', fontWeight: 900, color: C.white, fontFamily: F, letterSpacing: '1px', marginBottom: '16px' }}>{formula}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {formulaVariants.map((v, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.16)', borderRadius: '12px', padding: '10px 14px', fontSize: '15px', fontWeight: 700, color: C.white, fontFamily: F }}>{v}</div>
          ))}
        </div>
      </div>

      <div>
        <Label>What each part means</Label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {componentBreakdown.map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center', background: C.surface, borderRadius: '12px', padding: '12px 14px', border: `1px solid ${C.border}` }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: C.blue, color: C.white, fontSize: '17px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: F }}>{c.symbol}</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: C.body, fontFamily: F, lineHeight: 1.5 }}>{c.meaning}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 6 — WORKED EXAMPLE
// ─────────────────────────────────────────────────────────────────────────────

function SlideWorkedExample({ slide }) {
  const { exampleNumber, problem, steps, answer, difficulty } = slide.content
  return (
    <div style={{ padding: '20px 20px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <MascotCompanion emotion="teaching" message="Let's look at this together — follow each step carefully." />

      <div style={{ display: 'flex', gap: '8px' }}>
        <div style={{ background: C.blueLt, borderRadius: '50px', padding: '4px 14px', fontSize: '11px', fontWeight: 800, color: C.blue, fontFamily: F }}>Example {exampleNumber}</div>
        <div style={{ background: difficulty === 'easy' ? C.greenLt : C.blueLt, borderRadius: '50px', padding: '4px 14px', fontSize: '11px', fontWeight: 800, color: difficulty === 'easy' ? C.greenDk : C.blue, fontFamily: F }}>
          {difficulty === 'easy' ? 'Straightforward' : 'Medium'}
        </div>
      </div>

      <div style={{ background: C.surface, borderRadius: '18px', padding: '16px 18px', border: `1px solid ${C.border}` }}>
        <Label>Problem</Label>
        <Body style={{ fontSize: '17px' }}>{problem}</Body>
      </div>

      <div>
        <Label>Solution — Step by Step</Label>
        {steps.map((step, i) => <StepCard key={i} step={step} index={i} />)}
      </div>

      <div style={{ background: C.greenLt, borderRadius: '14px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', border: `1.5px solid ${C.green}` }}>
        <div style={{ fontSize: '22px' }}>✓</div>
        <div>
          <Label>Answer</Label>
          <div style={{ fontSize: '18px', fontWeight: 900, color: C.text, fontFamily: F }}>{answer}</div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 7 — TRY IT
// ─────────────────────────────────────────────────────────────────────────────

function SlideTryIt({ slide, onNext, onMascotEmotion }) {
  const { problem, hint, steps, answer } = slide.content
  const [showHint,     setShowHint]     = useState(false)
  const [showSolution, setShowSolution] = useState(false)

  function handleReview() {
    setShowSolution(true)
    onMascotEmotion('celebrating')
  }

  return (
    <div style={{ padding: '20px 20px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <MascotCompanion
        emotion={showSolution ? 'celebrating' : 'thinking'}
        message={showSolution ? "Well done for working through it! Study each step." : "Now you try! Take your time — tap the hint if you need a nudge."}
      />

      <div style={{ background: C.surface, borderRadius: '18px', padding: '16px 18px', border: `1px solid ${C.border}` }}>
        <Label>Your Problem</Label>
        <Body style={{ fontSize: '17px' }}>{problem}</Body>
      </div>

      {!showHint ? (
        <button onClick={() => setShowHint(true)} style={{ padding: '13px 16px', borderRadius: '14px', border: `1.5px dashed ${C.muted}`, background: 'transparent', fontSize: '15px', fontWeight: 700, color: C.muted, fontFamily: F, cursor: 'pointer', textAlign: 'left' }}>
          💡 Need a hint? Tap here
        </button>
      ) : (
        <div style={{ background: '#FFFBEA', borderRadius: '14px', padding: '14px 16px', border: `1.5px solid #FFD700` }}>
          <Label>Hint</Label>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#5C4400', fontFamily: F, lineHeight: 1.65 }}>{hint}</div>
        </div>
      )}

      {!showSolution && (
        <button onClick={handleReview} style={{ padding: '16px', borderRadius: '16px', border: 'none', background: C.blue, color: C.white, fontFamily: F, fontWeight: 900, fontSize: '16px', cursor: 'pointer', width: '100%' }}>
          Review Full Solution →
        </button>
      )}

      {showSolution && (
        <>
          <Label>Full Solution</Label>
          {steps.map((step, i) => <StepCard key={i} step={step} index={i} />)}
          <div style={{ background: C.greenLt, borderRadius: '14px', padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'center', border: `1.5px solid ${C.green}` }}>
            <div style={{ fontSize: '22px' }}>✓</div>
            <div>
              <Label>Answer</Label>
              <div style={{ fontSize: '18px', fontWeight: 900, color: C.text, fontFamily: F }}>{answer}</div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 8 — PRACTICE QUESTION
// Manages its own action row. Tells parent to hide the global Next button.
// ─────────────────────────────────────────────────────────────────────────────

function SlidePracticeQuestion({ slide, onNext, onXP, onMascotEmotion, onPracticeReady }) {
  const { question, options, xpValue } = slide.content
  const [selected, setSelected] = useState(null)
  const [attempts, setAttempts] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [awarded,  setAwarded]  = useState(false)

  const correctOpt = options.find(o => o.isCorrect)
  const isCorrect  = selected?.isCorrect
  const wrongOpt   = selected && !selected.isCorrect ? selected : null
  const showSeeAns = attempts >= 2 && !isCorrect && !revealed

  // Tell root whether to show the global Next button
  useEffect(() => {
    onPracticeReady?.(isCorrect || revealed)
  }, [isCorrect, revealed])

  function handleSelect(opt) {
    if (awarded || revealed) return
    setSelected(opt)
    setAttempts(a => a + 1)
    if (opt.isCorrect) {
      onMascotEmotion('celebrating')
      onXP(xpValue)
      setAwarded(true)
    } else {
      onMascotEmotion('encouraging')
    }
  }

  function handleSeeAnswer() {
    setRevealed(true)
    setSelected(correctOpt)
    onMascotEmotion('teaching')
    if (!awarded) { onXP(Math.floor(xpValue / 2)); setAwarded(true) }
  }

  const successMsg = SUCCESS_MSGS[attempts % SUCCESS_MSGS.length]
  const wrongMsg   = WRONG_MSGS[Math.min(attempts - 1, WRONG_MSGS.length - 1)]

  function optBg(opt)     { const s = selected?.id === opt.id; if (!selected) return C.surface; if (opt.isCorrect) return C.greenLt; if (s && !opt.isCorrect) return '#FFF0F1'; return C.surface }
  function optBorder(opt) { const s = selected?.id === opt.id; if (!selected) return `1.5px solid ${C.border}`; if (opt.isCorrect) return `2px solid ${C.green}`; if (s && !opt.isCorrect) return `2px solid ${C.red}`; return `1.5px solid ${C.border}` }
  function badgeBg(opt)   { const s = selected?.id === opt.id; if (!selected) return C.bgPill; if (opt.isCorrect) return C.green; if (s && !opt.isCorrect) return C.red; return C.bgPill }
  function badgeColor(opt){ const s = selected?.id === opt.id; if (!selected) return '#555'; if (opt.isCorrect || (s && !opt.isCorrect)) return C.white; return '#AAA' }

  return (
    <div style={{ padding: '20px 20px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <MascotCompanion
        emotion={isCorrect ? 'celebrating' : attempts > 0 ? 'encouraging' : 'thinking'}
        message={isCorrect ? successMsg : attempts > 0 ? wrongMsg : "Time to test yourself! Pick the answer you think is right."}
      />

      <div style={{ background: C.surface, borderRadius: '16px', padding: '16px 18px', border: `1px solid ${C.border}` }}>
        <Body style={{ fontSize: '17px' }}>{question}</Body>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
        {options.map((opt, i) => (
          <div key={opt.id} onClick={() => !awarded && !revealed && !selected && handleSelect(opt)} style={{
            borderRadius: '14px', padding: '14px 16px', display: 'flex', gap: '12px',
            alignItems: 'center', cursor: awarded || revealed || selected ? 'default' : 'pointer',
            transition: 'all 0.2s', background: optBg(opt), border: optBorder(opt),
            opacity: selected && !opt.isCorrect && selected.id !== opt.id ? 0.45 : 1,
          }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 900, flexShrink: 0, fontFamily: F, transition: 'all 0.2s', background: badgeBg(opt), color: badgeColor(opt) }}>
              {LETTERS[i]}
            </div>
            <Body style={{ fontSize: '16px' }}>{opt.label}</Body>
          </div>
        ))}
      </div>

      {wrongOpt && !revealed && wrongOpt.wrongExplanation && (
        <div style={{ background: '#FFF0F1', borderRadius: '14px', padding: '13px 16px', border: `1.5px solid ${C.red}33` }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#C0222A', fontFamily: F, lineHeight: 1.6 }}>{wrongOpt.wrongExplanation}</div>
        </div>
      )}

      {revealed && (
        <div style={{ background: C.surface, borderRadius: '14px', padding: '13px 16px', border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: C.muted, fontFamily: F }}>
            You earned {Math.floor(xpValue / 2)} XP — try to get it first time next session!
          </div>
        </div>
      )}

      {/* Practice-specific action buttons — sit above the sticky BottomBar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {selected && !isCorrect && !revealed && (
          <button onClick={() => setSelected(null)} style={{ padding: '14px', borderRadius: '14px', border: `1.5px solid ${C.border}`, background: C.white, fontFamily: F, fontWeight: 800, fontSize: '15px', color: C.dark, cursor: 'pointer' }}>
            Try Again
          </button>
        )}
        {showSeeAns && (
          <button onClick={handleSeeAnswer} style={{ padding: '14px', borderRadius: '14px', border: 'none', background: C.blue, color: C.white, fontFamily: F, fontWeight: 900, fontSize: '15px', cursor: 'pointer' }}>
            See Answer (partial XP)
          </button>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 9 — LESSON COMPLETE
// ─────────────────────────────────────────────────────────────────────────────

function PopStar({ delay }) {
  const [on, setOn] = useState(false)
  useEffect(() => { const t = setTimeout(() => setOn(true), delay); return () => clearTimeout(t) }, [delay])
  return <span style={{ fontSize: '28px', display: 'inline-block', transform: on ? 'scale(1)' : 'scale(0)', opacity: on ? 1 : 0, transition: `transform 0.4s cubic-bezier(.175,.885,.32,1.275) ${delay}ms, opacity 0.2s ${delay}ms` }}>⭐</span>
}

function SlideLessonComplete({ slide, totalXP }) {
  const { completionMessage, nextLessonTitle } = slide.content
  return (
    <div style={{ padding: '20px 20px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <MascotCompanion emotion="celebrating" message="You did it! I'm so proud of you. This lesson is complete! 🎉" />

      <div style={{ background: C.blue, borderRadius: '24px', padding: '28px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', top: '-60px', right: '-40px' }} />
        <div style={{ fontSize: '52px', marginBottom: '8px', position: 'relative', zIndex: 1 }}>🏆</div>
        <div style={{ fontSize: '24px', fontWeight: 900, color: C.white, fontFamily: F, marginBottom: '6px', position: 'relative', zIndex: 1 }}>Lesson Complete!</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '14px', position: 'relative', zIndex: 1 }}>
          <PopStar delay={100} /><PopStar delay={260} /><PopStar delay={420} />
        </div>
        <div style={{ background: 'rgba(255,255,255,0.18)', borderRadius: '14px', padding: '12px 16px', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.75)', fontFamily: F }}>XP earned</div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: C.white, fontFamily: F }}>+{totalXP} XP ⭐</div>
        </div>
      </div>

      <div style={{ background: C.surface, borderRadius: '18px', padding: '16px 18px', border: `1px solid ${C.border}` }}>
        <Body style={{ fontSize: '16px' }}>{completionMessage}</Body>
      </div>

      {nextLessonTitle && (
        <div style={{ background: C.surface, borderRadius: '16px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', border: `1px solid ${C.border}` }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: C.blueLt, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>⚡</div>
          <div>
            <Label>Up Next</Label>
            <div style={{ fontSize: '16px', fontWeight: 900, color: C.text, fontFamily: F }}>{nextLessonTitle}</div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── SLIDE ROUTER ─────────────────────────────────────────────────────────────

function SlideRenderer({ slide, onNext, onBack, onXP, onMascotEmotion, totalXP, onPracticeReady }) {
  const props = { slide, onNext, onBack, onXP, onMascotEmotion, totalXP, onPracticeReady }
  switch (slide.type) {
    case 'topic_intro':       return <SlideTopicIntro       {...props} />
    case 'hook':              return <SlideHook             {...props} />
    case 'definition':        return <SlideDefinition       {...props} />
    case 'concept':           return <SlideConcept          {...props} />
    case 'formula':           return <SlideFormula          {...props} />
    case 'worked_example':    return <SlideWorkedExample    {...props} />
    case 'try_it':            return <SlideTryIt            {...props} />
    case 'practice_question': return <SlidePracticeQuestion {...props} />
    case 'lesson_complete':   return <SlideLessonComplete   {...props} />
    default: return <div style={{ padding: '40px 20px', fontFamily: F, color: C.muted, textAlign: 'center' }}>Unknown: {slide.type}</div>
  }
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export function LessonEngine({ lesson, onComplete }) {
  const [idx,            setIdx]            = useState(0)
  const [xp,             setXp]             = useState(0)
  const [emotion,        setEmotion]        = useState('excited')
  const [animKey,        setAnimKey]        = useState(0)
  const [dir,            setDir]            = useState(1)
  const [practiceReady,  setPracticeReady]  = useState(false)

  const total   = lesson.slides.length
  const slide   = lesson.slides[idx]
  const isLast  = idx === total - 1

  // Slides that manage their own next action — BottomBar Next is hidden
  const isPractice = slide.type === 'practice_question'
  // Hook shows its own Continue only after selection; BottomBar hidden
  const isHook     = slide.type === 'hook'
  // TryIt shows Review/Continue inline; BottomBar Next hidden until solution shown
  const isTryIt    = slide.type === 'try_it'

  const hideNext = isHook || isPractice || isTryIt

  useEffect(() => {
    setEmotion(SLIDE_EMOTION[slide.type] || 'excited')
    setPracticeReady(false)
  }, [idx, slide.type])

  function navigate(delta) {
    const next = idx + delta
    if (next < 0 || next >= total) return
    setDir(delta); setIdx(next); setAnimKey(k => k + 1)
  }

  function goNext() {
    if (isLast) { onComplete?.(); return }
    navigate(1)
  }

  function goBack() {
    if (idx === 0) { onComplete?.(); return }
    navigate(-1)
  }

  const animClass = dir > 0 ? 'lf_slideRight' : 'lf_slideLeft'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', maxHeight: '100dvh', background: C.white, fontFamily: F, maxWidth: '640px', margin: '0 auto', overflow: 'hidden' }}>

      <TopBar current={idx} total={total} onBack={goBack} onClose={onComplete} xp={xp} />

      {/* Scrollable content */}
      <div key={animKey} className={animClass} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <SlideRenderer
          slide={slide}
          onNext={goNext}
          onBack={goBack}
          onXP={pts => setXp(x => x + pts)}
          onMascotEmotion={setEmotion}
          totalXP={xp}
          onPracticeReady={ready => setPracticeReady(ready)}
        />
      </div>

      {/* Sticky bottom bar — audio always shown; Next hidden for hook/practice/tryit */}
      <BottomBar
        onNext={isPractice ? (practiceReady ? goNext : undefined) : goNext}
        isLast={isLast}
        hideNext={hideNext && !(isPractice && practiceReady)}
      />
    </div>
  )
}