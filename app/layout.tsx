import './globals.css'
import Header from '@/components/Header'

export const metadata = {
  title: 'Campsite Reservation - Start your camping journey',
  description: 'Campsite Reservation App with Tailwind, Supabase, and TypeScript',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="mx-auto max-w-7xl">{children}</main>
      </body>
    </html>
  )
}
