import Link from 'next/link'
import { getSortedPostsData } from '../../../lib/posts'
import type { PostMetadata } from '../../../lib/posts'

export const metadata = {
  title: 'Blog | Venkata Janapareddy',
  description: 'Articles about frontend development, data visualization, and web performance',
}

export default function Blog() {
  const allPostsData: PostMetadata[] = getSortedPostsData()

  return (
    <div className="min-h-screen bg-white py-16 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-16">
          <Link
            href="/"
            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-8 inline-block"
          >
            ← Home
          </Link>

          <h1 className="text-5xl md:text-6xl font-light tracking-tight text-neutral-900 mb-4">
            Blog
          </h1>
          <p className="text-lg text-neutral-500 font-light">
            I write about frontend development, data visualization, design systems, web accessibility, and web performance.
          </p>
        </header>

        {/* Blog Posts List */}
        <div className="space-y-12">
          {allPostsData.map(({ id, date, title }) => (
            <article key={id} className="group">
              <Link href={`/blog/${id}`} className="block">
                <time className="text-sm text-neutral-400 font-light mb-2 block">
                  {new Date(date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                <h2 className="text-2xl md:text-3xl font-light text-neutral-900 group-hover:text-neutral-600 transition-colors">
                  {title}
                </h2>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
