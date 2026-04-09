'use client'

// ─────────────────────────────────────────────────────────────────────────────
// LessonFlow.jsx — Full-screen immersive lesson experience
//
// LAYOUT (spec-exact):
//   - Full viewport, white background, no phone shell
//   - Top bar: progress dots (left/center) + X close button (right)
//   - Content area: scrollable, fills remaining height
//   - Bottom bar: read-aloud play btn (54px circle) + Continue/Next btn (flex-1)
//   - Last slide: Complete button turns blue (#2D3CE6)
//   - First slide (cover): back arrow shown top-left
//
// SCREENS: cover | hook | content | example | practice | complete
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'

// ─── TOKENS ──────────────────────────────────────────────────────────────────
const C = {
  white:     '#FFFFFF',
  surface:   '#F7F8FA',
  green:     '#6DC77A',
  greenDark: '#52B362',
  blue:      '#2D3CE6',
  dark:      '#1A1A1A',
  text:      '#1A1A1A',
  muted:     '#888888',
  mutedLt:   '#AAAAAA',
  bgPill:    '#F0F0F0',
  border:    '#F0F0F0',
}
const F = "'Nunito', sans-serif"
const LETTERS = ['A', 'B', 'C', 'D']

// ─── TOP BAR ─────────────────────────────────────────────────────────────────
// Back arrow (always left) + progress segments (center) + X close (right)
// On slide 0 the back arrow exits the lesson (same as X close).

function LessonTopBar({ onBack, onClose, total, current }) {
  const btnStyle = {
    width:'38px', height:'38px', borderRadius:'12px', border:'none',
    background:C.bgPill, fontSize:'16px', cursor:'pointer',
    display:'flex', alignItems:'center', justifyContent:'center',
    color:C.text, fontFamily:F, fontWeight:700, flexShrink:0,
    transition:'background 0.15s',
  }

  return (
    <div style={{
      display:'flex', alignItems:'center', gap:'10px',
      padding:'14px 20px 10px',
      background:C.white,
      borderBottom:`1px solid ${C.border}`,
      position:'sticky', top:0, zIndex:10,
    }}>
      {/* Back arrow — always shown */}
      <button
        style={btnStyle}
        onClick={onBack}
        onMouseEnter={e => e.currentTarget.style.background='#E0E0E0'}
        onMouseLeave={e => e.currentTarget.style.background=C.bgPill}
        aria-label="Previous"
      >
        ←
      </button>

      {/* Progress segments */}
      <div style={{ flex:1, display:'flex', alignItems:'center', gap:'5px' }}>
        {Array.from({ length: total }).map((_, i) => {
          const done   = i < current
          const active = i === current
          return (
            <div key={i} style={{
              flex:   active ? 2 : 1,
              height: '5px',
              borderRadius: '3px',
              background: done ? C.green : active ? C.blue : C.bgPill,
              opacity: done ? 0.65 : 1,
              transition: 'all 0.3s ease',
            }} />
          )
        })}
      </div>

      {/* X close */}
      <button
        style={btnStyle}
        onClick={onClose}
        onMouseEnter={e => e.currentTarget.style.background='#E0E0E0'}
        onMouseLeave={e => e.currentTarget.style.background=C.bgPill}
        aria-label="Close lesson"
      >
        ✕
      </button>
    </div>
  )
}

// ─── BOTTOM ACTION BAR ────────────────────────────────────────────────────────
// Left: Listen button (audio placeholder, styled but non-functional for now)
// Right: Continue / Complete button (flex-1)
// Extra padding at bottom so the button is never crowded against the screen edge.

function LessonBottomBar({ onNext, isLast, disabled = false }) {
  const [showTip, setShowTip] = useState(false)

  return (
    <div style={{
      display:'flex', flexDirection:'column', gap:'0',
      padding:'12px 20px',
      paddingBottom:'max(28px, env(safe-area-inset-bottom, 28px))',
      background:C.white,
      borderTop:`1px solid ${C.border}`,
      position:'sticky', bottom:0,
    }}>
      <div style={{ display:'flex', gap:'12px', alignItems:'center' }}>

        {/* Listen / read-aloud button */}
        <div style={{ position:'relative', flexShrink:0 }}>
          <button
            onClick={() => { setShowTip(true); setTimeout(() => setShowTip(false), 2200) }}
            style={{
              width:'54px', height:'54px', borderRadius:'27px',
              background:C.dark, border:'none', cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center',
              transition:'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity='0.8'}
            onMouseLeave={e => e.currentTarget.style.opacity='1'}
            aria-label="Listen to this lesson"
          >
            {/* Speaker / headphones icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M3 9C3 5.686 7.029 3 12 3s9 2.686 9 6v6c0 1.657-1.343 3-3 3h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h2V9c0-2.761-3.134-5-7-5S5 6.239 5 9v3h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H6a3 3 0 0 1-3-3V9z" fill="white"/>
            </svg>
          </button>

          {/* Tooltip */}
          {showTip && (
            <div style={{
              position:'absolute', bottom:'62px', left:'50%', transform:'translateX(-50%)',
              background:C.dark, color:C.white, fontFamily:F, fontWeight:700, fontSize:'11px',
              padding:'6px 12px', borderRadius:'8px', whiteSpace:'nowrap', zIndex:20,
              lineHeight:1.4, textAlign:'center',
            }}>
              🎙️ Audio coming soon
              <div style={{ position:'absolute', bottom:'-4px', left:'50%', transform:'translateX(-50%)', width:'8px', height:'8px', background:C.dark, clipPath:'polygon(0 0,100% 0,50% 100%)' }}/>
            </div>
          )}
        </div>

        {/* Main CTA */}
        <button
          onClick={disabled ? undefined : onNext}
          style={{
            flex:1, height:'54px', borderRadius:'16px', border:'none',
            background: disabled ? '#CCC' : isLast ? C.blue : C.green,
            color:C.white, fontFamily:F, fontWeight:900, fontSize:'16px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1,
            transition:'background 0.2s, transform 0.1s',
            letterSpacing:'0.2px',
          }}
          onMouseDown={e  => { if (!disabled) e.currentTarget.style.transform='scale(0.98)' }}
          onMouseUp={e    => { e.currentTarget.style.transform='scale(1)' }}
          onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = isLast ? '#1E2BC0' : C.greenDark }}
          onMouseLeave={e => { if (!disabled) e.currentTarget.style.background = isLast ? C.blue    : C.green   }}
        >
          {isLast ? 'Complete Lesson ✓' : 'Continue →'}
        </button>
      </div>
    </div>
  )
}

// ─── PRIMITIVES ───────────────────────────────────────────────────────────────

function MascotPlaceholder({ size = 100 }) {
  // Replace: swap the inner <div> for <img src="/mascot.png" style={{width,height,objectFit:'cover'}} />
  return (
    <div style={{
      width:`${size}px`, height:`${size}px`, borderRadius:'22px',
      background:'linear-gradient(135deg,#FFE5B4,#FFDDA0)',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      gap:'4px', flexShrink:0, border:'2px solid rgba(255,255,255,0.7)',
    }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#C8943A" strokeWidth="1.5"/>
        <circle cx="9.5" cy="10.5" r="1.2" fill="#C8943A"/>
        <circle cx="14.5" cy="10.5" r="1.2" fill="#C8943A"/>
        <path d="M8.5 15c1 1.2 6 1.2 7 0" stroke="#C8943A" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <span style={{ fontSize:'9px', fontWeight:800, color:'#C8943A', fontFamily:F, textTransform:'uppercase', letterSpacing:'0.3px', textAlign:'center', lineHeight:1 }}>Mascot</span>
    </div>
  )
}

function MascotIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#C8943A" strokeWidth="1.5"/>
      <circle cx="9.5" cy="10.5" r="1.2" fill="#C8943A"/>
      <circle cx="14.5" cy="10.5" r="1.2" fill="#C8943A"/>
      <path d="M8.5 15c1 1.2 6 1.2 7 0" stroke="#C8943A" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

// Spec highlight box: #EEF0FF bg, 4px solid blue left border
function HighlightBox({ children }) {
  return (
    <div style={{
      background:'#EEF0FF',
      borderLeft:`4px solid ${C.blue}`,
      borderRadius:'0 14px 14px 0',
      padding:'14px 16px',
      margin:'16px 0',
    }}>
      <div style={{ fontSize:'14px', fontWeight:800, color:C.text, lineHeight:1.6, fontFamily:F }}>
        {children}
      </div>
    </div>
  )
}

// Section label — 13px uppercase muted, Nunito 900
function SlideLabel({ children }) {
  return (
    <div style={{ fontSize:'13px', fontWeight:900, color:C.mutedLt, textTransform:'uppercase', letterSpacing:'1px', fontFamily:F, marginBottom:'10px' }}>
      {children}
    </div>
  )
}

// Body text — 18px Nunito 700, generous line height
function BodyText({ children, style = {} }) {
  return (
    <div style={{ fontSize:'18px', fontWeight:700, color:C.text, lineHeight:1.7, fontFamily:F, ...style }}>
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 1 — COVER
// Layout: subject tag + lesson title at top, meta chips, then mascot intro below
// ─────────────────────────────────────────────────────────────────────────────

function ScreenCover({ lesson }) {
  return (
    <div style={{ padding:'24px 24px 32px', flex:1, display:'flex', flexDirection:'column' }}>

      {/* Subject + chapter tag */}
      <div style={{ display:'inline-flex', alignSelf:'flex-start', background:'#EEF0FF', color:C.blue, fontSize:'11px', fontWeight:800, padding:'4px 14px', borderRadius:'50px', letterSpacing:'0.5px', textTransform:'uppercase', fontFamily:F, marginBottom:'12px' }}>
        {lesson.subject} · {lesson.chapter}
      </div>

      {/* Lesson title — large and prominent at the top */}
      <div style={{ fontSize:'30px', fontWeight:900, color:C.text, lineHeight:1.2, fontFamily:F, marginBottom:'16px' }}>
        {lesson.title}
      </div>

      {/* Meta chips: duration, slides, XP */}
      <div style={{ display:'flex', gap:'8px', marginBottom:'28px', flexWrap:'wrap' }}>
        {[
          { icon:'⏱', label: lesson.duration         },
          { icon:'📖', label: `${lesson.slideCount} slides` },
          { icon:'⭐', label: `${lesson.xpReward} pts`      },
        ].map((chip, i) => (
          <div key={i} style={{ background:C.surface, borderRadius:'50px', padding:'6px 14px', fontSize:'13px', fontWeight:700, color:'#555', fontFamily:F, display:'flex', alignItems:'center', gap:'5px' }}>
            <span>{chip.icon}</span>{chip.label}
          </div>
        ))}
      </div>

      {/* Mascot intro — mascot + speech bubble, sits below the title */}
      <div style={{ display:'flex', gap:'14px', alignItems:'flex-start', background:C.surface, borderRadius:'20px', padding:'18px', marginBottom:'20px' }}>
        <MascotPlaceholder size={72} />
        <div style={{ flex:1 }}>
          {/* Bubble tail pointing left toward mascot */}
          <div style={{ background:C.white, borderRadius:'0 16px 16px 16px', padding:'14px 16px', border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:'15px', fontWeight:700, color:C.text, fontFamily:F, lineHeight:1.6 }}>
              {lesson.description}
            </div>
          </div>
          <div style={{ fontSize:'12px', fontWeight:700, color:C.mutedLt, fontFamily:F, marginTop:'6px', paddingLeft:'4px' }}>
            Your Guide
          </div>
        </div>
      </div>

      {/* Spacer so content doesn't press against bottom bar */}
      <div style={{ flex:1 }}/>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 2 — MASCOT HOOK  (typewriter)
// ─────────────────────────────────────────────────────────────────────────────

function ScreenMascotHook({ slide }) {
  const [displayed, setDisplayed] = useState('')
  const [showSub,   setShowSub]   = useState(false)
  const [cursor,    setCursor]    = useState(true)
  const ref = useRef(null)

  useEffect(() => {
    setDisplayed(''); setShowSub(false); setCursor(true)
    let i = 0
    ref.current = setInterval(() => {
      if (i < slide.hookText.length) {
        setDisplayed(slide.hookText.slice(0, ++i))
      } else {
        clearInterval(ref.current); setCursor(false)
        setTimeout(() => setShowSub(true), 400)
      }
    }, 36)
    return () => clearInterval(ref.current)
  }, [slide.hookText])

  return (
    <div style={{ padding:'20px 24px 36px', flex:1, display:'flex', flexDirection:'column' }}>
      <SlideLabel>🎯 Did you know?</SlideLabel>

      {/* Mascot + bubble */}
      <div style={{ display:'flex', gap:'12px', alignItems:'flex-start', marginBottom:'24px' }}>
        <MascotPlaceholder size={72} />
        {/* Speech bubble tail */}
        <div style={{ flex:1 }}>
          <div style={{ background:C.surface, borderRadius:'0 18px 18px 18px', padding:'16px 18px', position:'relative' }}>
            <div style={{ fontSize:'19px', fontWeight:800, color:C.text, lineHeight:1.5, fontFamily:F, minHeight:'60px' }}>
              {displayed}
              {cursor && (
                <span style={{ display:'inline-block', width:'2px', height:'20px', background:C.blue, marginLeft:'2px', verticalAlign:'middle', animation:'lf_cursor 0.8s infinite' }}/>
              )}
            </div>
          </div>
          <div style={{ fontSize:'12px', fontWeight:800, color:C.mutedLt, fontFamily:F, marginTop:'6px', paddingLeft:'4px' }}>
            {slide.mascotName} · Your Guide
          </div>
        </div>
      </div>

      <div style={{ opacity:showSub?1:0, transition:'opacity 0.5s', flex:1 }}>
        <BodyText style={{ color:'#555', fontSize:'16px' }}>{slide.subText}</BodyText>
      </div>

      <style>{`@keyframes lf_cursor{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 3 — LESSON CONTENT  (concept slide)
// ─────────────────────────────────────────────────────────────────────────────

function ScreenLessonContent({ slide }) {
  function renderParts(parts) {
    return parts.map((p, i) =>
      typeof p === 'string'
        ? <span key={i}>{p}</span>
        : <strong key={i} style={{ fontWeight:900 }}>{p.bold}</strong>
    )
  }

  return (
    <div style={{ padding:'20px 24px 36px', flex:1, display:'flex', flexDirection:'column' }}>
      <SlideLabel>📌 Concept {slide.conceptIndex} of {slide.conceptTotal}</SlideLabel>

      <div style={{ fontSize:'24px', fontWeight:900, color:C.text, fontFamily:F, lineHeight:1.25, marginBottom:'20px' }}>
        {slide.title}
      </div>

      {/* Concept image placeholder */}
      <div style={{ borderRadius:'18px', height:'130px', background:'linear-gradient(135deg,#F0FFF4,#DCFCE7)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'20px', border:'2px dashed #A8E6B5' }}>
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
          <rect x="3" y="5" width="18" height="14" rx="3" stroke="#52B362" strokeWidth="1.5"/>
          <circle cx="9" cy="10" r="2" stroke="#52B362" strokeWidth="1.5"/>
          <path d="M3 16l4-3 3 2.5 4-5 5 5.5" stroke="#52B362" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
      </div>

      <BodyText style={{ marginBottom:'4px' }}>{renderParts(slide.bodyParts)}</BodyText>

      {slide.highlight && <HighlightBox>{slide.highlight}</HighlightBox>}

      {slide.bodyParts2 && (
        <BodyText style={{ marginTop:'12px', color:'#555' }}>{renderParts(slide.bodyParts2)}</BodyText>
      )}

      {slide.bullets && (
        <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginTop:'16px' }}>
          {slide.bullets.map((b, i) => (
            <div key={i} style={{ display:'flex', gap:'12px', background:C.surface, borderRadius:'14px', padding:'12px 16px', alignItems:'flex-start' }}>
              <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:C.green, marginTop:'8px', flexShrink:0 }}/>
              <div style={{ fontFamily:F }}>
                <span style={{ fontSize:'15px', fontWeight:900, color:C.text }}>{b.term}: </span>
                <span style={{ fontSize:'15px', fontWeight:600, color:'#555' }}>{b.def}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 4 — WORKED EXAMPLE
// ─────────────────────────────────────────────────────────────────────────────

function ScreenWorkedExample({ slide }) {
  return (
    <div style={{ padding:'20px 24px 36px', flex:1, display:'flex', flexDirection:'column' }}>
      <SlideLabel>📐 Worked Example</SlideLabel>

      {/* Problem card */}
      <div style={{ background:C.blue, borderRadius:'22px', padding:'20px', marginBottom:'16px', color:C.white }}>
        <div style={{ fontSize:'12px', fontWeight:800, opacity:0.7, textTransform:'uppercase', letterSpacing:'0.8px', fontFamily:F, marginBottom:'8px' }}>Problem</div>
        <BodyText style={{ color:C.white, fontSize:'16px', marginBottom:'14px' }}>{slide.problem}</BodyText>
        <div style={{ background:'rgba(255,255,255,0.18)', borderRadius:'12px', padding:'12px 16px', fontSize:'18px', fontWeight:900, textAlign:'center', letterSpacing:'1px', fontFamily:F }}>
          {slide.formula}
        </div>
      </div>

      {/* Steps */}
      <div style={{ display:'flex', flexDirection:'column', gap:'10px', flex:1 }}>
        {slide.steps.map((step, i) => {
          const isObj = typeof step === 'object'
          return (
            <div key={i} style={{ background:C.surface, borderRadius:'16px', padding:'13px 16px', display:'flex', flexDirection:'column', gap:'6px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <div style={{ width:'26px', height:'26px', borderRadius:'50%', background:C.green, color:C.white, fontSize:'12px', fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontFamily:F }}>
                  {i + 1}
                </div>
                <div style={{ fontSize:'11px', fontWeight:800, color:C.greenDark, fontFamily:F, textTransform:'uppercase', letterSpacing:'0.4px' }}>
                  {isObj ? step.label : `Step ${i + 1}`}
                </div>
              </div>
              <div style={{ fontSize:'16px', fontWeight:700, color:C.text, lineHeight:1.5, fontFamily:F, background:C.white, borderRadius:'10px', padding:'10px 14px', marginLeft:'36px' }}>
                {isObj ? step.line : step}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 5 — PRACTICE QUESTION
// ─────────────────────────────────────────────────────────────────────────────

function ScreenPracticeQuestion({ slide, onNext }) {
  const [selected, setSelected] = useState(null)
  const [showWhy,  setShowWhy]  = useState(false)
  const answered  = selected !== null
  const isCorrect = selected === slide.correctIndex

  function optBg(i) {
    if (!answered) return C.surface
    if (i === slide.correctIndex) return '#EBF9EE'
    if (i === selected && !isCorrect) return '#FFF0F0'
    return C.surface
  }
  function optBorder(i) {
    if (!answered) return '1.5px solid transparent'
    if (i === slide.correctIndex) return `2px solid ${C.green}`
    if (i === selected && !isCorrect) return '2px solid #FF6B6B'
    return '1.5px solid transparent'
  }
  function letterBg(i) {
    if (!answered) return C.white
    if (i === slide.correctIndex) return C.green
    if (i === selected && !isCorrect) return '#FF6B6B'
    return C.white
  }

  return (
    <div style={{ padding:'20px 24px 36px', flex:1, display:'flex', flexDirection:'column' }}>
      <SlideLabel>💪 Your Turn</SlideLabel>

      {/* Mascot header */}
      <div style={{ display:'flex', alignItems:'center', gap:'12px', background:C.surface, borderRadius:'18px', padding:'14px', marginBottom:'16px' }}>
        <div style={{ width:'48px', height:'48px', borderRadius:'14px', background:'linear-gradient(135deg,#FFE5B4,#FFDDA0)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <MascotIcon size={22}/>
        </div>
        <div>
          <div style={{ fontSize:'15px', fontWeight:900, color:C.text, fontFamily:F }}>Your Turn! 💪</div>
          <div style={{ fontSize:'12px', fontWeight:600, color:C.muted, fontFamily:F }}>Let&apos;s see what you&apos;ve learned</div>
        </div>
      </div>

      {/* Question */}
      <BodyText style={{ marginBottom:'16px', fontSize:'17px' }}>{slide.question}</BodyText>

      {/* Options */}
      <div style={{ display:'flex', flexDirection:'column', gap:'10px', flex:1 }}>
        {slide.options.map((opt, i) => (
          <div key={i}
            onClick={() => !answered && setSelected(i)}
            style={{ display:'flex', alignItems:'center', gap:'12px', background:optBg(i), border:optBorder(i), borderRadius:'16px', padding:'14px 16px', cursor:answered?'default':'pointer', transition:'all 0.2s' }}
          >
            <div style={{ width:'32px', height:'32px', borderRadius:'10px', background:letterBg(i), color: answered && (i===slide.correctIndex || (i===selected&&!isCorrect)) ? C.white : '#666', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:900, flexShrink:0, fontFamily:F, transition:'all 0.2s' }}>
              {LETTERS[i]}
            </div>
            <div style={{ fontSize:'15px', fontWeight:700, color:C.text, fontFamily:F }}>{opt}</div>
          </div>
        ))}
      </div>

      {/* Why panel */}
      {showWhy && answered && (
        <div style={{ marginTop:'14px', borderRadius:'18px', padding:'16px', background:isCorrect?'#EBF9EE':'#FFF0F0', border:`2px solid ${isCorrect?C.green:'#FF6B6B'}` }}>
          <div style={{ fontSize:'13px', fontWeight:800, color:isCorrect?'#1A6B3A':'#A0222A', fontFamily:F, marginBottom:'8px' }}>
            {isCorrect ? "Here's why that's right ✅" : "Here's what happened 🤔"}
          </div>
          <div style={{ fontSize:'13px', fontWeight:700, color:isCorrect?C.greenDark:'#A0222A', textTransform:'uppercase', letterSpacing:'0.4px', fontFamily:F, marginBottom:'6px' }}>
            ✓ {LETTERS[slide.correctIndex]} — {slide.options[slide.correctIndex]}
          </div>
          <div style={{ fontSize:'14px', fontWeight:600, color:'#333', lineHeight:1.65, fontFamily:F }}>{slide.explanation}</div>
          {!isCorrect && slide.wrongExplanations && (
            <div style={{ marginTop:'10px', borderTop:'1px solid rgba(0,0,0,0.08)', paddingTop:'10px' }}>
              {slide.wrongExplanations.map((we, i) => (
                <div key={i} style={{ fontSize:'13px', fontWeight:600, color:'#555', lineHeight:1.6, marginBottom:'6px', fontFamily:F }}>
                  <span style={{ fontWeight:800, color:'#A0222A' }}>{LETTERS[we.index]}: </span>{we.reason}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Answer button row — override the bottom bar when answered */}
      {answered && (
        <div style={{ display:'flex', gap:'10px', marginTop:'12px' }}>
          <button onClick={() => setShowWhy(w=>!w)} style={{ flex:'0 0 auto', padding:'0 18px', height:'54px', borderRadius:'16px', border:`2px solid #FFD700`, background:'#FFFBEA', color:'#7A5C00', fontFamily:F, fontSize:'14px', fontWeight:900, cursor:'pointer' }}>
            {showWhy?'Hide ✕':'Why? 🤔'}
          </button>
          <button onClick={onNext} style={{ flex:1, height:'54px', borderRadius:'16px', border:'none', background:C.green, color:C.white, fontFamily:F, fontSize:'16px', fontWeight:900, cursor:'pointer' }}
            onMouseEnter={e=>e.currentTarget.style.background=C.greenDark}
            onMouseLeave={e=>e.currentTarget.style.background=C.green}
          >Check Answer →</button>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 6 — LESSON COMPLETE
// ─────────────────────────────────────────────────────────────────────────────

function PopStar({ delay }) {
  const [on, setOn] = useState(false)
  useEffect(() => { const t = setTimeout(()=>setOn(true), delay); return ()=>clearTimeout(t) }, [delay])
  return <span style={{ fontSize:'28px', display:'inline-block', transform:on?'scale(1)':'scale(0)', opacity:on?1:0, transition:`transform 0.4s cubic-bezier(.175,.885,.32,1.275) ${delay}ms, opacity 0.2s ease ${delay}ms` }}>⭐</span>
}

function ScreenLessonComplete({ lesson }) {
  return (
    <div style={{ padding:'20px 24px 36px', flex:1, display:'flex', flexDirection:'column' }}>
      {/* Blue hero */}
      <div style={{ background:C.blue, borderRadius:'24px', padding:'28px 24px', textAlign:'center', position:'relative', overflow:'hidden', marginBottom:'16px' }}>
        <div style={{ position:'absolute', width:'180px', height:'180px', borderRadius:'50%', background:'rgba(255,255,255,0.06)', top:'-70px', right:'-50px' }}/>
        <div style={{ fontSize:'52px', marginBottom:'8px', position:'relative', zIndex:1 }}>🏆</div>
        <div style={{ fontSize:'24px', fontWeight:900, color:C.white, fontFamily:F, position:'relative', zIndex:1 }}>Lesson Complete!</div>
        <div style={{ fontSize:'14px', fontWeight:600, color:'rgba(255,255,255,0.7)', fontFamily:F, marginTop:'4px', position:'relative', zIndex:1 }}>You crushed it. Keep going!</div>
        <div style={{ display:'flex', justifyContent:'center', gap:'8px', marginTop:'14px', position:'relative', zIndex:1 }}>
          <PopStar delay={100}/><PopStar delay={250}/><PopStar delay={400}/>
        </div>
      </div>

      {/* Summary */}
      <div style={{ background:C.surface, borderRadius:'20px', padding:'18px', marginBottom:'12px' }}>
        <div style={{ fontSize:'12px', fontWeight:800, color:C.mutedLt, textTransform:'uppercase', letterSpacing:'0.7px', fontFamily:F, marginBottom:'12px' }}>What You Learned</div>
        {lesson.summaryPoints.map((pt, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'8px 0', borderBottom:i<lesson.summaryPoints.length-1?`1px solid ${C.border}`:'none' }}>
            <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:C.green, flexShrink:0 }}/>
            <div style={{ fontSize:'14px', fontWeight:700, color:C.text, fontFamily:F }}>{pt}</div>
          </div>
        ))}
      </div>

      {/* Next lesson teaser */}
      {lesson.nextLesson && (
        <div style={{ background:C.surface, borderRadius:'18px', padding:'14px 16px', display:'flex', alignItems:'center', gap:'14px', border:`1.5px solid ${C.border}` }}>
          <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:'#EEF0FF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', flexShrink:0 }}>
            {lesson.nextLesson.icon}
          </div>
          <div>
            <div style={{ fontSize:'11px', fontWeight:800, color:C.mutedLt, textTransform:'uppercase', letterSpacing:'0.5px', fontFamily:F }}>Up Next</div>
            <div style={{ fontSize:'15px', fontWeight:900, color:C.text, fontFamily:F, marginTop:'2px' }}>{lesson.nextLesson.title}</div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LESSON DATA  (unchanged from previous version)
// ─────────────────────────────────────────────────────────────────────────────

export const lessonData = {
  id:          'lesson-motion-1',
  title:       'How Does Motion Work?',
  subject:     'Physics',
  chapter:     'Chapter 3',
  description: 'Learn how objects move, what causes them to speed up or slow down, and how to calculate velocity and acceleration.',
  duration:    '10 min',
  slideCount:  9,
  xpReward:    50,

  summaryPoints: [
    'Motion means a change in position over time',
    'Motion is always measured relative to a fixed reference point',
    'Speed, Distance, Velocity and Acceleration describe motion',
    'Speed = Distance ÷ Time',
  ],

  nextLesson: { icon: '⚡', title: 'Velocity & Acceleration' },

  slides: [
    { type: 'cover' },
    {
      type: 'hook', mascotName: 'Tunde',
      hookText: 'Have you ever wondered why a ball you throw always comes back down? 🤔',
      subText:  "In this lesson, we'll break down the science of motion — step by step, in a way that actually makes sense!",
    },
    {
      type: 'content', conceptIndex: 1, conceptTotal: 4, title: 'What is Motion?',
      bodyParts: ['An object is in ', { bold: 'motion' }, ' when it ', { bold: 'changes its position over time' }, '.'],
      highlight: null,
      bodyParts2: ['For example: a car driving down the road is in motion because its position is changing every second.'],
      bullets: null,
    },
    {
      type: 'content', conceptIndex: 2, conceptTotal: 4, title: 'Motion is Relative',
      bodyParts: ['Whether something is moving depends on your ', { bold: 'reference point' }, ' — the fixed object you are comparing it to.'],
      highlight: '💡 If you are sitting in a moving bus, you are in motion relative to someone standing outside. But you are NOT moving relative to the person sitting next to you on the bus.',
      bodyParts2: null, bullets: null,
    },
    {
      type: 'content', conceptIndex: 3, conceptTotal: 4, title: 'How Do We Describe Motion?',
      bodyParts: ['Scientists use four key quantities to describe motion:'],
      highlight: null, bodyParts2: null,
      bullets: [
        { term: 'Distance',     def: 'how far an object has travelled in total' },
        { term: 'Speed',        def: 'how fast an object is moving' },
        { term: 'Velocity',     def: 'speed in a specific direction' },
        { term: 'Acceleration', def: 'how quickly speed is changing' },
      ],
    },
    {
      type: 'content', conceptIndex: 4, conceptTotal: 4, title: 'The Speed Formula',
      bodyParts: ['When we know the distance an object travels and how long it takes, we can calculate its ', { bold: 'average speed' }, ' using one formula:'],
      highlight: '⚡ Speed = Distance ÷ Time',
      bodyParts2: ['Distance is measured in kilometres (km) or metres (m). Time is measured in hours (h) or seconds (s). Speed comes out in km/h or m/s.'],
      bullets: null,
    },
    {
      type: 'example',
      problem: 'A car travels 120 km in 2 hours. What is its average speed?',
      formula: 'Speed = Distance ÷ Time',
      steps: [
        { label: 'Step 1 — Write the formula',    line: 'Speed = Distance ÷ Time' },
        { label: 'Step 2 — Identify the Distance', line: 'Distance = 120 km' },
        { label: 'Step 3 — Identify the Time',     line: 'Time = 2 hours' },
        { label: 'Step 4 — Substitute the values', line: 'Speed = 120 ÷ 2' },
        { label: 'Step 5 — Solve',                 line: 'Speed = 60 km/h  ✓' },
      ],
    },
    {
      type: 'practice', questionNumber: 1, questionTotal: 1,
      question: 'A cyclist covers 45 km in 3 hours. What is their average speed?',
      options: ['10 km/h', '20 km/h', '15 km/h', '135 km/h'],
      correctIndex: 2,
      explanation: 'Using Speed = Distance ÷ Time: Distance = 45 km, Time = 3 hours. So Speed = 45 ÷ 3 = 15 km/h.',
      wrongExplanations: [
        { index: 0, reason: '10 km/h is wrong. Check: 10 × 3 = 30 km, not 45 km. The distance does not match.' },
        { index: 1, reason: '20 km/h is wrong. Check: 20 × 3 = 60 km, not 45 km. That is too large.' },
        { index: 3, reason: '135 km/h comes from multiplying 45 × 3 instead of dividing. The formula is Distance ÷ Time, not Distance × Time.' },
      ],
    },
    { type: 'complete' },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN MAP
// ─────────────────────────────────────────────────────────────────────────────

const SCREEN_CONTENT = {
  cover:    ScreenCover,
  hook:     ScreenMascotHook,
  content:  ScreenLessonContent,
  example:  ScreenWorkedExample,
  practice: ScreenPracticeQuestion,
  complete: ScreenLessonComplete,
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT — LessonFlow
// Full-screen, no shell wrapper. Sticky top bar + scrollable content + sticky bottom bar.
// ─────────────────────────────────────────────────────────────────────────────

export function LessonFlow({ lesson = lessonData, onComplete }) {
  const [idx,      setIdx]      = useState(0)
  const [dir,      setDir]      = useState(1)
  const [animKey,  setAnimKey]  = useState(0)
  const total  = lesson.slides.length
  const isLast = idx === total - 1

  function navigate(delta) {
    const next = idx + delta
    if (next < 0 || next >= total) return
    setDir(delta); setIdx(next); setAnimKey(k => k + 1)
  }

  const slide      = lesson.slides[idx]
  const SlideComp  = SCREEN_CONTENT[slide.type]
  const animClass  = dir > 0 ? 'lf_slideRight' : 'lf_slideLeft'

  // Practice screen manages its own bottom buttons after answering
  const isPractice = slide.type === 'practice'

  return (
    <div style={{
      display:'flex', flexDirection:'column',
      height:'100dvh', maxHeight:'100dvh',
      background:C.white, fontFamily:F,
      maxWidth:'680px', margin:'0 auto',
      overflow: 'hidden',
    }}>
      {/* Sticky top bar */}
      <LessonTopBar
        onBack={idx === 0 ? onComplete : () => navigate(-1)}
        onClose={onComplete}
        total={total}
        current={idx}
      />

      {/* Scrollable content */}
      <div
        key={animKey}
        className={animClass}
        style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column' }}
      >
        {SlideComp
          ? <SlideComp
              slide={slide}
              lesson={lesson}
              onNext={() => { if (isLast) { onComplete?.() } else { navigate(1) } }}
              onBack={() => navigate(-1)}
              totalSlides={total}
              slideIndex={idx}
            />
          : <div style={{ padding:'40px 24px', fontFamily:F }}>Unknown: {slide.type}</div>
        }
      </div>

      {/* Sticky bottom bar — hidden for practice (it renders its own) */}
      {!isPractice && (
        <LessonBottomBar
          onNext={() => { if (isLast) { onComplete?.() } else { navigate(1) } }}
          isLast={isLast}
        />
      )}
    </div>
  )
}