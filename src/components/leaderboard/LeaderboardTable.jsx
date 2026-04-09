// components/leaderboard/LeaderboardTable.jsx
import { clsx } from 'clsx'

function initials(name = '') {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
}

export function LeaderboardTable({ entries = [], currentUserId, startRank = 4 }) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-textMuted text-center py-8">
        No entries yet. Keep learning to earn XP!
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      {entries.map((entry, i) => {
        const rank = startRank + i
        const isYou = entry.student_id === currentUserId

        return (
          <div
            key={entry.student_id}
            className={clsx(
              'flex items-center gap-3 px-4 py-3 rounded-xl',
              isYou
                ? 'bg-primaryLight border-l-4 border-primary'
                : 'bg-surface border border-border',
            )}
          >
            <span className="text-sm font-black text-textMuted w-6 text-center">
              {rank}
            </span>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-black flex-shrink-0">
              {initials(entry.display_name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-textPrimary truncate">
                {isYou ? 'You' : entry.display_name}
                {isYou && (
                  <span className="ml-2 text-[10px] font-black bg-primary text-white px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                    You
                  </span>
                )}
              </p>
              {entry.class_level && (
                <p className="text-xs text-textMuted">{entry.class_level}</p>
              )}
            </div>
            <p className="font-heading font-black text-textPrimary text-sm">
              {entry.score} <span className="text-xs text-textMuted font-normal">XP</span>
            </p>
          </div>
        )
      })}
    </div>
  )
}
