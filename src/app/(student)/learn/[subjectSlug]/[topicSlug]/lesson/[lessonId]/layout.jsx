// Lesson layout — Fix 1 Layer 2
//
// Full-screen immersive shell. position:fixed + zIndex:9999 guarantees:
//   - Bottom nav (zIndex:40) is completely covered
//   - No chrome from any parent layout leaks in
//
// CSS safety net lives here too (body[data-mode=lesson] .bottom-nav).
// Layer 3 (body attribute) is set by LessonEngine on mount.

export default function LessonLayout({ children }) {
  return (
    <>
      <style>{`
        /* Fix 1 CSS safety net — belt-and-braces: never show nav inside lesson */
        body[data-mode="lesson"] nav,
        body[data-mode="lesson"] .bottom-nav,
        body[data-mode="lesson"] [data-nav="bottom"] {
          display: none !important;
        }
      `}</style>
      <div style={{
        position:   'fixed',
        inset:      0,
        zIndex:     9999,
        background: '#FFFFFF',
        overflowY:  'hidden',
        fontFamily: "'Nunito', sans-serif",
      }}>
        {children}
      </div>
    </>
  )
}