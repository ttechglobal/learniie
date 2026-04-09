// app/(auth)/onboarding/layout.jsx
'use client'

import { usePathname } from 'next/navigation'

const STEPS = ['/onboarding/mode', '/onboarding/class', '/onboarding/department', '/onboarding/exam']

export default function OnboardingLayout({ children }) {
  const pathname = usePathname()
  const currentStep = STEPS.findIndex((s) => pathname.includes(s)) + 1
  const totalSteps = STEPS.length

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-start px-4 py-8">
      <div className="w-full max-w-md">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-textMuted mb-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}% complete</span>
          </div>
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                  i < currentStep ? 'bg-primary' : 'bg-border'
                }`}
              />
            ))}
          </div>
        </div>

        {children}
      </div>
    </div>
  )
}
