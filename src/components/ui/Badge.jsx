import { clsx } from 'clsx'
const variants = {
  default:  'bg-surface2 text-inkMid border border-border',
  brand:    'bg-brandLight text-brand border border-brand/20',
  amber:    'bg-amberLight text-amberDark border border-amber/30',
  easy:     'bg-green-50 text-green-700 border border-green-200',
  medium:   'bg-amber-50 text-amber-700 border border-amber/30',
  hard:     'bg-red-50 text-red-700 border border-red-200',
}
export function Badge({ children, variant='default', className='' }) {
  return (
    <span className={clsx('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold', variants[variant], className)}>
      {children}
    </span>
  )
}
