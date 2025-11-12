import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin, hasSupabaseServiceRole } from '@/utils/supabase/admin'
import { isMissingTableError } from '@/utils/supabase/errors'

const Schema = z.object({
  title: z.string().min(2),
  type: z.enum(['text','image']),
  content: z.string().min(10),
  url: z.string().url().optional().or(z.literal('')),
})

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    const parsed = Schema.parse(body)
    if (!hasSupabaseServiceRole) {
      return NextResponse.json({ error: 'Server missing SUPABASE_SERVICE_ROLE_KEY' }, { status: 500 })
    }
    const { error } = await (supabaseAdmin as any)
      .from('submissions')
      .insert([{ user_id: userId, title: parsed.title, type: parsed.type, url: parsed.url || null, content: parsed.content, status: 'pending' }])
    if (error) {
      if (isMissingTableError(error, 'submissions')) {
        return NextResponse.json({ error: "Submissions table not found. Run Supabase migrations to create 'public.submissions'." }, { status: 503 })
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
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasSupabaseServiceRole) return NextResponse.json({ data: [] })
  const { data, error } = await (supabaseAdmin as any)
    .from('submissions')
    .select('id,title,type,status,created_at,url')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20)
  if (error) {
    if (isMissingTableError(error, 'submissions')) {
      return NextResponse.json({ data: [] })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ data: data ?? [] })
}
