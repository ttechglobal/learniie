// components/lesson/bites/QuickPointsBite.jsx
export function QuickPointsBite({ content }) {
  return (
    <div className="flex flex-col gap-2">
      {content.points.map((point, i) => (
        <div key={i} className="flex items-start gap-3">
          <span className="w-6 h-6 rounded-full bg-primaryLight text-primary text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
            {i + 1}
          </span>
          <p className="text-sm text-textPrimary leading-relaxed">{point}</p>
        </div>
      ))}
    </div>
  )
}
