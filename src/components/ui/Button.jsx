'use client'
import { clsx } from 'clsx'
import { Loader2 } from 'lucide-react'
 
const variants = {
  primary:   'bg-brand text-white font-bold hover:bg-brandDark active:scale-[0.97] shadow-brand',
  amber:     'bg-amber text-ink font-bold hover:bg-amberDark active:scale-[0.97] shadow-amber',
  secondary: 'bg-surface border border-border text-ink font-semibold hover:bg-surface2',
  ghost:     'text-inkMid hover:text-ink hover:bg-surface2',
  white:     'bg-white text-brand font-bold hover:bg-cream active:scale-[0.97]',
}
 
export function Button({ children, variant='primary', loading=false, disabled=false, size='md', className='', ...props }) {
  const sizes = { sm:'h-10 px-4 text-sm rounded-xl', md:'h-12 px-5 text-[15px] rounded-2xl', lg:'h-14 px-6 text-base rounded-2xl' }
  return (
    <button disabled={disabled || loading}
      className={clsx('inline-flex items-center justify-center gap-2 font-body transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed', sizes[size], variants[variant], className)}
      {...props}>
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  )
}
