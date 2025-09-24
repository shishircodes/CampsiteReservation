'use server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signIn(formData: FormData): Promise<{ error?: string } | void> {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  const supabase = await createSupabaseServerClient()

    // Attempt sign in
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    return { error: error.message }
  }

  
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

  if (profileErr) {
    return { error: profileErr.message }
  }

  // Redirect based on role
  if (profile?.role === 'staff' || profile?.role === 'admin') {
    redirect('/admin')
  } else {
    redirect('/')
  }
}

export async function signUp(formData: FormData): Promise<{ error?: string; ok?: true }> {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.auth.signUp({ email, password })
  if (error) {
    return { error: error.message }
  }
  return { ok: true }
}

export async function signOut(): Promise<void> {
  const supabase = await createSupabaseServerClient()

  await supabase.auth.signOut()
  redirect('/')
}
