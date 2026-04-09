'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Design-spec bottom nav:
//   White bg · 1.5px top border #F0F0F0
//   Active: label #2D3CE6, 5px blue dot below
//   Inactive: label #CCCCCC
//   Font: Nunito 700 10px
//   4 items: Home · Learn · Challenge · Profile

const F = "'Nunito', sans-serif"

const NAV = [
  { href:'/home',        emoji:'🏠', label:'Home'      },
  { href:'/learn',       emoji:'📖', label:'Learn'     },
  { href:'/leaderboard', emoji:'🏆', label:'Challenge' },
  { href:'/profile',     emoji:'👤', label:'Profile'   },
]

export function StudentNav() {
  const path = usePathname()

  return (
    <>
      {/* ── Desktop sidebar */}
      <aside className="hidden md:flex" style={{
        position:'fixed', top:0, left:0, height:'100%', zIndex:40,
        flexDirection:'column', background:'#FFFFFF',
        borderRight:'1px solid #E8E0D4', width:'72px', fontFamily:F,
      }}>
        <div className="lg:w-[220px]" style={{ display:'flex', alignItems:'center', gap:'12px', padding:'24px 16px', borderBottom:'1px solid #E8E0D4' }}>
          <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'#0D5C2E', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <span style={{ color:'#fff', fontFamily:F, fontWeight:900, fontSize:'14px' }}>L</span>
          </div>
          <span className="hidden lg:block" style={{ fontFamily:F, fontWeight:900, fontSize:'17px', color:'#1A1209' }}>Learniie</span>
        </div>

        <nav style={{ display:'flex', flexDirection:'column', gap:'4px', padding:'12px', flex:1 }}>
          {NAV.map(({ href, emoji, label }) => {
            const active = path === href || path.startsWith(href + '/')
            return (
              <Link key={href} href={href} style={{ textDecoration:'none' }}>
                <div className="lg:w-full" style={{
                  display:'flex', alignItems:'center', gap:'12px',
                  padding:'10px 12px', borderRadius:'18px',
                  background: active ? '#0D5C2E' : 'transparent',
                  color:      active ? '#fff'    : '#5C4F3A',
                  cursor:'pointer', transition:'background 0.15s',
                }}>
                  <span style={{ fontSize:'18px', lineHeight:1 }}>{emoji}</span>
                  <span className="hidden lg:block" style={{ fontFamily:F, fontWeight:700, fontSize:'14px' }}>{label}</span>
                </div>
              </Link>
            )
          })}
        </nav>

        <div style={{ padding:'16px' }}>
          <div className="hidden lg:flex" style={{ alignItems:'center', gap:'10px', borderRadius:'16px', padding:'12px', background:'#FFF5E0', border:'1px solid rgba(245,166,35,0.25)' }}>
            <span style={{ fontSize:'20px' }}>⭐</span>
            <div>
              <div style={{ fontSize:'10px', fontWeight:800, textTransform:'uppercase', letterSpacing:'1px', color:'#C4851A', fontFamily:F }}>Total XP</div>
              <div style={{ fontFamily:F, fontWeight:900, fontSize:'16px', color:'#1A1209' }}>1,240</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Mobile bottom nav */}
      <nav className="md:hidden" style={{
        position:'fixed', bottom:0, left:0, right:0, zIndex:40,
        background:'#FFFFFF', borderTop:'1.5px solid #F0F0F0',
        paddingBottom:'env(safe-area-inset-bottom)',
      }}>
        <div style={{ display:'flex', height:'60px' }}>
          {NAV.map(({ href, emoji, label }) => {
            const active = path === href || path.startsWith(href + '/')
            return (
              <Link key={href} href={href} style={{ flex:1, textDecoration:'none' }}>
                <div style={{
                  display:'flex', flexDirection:'column', alignItems:'center',
                  justifyContent:'center', gap:'2px', height:'100%', cursor:'pointer',
                }}>
                  <span style={{ fontSize:'20px', lineHeight:1 }}>{emoji}</span>
                  <span style={{ fontFamily:F, fontWeight:700, fontSize:'10px', color:active ? '#2D3CE6' : '#CCCCCC', lineHeight:1 }}>
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