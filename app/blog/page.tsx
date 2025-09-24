import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Post } from '@/types/db'

type PostListItem = Pick<Post, 'id' | 'title' | 'slug' | 'excerpt' | 'published_at'>

export default async function BlogPage() {
  const supabase = await createSupabaseServerClient()

  const { data } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, published_at')
    .eq('published', true)
    .order('published_at', { ascending: false })

  const posts = (data ?? []) as PostListItem[]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Latest posts</h1>
      {!posts.length ? (
        <p className="text-gray-600">No posts yet.</p>
      ) : (
        <ul className="grid gap-4">
          {posts.map((p) => (
            <li key={p.id} className="card">
              <h3 className="text-lg font-semibold mb-1">
                <Link href={`/blog/${p.slug}`} className="hover:underline">{p.title}</Link>
              </h3>
              {p.excerpt ? <p className="text-gray-600">{p.excerpt}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
