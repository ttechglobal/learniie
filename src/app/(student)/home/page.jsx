import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MOCK_TOPICS, MOCK_SUBJECTS } from '@/lib/mock/data'
import { HomeClient } from '@/components/dashboard/HomeClient'
 
export default async function HomePage() {
  const supabase = await createServerSupabaseClient()
  const { data:{ user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data:student } = await supabase
    .from('students').select('*, school:schools(canonical_name)').eq('id', user.id).single()
  if (!student) redirect('/onboarding/mode')
  return <HomeClient student={student} topics={MOCK_TOPICS} subjects={MOCK_SUBJECTS} />
}
