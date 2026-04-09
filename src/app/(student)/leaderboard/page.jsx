'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Leaderboard page  /leaderboard
// Period tabs · Rank hero card · Class ranking list · Mascot nudge
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { LearniiBuddy } from '@/components/mascot/LearniiBuddy'
import { MOCK_LEADERBOARD, MOCK_STUDENT } from '@/lib/mock/data'

const C = {
  white:  '#FFFFFF',
  page:   '#F7F8FA',
  blue:   '#4361ee',
  blueLt: '#eef4fd',
  green:  '#3B6D11',
  greenLt:'#eaf3de',
  amber:  '#BA7517',
  amberLt:'#faeeda',
  text:   '#1a1a2e',
  muted:  '#888888',
  border: '#e8e8e8',
}
const F = "'Nunito', sans-serif"

// Deterministic avatar colour from userId
const AVATAR_PALETTE = [
  { bg:'#faeeda', fg:'#633806' },
  { bg:'#eeedfe', fg:'#3C3489' },
  { bg:'#e1f5ee', fg:'#085041' },
  { bg:'#fbeaf0', fg:'#72243E' },
  { bg:'#f1efe8', fg:'#444441' },
  { bg:'#eef4fd', fg:'#0C447C' },
]
function avatarColor(userId) {
  let h = 0
  for (let i = 0; i < userId.length; i++) h = (h * 31 + userId.charCodeAt(i)) % AVATAR_PALETTE.length
  return AVATAR_PALETTE[h]
}
function initials(n = '') { return n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) }

// Build leaderboard entries from mock data
const MY_ID = MOCK_STUDENT.id
const ENTRIES = MOCK_LEADERBOARD.map((e, i) => ({
  rank:          i + 1,
  userId:        e.student_id,
  firstName:     e.display_name.split(' ')[0],
  lastInitial:   e.display_name.split(' ')[1]?.[0] || '',
  initials:      initials(e.display_name),
  xp:            e.score,
  streakDays:    e.streak,
  isCurrentUser: e.student_id === MY_ID,
}))

const MY_ENTRY = ENTRIES.find(e => e.isCurrentUser)
const MY_RANK  = MY_ENTRY?.rank ?? 0
const TOTAL    = ENTRIES.length

// Nudge message logic
function getNudge(rank) {
  if (rank === 1) return { expr:'celebrating', text:"You're at the top! Keep your streak going to stay there. 👑" }
  return { expr:'encouraging', text:`Holding steady at #${rank}. One more practice session could push you up!` }
}

// Rank medal colours
function rankStyle(rank) {
  if (rank === 1) return { color:'#B8860B', weight:800 }
  if (rank === 2) return { color:'#808080', weight:800 }
  if (rank === 3) return { color:'#CD7F32', weight:800 }
  return { color:C.muted, weight:600 }
}

// Medal labels
const MEDALS = ['🥇', '🥈', '🥉']

// ─── PERIOD TABS ─────────────────────────────────────────────────────────────

function PeriodTabs({ active, onChange }) {
  const tabs = [
    { id:'week',    label:'This week'  },
    { id:'month',   label:'This month' },
    { id:'alltime', label:'All time'   },
  ]
  return (
    <div style={{ display:'flex', gap:'0', borderBottom:`1px solid ${C.border}`, padding:'0 20px' }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          flex:1, padding:'12px 0', border:'none', background:'transparent',
          fontFamily:F, fontWeight:700, fontSize:'13px', cursor:'pointer',
          color: active === t.id ? C.blue : C.muted,
          borderBottom: active === t.id ? `2px solid ${C.blue}` : '2px solid transparent',
          transition:'all 0.15s',
        }}>
          {t.label}
        </button>
      ))}
    </div>
  )
}

// ─── RANK HERO ───────────────────────────────────────────────────────────────

function RankHero({ rank, total, period }) {
  const xpLabel = period === 'week' ? 'XP this week' : period === 'month' ? 'XP this month' : 'Total XP'
  const nextRank = rank > 1 ? rank - 1 : null
  const myXP = MY_ENTRY?.xp ?? 0
  const nextXP = nextRank ? (ENTRIES.find(e => e.rank === nextRank)?.xp ?? 0) - myXP : 0

  return (
    <div style={{ margin:'16px 20px', background:C.white, borderRadius:'14px', border:`0.5px solid ${C.border}`, padding:'20px', textAlign:'center' }}>
      <div style={{ fontSize:'11px', fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'1.2px', fontFamily:F, marginBottom:'8px' }}>Your Ranking</div>
      <div style={{ fontSize:'40px', fontWeight:900, color:C.blue, fontFamily:F, lineHeight:1 }}>#{rank}</div>
      <div style={{ fontSize:'13px', fontWeight:600, color:C.muted, fontFamily:F, marginTop:'5px', marginBottom:'12px' }}>
        out of {total} students · JSS 3A
      </div>
      <div style={{ fontSize:'15px', fontWeight:800, color:C.text, fontFamily:F, marginBottom:'14px' }}>
        {myXP.toLocaleString()} {xpLabel}
      </div>
      <div style={{ height:'1px', background:C.border, marginBottom:'14px' }} />
      {rank === 1 ? (
        <div style={{ fontSize:'14px', fontWeight:700, color:C.amber, fontFamily:F }}>
          👑 You&apos;re top of the class!
        </div>
      ) : (
        <div style={{ fontSize:'13px', fontWeight:700, color:C.muted, fontFamily:F }}>
          You need{' '}
          <span style={{ color:C.blue, fontWeight:900 }}>+{Math.max(0, nextXP)} XP</span>
          {' '}to reach #{nextRank}
        </div>
      )}
    </div>
  )
}

// ─── LEADERBOARD ROW ─────────────────────────────────────────────────────────

function LeaderboardRow({ entry }) {
  const av   = avatarColor(entry.userId)
  const rs   = rankStyle(entry.rank)
  const isMe = entry.isCurrentUser

  return (
    <div style={{
      display:'flex', alignItems:'center', gap:'12px', padding:'12px 16px',
      background: isMe ? C.blueLt : C.white,
      borderBottom:`1px solid ${C.border}`,
      minHeight:'52px',
    }}>
      {/* Rank */}
      <div style={{ width:'22px', textAlign:'center', fontSize:'13px', fontWeight:rs.weight, color:rs.color, fontFamily:F, flexShrink:0 }}>
        {entry.rank <= 3 ? MEDALS[entry.rank - 1] : entry.rank}
      </div>

      {/* Avatar */}
      <div style={{ width:'34px', height:'34px', borderRadius:'50%', background:av.bg, color:av.fg, fontSize:'12px', fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontFamily:F }}>
        {entry.initials}
      </div>

      {/* Name + streak */}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:'14px', fontWeight:700, color:C.text, fontFamily:F, display:'flex', alignItems:'center', gap:'6px' }}>
          <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {entry.firstName} {entry.lastInitial}.
          </span>
          {entry.rank <= 3 && <span style={{ fontSize:'11px' }}>{MEDALS[entry.rank - 1]}</span>}
          {isMe && (
            <span style={{ fontSize:'10px', fontWeight:800, color:C.blue, background:C.blueLt, padding:'2px 8px', borderRadius:'20px', flexShrink:0 }}>You</span>
          )}
        </div>
        {entry.streakDays > 0 && (
          <div style={{ fontSize:'11px', fontWeight:600, color:C.muted, fontFamily:F, marginTop:'1px' }}>
            {entry.streakDays} day streak 🔥
          </div>
        )}
      </div>

      {/* XP */}
      <div style={{ fontSize:'13px', fontWeight:800, color:isMe ? C.blue : C.text, fontFamily:F, flexShrink:0 }}>
        {entry.xp.toLocaleString()} XP
      </div>
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function LeaderboardPage() {
  const [period,   setPeriod]   = useState('week')
  const [expanded, setExpanded] = useState(false)

  const nudge     = getNudge(MY_RANK)
  const visible5  = ENTRIES.slice(0, 5)
  const remaining = ENTRIES.slice(5)

  return (
    <div style={{ background:C.page, minHeight:'100vh', fontFamily:F, maxWidth:'480px', margin:'0 auto', paddingBottom:'100px' }}>

      {/* ── HEADER */}
      <div style={{ background:C.white, padding:'20px 20px 0', borderBottom:`1px solid ${C.border}` }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0' }}>
          <div style={{ fontSize:'24px', fontWeight:900, color:C.text, fontFamily:F }}>
            🏆 <span style={{ color:C.blue }}>Leader</span>board
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'5px', background:C.blueLt, borderRadius:'50px', padding:'6px 12px' }}>
            <span style={{ fontSize:'13px' }}>⭐</span>
            <span style={{ fontSize:'13px', fontWeight:900, color:C.blue, fontFamily:F }}>{MOCK_STUDENT.xp.toLocaleString()}</span>
          </div>
        </div>

        {/* Period tabs */}
        <PeriodTabs active={period} onChange={setPeriod} />
      </div>

      {/* ── RANK HERO */}
      <RankHero rank={MY_RANK} total={TOTAL} period={period} />

      {/* ── RANKING LIST */}
      <div style={{ margin:'0 20px' }}>
        <div style={{ fontSize:'11px', fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'1px', fontFamily:F, marginBottom:'10px' }}>
          Class ranking · JSS 3A
        </div>
        <div style={{ background:C.white, borderRadius:'14px', border:`0.5px solid ${C.border}`, overflow:'hidden' }}>
          {visible5.map(e => <LeaderboardRow key={e.userId} entry={e} />)}

          {!expanded && remaining.length > 0 && (
            <button onClick={() => setExpanded(true)} style={{
              width:'100%', padding:'14px 16px', border:'none', background:C.page,
              fontFamily:F, fontWeight:700, fontSize:'13px', color:C.muted,
              cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px',
            }}>
              {remaining.length} more students ↓
            </button>
          )}

          {expanded && remaining.map(e => <LeaderboardRow key={e.userId} entry={e} />)}
        </div>
      </div>

      {/* ── MASCOT NUDGE */}
      <div style={{ margin:'20px 20px 0', background:C.greenLt, border:'1px solid #97c459', borderRadius:'14px', padding:'14px', display:'flex', gap:'12px', alignItems:'center' }}>
        <div style={{ flexShrink:0 }}>
          <LearniiBuddy size={48} expression={nudge.expr} />
        </div>
        <div style={{ fontSize:'14px', fontWeight:700, color:'#2A4A0A', fontFamily:F, lineHeight:1.5 }}>
          {nudge.text}
        </div>
      </div>
    </div>
  )
}