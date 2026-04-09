'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Profile page  /profile
// Hero + stats · Switch profile · Learning settings · Account settings
// Client component using mock data (swap Supabase fetch in when ready)
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { LearniiBuddy } from '@/components/mascot/LearniiBuddy'
import { MOCK_STUDENT } from '@/lib/mock/data'

const C = {
  white:  '#FFFFFF',
  page:   '#F7F8FA',
  blue:   '#4361ee',
  blueLt: '#eef4fd',
  green:  '#3B6D11',
  greenLt:'#eaf3de',
  amber:  '#BA7517',
  amberLt:'#faeeda',
  purple: '#534AB7',
  purpLt: '#eeedfe',
  red:    '#E24B4A',
  redLt:  '#fcebeb',
  text:   '#1a1a2e',
  muted:  '#888888',
  border: '#e8e8e8',
}
const F = "'Nunito', sans-serif"

const MODE_LABELS = {
  school:      'School only',
  exam:        'Exam only',
  school_exam: 'School + Exam',
}

const AVATAR_EMOJIS = ['👦','👧','🧒','👨‍🎓','👩‍🎓','🦁','🐯','🚀']

const CLASS_OPTIONS = ['JSS 1','JSS 2','JSS 3','SS 1','SS 2','SS 3']

// Profile data (normally from Supabase — using mock here)
const PROFILE = {
  firstName:    MOCK_STUDENT.display_name.split(' ')[0],
  lastName:     MOCK_STUDENT.display_name.split(' ')[1] || '',
  gender:       'male',
  avatarEmoji:  '👦',
  school:       "King's College Lagos",
  className:    'SS 2',
  currentMode:  MOCK_STUDENT.mode,
  examTarget:   'WAEC 2026',
  term:         '1st Term',
  stats: {
    totalXP:          MOCK_STUDENT.xp,
    streakDays:       MOCK_STUDENT.streak_days,
    topicsCompleted:  14,
    classRank:        3,
  },
}

// ─── SHARED ──────────────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return <div style={{ fontSize:'11px', fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'1px', fontFamily:F, marginBottom:'10px' }}>{children}</div>
}

function BottomSheet({ title, children, onClose }) {
  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:100 }} />
      <div style={{ position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:'480px', background:C.white, borderRadius:'20px 20px 0 0', zIndex:101, padding:'20px', animation:'sheetUp 0.25s ease both', maxHeight:'80dvh', overflowY:'auto' }}>
        <style>{`@keyframes sheetUp{from{transform:translateX(-50%) translateY(100%)}to{transform:translateX(-50%) translateY(0)}}`}</style>
        <div style={{ width:'40px', height:'4px', background:'#E8E8E8', borderRadius:'2px', margin:'0 auto 16px' }} />
        {title && <div style={{ fontSize:'17px', fontWeight:800, color:C.text, fontFamily:F, marginBottom:'18px', textAlign:'center' }}>{title}</div>}
        {children}
        <div style={{ height:'env(safe-area-inset-bottom, 0px)' }} />
      </div>
    </>
  )
}

function TextInput({ label, value, onChange }) {
  return (
    <div style={{ marginBottom:'14px' }}>
      <div style={{ fontSize:'12px', fontWeight:700, color:C.muted, fontFamily:F, marginBottom:'5px' }}>{label}</div>
      <input value={value} onChange={e => onChange(e.target.value)} style={{
        width:'100%', padding:'12px 14px', borderRadius:'10px',
        border:`1.5px solid ${C.border}`, fontFamily:F, fontSize:'15px',
        fontWeight:600, color:C.text, background:C.white, outline:'none',
        boxSizing:'border-box',
      }} />
    </div>
  )
}

// ─── EDIT PROFILE SHEET ───────────────────────────────────────────────────────

function EditProfileSheet({ profile, onClose, onSave }) {
  const [first,   setFirst]   = useState(profile.firstName)
  const [last,    setLast]    = useState(profile.lastName)
  const [gender,  setGender]  = useState(profile.gender)
  const [emoji,   setEmoji]   = useState(profile.avatarEmoji)
  const [school,  setSchool]  = useState(profile.school)
  const [cls,     setCls]     = useState(profile.className)
  const [clsDrop, setClsDrop] = useState(false)

  return (
    <BottomSheet title="Edit profile" onClose={onClose}>
      <TextInput label="First name"  value={first}  onChange={setFirst} />
      <TextInput label="Last name"   value={last}   onChange={setLast}  />

      {/* Gender */}
      <div style={{ marginBottom:'14px' }}>
        <div style={{ fontSize:'12px', fontWeight:700, color:C.muted, fontFamily:F, marginBottom:'6px' }}>Gender</div>
        <div style={{ display:'flex', gap:'8px' }}>
          {['male','female','unset'].map(g => (
            <button key={g} onClick={() => setGender(g)} style={{
              flex:1, padding:'10px 0', borderRadius:'10px',
              border: `1.5px solid ${gender === g ? C.blue : C.border}`,
              background: gender === g ? C.blueLt : C.white,
              color: gender === g ? C.blue : C.muted,
              fontFamily:F, fontWeight:800, fontSize:'12px', cursor:'pointer',
            }}>
              {g === 'male' ? 'Male' : g === 'female' ? 'Female' : 'Prefer not'}
            </button>
          ))}
        </div>
      </div>

      {/* Avatar emoji picker */}
      <div style={{ marginBottom:'14px' }}>
        <div style={{ fontSize:'12px', fontWeight:700, color:C.muted, fontFamily:F, marginBottom:'8px' }}>Avatar</div>
        <div style={{ display:'flex', gap:'10px', overflowX:'auto', scrollbarWidth:'none', paddingBottom:'4px' }}>
          {AVATAR_EMOJIS.map(e => (
            <button key={e} onClick={() => setEmoji(e)} style={{
              width:'48px', height:'48px', borderRadius:'50%', flexShrink:0,
              border: `2.5px solid ${emoji === e ? C.blue : 'transparent'}`,
              background: emoji === e ? C.blueLt : C.page,
              fontSize:'22px', display:'flex', alignItems:'center', justifyContent:'center',
              cursor:'pointer', transform: emoji === e ? 'scale(1.15)' : 'scale(1)', transition:'all 0.15s',
            }}>
              {e}
            </button>
          ))}
        </div>
      </div>

      <TextInput label="School" value={school} onChange={setSchool} />

      {/* Class dropdown */}
      <div style={{ marginBottom:'20px' }}>
        <div style={{ fontSize:'12px', fontWeight:700, color:C.muted, fontFamily:F, marginBottom:'5px' }}>Class</div>
        <button onClick={() => setClsDrop(o => !o)} style={{ width:'100%', padding:'12px 14px', borderRadius:'10px', border:`1.5px solid ${C.border}`, fontFamily:F, fontSize:'15px', fontWeight:600, color:C.text, background:C.white, display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer' }}>
          <span>{cls}</span>
          <span style={{ color:C.muted }}>⌄</span>
        </button>
        {clsDrop && (
          <div style={{ border:`1.5px solid ${C.border}`, borderRadius:'10px', marginTop:'4px', overflow:'hidden', background:C.white }}>
            {CLASS_OPTIONS.map(o => (
              <div key={o} onClick={() => { setCls(o); setClsDrop(false) }} style={{ padding:'11px 14px', fontSize:'14px', fontWeight:600, color:cls===o?C.blue:C.text, background:cls===o?C.blueLt:C.white, cursor:'pointer', borderBottom:`1px solid ${C.border}`, fontFamily:F }}>
                {o}
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={() => onSave({ firstName:first, lastName:last, gender, avatarEmoji:emoji, school, className:cls })} style={{
        width:'100%', padding:'15px', borderRadius:'12px', border:'none',
        background:C.blue, color:C.white, fontFamily:F, fontWeight:900, fontSize:'16px', cursor:'pointer',
      }}>
        Save changes
      </button>
    </BottomSheet>
  )
}

// ─── MODE SWITCHER SHEET ──────────────────────────────────────────────────────

function ModeSwitcherSheet({ current, onSave, onClose }) {
  const [pending, setPending] = useState(current)
  const opts = [
    { id:'school',      icon:'🏫', title:'School mode',   desc:'Follow your school syllabus' },
    { id:'exam',        icon:'🏆', title:'Exam mode',      desc:'Prepare for your exams'     },
    { id:'school_exam', icon:'🎯', title:'Both',           desc:'School syllabus + Exam prep' },
  ]
  return (
    <BottomSheet title="Switch learning mode" onClose={onClose}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px', marginBottom:'20px' }}>
        {opts.map(o => (
          <div key={o.id} onClick={() => setPending(o.id)} style={{
            padding:'14px 10px', borderRadius:'14px', cursor:'pointer', textAlign:'center',
            border: `${pending===o.id?'2px':'1.5px'} solid ${pending===o.id?C.blue:C.border}`,
            background: pending===o.id ? C.blueLt : C.white, position:'relative',
          }}>
            {pending===o.id && <div style={{ position:'absolute', top:'8px', right:'8px', width:'18px', height:'18px', borderRadius:'50%', background:C.blue, color:C.white, fontSize:'10px', fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:F }}>✓</div>}
            <div style={{ fontSize:'22px', marginBottom:'6px' }}>{o.icon}</div>
            <div style={{ fontSize:'12px', fontWeight:800, color:pending===o.id?C.blue:C.text, fontFamily:F }}>{o.title}</div>
            <div style={{ fontSize:'10px', fontWeight:600, color:C.muted, fontFamily:F, marginTop:'2px' }}>{o.desc}</div>
          </div>
        ))}
      </div>
      <button onClick={() => { onSave(pending); onClose() }} style={{ width:'100%', padding:'15px', borderRadius:'12px', border:'none', background:C.blue, color:C.white, fontFamily:F, fontWeight:900, fontSize:'16px', cursor:'pointer' }}>
        Confirm
      </button>
    </BottomSheet>
  )
}

// ─── LOGOUT CONFIRM SHEET ────────────────────────────────────────────────────

function LogoutSheet({ onClose }) {
  return (
    <BottomSheet onClose={onClose}>
      <div style={{ textAlign:'center', marginBottom:'20px' }}>
        <div style={{ fontSize:'36px', marginBottom:'10px' }}>🚪</div>
        <div style={{ fontSize:'18px', fontWeight:800, color:C.text, fontFamily:F, marginBottom:'6px' }}>Log out?</div>
        <div style={{ fontSize:'14px', fontWeight:600, color:C.muted, fontFamily:F }}>Are you sure you want to log out?</div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
        <form action="/api/auth/signout" method="POST" style={{ width:'100%' }}>
          <button type="submit" style={{ width:'100%', padding:'15px', borderRadius:'12px', border:'none', background:C.red, color:C.white, fontFamily:F, fontWeight:900, fontSize:'16px', cursor:'pointer' }}>
            Log out
          </button>
        </form>
        <button onClick={onClose} style={{ width:'100%', padding:'15px', borderRadius:'12px', border:`1.5px solid ${C.border}`, background:C.white, color:C.text, fontFamily:F, fontWeight:800, fontSize:'15px', cursor:'pointer' }}>
          Cancel
        </button>
      </div>
    </BottomSheet>
  )
}

// ─── SETTINGS ROW ────────────────────────────────────────────────────────────

function SettingsRow({ iconBg, icon, label, value, onClick, last = false, danger = false }) {
  return (
    <div onClick={onClick} style={{
      display:'flex', alignItems:'center', gap:'12px', padding:'13px 16px',
      borderBottom: last ? 'none' : `1px solid ${C.border}`,
      cursor:'pointer', background:C.white,
    }}>
      <div style={{ width:'34px', height:'34px', borderRadius:'9px', background:iconBg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', flexShrink:0 }}>
        {icon}
      </div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:'14px', fontWeight:700, color:danger ? C.red : C.text, fontFamily:F }}>{label}</div>
        {value && <div style={{ fontSize:'12px', fontWeight:600, color:C.muted, fontFamily:F, marginTop:'1px' }}>{value}</div>}
      </div>
      <span style={{ fontSize:'16px', color:danger ? C.red : C.muted }}>›</span>
    </div>
  )
}

// ─── TOGGLE ──────────────────────────────────────────────────────────────────

function Toggle({ on, onChange }) {
  return (
    <div onClick={() => onChange(!on)} style={{
      width:'44px', height:'26px', borderRadius:'13px', cursor:'pointer',
      background: on ? C.blue : '#CCCCCC',
      position:'relative', transition:'background 0.2s', flexShrink:0,
    }}>
      <div style={{
        width:'20px', height:'20px', borderRadius:'50%', background:C.white,
        position:'absolute', top:'3px', left: on ? '21px' : '3px',
        transition:'left 0.2s', boxShadow:'0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const [profile,   setProfile]   = useState(PROFILE)
  const [sheet,     setSheet]     = useState(null) // 'edit' | 'mode' | 'logout'
  const [notifOn,   setNotifOn]   = useState(true)

  const stats = [
    { label:'Total XP',     value: profile.stats.totalXP.toLocaleString() },
    { label:'Day streak',   value: profile.stats.streakDays                },
    { label:'Topics done',  value: profile.stats.topicsCompleted           },
    { label:'Class rank',   value: `#${profile.stats.classRank}`          },
  ]

  return (
    <div style={{ background:C.page, minHeight:'100vh', fontFamily:F, maxWidth:'480px', margin:'0 auto', paddingBottom:'100px' }}>

      {/* ── HEADER */}
      <div style={{ background:C.white, padding:'20px 20px 16px', borderBottom:`1px solid ${C.border}`, textAlign:'center' }}>
        <div style={{ fontSize:'22px', fontWeight:900, color:C.text, fontFamily:F }}>
          <span style={{ color:C.blue }}>My</span> profile
        </div>
      </div>

      {/* ── PROFILE HERO */}
      <div style={{ background:C.white, padding:'24px 20px 20px', borderBottom:`1px solid ${C.border}`, textAlign:'center' }}>
        {/* Avatar */}
        <div style={{ width:'72px', height:'72px', borderRadius:'50%', border:`3px solid ${C.blue}`, background:C.blueLt, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'36px', margin:'0 auto 12px' }}>
          {profile.avatarEmoji}
        </div>

        {/* Name */}
        <div style={{ fontSize:'18px', fontWeight:900, color:C.text, fontFamily:F }}>
          {profile.firstName} {profile.lastName}
        </div>
        <div style={{ fontSize:'13px', fontWeight:600, color:C.muted, fontFamily:F, marginTop:'3px', marginBottom:'16px' }}>
          {profile.className} · {profile.school}
        </div>

        {/* Stats row */}
        <div style={{ display:'flex', justifyContent:'center', gap:'0', marginBottom:'18px', background:C.page, borderRadius:'14px', overflow:'hidden' }}>
          {stats.map((s, i) => (
            <div key={s.label} style={{ flex:1, padding:'12px 8px', textAlign:'center', borderRight: i < stats.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ fontSize:'18px', fontWeight:900, color:C.text, fontFamily:F }}>{s.value}</div>
              <div style={{ fontSize:'10px', fontWeight:600, color:C.muted, fontFamily:F, marginTop:'2px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Edit button */}
        <button onClick={() => setSheet('edit')} style={{
          padding:'9px 22px', borderRadius:'20px', border:'none',
          background:C.page, color:C.blue, fontFamily:F, fontWeight:800, fontSize:'13px', cursor:'pointer',
          display:'inline-flex', alignItems:'center', gap:'6px',
        }}>
          ✏️ Edit profile
        </button>
      </div>

      {/* ── SWITCH PROFILE */}
      <div style={{ padding:'20px 20px 0' }}>
        <div style={{ border:'1.5px dashed #c0dd97', borderRadius:'14px', padding:'14px 16px', background:C.white, display:'flex', alignItems:'center', gap:'12px', cursor:'pointer' }}>
          {/* Stacked avatar previews */}
          <div style={{ display:'flex', marginRight:'4px' }}>
            {['👦','👧'].map((e, i) => (
              <div key={i} style={{ width:'30px', height:'30px', borderRadius:'50%', background:C.greenLt, border:`2px solid ${C.white}`, fontSize:'15px', display:'flex', alignItems:'center', justifyContent:'center', marginLeft: i > 0 ? '-8px' : '0' }}>
                {e}
              </div>
            ))}
          </div>
          <div style={{ flex:1, fontSize:'14px', fontWeight:700, color:C.green, fontFamily:F }}>Switch to another profile</div>
          <span style={{ fontSize:'16px', color:C.green }}>→</span>
        </div>
      </div>

      {/* ── LEARNING SETTINGS */}
      <div style={{ padding:'20px 20px 0' }}>
        <SectionLabel>Learning settings</SectionLabel>
        <div style={{ background:C.white, borderRadius:'14px', border:`0.5px solid ${C.border}`, overflow:'hidden' }}>
          <SettingsRow iconBg={C.blueLt}   icon="🎯" label="Current mode"  value={MODE_LABELS[profile.currentMode]} onClick={() => setSheet('mode')} />
          <SettingsRow iconBg={C.greenLt}  icon="📅" label="Term / Class"  value={`${profile.className} · ${profile.term}`} onClick={() => {}} />
          <SettingsRow iconBg={C.amberLt}  icon="🏆" label="Exam target"   value={profile.examTarget || 'Not set'}     onClick={() => {}} />
          <SettingsRow iconBg={C.purpLt}   icon="🏫" label="School"        value={profile.school}                      onClick={() => {}} last />
        </div>
      </div>

      {/* ── ACCOUNT SETTINGS */}
      <div style={{ padding:'20px 20px 0' }}>
        <SectionLabel>Account</SectionLabel>
        <div style={{ background:C.white, borderRadius:'14px', border:`0.5px solid ${C.border}`, overflow:'hidden' }}>
          {/* Notifications row with toggle */}
          <div style={{ display:'flex', alignItems:'center', gap:'12px', padding:'13px 16px', borderBottom:`1px solid ${C.border}` }}>
            <div style={{ width:'34px', height:'34px', borderRadius:'9px', background:'#FEF3E2', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', flexShrink:0 }}>🔔</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:'14px', fontWeight:700, color:C.text, fontFamily:F }}>Notifications</div>
              <div style={{ fontSize:'12px', fontWeight:600, color:C.muted, fontFamily:F, marginTop:'1px' }}>{notifOn ? 'On' : 'Off'}</div>
            </div>
            <Toggle on={notifOn} onChange={setNotifOn} />
          </div>
          <SettingsRow iconBg="#EEF0FF" icon="🔒" label="Change password" onClick={() => {}} />
          <SettingsRow iconBg={C.redLt} icon="🚪" label="Log out" danger onClick={() => setSheet('logout')} last />
        </div>
      </div>

      {/* ── SHEETS */}
      {sheet === 'edit' && (
        <EditProfileSheet
          profile={profile}
          onClose={() => setSheet(null)}
          onSave={updates => { setProfile(p => ({ ...p, ...updates })); setSheet(null) }}
        />
      )}
      {sheet === 'mode' && (
        <ModeSwitcherSheet
          current={profile.currentMode}
          onSave={m => setProfile(p => ({ ...p, currentMode: m }))}
          onClose={() => setSheet(null)}
        />
      )}
      {sheet === 'logout' && <LogoutSheet onClose={() => setSheet(null)} />}
    </div>
  )
}