// lib/utils/schoolMatching.js
// Uses Supabase's pg_trgm extension for fuzzy school name matching.
// Run the SQL in supabase/migrations/001_schema.sql first.

export async function findSimilarSchools(supabase, inputName, threshold = 0.3) {
  const { data } = await supabase.rpc('find_similar_schools', {
    input_name: inputName,
    similarity_threshold: threshold,
  })
  return data || []
}

export async function handleSchoolInput(supabase, studentId, schoolName) {
  const similar = await findSimilarSchools(supabase, schoolName)

  if (similar.length > 0 && similar[0].similarity > 0.7) {
    return { type: 'confirm', match: similar[0], message: `Is this your school? "${similar[0].canonical_name}"` }
  }

  if (similar.length > 0) {
    return { type: 'select', matches: similar, message: 'Did you mean one of these?' }
  }

  // No match — create new school
  const { data: newSchool } = await supabase
    .from('schools')
    .insert({ canonical_name: schoolName })
    .select()
    .single()

  await supabase.from('students').update({ school_id: newSchool.id }).eq('id', studentId)
  return { type: 'created', school: newSchool }
}
