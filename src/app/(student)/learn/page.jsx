'use client'

// ─────────────────────────────────────────────────────────────────────────────
// learn/page.jsx — Learning Hub  (complete implementation, spec v2)
//
// SECTIONS (in order):
//   1. Header bar         — wordmark · "Let's learn!" · XP badge
//   2. Mode badge + streak — mode pill (opens sheet) · streak chip
//   3. Mascot nudge card  — contextual message + optional Continue CTA
//   4. Subject tabs       — school mode only, clear active/inactive states
//   5. Continue card      — prominent in-progress topic card
//   6. Topic list         — chapter groups (school) or topic areas (exam)
//                           locked topics collapsed to a single row
//   7. Mode switcher sheet — bottom sheet modal
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LearniiBuddy } from '@/components/mascot/LearniiBuddy'
import { MOCK_STUDENT } from '@/lib/mock/data'

// ─── TOKENS ──────────────────────────────────────────────────────────────────

const C = {
  white:      '#FFFFFF',
  page:       '#F7F8FA',    // light grey page bg behind max-width container
  surface:    '#F7F8FA',
  green:      '#6DC77A',
  greenDk:    '#52B362',
  greenLt:    '#EBF9EE',
  greenCard:  '#F0FBF4',   // very light green tint for completed cards
  blue:       '#2D3CE6',
  blueLt:     '#EEF0FF',
  blueCard:   '#EEF4FD',   // very light blue tint for in-progress cards
  brand:      '#2D3CE6',
  dark:       '#1A1A1A',
  text:       '#1A1A1A',
  muted:      '#888888',
  mutedLt:    '#AAAAAA',
  border:     '#EEEEEE',
  bgPill:     '#F0F0F0',
  amber:      '#F59E0B',
  amberLt:    '#FEF3C7',
  // subject accents
  phyBlue:    '#185FA5',
  phyBlueLt:  '#EAF1FB',
  mathGreen:  '#1D9E75',
  mathGreenLt:'#E6F7F2',
  chemPurp:   '#534AB7',
  chemPurpLt: '#EDECFB',
  bioAmber:   '#D97706',
  bioAmberLt: '#FEF3E2',
}
const F = "'Nunito', sans-serif"

// ─── SUBJECT META ─────────────────────────────────────────────────────────────

const SUBJECT_META = {
  physics:     { accent:C.phyBlue,   accentLt:C.phyBlueLt,   label:'Physics',   emoji:'⚡' },
  mathematics: { accent:C.mathGreen, accentLt:C.mathGreenLt, label:'Maths',     emoji:'📐' },
  chemistry:   { accent:C.chemPurp,  accentLt:C.chemPurpLt,  label:'Chemistry', emoji:'🧪' },
  biology:     { accent:C.bioAmber,  accentLt:C.bioAmberLt,  label:'Biology',   emoji:'🌿' },
}
const SUBJECTS = ['physics','mathematics','chemistry','biology']

// ─── TOPIC DATA ───────────────────────────────────────────────────────────────
// status: 'completed' | 'in_progress' | 'unlocked' | 'locked'

const SCHOOL_DATA = {
  physics: [
    { id:'ch-p1', title:'Chapter 1: Mechanics', topics:[
      { id:'p1', title:'Introduction to Motion',  status:'completed',   lessons:3, xpValue:50, progressPercent:100, slug:'intro-motion',  lessonId:'lesson-1'            },
      { id:'p2', title:'Velocity & Acceleration', status:'in_progress', lessons:4, xpValue:60, progressPercent:45,  slug:'velocity',      lessonId:'physics-velocity-1'  },
      { id:'p3', title:"Newton's Laws",           status:'unlocked',    lessons:5, xpValue:70, progressPercent:0,   slug:'newtons-laws',  lessonId:'lesson-1'            },
      { id:'p4', title:'Forces & Friction',       status:'locked',      lessons:4, xpValue:60, progressPercent:0,   slug:'forces',        lessonId:'lesson-1'            },
      { id:'p5', title:'Circular Motion',         status:'locked',      lessons:3, xpValue:55, progressPercent:0,   slug:'circular',      lessonId:'lesson-1'            },
    ]},
    { id:'ch-p2', title:'Chapter 2: Energy', topics:[
      { id:'p6', title:'Work and Energy', status:'locked', lessons:4, xpValue:60, progressPercent:0, slug:'work-energy', lessonId:'lesson-1' },
      { id:'p7', title:'Power',           status:'locked', lessons:3, xpValue:50, progressPercent:0, slug:'power',       lessonId:'lesson-1' },
    ]},
    { id:'ch-p3', title:'Chapter 3: Waves', topics:[
      { id:'p8', title:'Wave Motion',  status:'locked', lessons:4, xpValue:60, progressPercent:0, slug:'wave-motion', lessonId:'lesson-1' },
      { id:'p9', title:'Sound Waves',  status:'locked', lessons:3, xpValue:55, progressPercent:0, slug:'sound-waves', lessonId:'lesson-1' },
    ]},
  ],
  mathematics: [
    { id:'ch-m1', title:'Chapter 1: Algebra', topics:[
      { id:'m1', title:'Quadratic Equations',    status:'completed',   lessons:4, xpValue:60, progressPercent:100, slug:'quadratic',    lessonId:'lesson-1' },
      { id:'m2', title:'Simultaneous Equations', status:'in_progress', lessons:3, xpValue:50, progressPercent:60,  slug:'simultaneous', lessonId:'lesson-1' },
      { id:'m3', title:'Indices & Logarithms',   status:'unlocked',    lessons:5, xpValue:70, progressPercent:0,   slug:'indices',      lessonId:'lesson-1' },
    ]},
    { id:'ch-m2', title:'Chapter 2: Sequences', topics:[
      { id:'m4', title:'Sequences & Series', status:'locked', lessons:4, xpValue:60, progressPercent:0, slug:'sequences',   lessonId:'lesson-1' },
      { id:'m5', title:'Mensuration',        status:'locked', lessons:4, xpValue:55, progressPercent:0, slug:'mensuration', lessonId:'lesson-1' },
    ]},
  ],
  chemistry: [
    { id:'ch-c1', title:'Chapter 1: Atomic Structure', topics:[
      { id:'c1', title:'Atomic Theory',    status:'completed',   lessons:3, xpValue:50, progressPercent:100, slug:'atomic-theory', lessonId:'lesson-1' },
      { id:'c2', title:'Periodic Table',   status:'in_progress', lessons:4, xpValue:60, progressPercent:30,  slug:'periodic',      lessonId:'lesson-1' },
      { id:'c3', title:'Chemical Bonding', status:'unlocked',    lessons:5, xpValue:70, progressPercent:0,   slug:'bonding',       lessonId:'lesson-1' },
    ]},
    { id:'ch-c2', title:'Chapter 2: Reactions', topics:[
      { id:'c4', title:'Types of Reactions', status:'locked', lessons:4, xpValue:60, progressPercent:0, slug:'reactions', lessonId:'lesson-1' },
    ]},
  ],
  biology: [
    { id:'ch-b1', title:'Chapter 1: Cell Biology', topics:[
      { id:'b1', title:'Cell Structure', status:'completed',   lessons:3, xpValue:50, progressPercent:100, slug:'cell-structure', lessonId:'lesson-1' },
      { id:'b2', title:'Cell Division',  status:'in_progress', lessons:4, xpValue:60, progressPercent:50,  slug:'cell-division',  lessonId:'lesson-1' },
      { id:'b3', title:'Genetics',       status:'unlocked',    lessons:5, xpValue:70, progressPercent:0,   slug:'genetics',       lessonId:'lesson-1' },
    ]},
  ],
}

const EXAM_DATA = {
  physics: [
    { id:'ta-p1', title:'Mechanics', topics:[
      { id:'ep1', title:'Speed & Velocity',  status:'completed',   lessons:4, xpValue:60, progressPercent:100, slug:'speed-velocity', lessonId:'physics-velocity-1' },
      { id:'ep2', title:'Acceleration',      status:'in_progress', lessons:3, xpValue:50, progressPercent:40,  slug:'acceleration',   lessonId:'lesson-1'           },
      { id:'ep3', title:"Newton's Laws",     status:'unlocked',    lessons:5, xpValue:70, progressPercent:0,   slug:'newtons-laws',   lessonId:'lesson-1'           },
      { id:'ep4', title:'Projectiles',       status:'locked',      lessons:4, xpValue:65, progressPercent:0,   slug:'projectiles',    lessonId:'lesson-1'           },
    ]},
    { id:'ta-p2', title:'Waves & Optics', topics:[
      { id:'ep5', title:'Wave Properties', status:'locked', lessons:4, xpValue:60, progressPercent:0, slug:'wave-props', lessonId:'lesson-1' },
      { id:'ep6', title:'Light & Mirrors', status:'locked', lessons:4, xpValue:65, progressPercent:0, slug:'light',      lessonId:'lesson-1' },
    ]},
    { id:'ta-p3', title:'Electricity', topics:[
      { id:'ep7', title:'Current & Voltage',    status:'locked', lessons:3, xpValue:55, progressPercent:0, slug:'current',    lessonId:'lesson-1' },
      { id:'ep8', title:"Resistance & Ohm's Law", status:'locked', lessons:4, xpValue:65, progressPercent:0, slug:'resistance', lessonId:'lesson-1' },
    ]},
  ],
  mathematics: [
    { id:'ta-m1', title:'Algebra', topics:[
      { id:'em1', title:'Quadratic Equations',    status:'completed',   lessons:4, xpValue:60, progressPercent:100, slug:'quadratic',    lessonId:'lesson-1' },
      { id:'em2', title:'Simultaneous Equations', status:'in_progress', lessons:3, xpValue:50, progressPercent:60,  slug:'simultaneous', lessonId:'lesson-1' },
      { id:'em3', title:'Logarithms',             status:'unlocked',    lessons:5, xpValue:70, progressPercent:0,   slug:'logarithms',   lessonId:'lesson-1' },
    ]},
    { id:'ta-m2', title:'Trigonometry', topics:[
      { id:'em4', title:'Trig Ratios',       status:'locked', lessons:4, xpValue:65, progressPercent:0, slug:'trig-ratios',  lessonId:'lesson-1' },
      { id:'em5', title:'Sine & Cosine Rule', status:'locked', lessons:4, xpValue:70, progressPercent:0, slug:'sine-cosine', lessonId:'lesson-1' },
    ]},
  ],
  chemistry: [
    { id:'ta-c1', title:'Atomic Structure', topics:[
      { id:'ec1', title:'Atomic Theory',    status:'completed',   lessons:3, xpValue:50, progressPercent:100, slug:'atomic-theory', lessonId:'lesson-1' },
      { id:'ec2', title:'Periodic Table',   status:'in_progress', lessons:4, xpValue:60, progressPercent:30,  slug:'periodic',      lessonId:'lesson-1' },
      { id:'ec3', title:'Electron Config.', status:'unlocked',    lessons:3, xpValue:55, progressPercent:0,   slug:'electron-cfg',  lessonId:'lesson-1' },
    ]},
  ],
  biology: [
    { id:'ta-b1', title:'Cell Biology', topics:[
      { id:'eb1', title:'Cell Structure', status:'completed',   lessons:3, xpValue:50, progressPercent:100, slug:'cell-structure', lessonId:'lesson-1' },
      { id:'eb2', title:'Cell Division',  status:'in_progress', lessons:4, xpValue:60, progressPercent:50,  slug:'cell-division',  lessonId:'lesson-1' },
    ]},
  ],
}

// ─── NUDGE MESSAGE ────────────────────────────────────────────────────────────

function getNudgeMessage(user, inProgressTopic) {
  const h = new Date().getHours()
  const timeStr = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'

  if (inProgressTopic) {
    return {
      emotion: 'encouraging',
      text:    `You're halfway through "${inProgressTopic.title}". Want to finish it?`,
      hasCta:  true,
    }
  }
  if (user.streakDays >= 3) {
    return {
      emotion: 'excited',
      text:    `${user.streakDays}-day streak! Don't break it — you're on fire. 🔥`,
      hasCta:  false,
    }
  }
  return {
    emotion: 'excited',
    text:    `Good ${timeStr}, ${user.firstName}! Ready to learn something new today?`,
    hasCta:  false,
  }
}

// ─── SECTION 1 — HEADER BAR ───────────────────────────────────────────────────

function HeaderBar({ totalXP }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px 0' }}>
      {/* Wordmark */}
      <div style={{ fontSize:'18px', fontWeight:900, color:C.dark, fontFamily:F, letterSpacing:'-0.3px' }}>
        Learni<span style={{ color:C.blue }}>i</span>e
      </div>

      {/* Centre headline */}
      <div style={{ fontSize:'17px', fontWeight:900, color:C.dark, fontFamily:F }}>
        Let&apos;s <span style={{ color:C.blue }}>learn!</span>
      </div>

      {/* XP badge */}
      <Link href="/profile" style={{ textDecoration:'none' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'4px', background:C.blueLt, borderRadius:'50px', padding:'6px 12px', border:`1.5px solid #CBD5F8` }}>
          <span style={{ fontSize:'13px' }}>⭐</span>
          <span style={{ fontSize:'12px', fontWeight:900, color:C.blue, fontFamily:F }}>{totalXP.toLocaleString()}</span>
        </div>
      </Link>
    </div>
  )
}

// ─── SECTION 2 — MODE BADGE + STREAK ─────────────────────────────────────────

function ModeBadgeRow({ mode, term, streakDays, onOpenSheet }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 20px 0' }}>
      {/* Mode pill — tappable */}
      <button
        onClick={onOpenSheet}
        style={{
          display:'flex', alignItems:'center', gap:'7px',
          background:C.white, border:`1.5px solid ${C.border}`,
          borderRadius:'50px', padding:'7px 14px',
          cursor:'pointer', fontFamily:F, transition:'border-color 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor=C.blue}
        onMouseLeave={e => e.currentTarget.style.borderColor=C.border}
      >
        <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:mode==='school'?C.blue:C.green, flexShrink:0 }}/>
        <span style={{ fontSize:'12px', fontWeight:800, color:C.text, fontFamily:F }}>
          {mode === 'school' ? `School mode · ${term}` : 'Exam mode · All topics'}
        </span>
        <span style={{ fontSize:'10px', color:C.muted }}>✏️</span>
      </button>

      {/* Streak chip */}
      <div style={{ display:'flex', alignItems:'center', gap:'5px', background:C.amberLt, borderRadius:'50px', padding:'6px 12px' }}>
        <span style={{ fontSize:'14px', animation:'flicker 1.5s ease-in-out infinite' }}>🔥</span>
        <span style={{ fontSize:'12px', fontWeight:800, color:C.amber, fontFamily:F }}>
          {streakDays > 0 ? `${streakDays} day streak` : 'Start your streak'}
        </span>
      </div>

      <style>{`
        @keyframes flicker{0%,100%{opacity:1}50%{opacity:.7}}
        @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
      `}</style>
    </div>
  )
}

// ─── SECTION 3 — MASCOT NUDGE CARD ────────────────────────────────────────────

function MascotNudgeCard({ user, inProgressTopic, subjectId, onContinue }) {
  const nudge   = getNudgeMessage(user, inProgressTopic)
  const meta    = SUBJECT_META[subjectId] || SUBJECT_META.physics
  const bgColor = nudge.hasCta ? meta.accentLt : '#EAF3DE'
  const border  = nudge.hasCta ? `1px solid ${meta.accent}33` : '1px solid #97C45933'

  return (
    <div style={{
      margin:'12px 20px 0',
      background:bgColor, border, borderRadius:'14px', padding:'14px',
      display:'flex', alignItems:'center', gap:'12px',
      animation:'nudgeIn 0.3s ease both',
    }}>
      <style>{`@keyframes nudgeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Mascot */}
      <div style={{ flexShrink:0 }}>
        <LearniiBuddy size={44} expression={nudge.emotion === 'encouraging' ? 'encouraging' : 'excited'} />
      </div>

      {/* Message + CTA */}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:'14px', fontWeight:700, color:C.dark, fontFamily:F, lineHeight:1.5 }}>
          {nudge.text}
        </div>
        {nudge.hasCta && inProgressTopic && (
          <button
            onClick={onContinue}
            style={{
              marginTop:'8px', padding:'6px 16px', borderRadius:'50px', border:'none',
              background:meta.accent, color:C.white, fontFamily:F, fontWeight:800,
              fontSize:'12px', cursor:'pointer', transition:'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity='0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity='1'}
          >
            Continue →
          </button>
        )}
      </div>
    </div>
  )
}

// ─── SECTION 4 — SUBJECT TABS ─────────────────────────────────────────────────

function SubjectTabs({ active, onChange }) {
  return (
    <div style={{ padding:'12px 0 0', overflowX:'auto', scrollbarWidth:'none' }}>
      <div style={{ display:'flex', gap:'8px', paddingLeft:'20px', paddingRight:'20px', paddingBottom:'2px' }}>
        {SUBJECTS.map(id => {
          const meta  = SUBJECT_META[id]
          const isAct = active === id
          return (
            <button key={id} onClick={() => onChange(id)} style={{
              padding:'8px 18px', borderRadius:'50px', border:'none', cursor:'pointer',
              background:    isAct ? C.white : '#F1EFE8',
              color:         isAct ? meta.accent : '#888888',
              fontFamily:F,  fontWeight:800, fontSize:'14px',
              flexShrink:0,  transition:'all 0.15s',
              boxShadow:     isAct ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              outline:       isAct ? `1.5px solid ${meta.accent}` : 'none',
              outlineOffset: '-1.5px',
            }}>
              {meta.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── SECTION 5 — CONTINUE CARD ────────────────────────────────────────────────
// Shown when there's an in-progress topic and the nudge card didn't already CTA

function ContinueCard({ topic, subjectId }) {
  const meta = SUBJECT_META[subjectId] || SUBJECT_META.physics
  const href = `/learn/${subjectId}/${topic.slug}/lesson/${topic.lessonId}`
  const pct  = topic.progressPercent || 0

  return (
    <Link href={href} style={{ textDecoration:'none', display:'block', margin:'12px 20px 0' }}>
      <div style={{
        background:C.white, borderRadius:'16px',
        border:`1.5px solid ${meta.accent}55`,
        borderLeft:`4px solid ${meta.accent}`,
        padding:'14px 16px', display:'flex', alignItems:'center', gap:'12px',
        cursor:'pointer', transition:'transform 0.12s',
      }}
        onMouseDown={e => e.currentTarget.style.transform='scale(0.98)'}
        onMouseUp={e => e.currentTarget.style.transform='scale(1)'}
        onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
      >
        {/* Play icon */}
        <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:meta.accent, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
            <path d="M4 2.5L13 8 4 13.5V2.5z"/>
          </svg>
        </div>

        {/* Text + progress bar */}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:'11px', fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.6px', fontFamily:F, marginBottom:'3px' }}>
            Continue
          </div>
          <div style={{ fontSize:'15px', fontWeight:900, color:C.text, fontFamily:F, marginBottom:'6px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
            {topic.title}
          </div>
          {/* Progress bar */}
          <div style={{ height:'4px', background:C.bgPill, borderRadius:'2px', overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${pct}%`, background:meta.accent, borderRadius:'2px', transition:'width 0.5s ease' }}/>
          </div>
          <div style={{ fontSize:'11px', fontWeight:600, color:C.muted, fontFamily:F, marginTop:'4px' }}>{pct}% complete</div>
        </div>

        <div style={{ fontSize:'20px', color:meta.accent, flexShrink:0 }}>›</div>
      </div>
    </Link>
  )
}

// ─── TOPIC CARD ───────────────────────────────────────────────────────────────

function TopicCard({ topic, subjectId, onLockedTap, staggerIdx }) {
  const meta   = SUBJECT_META[subjectId] || SUBJECT_META.physics
  const locked = topic.status === 'locked'
  const href   = `/learn/${subjectId}/${topic.slug}/lesson/${topic.lessonId}`
  const cardRef = useRef(null)

  // Per-status visual config
  const cfg = {
    completed: {
      iconBg:    C.green,
      iconColor: C.white,
      icon:      '✓',
      cardBg:    C.greenCard,
      border:    `0.5px solid #97C459`,
      leftBorder:'none',
    },
    in_progress: {
      iconBg:    C.blue,
      iconColor: C.white,
      icon:      '▶',
      cardBg:    C.blueCard,
      border:    `1.5px solid ${C.blue}`,
      leftBorder:`3px solid ${C.blue}`,
    },
    unlocked: {
      iconBg:    '#E8E8E8',
      iconColor: '#666666',
      icon:      '▶',
      cardBg:    C.white,
      border:    `0.5px solid ${C.border}`,
      leftBorder:'none',
    },
    locked: {
      iconBg:    C.bgPill,
      iconColor: C.mutedLt,
      icon:      '🔒',
      cardBg:    C.white,
      border:    `0.5px solid ${C.border}`,
      leftBorder:'none',
    },
  }[topic.status] || {}

  function handleTap() {
    if (!locked) return
    onLockedTap()
    cardRef.current?.animate([
      { transform:'translateX(0)' },
      { transform:'translateX(-4px)' },
      { transform:'translateX(4px)' },
      { transform:'translateX(-4px)' },
      { transform:'translateX(4px)' },
      { transform:'translateX(-4px)' },
      { transform:'translateX(0)' },
    ], { duration:300, easing:'ease-in-out' })
  }

  const inner = (
    <div ref={cardRef} onClick={handleTap} style={{
      display:'flex', alignItems:'center', gap:'12px',
      background:cfg.cardBg,
      borderRadius:'14px',
      border:cfg.border,
      borderLeft:cfg.leftBorder || cfg.border,
      padding:'13px 14px',
      marginBottom:'8px',
      cursor:locked ? 'not-allowed' : 'pointer',
      transition:'transform 0.12s',
      animation:`cardIn 0.3s ease both`,
      animationDelay:`${staggerIdx * 40}ms`,
    }}
      onMouseDown={e => { if (!locked) e.currentTarget.style.transform='scale(0.97)' }}
      onMouseUp={e   => { e.currentTarget.style.transform='scale(1)' }}
      onMouseLeave={e => { e.currentTarget.style.transform='scale(1)' }}
    >
      {/* State icon — 44×44 */}
      <div style={{
        width:'44px', height:'44px', borderRadius:'12px', flexShrink:0,
        background:cfg.iconBg, color:cfg.iconColor,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:topic.status==='locked'?'18px':'14px',
        fontWeight:900, fontFamily:F,
      }}>
        {cfg.icon}
      </div>

      {/* Centre */}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:'15px', fontWeight:900, color:C.text, fontFamily:F, lineHeight:1.25, marginBottom:'2px' }}>
          {topic.title}
        </div>
        <div style={{ fontSize:'12px', fontWeight:600, color:C.muted, fontFamily:F, marginBottom: topic.status==='in_progress' ? '6px' : '0' }}>
          {topic.lessonCount ?? topic.lessons} lessons · {topic.xpValue} pts
        </div>
        {/* Progress bar for in-progress only */}
        {topic.status === 'in_progress' && (
          <div style={{ height:'3px', background:C.bgPill, borderRadius:'2px', overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${topic.progressPercent||0}%`, background:C.blue, borderRadius:'2px' }}/>
          </div>
        )}
      </div>

      {/* Right: XP badge or locked arrow */}
      {topic.status !== 'locked' ? (
        <div style={{
          background: topic.status==='completed' ? C.greenLt : topic.status==='in_progress' ? C.blueLt : C.bgPill,
          color:      topic.status==='completed' ? C.greenDk : topic.status==='in_progress' ? C.blue   : C.muted,
          borderRadius:'50px', padding:'4px 10px',
          fontSize:'11px', fontWeight:800, fontFamily:F, flexShrink:0,
        }}>
          +{topic.xpValue}
        </div>
      ) : (
        <div style={{ fontSize:'18px', color:'rgba(0,0,0,0.1)', flexShrink:0 }}>›</div>
      )}
    </div>
  )

  if (locked) return inner
  return <Link href={href} style={{ textDecoration:'none' }}>{inner}</Link>
}

// ─── LOCKED TOPICS COLLAPSED ROW ─────────────────────────────────────────────

function LockedCollapsed({ count, chapterTitle }) {
  if (count === 0) return null
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:'8px',
      padding:'10px 14px', borderRadius:'12px',
      border:`1px dashed ${C.border}`,
      marginBottom:'8px', cursor:'default',
    }}>
      <span style={{ fontSize:'14px', opacity:0.5 }}>🔒</span>
      <span style={{ fontSize:'12px', fontWeight:700, color:C.muted, fontFamily:F }}>
        +{count} more topic{count>1?'s':''} — complete above to unlock
      </span>
    </div>
  )
}

// ─── CHAPTER SECTION (school mode) ───────────────────────────────────────────

function ChapterSection({ chapter, subjectId, onLockedTap, baseIdx }) {
  const unlocked = chapter.topics.filter(t => t.status !== 'locked')
  const locked   = chapter.topics.filter(t => t.status === 'locked')
  const allDone  = unlocked.length > 0 && unlocked.every(t => t.status === 'completed')

  return (
    <div style={{ marginBottom:'20px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'8px', paddingBottom:'8px', paddingTop:'4px' }}>
        <div style={{ fontSize:'11px', fontWeight:800, color:C.mutedLt, textTransform:'uppercase', letterSpacing:'0.8px', fontFamily:F }}>
          {chapter.title}
        </div>
        {allDone && (
          <div style={{ background:C.greenLt, borderRadius:'50px', padding:'2px 8px', fontSize:'10px', fontWeight:800, color:C.greenDk, fontFamily:F }}>
            ✓ Complete
          </div>
        )}
      </div>

      {/* Unlocked / in-progress / completed topics */}
      {unlocked.map((t, i) => (
        <TopicCard key={t.id} topic={t} subjectId={subjectId} onLockedTap={onLockedTap} staggerIdx={baseIdx + i} />
      ))}

      {/* Chapter complete banner */}
      {allDone && (
        <div style={{ background:C.greenLt, borderRadius:'12px', padding:'10px 14px', border:`1px solid #97C459`, marginBottom:'8px', display:'flex', alignItems:'center', gap:'8px' }}>
          <span style={{ fontSize:'16px' }}>🎉</span>
          <span style={{ fontSize:'13px', fontWeight:700, color:C.greenDk, fontFamily:F }}>
            Chapter complete! You&apos;ve mastered {chapter.title}.
          </span>
        </div>
      )}

      {/* Locked topics collapsed */}
      <LockedCollapsed count={locked.length} chapterTitle={chapter.title} />
    </div>
  )
}

// ─── TOPIC GROUP SECTION (exam mode) ─────────────────────────────────────────

function TopicGroupSection({ group, subjectId, onLockedTap, baseIdx, groupRef }) {
  const unlocked = group.topics.filter(t => t.status !== 'locked')
  const locked   = group.topics.filter(t => t.status === 'locked')

  return (
    <div ref={groupRef} style={{ marginBottom:'20px' }}>
      <div style={{ fontSize:'11px', fontWeight:800, color:C.mutedLt, textTransform:'uppercase', letterSpacing:'0.8px', fontFamily:F, paddingBottom:'8px', paddingTop:'4px' }}>
        {group.title}
      </div>
      {unlocked.map((t, i) => (
        <TopicCard key={t.id} topic={t} subjectId={subjectId} onLockedTap={onLockedTap} staggerIdx={baseIdx + i} />
      ))}
      <LockedCollapsed count={locked.length} />
    </div>
  )
}

// ─── EXAM MODE JUMP DROPDOWN ──────────────────────────────────────────────────

function JumpDropdown({ groups, onJump }) {
  const [open, setOpen]       = useState(false)
  const [selected, setSelected] = useState('all')

  function choose(id) {
    setSelected(id)
    setOpen(false)
    if (id !== 'all') onJump(id)
  }

  const label = selected === 'all' ? 'All topics' : (groups.find(g=>g.id===selected)?.title || 'All topics')

  return (
    <div style={{ marginBottom:'14px', position:'relative' }}>
      <div style={{ fontSize:'10px', fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.8px', fontFamily:F, marginBottom:'5px' }}>
        Jump to topic
      </div>
      <div onClick={() => setOpen(o=>!o)} style={{
        background:C.white, borderRadius:'12px', padding:'12px 16px',
        border:`1.5px solid ${open ? C.blue : C.border}`,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        cursor:'pointer', transition:'border-color 0.15s',
      }}>
        <span style={{ fontSize:'15px', fontWeight:800, color:C.text, fontFamily:F }}>{label}</span>
        <span style={{ fontSize:'14px', color:C.muted, transition:'transform 0.2s', transform:open?'rotate(180deg)':'none', display:'inline-block' }}>⌄</span>
      </div>
      {open && (
        <div style={{ position:'absolute', top:'calc(100% + 4px)', left:0, right:0, background:C.white, borderRadius:'14px', border:`1.5px solid ${C.border}`, zIndex:40, overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.1)' }}>
          {[{id:'all',title:'All topics'}, ...groups].map((g, i, arr) => (
            <div key={g.id} onClick={() => choose(g.id)} style={{
              padding:'12px 16px', cursor:'pointer',
              background:selected===g.id ? C.blueLt : C.white,
              fontSize:'14px', fontWeight:selected===g.id?800:600,
              color:selected===g.id?C.blue:C.text, fontFamily:F,
              borderBottom:i<arr.length-1?`1px solid ${C.border}`:'none',
            }}>
              {g.title}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── MODE SWITCHER BOTTOM SHEET ───────────────────────────────────────────────

function ModeSwitcherSheet({ currentMode, term, onConfirm, onClose }) {
  const [pending, setPending] = useState(currentMode)

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:100 }}/>

      {/* Sheet */}
      <div style={{
        position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)',
        width:'100%', maxWidth:'430px', background:C.white,
        borderRadius:'24px 24px 0 0', zIndex:101, padding:'20px',
        animation:'sheetUp 0.25s ease both',
      }}>
        <style>{`@keyframes sheetUp{from{transform:translateX(-50%) translateY(100%)}to{transform:translateX(-50%) translateY(0)}}`}</style>

        {/* Handle */}
        <div style={{ width:'40px', height:'4px', background:C.bgPill, borderRadius:'2px', margin:'0 auto 16px' }}/>

        <div style={{ fontSize:'18px', fontWeight:900, color:C.text, fontFamily:F, marginBottom:'16px', textAlign:'center' }}>
          Switch learning mode
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'20px' }}>
          {[
            { id:'school', icon:'🏫', title:'School mode', desc:'Follow your school syllabus', sub:term },
            { id:'exam',   icon:'🏆', title:'Exam mode',   desc:'Prepare for your exams',     sub:'WAEC · JAMB · NECO' },
          ].map(opt => (
            <div key={opt.id} onClick={() => setPending(opt.id)} style={{
              padding:'16px', borderRadius:'16px', cursor:'pointer',
              border:`${pending===opt.id?'2px':'1.5px'} solid ${pending===opt.id?C.blue:C.border}`,
              background:pending===opt.id ? C.blueLt : C.white,
              position:'relative', transition:'all 0.15s',
            }}>
              {pending === opt.id && (
                <div style={{ position:'absolute', top:'10px', right:'10px', width:'20px', height:'20px', borderRadius:'50%', background:C.blue, color:C.white, fontSize:'11px', fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:F }}>✓</div>
              )}
              <div style={{ fontSize:'24px', marginBottom:'8px' }}>{opt.icon}</div>
              <div style={{ fontSize:'14px', fontWeight:900, color:C.text, fontFamily:F, marginBottom:'3px' }}>{opt.title}</div>
              <div style={{ fontSize:'12px', fontWeight:600, color:C.muted, fontFamily:F, marginBottom:'4px' }}>{opt.desc}</div>
              <div style={{ fontSize:'11px', fontWeight:700, color:C.blue, fontFamily:F }}>{opt.sub}</div>
            </div>
          ))}
        </div>

        <button onClick={() => { onConfirm(pending); onClose() }} style={{
          width:'100%', padding:'16px', borderRadius:'16px', border:'none',
          background:C.blue, color:C.white, fontFamily:F, fontWeight:900,
          fontSize:'16px', cursor:'pointer',
        }}>
          Confirm
        </button>
      </div>
    </>
  )
}

// ─── TOAST ────────────────────────────────────────────────────────────────────

function Toast({ message, visible }) {
  return (
    <div style={{
      position:'fixed', bottom:'88px', left:'50%', transform:'translateX(-50%)',
      background:C.dark, color:C.white, fontFamily:F, fontWeight:700, fontSize:'13px',
      padding:'10px 20px', borderRadius:'50px', zIndex:200,
      opacity:visible?1:0, pointerEvents:'none',
      transition:'opacity 0.2s ease', whiteSpace:'nowrap',
    }}>
      🔒 Complete the previous topic first
    </div>
  )
}

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────

function EmptyState({ subjectId }) {
  const meta = SUBJECT_META[subjectId] || SUBJECT_META.physics
  return (
    <div style={{ padding:'48px 20px', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:'12px' }}>
      <LearniiBuddy size={72} expression="thinking"/>
      <div style={{ fontSize:'16px', fontWeight:800, color:C.text, fontFamily:F }}>
        No topics here yet
      </div>
      <div style={{ fontSize:'13px', fontWeight:600, color:C.muted, fontFamily:F }}>
        {meta.label} content is coming soon. Check back shortly!
      </div>
    </div>
  )
}

// ─── ROOT PAGE ────────────────────────────────────────────────────────────────

export default function LearnPage() {
  const router = useRouter()

  const [mode,        setMode]        = useState('school')
  const [subject,     setSubject]     = useState('physics')
  const [listKey,     setListKey]     = useState(0)
  const [sheetOpen,   setSheetOpen]   = useState(false)
  const [toast,       setToast]       = useState(false)

  const user = {
    firstName:  MOCK_STUDENT.display_name.split(' ')[0],
    totalXP:    MOCK_STUDENT.xp,
    weeklyXP:   MOCK_STUDENT.weekly_xp,
    streakDays: MOCK_STUDENT.streak_days,
  }

  const schoolMeta = { term:'1st Term', classLevel:'SS2' }
  const chapters   = SCHOOL_DATA[subject] || []
  const topicAreas = EXAM_DATA[subject]   || []

  // Find first in-progress topic for nudge + continue card
  const allTopicsFlat = (mode === 'school' ? chapters : topicAreas)
    .flatMap(g => g.topics)
  const inProgressTopic = allTopicsFlat.find(t => t.status === 'in_progress') || null

  // Area refs for exam mode scroll-jump
  const groupRefs = useRef({})

  function switchMode(m) {
    setListKey(k => k+1)
    setMode(m)
  }

  function switchSubject(s) {
    setListKey(k => k+1)
    setSubject(s)
  }

  function handleLockedTap() {
    setToast(true)
    setTimeout(() => setToast(false), 2200)
  }

  function handleContinue() {
    if (!inProgressTopic) return
    router.push(`/learn/${subject}/${inProgressTopic.slug}/lesson/${inProgressTopic.lessonId}`)
  }

  function jumpToGroup(id) {
    const el = groupRefs.current[id]
    if (el) el.scrollIntoView({ behavior:'smooth', block:'start' })
  }

  // Compute stagger indices for card cascade animation
  let staggerCounter = 0

  return (
    <div style={{ background:C.white, minHeight:'100vh', fontFamily:F, maxWidth:'430px', margin:'0 auto', paddingBottom:'100px', display:'flex', flexDirection:'column', position:'relative' }}>

      <style>{`
        @keyframes cardIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes nudgeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes sheetUp{from{transform:translateX(-50%) translateY(100%)}to{transform:translateX(-50%) translateY(0)}}
        @keyframes flicker{0%,100%{opacity:1}50%{opacity:.7}}
        @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
      `}</style>

      {/* ── STICKY HEADER ─────────────────────────────────────────────────── */}
      <div style={{ background:C.white, flexShrink:0, position:'sticky', top:0, zIndex:20, borderBottom:`1px solid ${C.border}`, paddingBottom:'12px' }}>

        {/* 1. Header bar */}
        <HeaderBar totalXP={user.totalXP} />

        {/* 2. Mode badge + streak */}
        <ModeBadgeRow
          mode={mode}
          term={schoolMeta.term}
          streakDays={user.streakDays}
          onOpenSheet={() => setSheetOpen(true)}
        />
      </div>

      {/* ── SCROLLABLE CONTENT ────────────────────────────────────────────── */}
      <div style={{ flex:1, overflowY:'auto' }}>

        {/* 3. Mascot nudge card */}
        <MascotNudgeCard
          user={user}
          inProgressTopic={inProgressTopic}
          subjectId={subject}
          onContinue={handleContinue}
        />

        {/* 4. Subject tabs — school mode */}
        {mode === 'school' && (
          <SubjectTabs active={subject} onChange={switchSubject} />
        )}

        {/* 5. Continue card — only if nudge didn't already show CTA */}
        {inProgressTopic && !getNudgeMessage(user, inProgressTopic).hasCta && (
          <ContinueCard topic={inProgressTopic} subjectId={subject} />
        )}

        {/* 6. Content list */}
        <div key={listKey} style={{ padding:'14px 20px 0', animation:'cardIn 0.2s ease both' }}>

          {/* ── SCHOOL MODE ── */}
          {mode === 'school' && (
            chapters.length === 0
              ? <EmptyState subjectId={subject} />
              : chapters.map(ch => {
                  const idx = staggerCounter
                  staggerCounter += ch.topics.filter(t=>t.status!=='locked').length
                  return (
                    <ChapterSection
                      key={ch.id}
                      chapter={ch}
                      subjectId={subject}
                      onLockedTap={handleLockedTap}
                      baseIdx={idx}
                    />
                  )
                })
          )}

          {/* ── EXAM MODE ── */}
          {mode === 'exam' && (
            <div>
              {/* Subject tabs for exam mode */}
              <div style={{ display:'flex', gap:'8px', overflowX:'auto', scrollbarWidth:'none', marginBottom:'14px', marginLeft:'-20px', marginRight:'-20px', paddingLeft:'20px', paddingRight:'20px' }}>
                {SUBJECTS.map(id => {
                  const meta  = SUBJECT_META[id]
                  const isAct = subject === id
                  return (
                    <button key={id} onClick={() => switchSubject(id)} style={{
                      padding:'8px 18px', borderRadius:'50px', border:'none',
                      background:isAct ? C.white : '#F1EFE8',
                      color:isAct ? meta.accent : '#888',
                      fontFamily:F, fontWeight:800, fontSize:'14px',
                      cursor:'pointer', flexShrink:0, transition:'all 0.15s',
                      boxShadow:isAct ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                      outline:isAct ? `1.5px solid ${meta.accent}` : 'none',
                      outlineOffset:'-1.5px',
                    }}>
                      {meta.label}
                    </button>
                  )
                })}
              </div>

              {topicAreas.length === 0
                ? <EmptyState subjectId={subject} />
                : (
                  <>
                    <JumpDropdown groups={topicAreas} onJump={jumpToGroup} />
                    {topicAreas.map(area => {
                      const idx = staggerCounter
                      staggerCounter += area.topics.filter(t=>t.status!=='locked').length
                      return (
                        <TopicGroupSection
                          key={area.id}
                          group={area}
                          subjectId={subject}
                          onLockedTap={handleLockedTap}
                          baseIdx={idx}
                          groupRef={el => { groupRefs.current[area.id] = el }}
                        />
                      )
                    })}
                  </>
                )
              }
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      <Toast visible={toast} />

      {/* Mode switcher bottom sheet */}
      {sheetOpen && (
        <ModeSwitcherSheet
          currentMode={mode}
          term={schoolMeta.term}
          onConfirm={m => { switchMode(m) }}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </div>
  )
}