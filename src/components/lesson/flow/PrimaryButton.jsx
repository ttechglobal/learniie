'use client'
import C  from './constants.jsx'

export function PrimaryButton({ children, onClick, color, disabled=false, style={} }) {
  const bg = disabled ? '#ccc' : (color || C.green)
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        margin:'0 24px 28px', background:bg, color:'white',
        fontFamily:'Nunito, sans-serif', fontSize:'17px', fontWeight:900,
        border:'none', borderRadius:'18px', padding:'18px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        width:'calc(100% - 48px)',
        transition:'background 0.2s, transform 0.1s, opacity 0.4s',
        letterSpacing:'0.3px', opacity: disabled ? 0.4 : 1,
        ...style,
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = color ? color : C.greenDark }}
      onMouseLeave={e => { e.currentTarget.style.background = bg }}
      onMouseDown={e => { if (!disabled) e.currentTarget.style.transform='scale(0.98)' }}
      onMouseUp={e => { e.currentTarget.style.transform='scale(1)' }}
    >
      {children}
    </button>
  )
}