import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const oauthError = searchParams.get('error_description') || searchParams.get('error')
  
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'

  // Resolve external public origin for reverse proxies (like Vercel)
  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https'
  const isLocalEnv = process.env.NODE_ENV === 'development'

  const targetOrigin = (!isLocalEnv && forwardedHost)
    ? `${forwardedProto}://${forwardedHost}`
    : origin

  if (oauthError) {
    return NextResponse.redirect(`${targetOrigin}/login?error=${encodeURIComponent(oauthError)}`)
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const isSuccessfulNextUrl = next.startsWith('/')
      return NextResponse.redirect(`${targetOrigin}${isSuccessfulNextUrl ? next : '/'}`)
    } else {
      return NextResponse.redirect(`${targetOrigin}/login?error=${encodeURIComponent(error.message)}`)
    }
  }

  // fallback redirect
  return NextResponse.redirect(`${targetOrigin}/login?error=auth-callback-failed`)
}
