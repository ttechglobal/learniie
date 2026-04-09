// Full-screen immersive lesson layout.
// position:fixed + zIndex:9999 guarantees bottom nav (zIndex:40) is hidden.
// safe-area-inset-bottom handles iPhone home indicator.
export default function LessonLayout({ children }) {
  return (
    <div style={{
      position:   'fixed',
      inset:      0,
      zIndex:     9999,
      background: '#FFFFFF',
      overflowY:  'hidden',   // LessonFlow manages its own internal scroll
      fontFamily: "'Nunito', sans-serif",
    }}>
      {children}
    </div>
  )
}