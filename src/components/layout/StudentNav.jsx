'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const F = "'Nunito', sans-serif"

const NAV = [
  { href:'/home',        emoji:'🏠', label:'Home'      },
  { href:'/learn',       emoji:'📖', label:'Learn'     },
  { href:'/practice',    emoji:'✏️',  label:'Practise'  },
  { href:'/leaderboard', emoji:'🏆', label:'Challenge' },
  { href:'/profile',     emoji:'👤', label:'Profile'   },
]

export function StudentNav() {
  const path = usePathname()

  // Fix 1 Layer 1 — completely unmount nav on any active lesson route.
  // The lesson layout (zIndex:9999) also covers it, but returning null here
  // ensures the nav is never in the DOM during a lesson.
  const isInsideLesson = /^\/learn\/[^/]+\/[^/]+/.test(path)
  if (isInsideLesson) return null

  return (
    <>
      {/* ── Desktop sidebar */}
      <aside className="hidden md:flex" style={{
        position:'fixed', top:0, left:0, height:'100%', zIndex:40,
        flexDirection:'column', background:'#FFFFFF',
        borderRight:'1px solid #EBEBEB', width:'72px', fontFamily:F,
      }}>
        <div className="lg:w-[220px]" style={{ display:'flex', alignItems:'center', gap:'12px', padding:'24px 16px', borderBottom:'1px solid #EBEBEB' }}>
          <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'#2D3CE6', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <span style={{ color:'#fff', fontFamily:F, fontWeight:900, fontSize:'14px' }}>L</span>
          </div>
          <span className="hidden lg:block" style={{ fontFamily:F, fontWeight:900, fontSize:'17px', color:'#1A1A1A' }}>Learniie</span>
        </div>

        <nav style={{ display:'flex', flexDirection:'column', gap:'4px', padding:'12px', flex:1 }}>
          {NAV.map(({ href, emoji, label }) => {
            const active = path === href || path.startsWith(href + '/')
            return (
              <Link key={href} href={href} style={{ textDecoration:'none' }}>
                <div className="lg:w-full" style={{
                  display:'flex', alignItems:'center', gap:'12px',
                  padding:'10px 12px', borderRadius:'14px',
                  background: active ? '#EEF0FF' : 'transparent',
                  color:      active ? '#2D3CE6' : '#888888',
                  cursor:'pointer', transition:'background 0.15s',
                }}>
                  <span style={{ fontSize:'18px', lineHeight:1 }}>{emoji}</span>
                  <span className="hidden lg:block" style={{ fontFamily:F, fontWeight:700, fontSize:'14px' }}>{label}</span>
                </div>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* ── Mobile bottom nav — 5 tabs */}
      <nav className="md:hidden" style={{
        position:'fixed', bottom:0, left:0, right:0, zIndex:40,
        background:'#FFFFFF', borderTop:'1.5px solid #F0F0F0',
        paddingBottom:'env(safe-area-inset-bottom)',
      }}>
        <div style={{ display:'flex', height:'58px' }}>
          {NAV.map(({ href, emoji, label }) => {
            const active = path === href || path.startsWith(href + '/')
            return (
              <Link key={href} href={href} style={{ flex:1, textDecoration:'none' }}>
                <div style={{
                  display:'flex', flexDirection:'column', alignItems:'center',
                  justifyContent:'center', gap:'2px', height:'100%',
                }}>
                  <span style={{ fontSize:'19px', lineHeight:1 }}>{emoji}</span>
                  <span style={{ fontFamily:F, fontWeight:700, fontSize:'9px', color:active ? '#2D3CE6' : '#CCCCCC', lineHeight:1 }}>
                    {label}
                  </span>
                  <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:active ? '#2D3CE6' : 'transparent', transition:'background 0.2s' }} />
                </div>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}