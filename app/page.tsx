import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Post } from '@/types/db'


export default async function HomePage() {

  return (
    <div>
      This is Homepage
    </div>
  )
}
