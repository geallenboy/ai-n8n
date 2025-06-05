import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
    "/",
    '/sign-in(.*)',
    '/sign-up(.*)',
    "/api(.*)",
    "/front/about",
    "/front/blogs(.*)",
    "/front/tutorial(.*)",
    "/front/use-cases(.*)",
    "/front/pricing(.*)",
    "/front/privacy(.*)",
    "/front/terms(.*)",
    "/robots.txt",
    "/sitemap.xml",
    "/favicon.ico",
    "/_next/static(.*)",
    "/_next/image(.*)",
    "/contact",
    "/test-editor",
    "/test-renderer"
])

export default clerkMiddleware(async (auth, request) => {
    if (!isPublicRoute(request)) {
        await auth.protect()
    }
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}