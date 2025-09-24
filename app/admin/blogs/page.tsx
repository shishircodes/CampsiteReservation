import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Post, Profile } from '@/types/db'

export const metadata = { title: 'Admin' }

type PostRow = Pick<Post, 'id' | 'title' | 'slug' | 'published' | 'created_at' | 'updated_at'>

export default async function BlogAdminPage() {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error: upsertErr } = await supabase
    .from('profiles')
    .upsert({ id: user.id }, { onConflict: 'id' })
  if (upsertErr) {
    console.error('profiles upsert failed (RLS likely):', upsertErr)
  }

  const { data: prof, error: profErr } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle()
  if (profErr) console.error('profiles select error:', profErr)

  const profile = (prof ?? null) as { is_admin: boolean } | null

  if (!profile?.is_admin) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600">
          You are signed in but not an admin. Ask an admin to grant you access.
        </p>
      </div>
    )
  }

  const { data } = await supabase
    .from('posts')
    .select('id, title, slug, published, created_at, updated_at')
    .order('created_at', { ascending: false })

  const posts = (data ?? []) as PostRow[]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin</h1>
        <Link href="/admin/new" className="btn btn-primary">New Post</Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="py-2 pr-4">Title</th>
              <th className="py-2 pr-4">Slug</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Updated</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {posts.map(p => (
              <tr key={p.id} className="border-t">
                <td className="py-2 pr-4">{p.title}</td>
                <td className="py-2 pr-4">{p.slug}</td>
                <td className="py-2 pr-4">{p.published ? 'Published' : 'Draft'}</td>
                <td className="py-2 pr-4">{new Date(p.updated_at || p.created_at).toLocaleString()}</td>
                <td className="py-2">
                  <Link href={`/admin/edit/${p.id}`} className="text-blue-600 hover:underline">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
