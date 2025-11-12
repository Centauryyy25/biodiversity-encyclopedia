import { createClient } from '@/utils/supabase/client'
import type { Tables } from '@/types/database.types'

const supabase = createClient()

export type QuizTopic = 'Taxonomy' | 'Habitats' | 'Conservation' | 'Classification' | 'SpeciesSpec'

export async function fetchSpeciesForQuiz(topic: QuizTopic, limit = 40) {
  // Derive a simple filter strategy per topic using existing columns
  let query = supabase.from('species').select('*').limit(limit)

  switch (topic) {
    case 'Taxonomy':
      // Prefer records with genus/family filled
      query = query.not('genus', 'is', null)
      break
    case 'Habitats':
      query = query.not('habitat_description', 'is', null)
      break
    case 'Conservation':
      query = query.not('iucn_status', 'is', null)
      break
    case 'Classification':
      query = query.not('family', 'is', null)
      break
    case 'SpeciesSpec':
      query = query.not('genus', 'is', null)
      break
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as Tables<'species'>[]
}
