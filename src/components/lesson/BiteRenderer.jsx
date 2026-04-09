import { WelcomeBite }        from './bites/WelcomeBite'
import { HookBite }           from './bites/HookBite'
import { ConceptBite }        from './bites/ConceptBite'
import { WorkedExampleBite }  from './bites/WorkedExampleBite'
import { EmphasisBite }       from './bites/EmphasisBite'
import { PracticeBite }       from './bites/PracticeBite'
import { SummaryBite }        from './bites/SummaryBite'
import { ChallengeBite }      from './bites/ChallengeBite'
 
const BITE_MAP = {
  welcome:       WelcomeBite,
  hook:          HookBite,
  concept:       ConceptBite,
  worked_example:WorkedExampleBite,
  emphasis:      EmphasisBite,
  practice:      PracticeBite,
  summary:       SummaryBite,
  challenge:     ChallengeBite,
}
 
let _practiceCount = 0
 
export function BiteRenderer({ bite, resetPracticeCount=false }) {
  if (resetPracticeCount) { _practiceCount = 0; return null }
  if (!bite) return null
  const Component = BITE_MAP[bite.bite_type]
  if (!Component) {
    return (
      <div className="bg-amberLight border border-amber/20 rounded-xl p-3">
        <p className="text-xs font-bold text-amberDark uppercase mb-1">{bite.bite_type} (not yet built)</p>
        <pre className="text-xs text-inkMid overflow-auto">{JSON.stringify(bite.content_json, null, 2)}</pre>
      </div>
    )
  }
  if (bite.bite_type === 'practice') {
    _practiceCount++
    return <Component content={bite.content_json} questionNumber={_practiceCount} />
  }
  return <Component content={bite.content_json} />
}
