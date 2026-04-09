// app/api/leaderboard/route.js
import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(request) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const contextKey = searchParams.get('contextKey')
  const period     = searchParams.get('period') || 'weekly'

  if (!contextKey) {
    return NextResponse.json({ error: 'contextKey is required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('leaderboard_snapshots')
    .select('*')
    .eq('context_key', contextKey)
    .eq('period', period)
    .order('rank', { ascending: true })
    .limit(50)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ entries: data })
}
