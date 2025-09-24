import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { div } from 'motion/react-client'

export const metadata = { title: 'Admin' }


export default async function AdminPage() {

  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  // Check role
  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  // If cannot read profile or not staff/admin → send home
  if (profileErr || (profile?.role !== "admin" && profile?.role !== "staff")) {
    redirect("/");
  }
  
  redirect('/admin/campsites')

  return (

    
    <div>
        Admin page under construction
    </div>
  )
}
