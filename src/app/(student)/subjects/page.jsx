'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const F = "'Nunito', sans-serif"

const C = {
  green:  '#6DC77A',
  blue:   '#2D3CE6',
  dark:   '#1A1A1A',
  cream:  '#FAF0DC',
  white:  '#FFFFFF',
  bgPill: '#F0F0F0',
  text:   '#1A1A1A',
  muted:  '#888888',
}

const JSS_SUBJECTS = [
  { id:'jss-maths',   name:'Mathematics',   emoji:'📐', bg:'#EBF9EE', available:true  },
  { id:'jss-science', name:'Basic Science',  emoji:'🔬', bg:'#EEF0FF', available:true  },
  { id:'jss-english', name:'English',        emoji:'📖', bg:'#FFF8E7', available:true  },
  { id:'jss-social',  name:'Social Studies', emoji:'🌍', bg:'#FFF0F0', available:true  },
  { id:'jss-ict',     name:'ICT',            emoji:'💻', bg:'#F5F0FF', available:true  },
  { id:'jss-civic',   name:'Civic Ed',       emoji:'⚖️',  bg:'#F0FFF4', available:true  },
]

const SS_SUBJECTS = [
  { id:'ss-maths',   name:'Mathematics',  emoji:'📐', bg:'#EBF9EE', available:true  },
  { id:'ss-physics', name:'Physics',       emoji:'⚡', bg:'#EEF0FF', available:true  },
  { id:'ss-chem',    name:'Chemistry',     emoji:'🧪', bg:'#FFF8E7', available:true  },
  { id:'ss-bio',     name:'Biology',       emoji:'🌿', bg:'#F0FFF4', available:true  },
  { id:'ss-english', name:'English',       emoji:'📖', bg:'#FFF5E0', available:true  },
  { id:'ss-prog',    name:'Programming',   emoji:'💻', bg:'#F5F0FF', available:true  },
  { id:'ss-econ',    name:'Economics',     emoji:'📈', bg:'#F9F9F9', available:false },
  { id:'ss-lit',     name:'Literature',    emoji:'📚', bg:'#F9F9F9', available:false },
]

export default function SubjectsPage() {
  const router   = useRouter()
  const [level,    setLevel]    = useState('JSS')
  const [selected, setSelected] = useState(new Set(['jss-maths']))
  const [saving,   setSaving]   = useState(false)

  const subjects = level === 'JSS' ? JSS_SUBJECTS : SS_SUBJECTS

  function toggle(id, available) {
    if (!available) return
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        if (next.size === 1) return prev   // keep at least one selected
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  async function handleSave() {
    setSaving(true)
    await new Promise(r => setTimeout(r, 700))
    router.back()
  }

  return (
    <div style={{ background:C.cream, minHeight:'100vh', fontFamily:F, maxWidth:'520px', margin:'0 auto', paddingBottom:'100px', overflowY:'auto' }}>

      {/* Header */}
      <div style={{ padding:'22px 22px 0', display:'flex', alignItems:'center', gap:'14px' }}>
        <button onClick={() => router.back()} style={{ width:'38px', height:'38px', borderRadius:'12px', background:C.bgPill, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', fontFamily:F, flexShrink:0, transition:'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background='#E0E0E0'}
          onMouseLeave={e => e.currentTarget.style.background=C.bgPill}
        >←</button>
        <div style={{ fontSize:'18px', fontWeight:900, color:C.text, fontFamily:F }}>My Subjects</div>
      </div>

      {/* Description */}
      <div style={{ padding:'10px 22px 18px', fontSize:'13px', fontWeight:600, color:C.muted, fontFamily:F, lineHeight:1.55 }}>
        Tap to select the subjects you want to study. You can change these anytime.
      </div>

      {/* Level tabs */}
      <div style={{ padding:'0 22px 20px', display:'flex', gap:'8px' }}>
        {['JSS', 'SS'].map(lv => (
          <button key={lv}
            onClick={() => { setLevel(lv); setSelected(new Set([lv === 'JSS' ? 'jss-maths' : 'ss-maths'])) }}
            style={{ padding:'8px 22px', borderRadius:'50px', border:'none', background:level === lv ? C.blue : C.bgPill, color:level === lv ? C.white : '#666', fontFamily:F, fontWeight:800, fontSize:'12px', cursor:'pointer', transition:'all 0.2s' }}
          >
            {lv === 'JSS' ? 'JSS 1–3' : 'SS 1–3'}
          </button>
        ))}
      </div>

      {/* Subject grid */}
      <div style={{ padding:'0 22px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
        {subjects.map(s => {
          const isSel    = selected.has(s.id)
          const isLocked = !s.available
          return (
            <div key={s.id} onClick={() => toggle(s.id, s.available)} style={{ background:s.bg, borderRadius:'20px', padding:'16px', border:isSel ? `2.5px solid ${C.green}` : '2.5px solid transparent', cursor:isLocked ? 'not-allowed' : 'pointer', opacity:isLocked ? 0.4 : 1, position:'relative', transition:'border 0.15s, opacity 0.15s' }}>
              {/* Checkmark or lock */}
              <div style={{ position:'absolute', top:'12px', right:'12px', width:'22px', height:'22px', borderRadius:'50%', background:isSel && !isLocked ? C.green : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', fontSize:isLocked ? '14px' : '11px', fontWeight:900, color:C.white, transition:'background 0.15s' }}>
                {isLocked ? '🔒' : isSel ? '✓' : null}
              </div>
              <div style={{ fontSize:'30px', marginBottom:'8px', lineHeight:1 }}>{s.emoji}</div>
              <div style={{ fontSize:'15px', fontWeight:900, color:C.text, fontFamily:F, marginBottom:'4px', lineHeight:1.2 }}>{s.name}</div>
              <div style={{ fontSize:'11px', fontWeight:700, color:C.muted, fontFamily:F }}>
                {s.available ? 'Tap to select' : 'Not available'}
              </div>
            </div>
          )
        })}
      </div>

      {/* Save button */}
      <div style={{ padding:'24px 22px 0' }}>
        <button onClick={handleSave} disabled={saving} style={{ width:'100%', padding:'16px', borderRadius:'16px', border:'none', background:saving ? C.dark : C.green, color:C.white, fontFamily:F, fontWeight:900, fontSize:'16px', cursor:saving ? 'not-allowed' : 'pointer', transition:'background 0.25s' }}>
          {saving ? '✓ Saved!' : 'Save My Subjects ✓'}
        </button>
      </div>
    </div>
  )
}