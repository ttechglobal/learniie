// Admin layout — shared sidebar navigation for all admin pages

import Link from 'next/link'

const NAV_ITEMS = [
  { href: '/admin/curriculum',        label: 'Curriculum Upload',   icon: '📄' },
  { href: '/admin/lessons/generate',  label: 'Generate Lessons',    icon: '✨' },
  { href: '/admin/lessons/status',    label: 'Generation Status',   icon: '📊' },
  { href: '/admin/content',           label: 'Published Lessons',   icon: '📚' },
  { href: '/admin/schools',           label: 'Schools',             icon: '🏫' },
]

export default function AdminLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Nunito', sans-serif" }}>
      {/* Sidebar */}
      <aside style={{ width: '220px', flexShrink: 0, background: '#1A1A2E', minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '24px 0' }}>
        <div style={{ padding: '0 20px 28px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '18px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.3px' }}>
            learniie <span style={{ color: '#6DC77A' }}>admin</span>
          </div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginTop: '3px' }}>
            Content Management
          </div>
        </div>

        <nav style={{ padding: '16px 12px', flex: 1 }}>
          {NAV_ITEMS.map(item => (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', marginBottom: '4px', color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
              >
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                {item.label}
              </div>
            </Link>
          ))}
        </nav>

        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Link href="/home" style={{ textDecoration: 'none', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            ← Back to App
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, background: '#F7F8FA', minHeight: '100vh', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  )
}