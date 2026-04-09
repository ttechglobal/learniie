// components/lesson/bites/ApplyItBite.jsx
export function ApplyItBite({ content }) {
  return (
    <div className="bg-coral/10 border border-coral/20 rounded-2xl p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-coral mb-2">
        Try It
      </p>
      <p className="text-sm text-textPrimary leading-relaxed font-medium">
        {content.challenge}
      </p>
      {content.hint && (
        <p className="text-xs text-textSecondary mt-3 italic">
          💡 Hint: {content.hint}
        </p>
      )}
    </div>
  )
}
