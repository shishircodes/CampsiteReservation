import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { div } from 'motion/react-client'

export const metadata = { title: 'Admin' }


export default async function AdminPage() {

  const supabase = await createSupabaseServerClient()

    // fetch the signed-in user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'User not found after login' }
  }
  
    // Fetch profile row for this user
  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)   // now `user` is defined
    .maybeSingle()


  // // Redirect to homepage if not admin
  // if (profile?.role !== 'staff' || profile?.role !== 'admin') {
  //   redirect('/')
  // }
  
  redirect('/admin/campsites')

  return (

    
    <div>
        Admin page under construction
    </div>
  )
}
