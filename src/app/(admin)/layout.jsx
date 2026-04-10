'use client'
// ─────────────────────────────────────────────────────────────────────────────
// Admin Shell Layout — Inter font, dark navy sidebar, professional SaaS style
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Design tokens — admin panel only
const A = {
  bg:       '#F8F9FA',
  sidebar:  '#0F172A',
  sideText: '#94A3B8',
  sideActive:'#F1F5F9',
  card:     '#FFFFFF',
  border:   '#E2E8F0',
  accent:   '#2D3CE6',
  success:  '#16A34A',
  warning:  '#D97706',
  danger:   '#DC2626',
  muted:    '#64748B',
  text:     '#0F172A',
}
const F = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"

const NAV = [
  { href: '/admin/dashboard',       icon: '⊞',  label: 'Dashboard'   },
  { href: '/admin/curriculum',      icon: '📄',  label: 'Curriculum'  },
  { href: '/admin/lessons',         icon: '📚',  label: 'Lessons'     },
  { href: '/admin/lessons/generate',icon: '✨',  label: 'Generate'    },
  { href: '/admin/batch',           icon: '⚡',  label: 'Batch Jobs'  },
]

export default function AdminLayout({ children }) {
  const path = usePathname()

  // Breadcrumb from path segments
  const segments = path.replace('/admin/', '').split('/').filter(Boolean)
  const breadcrumb = ['Admin', ...segments.map(s => s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' '))]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .admin-root * { font-family: '${F}' !important; box-sizing: border-box; }
        .admin-nav-item { transition: background 0.12s, color 0.12s; }
        .admin-nav-item:hover { background: rgba(255,255,255,0.08) !important; color: #F1F5F9 !important; }
      `}</style>
      <div className="admin-root" style={{ display:'flex', minHeight:'100vh', background: A.bg, fontFamily: F }}>

        {/* ── Sidebar ────────────────────────────────────────────────── */}
        <aside style={{ width:'240px', flexShrink:0, background: A.sidebar, minHeight:'100vh', display:'flex', flexDirection:'column', position:'fixed', top:0, left:0, bottom:0, zIndex:50 }}>
          {/* Logo */}
          <div style={{ padding:'20px 20px 18px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
              <div style={{ width:'32px', height:'32px', borderRadius:'8px', background: A.accent, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:800, color:'#fff', flexShrink:0 }}>L</div>
              <div>
                <div style={{ fontSize:'15px', fontWeight:700, color:'#F8FAFC', letterSpacing:'-0.2px' }}>Learniie</div>
                <div style={{ fontSize:'10px', fontWeight:600, color: A.sideText, textTransform:'uppercase', letterSpacing:'0.8px', marginTop:'1px' }}>Admin Panel</div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex:1, padding:'12px 10px', overflowY:'auto' }}>
            <div style={{ fontSize:'10px', fontWeight:600, color:'rgba(148,163,184,0.5)', textTransform:'uppercase', letterSpacing:'1px', padding:'0 10px', marginBottom:'6px', marginTop:'4px' }}>Navigation</div>
            {NAV.map(item => {
              const active = path === item.href || (item.href !== '/admin/dashboard' && path.startsWith(item.href))
              return (
                <Link key={item.href} href={item.href} style={{ textDecoration:'none' }}>
                  <div className="admin-nav-item" style={{
                    display:'flex', alignItems:'center', gap:'10px', padding:'8px 10px',
                    borderRadius:'6px', marginBottom:'2px',
                    background: active ? 'rgba(45,60,230,0.25)' : 'transparent',
                    color: active ? '#F1F5F9' : A.sideText,
                    fontSize:'13px', fontWeight: active ? 600 : 500,
                  }}>
                    <span style={{ fontSize:'14px', lineHeight:1 }}>{item.icon}</span>
                    {item.label}
                    {active && <div style={{ marginLeft:'auto', width:'4px', height:'4px', borderRadius:'50%', background: A.accent }} />}
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* Bottom */}
          <div style={{ padding:'14px 16px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
            <Link href="/home" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:'8px', color:'rgba(148,163,184,0.6)', fontSize:'12px', fontWeight:500, transition:'color 0.12s' }}>
              <span>←</span> Back to App
            </Link>
          </div>
        </aside>

        {/* ── Right side ─────────────────────────────────────────────── */}
        <div style={{ flex:1, marginLeft:'240px', display:'flex', flexDirection:'column', minHeight:'100vh' }}>

          {/* Top bar */}
          <header style={{ height:'56px', background: A.card, borderBottom:`1px solid ${A.border}`, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', position:'sticky', top:0, zIndex:40 }}>
            <div style={{ fontSize:'13px', color: A.muted, fontWeight:500 }}>
              {breadcrumb.map((seg, i) => (
                <span key={i}>
                  {i > 0 && <span style={{ margin:'0 6px', color: A.border }}>›</span>}
                  <span style={{ color: i === breadcrumb.length - 1 ? A.text : A.muted, fontWeight: i === breadcrumb.length - 1 ? 600 : 400 }}>{seg}</span>
                </span>
              ))}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
              <button style={{ width:'32px', height:'32px', borderRadius:'6px', border:`1px solid ${A.border}`, background:A.card, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px' }}>🔔</button>
              <div style={{ width:'32px', height:'32px', borderRadius:'50%', background: A.accent, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:700 }}>A</div>
            </div>
          </header>

          {/* Page content */}
          <main style={{ flex:1, padding:'24px', maxWidth:'1200px', width:'100%', margin:'0 auto', boxSizing:'border-box' }}>
            {children}
          </main>
        </div>
      </div>
    </>
  )
}