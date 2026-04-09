'use client'
// Learniiebuddy — flat 2D SVG mascot
// Young Nigerian boy, dark skin, yellow shirt, dark blue shorts
const EXPRESSIONS = {
  excited: {
    eyeL: 'M 22 30 Q 26 25 30 30', eyeR: 'M 42 30 Q 46 25 50 30',
    mouth: 'M 28 44 Q 36 52 44 44',
    brows: 'M 21 24 Q 26 20 30 24 M 42 24 Q 46 20 50 24', extra: null,
  },
  thinking: {
    eyeL: 'M 23 30 L 29 30', eyeR: 'M 43 30 L 49 30',
    mouth: 'M 30 46 Q 36 44 42 46',
    brows: 'M 21 26 Q 26 22 30 26 M 42 24 Q 47 22 50 26', extra: null,
  },
  proud: {
    eyeL: 'M 22 31 Q 26 26 30 31', eyeR: 'M 42 31 Q 46 26 50 31',
    mouth: 'M 27 43 Q 36 50 45 43',
    brows: 'M 21 24 Q 26 21 30 24 M 42 24 Q 46 21 50 24', extra: null,
  },
  encouraging: {
    eyeL: 'M 23 29 Q 26 26 30 29', eyeR: 'M 43 29 Q 46 26 50 29',
    mouth: 'M 29 45 Q 36 50 43 45',
    brows: 'M 22 25 Q 26 22 30 25 M 42 25 Q 46 22 50 25', extra: null,
  },
  question: {
    eyeL: 'M 23 30 Q 26 27 30 30', eyeR: 'M 43 30 Q 46 27 50 30',
    mouth: 'M 30 46 Q 36 42 42 46',
    brows: 'M 21 27 Q 24 22 30 25 M 42 25 Q 48 22 51 27', extra: null,
  },
  celebrating: {
    eyeL: 'M 22 30 Q 26 24 30 30', eyeR: 'M 42 30 Q 46 24 50 30',
    mouth: 'M 26 42 Q 36 54 46 42',
    brows: 'M 20 22 Q 26 17 30 22 M 42 22 Q 46 17 52 22', extra: null,
  },
}
 
export function LearniiBuddy({ size=120, expression='excited', className='' }) {
  const expr = EXPRESSIONS[expression] || EXPRESSIONS.excited
  return (
    <svg width={size} height={size*1.4} viewBox="0 0 72 100"
      fill="none" xmlns="http://www.w3.org/2000/svg" className={className}
      aria-label={`Learniiebuddy — ${expression}`}>
      {/* Shadow */}
      <ellipse cx="36" cy="97" rx="16" ry="3" fill="#1A1209" opacity="0.08"/>
      {/* Legs */}
      <rect x="24" y="72" width="9" height="20" rx="4" fill="#1A2A4A"/>
      <rect x="39" y="72" width="9" height="20" rx="4" fill="#1A2A4A"/>
      {/* Shoes */}
      <ellipse cx="28" cy="92" rx="7" ry="4" fill="#2D2416"/>
      <ellipse cx="43" cy="92" rx="7" ry="4" fill="#2D2416"/>
      {/* Shorts */}
      <rect x="20" y="64" width="32" height="16" rx="6" fill="#1A2A4A"/>
      {/* Shirt — bright yellow */}
      <rect x="18" y="44" width="36" height="26" rx="8" fill="#F5C842"/>
      <path d="M 30 44 Q 36 48 42 44" stroke="#E8B520" strokeWidth="1.5" fill="none"/>
      <rect x="22" y="50" width="8" height="7" rx="2" fill="none" stroke="#E8B520" strokeWidth="1"/>
      {/* Arms */}
      <rect x="7" y="46" width="13" height="9" rx="5" fill="#3D2B1F" transform="rotate(20 7 46)"/>
      <rect x="52" y="46" width="13" height="9" rx="5" fill="#3D2B1F" transform="rotate(-20 65 46)"/>
      <ellipse cx="12" cy="55" rx="5" ry="5" fill="#3D2B1F"/>
      <ellipse cx="60" cy="55" rx="5" ry="5" fill="#3D2B1F"/>
      {/* Neck */}
      <rect x="31" y="36" width="10" height="12" rx="5" fill="#3D2B1F"/>
      {/* Head */}
      <ellipse cx="36" cy="24" rx="18" ry="18" fill="#3D2B1F"/>
      <ellipse cx="18" cy="25" rx="3.5" ry="4" fill="#3D2B1F"/>
      <ellipse cx="54" cy="25" rx="3.5" ry="4" fill="#3D2B1F"/>
      {/* Hair */}
      <ellipse cx="36" cy="9" rx="15" ry="8" fill="#1A1209"/>
      <ellipse cx="24" cy="12" rx="7" ry="6" fill="#1A1209"/>
      <ellipse cx="48" cy="12" rx="7" ry="6" fill="#1A1209"/>
      {/* Eyes */}
      <ellipse cx="26" cy="30" rx="5" ry="5.5" fill="white"/>
      <ellipse cx="46" cy="30" rx="5" ry="5.5" fill="white"/>
      <ellipse cx="27" cy="31" rx="3" ry="3.5" fill="#1A1209"/>
      <ellipse cx="47" cy="31" rx="3" ry="3.5" fill="#1A1209"/>
      <ellipse cx="28" cy="29" rx="1.2" ry="1.2" fill="white"/>
      <ellipse cx="48" cy="29" rx="1.2" ry="1.2" fill="white"/>
      {/* Expression */}
      <path d={expr.eyeL} stroke="#1A1209" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d={expr.eyeR} stroke="#1A1209" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d={expr.brows} stroke="#1A1209" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d={expr.mouth} stroke="#1A1209" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* Nose */}
      <ellipse cx="36" cy="37" rx="2.5" ry="1.5" fill="#2D1F14"/>
    </svg>
  )
}
