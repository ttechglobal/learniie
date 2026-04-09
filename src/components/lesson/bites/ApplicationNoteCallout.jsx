// components/lesson/bites/ApplicationNoteCallout.jsx
export function ApplicationNoteCallout({ content }) {
  return (
    <div className="border-l-4 border-coral bg-coral/10 rounded-r-2xl p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-coral mb-2">
        Real Life
      </p>
      <p className="text-sm text-textPrimary leading-relaxed">{content.text}</p>
    </div>
  )
}
