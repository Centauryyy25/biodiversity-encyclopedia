import { auth, currentUser } from '@clerk/nextjs/server'
import ModerationTable from '@/components/domain/admin/ModerationTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabaseAdmin, hasSupabaseServiceRole } from '@/utils/supabase/admin'

const fakeSubmissions = [
  { id: 's1', title: 'Panthera leo photo', user: 'alice', type: 'image', status: 'pending', createdAt: '2025-01-01' },
  { id: 's2', title: 'New species note: Oak gall', user: 'bob', type: 'text', status: 'pending', createdAt: '2025-01-02' },
  { id: 's3', title: 'Habitat update: Wetlands', user: 'chris', type: 'text', status: 'flagged', createdAt: '2025-01-03' },
] as const

function isAdminEmail(email?: string | null) {
  const list = process.env.ADMIN_EMAILS?.split(',').map(s => s.trim().toLowerCase()).filter(Boolean) ?? []
  return email ? list.includes(email.toLowerCase()) : false
}

export default async function ModeratePage() {
  const { userId } = await auth()
  const user = await currentUser()
  const email = user?.primaryEmailAddress?.emailAddress ?? null
  const role = (user?.publicMetadata as any)?.role
  const isAllowed = Boolean(userId) && (role === 'admin' || isAdminEmail(email))

  if (!isAllowed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md rounded-2xl">
          <CardHeader>
            <CardTitle>Forbidden</CardTitle>
          </CardHeader>
          <CardContent>
            You don&apos;t have access to this area.
          </CardContent>
        </Card>
      </div>
    )
  }

  // Fetch latest submissions for moderation (server-side)
  let submissions: { id: string; title: string; user: string; type: 'image'|'text'; status: 'pending'|'approved'|'rejected'|'flagged'; createdAt: string; url?: string | null; content?: string | null }[] = []
  let missingTable = false
  if (isAllowed && hasSupabaseServiceRole) {
    const { data, error } = await (supabaseAdmin as any)
      .from('submissions')
      .select('id,title,user_id,type,status,created_at,url,content')
      .order('created_at', { ascending: false })
      .limit(50)
    if (error) {
      // When the table is missing, show a helpful message
      missingTable = true
    } else if (Array.isArray(data)) {
      submissions = data.map((row: any) => ({
        id: row.id,
        title: row.title,
        user: row.user_id,
        type: row.type,
        status: row.status,
        createdAt: row.created_at,
        url: row.url ?? null,
        content: row.content ?? null,
      }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E9F1E8] to-white dark:from-[#051F20] dark:to-[#163832] py-12">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8 lg:px-12">
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="text-[#2F5233] dark:text-[#DAF1DE]">Moderation Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            {(!hasSupabaseServiceRole) ? (
              <div className="text-sm text-red-500">Server missing SUPABASE_SERVICE_ROLE_KEY. Cannot load submissions.</div>
            ) : missingTable ? (
              <div className="text-sm text-red-500">Submissions table not found. Run Supabase migrations to create 'public.submissions'.</div>
            ) : (
              <ModerationTable submissions={submissions.length ? submissions : fakeSubmissions} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
