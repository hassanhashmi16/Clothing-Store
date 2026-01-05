'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { User } from 'lucide-react'

export default function LoginPage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/')
        }
    }, [status, router])

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-pulse flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-accent-brown/10 border border-accent-brown/20 flex items-center justify-center text-accent-brown">
                        <User size={24} strokeWidth={1.5} />
                    </div>
                    <p className="text-sm font-serif tracking-widest text-foreground/50">LOADING</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
            <div className="w-full max-w-md space-y-12 text-center">
                <div className="space-y-4">
                    <h1 className="text-3xl font-serif tracking-tighter text-foreground uppercase">Elegance</h1>
                    <p className="text-sm text-foreground/50 tracking-wide">Sign in to access your curated experience</p>
                </div>

                <div className="space-y-6">
                    <button
                        onClick={() => signIn('google')}
                        className="w-full py-4 px-6 border border-foreground/10 flex items-center justify-center space-x-3 hover:bg-foreground/5 transition-all group"
                    >
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94L5.84 14.1z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            />
                        </svg>
                        <span className="text-sm font-medium tracking-wide">Continue with Google</span>
                    </button>

                    <div className="flex items-center justify-center space-x-4">
                        <div className="h-[1px] flex-1 bg-foreground/10" />
                        <span className="text-[10px] text-foreground/30 uppercase tracking-widest">or</span>
                        <div className="h-[1px] flex-1 bg-foreground/10" />
                    </div>

                    <p className="text-[11px] text-foreground/40 leading-relaxed max-w-xs mx-auto">
                        By signing in, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
                    </p>
                </div>

                <div className="pt-8">
                    <button
                        onClick={() => router.push('/')}
                        className="text-xs text-foreground/60 hover:text-foreground transition-colors uppercase tracking-widest font-medium"
                    >
                        Return to Store
                    </button>
                </div>
            </div>
        </div>
    )
}
