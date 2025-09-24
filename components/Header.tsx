import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { signOut } from '@/app/actions/auth'

export default async function Header() {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()


  return (
    <header className="border-b border-gray-200">
      <div className="container flex items-center gap-4 py-3">
        <Link href="/" className="font-semibold">Campsite Reservation</Link>
        {user && <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900">Dashboard</Link>}
        <div className="ml-auto flex items-center gap-3">
          {user ? (
            <form action={signOut}>
              <button className="btn">Sign out</button>
            </form>
          ) : (
            <Link href="/login" className="btn">Login</Link>
          )}
        </div>
      </div>
    </header>
  )
}
