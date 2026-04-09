import { clsx } from 'clsx'
export function Input({ label, error, helperText, id, className='', ...props }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g,'-')
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={inputId} className="text-xs font-bold uppercase tracking-widest text-inkLight">{label}</label>}
      <input id={inputId}
        className={clsx('h-[52px] w-full rounded-xl px-4 bg-surface2 border border-border text-[15px] text-ink placeholder:text-inkLight focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all duration-150', error && 'border-red-400', className)}
        {...props}
      />
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-inkLight">{helperText}</p>}
    </div>
  )
}
