'use client'

// ─────────────────────────────────────────────────────────────────────────────
// learn/page.jsx — Full redesign per spec
//
// Header (sticky, white):
//   Row 1: Mascot placeholder (40×40) + speech bubble with rotating messages
//   Row 2: School / Exam mode toggle pills
//   Row 3: Subject switcher horizontal pills
//
// School mode: chapter-grouped topic cards (done/current/locked states)
// Exam mode:   topic dropdown + stat chips + lesson list
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import Link from 'next/link'

const F = "'Nunito', sans-serif"

const C = {
  white:   '#FFFFFF',
  surface: '#F7F8FA',
  green:   '#6DC77A',
  greenDk: '#52B362',
  blue:    '#2D3CE6',
  dark:    '#1A1A1A',
  text:    '#1A1A1A',
  muted:   '#999999',
  mutedLt: '#AAAAAA',
  border:  '#F0F0F0',
  bgPill:  '#F0F0F0',
}

const MESSAGES = [
  'Pick up where you left off! 👋',
  "You're on a roll! Keep going 🔥",
  'Knowledge is power — keep going! 💪',
  'Every bite gets you closer! 🎯',
]

// ── DATA ──────────────────────────────────────────────────────────────────────

const SUBJECT_PILLS = [
  { id:'physics',     label:'Physics'   },
  { id:'mathematics', label:'Maths'     },
  { id:'chemistry',   label:'Chemistry' },
  { id:'biology',     label:'Biology'   },
]

const TOPICS = {
  physics: [
    { chapter:'Chapter 1 — Mechanics', items:[
      { id:'p1', title:'Introduction to Motion',  status:'done',    lessons:3, pts:50, slug:'intro-motion' },
      { id:'p2', title:'Velocity & Acceleration', status:'current', lessons:4, pts:60, slug:'velocity'     },
      { id:'p3', title:"Newton's Laws",           status:'locked',  lessons:5, pts:70, slug:'newtons-laws' },
    ]},
    { chapter:'Chapter 2 — Energy', items:[
      { id:'p4', title:'Work and Energy', status:'locked', lessons:4, pts:60, slug:'work-energy' },
      { id:'p5', title:'Power',           status:'locked', lessons:3, pts:50, slug:'power'       },
    ]},
    { chapter:'Chapter 3 — Waves', items:[
      { id:'p6', title:'Wave Motion', status:'locked', lessons:4, pts:60, slug:'wave-motion' },
      { id:'p7', title:'Sound Waves', status:'locked', lessons:3, pts:55, slug:'sound-waves' },
    ]},
  ],
  mathematics: [
    { chapter:'Chapter 1 — Algebra', items:[
      { id:'m1', title:'Quadratic Equations',    status:'done',    lessons:4, pts:60, slug:'quadratic'    },
      { id:'m2', title:'Simultaneous Equations', status:'current', lessons:3, pts:50, slug:'simultaneous' },
      { id:'m3', title:'Indices & Logarithms',   status:'locked',  lessons:5, pts:70, slug:'indices'      },
    ]},
    { chapter:'Chapter 2 — Sequences', items:[
      { id:'m4', title:'Sequences & Series', status:'locked', lessons:4, pts:60, slug:'sequences'   },
      { id:'m5', title:'Mensuration',        status:'locked', lessons:4, pts:55, slug:'mensuration' },
    ]},
  ],
  chemistry: [
    { chapter:'Chapter 1 — Atomic Structure', items:[
      { id:'c1', title:'Atomic Theory',    status:'done',    lessons:3, pts:50, slug:'atomic-theory' },
      { id:'c2', title:'Periodic Table',   status:'current', lessons:4, pts:60, slug:'periodic'      },
      { id:'c3', title:'Chemical Bonding', status:'locked',  lessons:5, pts:70, slug:'bonding'       },
    ]},
  ],
  biology: [
    { chapter:'Chapter 1 — Cell Biology', items:[
      { id:'b1', title:'Cell Structure', status:'done',    lessons:3, pts:50, slug:'cell-structure' },
      { id:'b2', title:'Cell Division',  status:'current', lessons:4, pts:60, slug:'cell-division'  },
      { id:'b3', title:'Genetics',       status:'locked',  lessons:5, pts:70, slug:'genetics'       },
    ]},
  ],
}

// Flat topic list for exam mode dropdown
const ALL_TOPICS = Object.entries(TOPICS).flatMap(([subj, chapters]) =>
  chapters.flatMap(ch => ch.items.map(t => ({ ...t, subject: subj, chapter: ch.chapter })))
)

// ── MASCOT PLACEHOLDER ────────────────────────────────────────────────────────

function MascotThumb() {
  // Replace inner with <img src="/mascot.png" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'14px'}}/> when ready
  return (
    <div style={{ width:'44px', height:'44px', borderRadius:'14px', background:'linear-gradient(135deg,#FFE5B4,#FFDDA0)', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#C8943A" strokeWidth="1.5"/>
        <circle cx="9.5" cy="10.5" r="1.2" fill="#C8943A"/>
        <circle cx="14.5" cy="10.5" r="1.2" fill="#C8943A"/>
        <path d="M8.5 15c1 1.2 6 1.2 7 0" stroke="#C8943A" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </div>
  )
}

// ── STATUS CONFIG ─────────────────────────────────────────────────────────────

function statusCfg(status) {
  if (status === 'done')    return { cardBg:'#F9FFF9', cardBorder:'#C5EECB', badgeBg:C.green,  icon:'✓', iconC:C.white }
  if (status === 'current') return { cardBg:'#EEF0FF', cardBorder:C.blue,   badgeBg:C.blue,   icon:'▶', iconC:C.white }
  return                           { cardBg:C.white,   cardBorder:C.border,  badgeBg:C.surface, icon:'🔒', iconC:C.muted }
}

// ── TOPIC CARD ────────────────────────────────────────────────────────────────

function TopicCard({ topic, subjectSlug }) {
  const cfg    = statusCfg(topic.status)
  const locked = topic.status === 'locked'
  const href   = `/learn/${subjectSlug}/${topic.slug}/lesson/lesson-1`

  const card = (
    <div style={{
      borderRadius:'18px', padding:'14px', border:`1.5px solid ${cfg.cardBorder}`,
      background:cfg.cardBg, marginBottom:'9px', display:'flex', alignItems:'center',
      gap:'12px', opacity:locked?0.45:1, cursor:locked?'not-allowed':'pointer',
      transition:'opacity 0.15s, transform 0.12s',
    }}
      onMouseDown={e => { if (!locked) e.currentTarget.style.transform='scale(0.98)' }}
      onMouseUp={e => { e.currentTarget.style.transform='scale(1)' }}
      onMouseLeave={e => { e.currentTarget.style.transform='scale(1)' }}
    >
      {/* Status badge 46×46 */}
      <div style={{ width:'46px', height:'46px', borderRadius:'13px', background:cfg.badgeBg, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:locked?'18px':'15px', color:cfg.iconC, fontWeight:900, fontFamily:F }}>
        {cfg.icon}
      </div>

      {/* Text */}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:'14px', fontWeight:900, color:C.text, fontFamily:F, lineHeight:1.2, marginBottom:'3px' }}>{topic.title}</div>
        <div style={{ fontSize:'11px', fontWeight:600, color:C.muted, fontFamily:F }}>{topic.lessons} lessons · {topic.pts} pts</div>
      </div>

      {/* Right */}
      {!locked ? (
        <div style={{ background:'#EBF9EE', borderRadius:'50px', padding:'3px 10px', fontSize:'10px', fontWeight:800, color:C.greenDk, fontFamily:F, flexShrink:0 }}>
          {topic.pts} pts
        </div>
      ) : (
        <div style={{ fontSize:'16px', color:'rgba(0,0,0,0.12)', flexShrink:0 }}>›</div>
      )}
    </div>
  )

  if (locked) return card
  return <Link href={href} style={{ textDecoration:'none' }}>{card}</Link>
}

// ── EXAM STAT CHIP ────────────────────────────────────────────────────────────

function StatChip({ label, value }) {
  return (
    <div style={{ background:C.surface, borderRadius:'12px', padding:'8px 14px', display:'flex', flexDirection:'column', alignItems:'center', flex:1 }}>
      <div style={{ fontSize:'16px', fontWeight:900, color:C.text, fontFamily:F }}>{value}</div>
      <div style={{ fontSize:'10px', fontWeight:700, color:C.muted, fontFamily:F, textAlign:'center' }}>{label}</div>
    </div>
  )
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function LearnPage() {
  const [mode,         setMode]         = useState('school')   // 'school' | 'exam'
  const [subject,      setSubject]      = useState('physics')
  const [examTopic,    setExamTopic]    = useState(ALL_TOPICS[1])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [msgIdx]                        = useState(() => Math.floor(Math.random() * MESSAGES.length))

  const chapters = TOPICS[subject] || []

  return (
    <div style={{ background:C.white, minHeight:'100vh', fontFamily:F, maxWidth:'520px', margin:'0 auto', paddingBottom:'100px', display:'flex', flexDirection:'column' }}>

      {/* ── STICKY HEADER ───────────────────────────────────────────────────── */}
      <div style={{ background:C.white, padding:'20px 22px 0', flexShrink:0, position:'sticky', top:0, zIndex:20, borderBottom:`1px solid ${C.border}`, paddingBottom:'14px' }}>

        {/* Row 1 — Mascot + message bubble */}
        <div style={{ display:'flex', gap:'10px', alignItems:'center', marginBottom:'14px' }}>
          <MascotThumb />
          {/* Speech bubble — border radius 0 at top-left = pointed tail corner */}
          <div style={{ background:C.surface, borderRadius:'0 16px 16px 16px', padding:'10px 14px', flex:1 }}>
            <div style={{ fontSize:'13px', fontWeight:700, color:'#444', fontFamily:F, lineHeight:1.4 }}>
              {MESSAGES[msgIdx]}
            </div>
          </div>
        </div>

        {/* Row 2 — Mode toggle */}
        <div style={{ display:'flex', gap:'8px', marginBottom:'14px' }}>
          {['school', 'exam'].map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex:1, padding:'10px 20px', borderRadius:'50px', border:'none',
                background: mode === m ? C.blue : C.bgPill,
                color:      mode === m ? C.white : '#666',
                fontFamily:F, fontWeight:800, fontSize:'13px',
                cursor:'pointer', transition:'all 0.2s',
              }}
            >
              {m === 'school' ? '🏫 School' : '📋 Exam'}
            </button>
          ))}
        </div>

        {/* Row 3 — Subject pills (school mode only) */}
        {mode === 'school' && (
          <div style={{ display:'flex', gap:'8px', overflowX:'auto', scrollbarWidth:'none', marginLeft:'-22px', marginRight:'-22px', paddingLeft:'22px', paddingRight:'22px', paddingBottom:'2px' }}>
            {SUBJECT_PILLS.map(p => (
              <button
                key={p.id}
                onClick={() => setSubject(p.id)}
                style={{
                  padding:'8px 20px', borderRadius:'50px', border:'none',
                  background: subject === p.id ? C.blue : C.bgPill,
                  color:      subject === p.id ? C.white : '#555',
                  fontFamily:F, fontWeight:800, fontSize:'13px',
                  cursor:'pointer', flexShrink:0, transition:'all 0.2s',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── CONTENT ─────────────────────────────────────────────────────────── */}
      <div style={{ padding:'16px 22px 0', flex:1, overflowY:'auto' }}>

        {/* ── SCHOOL MODE ── */}
        {mode === 'school' && chapters.map(ch => (
          <div key={ch.chapter} style={{ marginBottom:'22px' }}>
            {/* Chapter label */}
            <div style={{ fontSize:'11px', fontWeight:800, color:C.mutedLt, textTransform:'uppercase', letterSpacing:'0.7px', fontFamily:F, paddingTop:'4px', paddingBottom:'8px' }}>
              {ch.chapter}
            </div>
            {ch.items.map(t => (
              <TopicCard key={t.id} topic={t} subjectSlug={subject} />
            ))}
          </div>
        ))}

        {/* ── EXAM MODE ── */}
        {mode === 'exam' && (
          <div>
            {/* Topic dropdown selector */}
            <div
              onClick={() => setDropdownOpen(o => !o)}
              style={{ background:C.surface, borderRadius:'14px', padding:'14px 16px', border:`1.5px solid #E0E0E0`, display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer', marginBottom:'12px', transition:'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background='#EEEEF2'}
              onMouseLeave={e => e.currentTarget.style.background=C.surface}
            >
              <div style={{ fontSize:'14px', fontWeight:800, color:C.text, fontFamily:F }}>{examTopic.title}</div>
              <div style={{ fontSize:'16px', color:C.muted, transition:'transform 0.2s', transform:dropdownOpen?'rotate(180deg)':'rotate(0deg)' }}>⌄</div>
            </div>

            {/* Dropdown sheet */}
            {dropdownOpen && (
              <div style={{ background:C.white, borderRadius:'18px', border:`1.5px solid ${C.border}`, overflow:'hidden', marginBottom:'14px' }}>
                {ALL_TOPICS.filter(t => t.status !== 'locked').map((t, i, arr) => (
                  <div key={t.id}
                    onClick={() => { setExamTopic(t); setDropdownOpen(false) }}
                    style={{ padding:'13px 16px', cursor:'pointer', borderBottom:i<arr.length-1?`1px solid ${C.border}`:'none', background:examTopic.id===t.id?'#EEF0FF':C.white, display:'flex', alignItems:'center', justifyContent:'space-between', transition:'background 0.15s' }}
                    onMouseEnter={e => { if(examTopic.id!==t.id) e.currentTarget.style.background=C.surface }}
                    onMouseLeave={e => { if(examTopic.id!==t.id) e.currentTarget.style.background=C.white }}
                  >
                    <div>
                      <div style={{ fontSize:'14px', fontWeight:800, color:C.text, fontFamily:F }}>{t.title}</div>
                      <div style={{ fontSize:'11px', fontWeight:600, color:C.muted, fontFamily:F }}>{t.chapter}</div>
                    </div>
                    {examTopic.id === t.id && <div style={{ fontSize:'14px', color:C.blue, fontWeight:900, fontFamily:F }}>✓</div>}
                  </div>
                ))}
              </div>
            )}

            {/* Stat chips */}
            <div style={{ display:'flex', gap:'8px', marginBottom:'16px' }}>
              <StatChip label="Past Questions" value="42"/>
              <StatChip label="Practice Qs"   value="18"/>
              <StatChip label="Est. Time"      value="25m"/>
            </div>

            {/* Lessons in selected topic */}
            <div style={{ fontSize:'11px', fontWeight:800, color:C.mutedLt, textTransform:'uppercase', letterSpacing:'0.7px', fontFamily:F, marginBottom:'8px' }}>
              Lessons in this topic
            </div>
            {Array.from({ length: examTopic.lessons }, (_, i) => (
              <Link key={i} href={`/learn/${examTopic.subject}/${examTopic.slug}/lesson/lesson-${i+1}`} style={{ textDecoration:'none' }}>
                <div style={{ background:C.surface, borderRadius:'16px', padding:'14px 16px', marginBottom:'8px', display:'flex', alignItems:'center', gap:'12px', cursor:'pointer', transition:'transform 0.12s' }}
                  onMouseDown={e => e.currentTarget.style.transform='scale(0.98)'}
                  onMouseUp={e => e.currentTarget.style.transform='scale(1)'}
                  onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
                >
                  <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'#EEF0FF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:900, color:C.blue, fontFamily:F, flexShrink:0 }}>
                    {i + 1}
                  </div>
                  <div>
                    <div style={{ fontSize:'14px', fontWeight:800, color:C.text, fontFamily:F }}>Lesson {i + 1}</div>
                    <div style={{ fontSize:'11px', fontWeight:600, color:C.muted, fontFamily:F }}>Tap to start</div>
                  </div>
                  <div style={{ marginLeft:'auto', fontSize:'16px', color:'rgba(0,0,0,0.15)' }}>›</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}