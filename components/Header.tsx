import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { signOut } from '@/app/actions/auth'


export default async function Header() {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser();

  let role: string | null = null;
  let full_name: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, full_name")
      .eq("id", user.id)
      .maybeSingle();
    role = profile?.role ?? null;
    full_name = profile?.full_name ?? "User"
  }


  return (
    <header className="border-b border-gray-200">
      <div className="container flex items-center gap-4 py-3">
        <Link href="/" className="font-semibold">Campsite Reservation</Link>
        
        <div className="ml-auto flex items-center gap-6">
          {user && (role === "admin" || role === "staff") && (
          <Link
            href="/admin"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Admin
          </Link>
        )}
        <Link href='/campsites' className='text-sm text-gray-600 hover:text-gray-900'>Campsites</Link>
        
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
