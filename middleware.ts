import { clerkMiddleware } from '@clerk/nextjs/server'

// Keep middleware minimal to satisfy Clerk's detection and enable auth() in RSC
export default clerkMiddleware()

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
}
