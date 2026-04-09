import { clsx } from 'clsx'
export function Card({ children, className='', hover=false, ...props }) {
  return (
    <div className={clsx('bg-surface rounded-2xl p-4 shadow-card', hover && 'hover:shadow-lift cursor-pointer transition-shadow duration-200', className)} {...props}>
      {children}
    </div>
  )
}
