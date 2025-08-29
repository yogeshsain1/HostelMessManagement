import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { AuthProvider } from "@/lib/auth"
import { NotificationProvider } from "@/lib/notifications"
import { ThemeProvider } from "next-themes"
import { ErrorBoundary } from "@/components/error-boundary"
import { Toaster } from "sonner"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export const metadata: Metadata = {
  title: {
    default: "Poornima University - Hostel Management",
    template: "%s | Poornima Hostel",
  },
  description:
    "Complete hostel and mess management solution for Poornima University, Jaipur",
  keywords: [
    "hostel management",
    "mess management",
    "student portal",
    "warden",
    "admin",
    "Poornima University",
    "Jaipur",
  ],
  applicationName: "PU Hostel Management",
  creator: "Poornima University",
  authors: [{ name: "Poornima University IT" }],
  generator: "v0.app",
  icons: {
    icon: "/images/poornima-logo.png",
    shortcut: "/images/poornima-logo.png",
    apple: "/images/poornima-logo.png",
  },
  openGraph: {
    title: "Poornima University - Hostel Management",
    description:
      "Complete hostel and mess management solution for Poornima University, Jaipur",
    url: "https://demo.example.com",
    siteName: "PU Hostel Management",
    images: [
      {
        url: "/images/hostel-exterior.png",
        width: 1200,
        height: 630,
        alt: "Poornima University Hostel Campus",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Poornima University - Hostel Management",
    description:
      "Complete hostel and mess management solution for Poornima University, Jaipur",
    images: ["/images/hostel-exterior.png"],
    creator: "@poornimauni",
  },
  metadataBase: new URL("http://localhost:3000"),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          <ErrorBoundary>
            <AuthProvider>
              <NotificationProvider>
                <Suspense
                  fallback={
                    <div className="min-h-screen flex items-center justify-center">
                      <LoadingSpinner size="lg" />
                    </div>
                  }
                >
                  {children}
                </Suspense>
                <Toaster position="top-right" closeButton richColors />
              </NotificationProvider>
            </AuthProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}
