import { auth, currentUser } from '@clerk/nextjs/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ContributionForm from '@/components/domain/contribute/ContributionForm'
import MySubmissions from '@/components/domain/contribute/MySubmissions'
import Link from 'next/link'

export default async function ContributePage() {
  const { userId } = await auth()
  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md rounded-2xl">
          <CardHeader>
            <CardTitle>Sign in required</CardTitle>
          </CardHeader>
          <CardContent>
            Please <Link href="/sign-in" className="underline">sign in</Link> to contribute.
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E9F1E8] to-white dark:from-[#051F20] dark:to-[#163832] py-12">
      <div className="mx-auto max-w-[900px] px-4 md:px-8 lg:px-12">
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="text-[#2F5233] dark:text-[#DAF1DE]">Contribute a Submission</CardTitle>
          </CardHeader>
          <CardContent>
            <ContributionForm />
          </CardContent>
        </Card>
        <div className="mt-6">
          <MySubmissions />
        </div>
      </div>
    </div>
  )
}
