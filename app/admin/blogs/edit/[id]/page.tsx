import { notFound, redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { updatePost, deletePost } from '@/app/actions/posts'
import type { Post } from '@/types/db'
import Tiptap from '@/components/Tiptap'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {

  const {id} = await params

  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).maybeSingle()
  if (!(profile as any)?.is_admin) redirect('/admin')

  const { data } = await supabase.from('posts').select('*').eq('id', id).maybeSingle()
  const post = data as Post | null
  if (!post) notFound()

  async function updateAction(formData: FormData) {
    'use server'
    return updatePost(id, formData)
  }

  async function deleteAction() {
    'use server'
    return deletePost(id)
  }

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Edit Post</h1>

      <form action={updateAction} className="space-y-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Title</label>
          <input name="title" className="input" defaultValue={post.title} required />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Slug</label>
          <input name="slug" className="input" defaultValue={post.slug} />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Excerpt</label>
          <textarea name="excerpt" className="textarea" defaultValue={post.excerpt ?? ''} />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Content</label>
          <Tiptap name="content" initialContent={post.content ?? ''} />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Cover image URL</label>
          <input name="cover" className="input" defaultValue={post.cover_image_url ?? ''} />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Tags (comma-separated)</label>
          <input name="tags" className="input" defaultValue={(post.tags || []).join(', ')} />
        </div>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="published" defaultChecked={post.published} />
          <span>Published</span>
        </label>
        <div className="flex gap-2">
          <button className="btn btn-primary">Update post</button>
          <a href="/admin" className="btn">Cancel</a>
        </div>
      </form>

      <form action={deleteAction}>
        <button className="btn mt-2" type="submit">Delete post</button>
      </form>
    </div>
  )
}
