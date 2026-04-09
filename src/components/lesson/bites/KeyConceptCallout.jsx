// components/lesson/bites/KeyConceptCallout.jsx
export function KeyConceptCallout({ content }) {
  return (
    <div className="border-l-4 border-primary bg-primaryLight rounded-r-2xl p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-primaryDark mb-2">
        Key Concept
      </p>
      <p className="text-sm text-textPrimary leading-relaxed">{content.text}</p>
    </div>
  )
}
