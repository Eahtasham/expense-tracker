import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ReduxProvider } from "@/lib/redux/provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Track your expenses with offline sync capability",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ReduxProvider>
            {children}
            <Toaster />
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'