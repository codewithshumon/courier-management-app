import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // console.log('[Middleware] Path:', pathname, '| Has token:', token)

  const publicPaths = ['/login', '/register', '/forgot-password']
  const isPublicPath = publicPaths.includes(pathname)

  if (!token && !isPublicPath) {
    console.log('[Middleware] Redirecting to login')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (token && isPublicPath) {
    console.log('[Middleware] Already logged in, redirecting to dashboard')
    return NextResponse.redirect(new URL('customer/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/agent/:path*',
    '/customer/:path*',
    '/dashboard/:path*',
    '/login',
    '/register',
  ],
}