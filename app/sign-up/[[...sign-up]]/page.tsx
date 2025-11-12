"use client"

import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <SignUp appearance={{
        elements: {
          card: 'shadow-lg rounded-2xl border',
          formButtonPrimary: 'rounded-xl',
        }
      }} />
    </div>
  )
}

