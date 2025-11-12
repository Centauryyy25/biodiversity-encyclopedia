import { auth, currentUser } from '@clerk/nextjs/server'

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) return <div className="p-8">Unauthorized</div>
  const user = await currentUser()
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Welcome, {user?.firstName || 'User'}!</h1>
      <p className="text-muted-foreground mt-2">You are logged in with Clerk.</p>
    </div>
  )
}

