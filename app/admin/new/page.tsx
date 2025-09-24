import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { createPost } from '@/app/actions/posts'
import Tiptap from '@/components/Tiptap'

export const metadata = { title: 'New Post' }

export default async function NewPostPage() {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).maybeSingle()
  if (!(profile as any)?.is_admin) redirect('/admin')

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">New Post</h1>
      <form action={createPost} className="space-y-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Title</label>
          <input name="title" className="input" required />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Slug (optional)</label>
          <input name="slug" className="input" placeholder="auto-from-title if blank" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Excerpt</label>
          <textarea name="excerpt" className="textarea" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Content</label>
          <Tiptap name="content" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Cover image URL</label>
          <input name="cover" className="input" placeholder="https://..." />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Tags (comma-separated)</label>
          <input name="tags" className="input" placeholder="nextjs, supabase" />
        </div>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="published" />
          <span>Published</span>
        </label>
        <div className="flex gap-2">
          <button className="btn btn-primary">Create post</button>
          <a href="/admin" className="btn">Cancel</a>
        </div>
      </form>
    </div>
  )
}
