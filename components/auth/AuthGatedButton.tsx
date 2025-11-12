"use client"

import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type Props = {
  href: string
  children?: React.ReactNode
  label?: string
  variant?: React.ComponentProps<typeof Button>['variant']
  className?: string
  ariaLabel?: string
}

export default function AuthGatedButton({ href, children, label, variant, className, ariaLabel }: Props) {
  const content = children ?? label ?? 'Continue'
  const a11y = ariaLabel ?? (typeof content === 'string' ? content : 'Continue')
  return (
    <>
      <SignedIn>
        <Button asChild variant={variant} className={className} aria-label={a11y}>
          <Link href={href}>{content}</Link>
        </Button>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal" forceRedirectUrl={href}>
          <Button variant={variant} className={className} aria-label={a11y}>
            {content}
          </Button>
        </SignInButton>
      </SignedOut>
    </>
  )
}
