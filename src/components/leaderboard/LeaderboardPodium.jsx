// components/leaderboard/LeaderboardPodium.jsx
import { clsx } from 'clsx'

const MEDAL = ['🥇', '🥈', '🥉']
const HEIGHTS = ['h-20', 'h-14', 'h-10']
const ORDER = [1, 0, 2] // render 2nd, 1st, 3rd

function initials(name = '') {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
}

export function LeaderboardPodium({ top3 = [], currentUserId }) {
  return (
    <div className="flex items-end justify-center gap-3 py-4">
      {ORDER.map((rankIndex) => {
        const entry = top3[rankIndex]
        if (!entry) return <div key={rankIndex} className="w-24" />
        const isYou = entry.student_id === currentUserId

        return (
          <div key={entry.student_id} className="flex flex-col items-center gap-2 w-24">
            {/* Medal */}
            <span className="text-2xl">{MEDAL[rankIndex]}</span>

            {/* Avatar */}
            <div className={clsx(
              'w-12 h-12 rounded-full flex items-center justify-center',
              'font-heading font-black text-sm text-white',
              rankIndex === 0 ? 'bg-amber' : 'bg-primary',
              isYou && 'ring-2 ring-offset-2 ring-primary',
            )}>
              {initials(entry.display_name)}
            </div>

            {/* Name + XP */}
            <div className="text-center">
              <p className="text-xs font-bold text-textPrimary truncate w-24 text-center">
                {isYou ? 'You' : entry.display_name}
              </p>
              <p className="text-[10px] text-textMuted">{entry.score} XP</p>
            </div>

            {/* Podium platform */}
            <div className={clsx(
              'w-full rounded-t-lg',
              HEIGHTS[rankIndex],
              rankIndex === 0 ? 'bg-amber/20' : 'bg-surfaceSecondary',
            )} />
          </div>
        )
      })}
    </div>
  )
}
