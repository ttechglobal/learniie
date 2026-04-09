'use client'
import C  from './constants.jsx'

export function ProgressDots({ total, current }) {
  return (
    <div style={{ display:'flex', gap:'6px', alignItems:'center' }}>
      {Array.from({ length: total }).map((_, i) => {
        const isDone   = i < current
        const isActive = i === current
        return (
          <div
            key={i}
            style={{
              height:       '8px',
              width:        isActive ? '22px' : '8px',
              borderRadius: isActive ? '4px' : '50%',
              background:   isDone || isActive ? C.green : C.bgPill,
              opacity:      isDone ? 0.55 : 1,
              transition:   'all 0.3s ease',
            }}
          />
        )
      })}
    </div>
  )
}