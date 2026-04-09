'use client'
import C  from './constants.jsx'
import { ProgressDots } from './ProgressDots'

export function TopBar({ onBack, total, current }) {
  return (
    <div style={{
      display:'flex', justifyContent:'space-between',
      alignItems:'center', padding:'20px 24px 8px',
    }}>
      <button
        onClick={onBack}
        style={{
          width:'40px', height:'40px', borderRadius:'12px', border:'none',
          background:C.bgPill, fontSize:'18px', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center',
          color:C.text, fontFamily:'inherit',
        }}
        onMouseEnter={e => e.currentTarget.style.background='#e0e0e0'}
        onMouseLeave={e => e.currentTarget.style.background=C.bgPill}
      >
        ←
      </button>
      <ProgressDots total={total} current={current} />
      <button style={{
        width:'40px', height:'40px', borderRadius:'12px', border:'none',
        background:C.bgPill, fontSize:'18px', cursor:'pointer',
        display:'flex', alignItems:'center', justifyContent:'center',
        color:C.text, fontFamily:'inherit',
      }}>⋮</button>
    </div>
  )
}