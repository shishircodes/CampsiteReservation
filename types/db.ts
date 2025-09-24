export type Profile = {
  id: string
  full_name?: string | null
  is_admin: boolean
  created_at: string
}

export type Post = {
  id: string
  author_id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_image_url: string | null
  tags: string[]
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}
