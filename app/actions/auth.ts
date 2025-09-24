'use server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signIn(formData: FormData): Promise<void> {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  const supabase = await createSupabaseServerClient()

    // Attempt sign in
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    redirect('/')
  }

  
  // fetch the signed-in user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/')
  }
  
    // Fetch profile row for this user
  const { data: profile} = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)   // now `user` is defined
    .maybeSingle()

  // Redirect based on role
  if (profile?.role === 'staff' || profile?.role === 'admin') {
    redirect('/admin')
  } else {
    redirect('/')
  }
}

export async function signUp(formData: FormData): Promise<void> {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.auth.signUp({ email, password })
  if (error) {
    redirect('/')
  }
  redirect('/')
}

export async function signOut(): Promise<void> {
  const supabase = await createSupabaseServerClient()

  await supabase.auth.signOut()
  redirect('/')
}
