import { MOCK_LEADERBOARD, MOCK_STUDENT } from '@/lib/mock/data'
import { LearniiBuddy } from '@/components/mascot/LearniiBuddy'

function initials(n='') { return n.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) }

const PODIUM_ORDER = [1, 0, 2]
const PODIUM_HEIGHT = ['h-12', 'h-20', 'h-8']
const PODIUM_COLORS = [
  { ring:'#F5A623', bg:'#FFF5E0', text:'#C4851A' },
  { ring:'#0D5C2E', bg:'#E8F5EE', text:'#0D5C2E' },
  { ring:'#9A8C78', bg:'#F3EFE8', text:'#5C4F3A' },
]
const MEDALS = ['🥇','🥈','🥉']

export default function LeaderboardPage() {
  const top3 = MOCK_LEADERBOARD.slice(0, 3)
  const rest = MOCK_LEADERBOARD.slice(3)
  const myId = MOCK_STUDENT.id

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-white flex flex-col">
      <div className="px-5 pt-14 pb-6">
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color:'#9A8C78' }}>This Week</p>
        <h1 className="font-heading text-[32px] font-black text-[#1A1209] leading-tight">Leaderboard</h1>
      </div>

      <div className="px-5 mb-6">
        <div className="rounded-3xl overflow-hidden p-6" style={{ background:'linear-gradient(145deg, #093D1E 0%, #0D5C2E 100%)' }}>
          <div className="flex items-end justify-center gap-4">
            {PODIUM_ORDER.map(ri => {
              const e = top3[ri]
              if (!e) return <div key={ri} className="w-20" />
              const isYou = e.student_id === myId
              const pc = PODIUM_COLORS[ri]
              return (
                <div key={e.student_id} className="flex flex-col items-center gap-2">
                  <span className="text-2xl">{MEDALS[ri]}</span>
                  {isYou
                    ? <LearniiBuddy size={44} expression="proud" />
                    : (
                      <div className="w-12 h-12 rounded-full flex items-center justify-center font-heading font-black text-sm text-white"
                        style={{ background:'rgba(255,255,255,0.15)', border:`2px solid ${pc.ring}` }}>
                        {initials(e.display_name)}
                      </div>
                    )
                  }
                  <p className="text-[11px] font-bold text-white/80 w-20 text-center truncate">
                    {isYou ? 'You 🎯' : e.display_name.split(' ')[0]}
                  </p>
                  <p className="text-[10px] font-semibold text-white/50">{e.score.toLocaleString()}</p>
                  <div className={`w-16 rounded-t-xl ${PODIUM_HEIGHT[ri]}`}
                    style={{ background: pc.ring + '30', border:`1px solid ${pc.ring}40` }} />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 px-5 pb-28">
        {rest.map((entry, i) => {
          const rank  = 4 + i
          const isYou = entry.student_id === myId
          return (
            <div key={entry.student_id}
              className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all"
              style={{
                background:  isYou ? '#E8F5EE' : '#fff',
                borderColor: isYou ? '#0D5C2E' : '#E8E0D4',
                borderWidth: isYou ? '1.5px'   : '1px',
              }}>
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                style={{ background:'#F3EFE8', color:'#5C4F3A' }}>
                {rank}
              </span>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
                style={{ background: isYou ? '#0D5C2E' : '#F3EFE8', color: isYou ? '#fff' : '#5C4F3A' }}>
                {initials(entry.display_name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[15px] text-[#1A1209] truncate flex items-center gap-2">
                  {isYou ? 'You' : entry.display_name}
                  {isYou && <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
                    style={{ background:'#0D5C2E', color:'#fff' }}>YOU</span>}
                </p>
                <p className="text-xs font-medium" style={{ color:'#9A8C78' }}>🔥 {entry.streak} day streak</p>
              </div>
              <div className="text-right">
                <p className="font-heading font-black text-[17px] text-[#1A1209]">{entry.score.toLocaleString()}</p>
                <p className="text-[10px] font-semibold" style={{ color:'#9A8C78' }}>XP</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}