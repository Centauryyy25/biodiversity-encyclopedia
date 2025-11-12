import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin, hasSupabaseServiceRole } from '@/utils/supabase/admin'
import { isMissingTableError } from '@/utils/supabase/errors'

const ResultSchema = z.object({
  quiz_id: z.string().min(1),
  topic: z.enum(['Taxonomy','Habitats','Conservation','Classification','SpeciesSpec']),
  difficulty: z.enum(['Beginner','Intermediate','Advanced']),
  questions_count: z.number().int().nonnegative(),
  correct_count: z.number().int().nonnegative(),
  metadata: z.record(z.any()).optional(),
})

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (!hasSupabaseServiceRole) {
      return NextResponse.json({ error: 'Server missing SUPABASE_SERVICE_ROLE_KEY for writes' }, { status: 500 })
    }

    const json = await req.json()
    const parsed = ResultSchema.parse(json)

    const { error } = await (supabaseAdmin as any)
      .from('quiz_results')
      .insert([
        {
          user_id: userId,
          quiz_id: parsed.quiz_id,
          topic: parsed.topic,
          difficulty: parsed.difficulty,
          questions_count: parsed.questions_count,
          correct_count: parsed.correct_count,
          metadata: parsed.metadata ?? null,
        } as any,
      ])

    if (error) {
      if (isMissingTableError(error, 'quiz_results')) {
        return NextResponse.json({ error: "Quiz results table not found. Run Supabase migrations to create 'public.quiz_results'." }, { status: 503 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues.map(i => i.message).join(', ') }, { status: 400 })
    }
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // If service role key isn't available (local dev or misconfig), degrade gracefully
    if (!hasSupabaseServiceRole) {
      return NextResponse.json({ data: [] })
    }

    const { data, error } = await (supabaseAdmin as any)
      .from('quiz_results')
      .select('*')
      .eq('user_id', userId)
      .order('finished_at', { ascending: false })
      .limit(20)
    if (error) {
      if (isMissingTableError(error, 'quiz_results')) {
        // Degrade gracefully: return empty list instead of surfacing 503
        return NextResponse.json({ data: [] })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ data: data ?? [] })
  } catch {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
