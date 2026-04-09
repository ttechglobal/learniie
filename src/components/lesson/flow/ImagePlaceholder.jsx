'use client'

export function ImagePlaceholder({ height=220, label='Image', style={} }) {
  return (
    <div style={{
      borderRadius:'28px', height:`${height}px`,
      background:'linear-gradient(135deg, #E8F5FF 0%, #D0EAFF 100%)',
      display:'flex', alignItems:'center', justifyContent:'center',
      flexDirection:'column', gap:'10px', color:'#90B8D4',
      fontSize:'14px', fontWeight:700, position:'relative', overflow:'hidden', ...style,
    }}>
      <div style={{ position:'absolute', width:'160px', height:'160px', borderRadius:'50%',
        background:'rgba(109,199,122,0.12)', top:'-40px', right:'-40px' }} />
      <div style={{ position:'absolute', width:'100px', height:'100px', borderRadius:'50%',
        background:'rgba(45,60,230,0.07)', bottom:'-20px', left:'20px' }} />
      <svg width="52" height="52" fill="none" viewBox="0 0 24 24" style={{ position:'relative', zIndex:1 }}>
        <rect x="3" y="5" width="18" height="14" rx="3" stroke="#90B8D4" strokeWidth="1.5"/>
        <circle cx="9" cy="10" r="2" stroke="#90B8D4" strokeWidth="1.5"/>
        <path d="M3 16l4-3 3 2.5 4-5 5 5.5" stroke="#90B8D4" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
      <span style={{ position:'relative', zIndex:1, fontFamily:'Nunito, sans-serif' }}>{label}</span>
    </div>
  )
}

export function ConceptImagePlaceholder({ height=160 }) {
  return (
    <div style={{
      margin:'0 24px 16px', height:`${height}px`, borderRadius:'20px',
      background:'linear-gradient(135deg, #F0FFF4, #DCFCE7)',
      display:'flex', alignItems:'center', justifyContent:'center',
      flexDirection:'column', gap:'8px', color:'#52B362',
      fontSize:'13px', fontWeight:700, border:'2px dashed #A8E6B5',
      fontFamily:'Nunito, sans-serif',
    }}>
      <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
        <rect x="3" y="5" width="18" height="14" rx="3" stroke="#52B362" strokeWidth="1.5"/>
        <circle cx="9" cy="10" r="2" stroke="#52B362" strokeWidth="1.5"/>
        <path d="M3 16l4-3 3 2.5 4-5 5 5.5" stroke="#52B362" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
      Concept Image
    </div>
  )
}

export function MascotPlaceholder({ size=120 }) {
  return (
    <div style={{
      width:`${size}px`, height:`${size}px`, borderRadius:'28px',
      background:'linear-gradient(135deg, #FFE5B4, #FFDDA0)',
      display:'flex', alignItems:'center', justifyContent:'center',
      flexDirection:'column', gap:'6px', fontFamily:'Nunito, sans-serif',
      fontSize:'11px', fontWeight:800, color:'#C8943A',
      boxShadow:'0 8px 24px rgba(200,148,58,0.2)',
      border:'3px solid rgba(255,255,255,0.8)', textAlign:'center', lineHeight:1.3,
    }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#C8943A" strokeWidth="1.5"/>
        <circle cx="9.5" cy="10.5" r="1.2" fill="#C8943A"/>
        <circle cx="14.5" cy="10.5" r="1.2" fill="#C8943A"/>
        <path d="M8.5 15c1 1.2 6 1.2 7 0" stroke="#C8943A" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      Mascot Image Here
    </div>
  )
}