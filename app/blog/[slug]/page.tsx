import { notFound } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Post } from '@/types/db'
import DOMPurify from 'isomorphic-dompurify'

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {

  const { slug } = await params; 

  const supabase = await createSupabaseServerClient()

  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  const post = data as Post | null
  if (!post || !post.published) notFound()

  // Sanitize Tiptap HTML on the server
  const safeHtml = DOMPurify.sanitize(post.content ?? '', {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['target', 'rel'], // keep link target/rel set by your editor
  })

  return (
    <article>
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

      {post.cover_image_url ? (
        <img src={post.cover_image_url} alt="" className="rounded-2xl mb-4 w-full" />
      ) : null}

      {post.excerpt ? <p className="text-gray-600">{post.excerpt}</p> : null}

      {/* Rich HTML content */}
      <div
        className="
          mt-4 leading-7
          [&_h1]:text-2xl [&_h1]:font-bold
          [&_h2]:text-xl  [&_h2]:font-semibold
          [&_h3]:text-lg  [&_h3]:font-semibold
          [&_blockquote]:border-l-4 [&_blockquote]:pl-3 [&_blockquote]:text-gray-600
          [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5
          [&_pre]:rounded [&_pre]:bg-gray-900 [&_pre]:p-3 [&_pre]:text-gray-100
          [&_ul]:list-disc [&_ul]:pl-6
          [&_ol]:list-decimal [&_ol]:pl-6
          [&_a]:text-blue-600 hover:[&_a]:underline
          max-w-none
        "
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />
    </article>
  )
}
