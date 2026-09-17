'use client'

import React, { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { login, signup } from './actions'
import { createClient } from '@/lib/supabase/client'
import { 
  ShieldAlert, 
  ShieldCheck, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  UserPlus, 
  Activity, 
  Cpu, 
  Radio, 
  Loader2,
  Sparkles,
  CheckCircle2
} from 'lucide-react'

function LoginContent() {
  const searchParams = useSearchParams()
  const errorParam = searchParams.get('error')
  const messageParam = searchParams.get('message')

  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const activeError = localError || errorParam

  // Handle Google OAuth Direct Linking
  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true)
      setLocalError(null)
      const supabase = createClient()
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        setLocalError(error.message)
        setIsGoogleLoading(false)
      }
    } catch (err: unknown) {
      setLocalError(err instanceof Error ? err.message : 'Failed to connect to Google')
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md relative">
      {/* Decorative Cyber Frame Brackets */}
      <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-primary-container pointer-events-none z-20" />
      <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-primary-container pointer-events-none z-20" />
      <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-primary-container pointer-events-none z-20" />
      <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-primary-container pointer-events-none z-20" />

      {/* Main Glassmorphic Card */}
      <div className="backdrop-blur-2xl bg-surface-container/85 border border-primary/25 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.85)] p-8 relative z-10 overflow-hidden">
        
        {/* Subtle top neon beam */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary-container to-transparent opacity-80" />

        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-6">
          {/* Glowing Brand Badge */}
          <div className="relative mb-4">
            <div className="w-16 h-16 rounded-2xl bg-surface-container-high border border-primary/40 flex items-center justify-center text-primary-container shadow-[0_0_30px_rgba(0,240,255,0.3)] relative z-10">
              <ShieldCheck size={36} className="text-primary-container animate-pulse" />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-primary-container/20 blur-xl -z-10" />
            <div className="absolute -inset-1 rounded-2xl border border-primary-container/30 radar-sweep opacity-40 pointer-events-none" />
          </div>

          {/* System Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/10 border border-primary-container/30 text-primary-fixed-dim text-xs font-mono mb-2.5">
            <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
            <span>SECURE TELEMETRY GATEWAY</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface font-headline">
            {mode === 'signin' ? 'Operative Access' : 'Create Clearance'}
          </h1>
          <p className="text-on-surface-variant text-xs sm:text-sm mt-1 max-w-xs font-sans">
            {mode === 'signin' 
              ? 'Authenticate to access real-time driver telemetry & safety metrics.'
              : 'Register a new profile on the SafeDrive security intelligence network.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-surface-container-lowest/80 rounded-xl border border-outline-variant/60 mb-6 relative">
          <button
            type="button"
            onClick={() => { setMode('signin'); setLocalError(null); }}
            className={`py-2 text-xs font-headline font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'signin'
                ? 'bg-primary-container text-on-primary-container shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Lock size={13} />
            SIGN IN
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setLocalError(null); }}
            className={`py-2 text-xs font-headline font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'signup'
                ? 'bg-primary-container text-on-primary-container shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <UserPlus size={13} />
            CREATE ACCOUNT
          </button>
        </div>

        {/* Google One-Click OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isSubmitting}
          className="w-full py-3 px-4 bg-surface-container-highest/90 hover:bg-surface-bright border border-outline-variant/80 hover:border-primary-container/60 rounded-xl text-on-surface text-sm font-medium transition-all duration-200 flex items-center justify-center gap-3 shadow-sm hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] group active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed mb-5 cursor-pointer"
        >
          {isGoogleLoading ? (
            <>
              <Loader2 size={18} className="animate-spin text-primary-container" />
              <span className="font-mono text-xs text-primary-fixed-dim">CONNECTING TO GOOGLE AUTH...</span>
            </>
          ) : (
            <>
              {/* Google 4-color Vector Icon */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.9 6.4C.7 8.8 0 10.4 0 12s.7 3.2 1.9 5.6l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.3L1.9 16c1.8 3.8 5.6 7 10.1 7z"
                />
              </svg>
              <span className="font-sans font-medium text-sm text-on-surface">
                {mode === 'signin' ? 'Continue with Google' : 'Sign up directly with Google'}
              </span>
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center mb-5">
          <div className="border-t border-outline-variant/60 w-full" />
          <span className="bg-surface-container px-3 text-[11px] font-mono uppercase tracking-widest text-on-surface-variant/70 shrink-0">
            OR USE CREDENTIALS
          </span>
          <div className="border-t border-outline-variant/60 w-full" />
        </div>

        {/* Alert Messages (Error / Success) */}
        {activeError && (
          <div className="mb-5 p-3.5 bg-error-container/20 border border-error/50 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <ShieldAlert className="text-error shrink-0 mt-0.5" size={18} />
            <div className="text-xs text-error font-medium leading-relaxed">
              <p className="font-semibold mb-0.5">Authentication Exception</p>
              <p>{activeError}</p>
              {activeError.toLowerCase().includes('provider') && (
                <p className="mt-1 text-[11px] text-on-surface-variant">
                  Tip: Enable Google provider in Supabase Dashboard → Authentication → Providers → Google.
                </p>
              )}
            </div>
          </div>
        )}

        {messageParam && (
          <div className="mb-5 p-3.5 bg-secondary-container/20 border border-secondary/50 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <CheckCircle2 className="text-secondary shrink-0 mt-0.5" size={18} />
            <div className="text-xs text-secondary font-medium leading-relaxed">
              <p>{messageParam}</p>
            </div>
          </div>
        )}

        {/* Main Email & Password Form */}
        <form 
          action={async (formData) => {
            setIsSubmitting(true)
            setLocalError(null)
            try {
              if (mode === 'signin') {
                await login(formData)
              } else {
                await signup(formData)
              }
            } catch (err: unknown) {
              // Note: Next.js redirect() throws a NEXT_REDIRECT error which is normal behavior.
              // Only catch non-redirect errors.
              if (err instanceof Error && !err.message.includes('NEXT_REDIRECT')) {
                setLocalError(err.message)
                setIsSubmitting(false)
              }
            }
          }}
          className="space-y-4"
        >
          {/* Email Field */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5 flex items-center justify-between"
            >
              <span>Clearance Email</span>
              <span className="text-[10px] text-primary-container/70 font-mono">TLS ENCRYPTED</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
                <Mail size={16} />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="operative@safedrive.ai"
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-highest/60 border border-outline-variant/70 rounded-xl text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all font-mono text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5 flex items-center justify-between"
            >
              <span>Security Passkey</span>
              {mode === 'signup' && (
                <span className="text-[10px] text-secondary font-mono">MIN 6 CHARACTERS</span>
              )}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
                <Lock size={16} />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                required
                minLength={6}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-surface-container-highest/60 border border-outline-variant/70 rounded-xl text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all font-mono text-xs sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                title={showPassword ? 'Hide passkey' : 'Show passkey'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || isGoogleLoading}
            className="w-full mt-2 py-3 bg-gradient-to-r from-primary-container via-primary-fixed-dim to-secondary font-headline font-bold text-on-primary-container rounded-xl hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed group"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>PROCESSING CLEARANCE...</span>
              </>
            ) : mode === 'signin' ? (
              <>
                <span>ESTABLISH TELEMETRY LINK</span>
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </>
            ) : (
              <>
                <Sparkles size={17} />
                <span>REGISTER SECURITY CLEARANCE</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Security Badges */}
        <div className="mt-8 pt-5 border-t border-outline-variant/40 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-on-surface-variant/70">
          <div className="flex items-center gap-1.5">
            <Radio size={12} className="text-secondary animate-pulse" />
            <span>NODE: US-EAST</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cpu size={12} className="text-primary-container" />
            <span>AES-256-GCM</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Activity size={12} className="text-tertiary-fixed-dim" />
            <span>LATENCY: 14ms</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden scanline-grid selection:bg-primary-container selection:text-on-primary-container">
      {/* Background Cyber Ambient Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-container/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-10 left-10 w-[350px] h-[350px] bg-tertiary-fixed-dim/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Decorative Cyber Grid Background Lines */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,14,22,0.85)_100%)] pointer-events-none -z-10" />

      {/* Floating System Brand Tag at Top */}
      <div className="mb-6 flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-surface-container/60 border border-outline-variant/40 backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
        <span className="font-mono text-[11px] tracking-widest text-primary-fixed-dim uppercase">
          SAFEDRIVE INTELLIGENCE NETWORK // v2.4
        </span>
      </div>

      {/* Main Form Content */}
      <Suspense fallback={
        <div className="flex items-center gap-3 p-6 bg-surface-container rounded-xl border border-outline-variant text-primary font-mono text-sm">
          <Loader2 className="animate-spin text-primary-container" size={20} />
          Initializing secure cryptographic handshakes...
        </div>
      }>
        <LoginContent />
      </Suspense>

      {/* Bottom Disclaimer */}
      <p className="mt-6 text-[11px] font-mono text-on-surface-variant/50 text-center max-w-sm">
        Authorized personnel only. All access requests, telemetry streams, and session tokens are cryptographically signed and audited.
      </p>
    </div>
  )
}
