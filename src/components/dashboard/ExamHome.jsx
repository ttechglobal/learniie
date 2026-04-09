// components/dashboard/ExamHome.jsx
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Badge } from '@/components/ui/Badge'
import { getPreparednessLabel } from '@/lib/utils/preparedness'

export function ExamHome({ student, topics = [], overallScore = 0 }) {
  const { label, variant } = getPreparednessLabel(overallScore)

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <h1 className="font-heading text-2xl font-bold text-textPrimary mb-4">
        Exam Prep
      </h1>

      {/* Preparedness overview */}
      <Card className="mb-5">
        <div className="flex items-end justify-between mb-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-textMuted">
              Overall Readiness
            </p>
            <p className="font-heading text-5xl font-black text-textPrimary mt-1">
              {overallScore}%
            </p>
          </div>
          <Badge variant={variant}>{label}</Badge>
        </div>
        <ProgressBar percent={overallScore} />
      </Card>

      {/* Focus here — weakest 3 topics */}
      {topics.length > 0 && (
        <div className="mb-6">
          <h2 className="font-heading text-lg font-bold text-textPrimary mb-3">
            Focus Here
          </h2>
          <div className="flex flex-col gap-2">
            {topics.slice(0, 3).map((t) => {
              const { label: tLabel, variant: tVariant } = getPreparednessLabel(t.preparedness_score)
              return (
                <Card key={t.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-sm text-textPrimary">{t.title}</p>
                    <Badge variant={tVariant}>{t.preparedness_score}%</Badge>
                  </div>
                  <ProgressBar percent={t.preparedness_score} />
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* All topics grid */}
      {topics.length > 0 && (
        <div>
          <h2 className="font-heading text-lg font-bold text-textPrimary mb-3">
            All Topics
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {topics.map((t) => {
              const { variant: tVariant } = getPreparednessLabel(t.preparedness_score)
              return (
                <Card key={t.id} className="p-3">
                  <p className="font-semibold text-xs text-textPrimary mb-2 line-clamp-2">{t.title}</p>
                  <div className="flex items-center gap-2">
                    <ProgressBar percent={t.preparedness_score} className="flex-1" />
                    <span className="text-xs font-bold text-textSecondary">{t.preparedness_score}%</span>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
