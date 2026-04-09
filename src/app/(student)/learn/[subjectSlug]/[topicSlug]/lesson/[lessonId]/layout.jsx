// Full-screen immersive lesson layout.
// Covers entire viewport. No sidebar, no bottom nav, no distractions.
export default function LessonLayout({ children }) {
  return (
    <div style={{
      position:   'fixed',
      inset:      0,
      zIndex:     100,
      background: '#FFFFFF',
      overflowY:  'auto',
      fontFamily: "'Nunito', sans-serif",
    }}>
      {children}
    </div>
  )
}