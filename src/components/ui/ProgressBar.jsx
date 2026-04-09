'use client'
import { clsx } from 'clsx'
function getColour(p) {
  if (p <= 0)  return 'bg-surface2'
  if (p <= 20) return 'bg-notStarted'
  if (p <= 40) return 'bg-beginning'
  if (p <= 60) return 'bg-getting'
  if (p <= 80) return 'bg-onTrack'
  return 'bg-ready'
}
export function ProgressBar({ percent=0, colour=null, className='' }) {
  const v = Math.min(100, Math.max(0, percent))
  return (
    <div className={clsx('w-full h-2 rounded-full bg-surface2 overflow-hidden', className)}>
      <div style={{ width:`${v}%`, transition:'width 700ms cubic-bezier(.4,0,.2,1)' }}
        className={clsx('h-full rounded-full', colour || getColour(v))} />
    </div>
  )
}
