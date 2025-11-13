import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth, currentUser } from '@clerk/nextjs/server'
import { supabaseAdmin, hasSupabaseServiceRole } from '@/utils/supabase/admin'

const BodySchema = z.object({
  id: z.string().min(1),
  status: z.enum(['pending','approved','rejected','flagged'])
})

function isAdminEmail(email?: string | null) {
  const list = process.env.ADMIN_EMAILS?.split(',').map(s => s.trim().toLowerCase()).filter(Boolean) ?? []
  return email ? list.includes(email.toLowerCase()) : false
}

const getRoleFromMetadata = (metadata: unknown): string | undefined => {
  if (typeof metadata !== 'object' || metadata === null) return undefined
  const value = (metadata as Record<string, unknown>).role
  return typeof value === 'string' ? value : undefined
}

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await currentUser()
    const email = user?.primaryEmailAddress?.emailAddress ?? null
    const role = getRoleFromMetadata(user?.publicMetadata)
    const isAllowed = Boolean(userId) && (role === 'admin' || isAdminEmail(email))
    if (!isAllowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    if (!hasSupabaseServiceRole) {
      return NextResponse.json({ error: 'Server missing SUPABASE_SERVICE_ROLE_KEY' }, { status: 500 })
    }

    const { id, status } = BodySchema.parse(await req.json())

    const { error } = await supabaseAdmin
      .from('submissions')
      .update({ status })
      .eq('id', id)
      .limit(1)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues.map(i => i.message).join(', ') }, { status: 400 })
    }
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
