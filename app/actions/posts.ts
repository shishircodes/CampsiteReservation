'use server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { slugify } from '@/utils/slugify'
import { redirect } from 'next/navigation'

export async function upsertProfile(userId: string): Promise<void> {
  const supabase = await createSupabaseServerClient()

  await supabase.from('profiles').upsert({ id: userId }, { onConflict: 'id' })
}

export async function createPost(formData: FormData): Promise<{ error?: string } | void> {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }
  await upsertProfile(user.id)

  const title = String(formData.get('title') ?? '')
  const slugInput = String(formData.get('slug') ?? '')
  const excerpt = String(formData.get('excerpt') ?? '')
  const content = String(formData.get('content') ?? '')
  const cover = String(formData.get('cover') ?? '')
  const tags = String(formData.get('tags') ?? '')
  const published = formData.get('published') === 'on'

  const payload = {
    author_id: user.id,
    title,
    slug: slugInput || slugify(title),
    excerpt: excerpt || null,
    content,
    cover_image_url: cover || null,
    tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    published,
    published_at: published ? new Date().toISOString() : null,
  }

  const { error } = await supabase.from('posts').insert(payload)
  if (error) return { error: error.message }
  redirect('/admin')
}

export async function updatePost(postId: string, formData: FormData): Promise<{ error?: string } | void> {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const title = String(formData.get('title') ?? '')
  const slugInput = String(formData.get('slug') ?? '')
  const excerpt = String(formData.get('excerpt') ?? '')
  const content = String(formData.get('content') ?? '')
  const cover = String(formData.get('cover') ?? '')
  const tags = String(formData.get('tags') ?? '')
  const published = formData.get('published') === 'on'

  const payload = {
    title,
    slug: slugInput || slugify(title),
    excerpt: excerpt || null,
    content,
    cover_image_url: cover || null,
    tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    published,
    published_at: published ? new Date().toISOString() : null,
  }

  const { error } = await supabase.from('posts').update(payload).eq('id', postId)
  if (error) return { error: error.message }
  redirect('/admin')
}

export async function deletePost(postId: string): Promise<{ error?: string } | void> {
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.from('posts').delete().eq('id', postId)
  if (error) return { error: error.message }
  redirect('/admin')
}
