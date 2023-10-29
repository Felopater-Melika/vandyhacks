'use client'

import './globals.css'
import { Inter as FontSans } from "next/font/google"
import {cn} from "@/lib/utils";
import { UserProvider } from "@auth0/nextjs-auth0/client"
import { ThemeProvider } from "@/components/theme-provider"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <UserProvider>{children}</UserProvider>
          </ThemeProvider>
      </body>
    </html>
  )
}
