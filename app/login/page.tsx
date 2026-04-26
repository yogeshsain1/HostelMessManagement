

"use client"

import { useRef } from "react"
import Image from "next/image"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  const shellRef = useRef<HTMLDivElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const glowARef = useRef<HTMLDivElement | null>(null)
  const glowBRef = useRef<HTMLDivElement | null>(null)
  const glowCRef = useRef<HTMLDivElement | null>(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      tl.fromTo(
        panelRef.current,
        { opacity: 0, y: 36, rotateX: 12, transformPerspective: 1200 },
        { opacity: 1, y: 0, rotateX: 0, duration: 1 }
      )
        .fromTo(
          shellRef.current?.querySelectorAll("[data-login-animate]"),
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 },
          "-=0.55"
        )
        .to(glowARef.current, { x: 24, y: -18, duration: 8, yoyo: true, repeat: -1, ease: "sine.inOut" }, 0)
        .to(glowBRef.current, { x: -18, y: 22, duration: 10, yoyo: true, repeat: -1, ease: "sine.inOut" }, 0)
        .to(glowCRef.current, { x: 16, y: -12, duration: 9, yoyo: true, repeat: -1, ease: "sine.inOut" }, 0)
    },
    { scope: shellRef }
  )

  return (
    <div ref={shellRef} className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(65,105,225,0.24),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(31,199,157,0.18),_transparent_28%),linear-gradient(135deg,_#07111f_0%,_#0b1f33_45%,_#060b14_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:56px_56px] opacity-25" />
      <div ref={glowARef} className="absolute left-[-5rem] top-20 h-72 w-72 rounded-full bg-cyan-400/25 blur-3xl" />
      <div ref={glowBRef} className="absolute right-[-4rem] top-12 h-96 w-96 rounded-full bg-indigo-500/25 blur-3xl" />
      <div ref={glowCRef} className="absolute bottom-[-6rem] left-1/3 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="hidden lg:block">
            <div className="max-w-xl space-y-8">
              <div data-login-animate className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/80 backdrop-blur-xl">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(74,222,128,0.85)]" />
                Hostel operations, reimagined
              </div>

              <div data-login-animate className="space-y-5">
                <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
                  Poornima Hostel
                  <span className="block bg-gradient-to-r from-cyan-300 via-white to-emerald-300 bg-clip-text text-transparent">
                    Management System
                  </span>
                </h1>
                <p className="max-w-lg text-lg leading-8 text-white/70">
                  A fast, modern control room for students, wardens, and admins to handle complaints, leave, mess, and notifications in one place.
                </p>
              </div>

              <div data-login-animate className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/8 p-4 backdrop-blur-xl shadow-[0_30px_90px_rgba(0,0,0,0.24)]">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                  <Image
                    src="/images/poornima-logo.png"
                    alt="Poornima University"
                    width={44}
                    height={44}
                    priority
                  />
                </div>
                <div>
                  <div className="text-sm uppercase tracking-[0.24em] text-white/50">Secure portal</div>
                  <div className="text-base font-medium text-white/90">Designed for daily hostel operations</div>
                </div>
              </div>
            </div>
          </div>

          <div ref={panelRef} className="mx-auto w-full max-w-lg">
            <div data-login-animate className="mb-6 flex items-center justify-center lg:hidden">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur-xl">
                <Image
                  src="/images/poornima-logo.png"
                  alt="Poornima University"
                  width={42}
                  height={42}
                  priority
                />
              </div>
            </div>

            <div data-login-animate className="mb-6 text-center lg:text-left">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-white/65 backdrop-blur-xl lg:hidden">
                Hostel management portal
              </div>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Welcome back</h2>
              <p className="mt-2 text-sm text-white/65 sm:text-base">
                Sign in to manage your hostel services and notices.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/8 p-2 shadow-[0_30px_120px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />
              <div className="rounded-[1.6rem] border border-white/10 bg-[#0b1222]/90 p-4 sm:p-5">
                <LoginForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
