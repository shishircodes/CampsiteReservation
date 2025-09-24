import './globals.css'
import Header from '@/components/Header'

export const metadata = {
  title: 'Supabase Blog (SSR, TS)',
  description: 'SSR blog with Tailwind, Supabase, and TypeScript',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="container py-6">{children}</main>
      </body>
    </html>
  )
}
