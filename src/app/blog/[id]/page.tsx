import Link from 'next/link'
import { getPostData } from '../../../../lib/posts'
import type { PostData } from '../../../../lib/posts'
import fs from 'fs'
import path from 'path'

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), 'posts')
  const fileNames = fs.readdirSync(postsDirectory)

  return fileNames.map((fileName) => ({
    id: fileName.replace(/\.md$/, ''),
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const postData: PostData = await getPostData(id)
  return {
    title: `${postData.title} | Venkata Janapareddy`,
    description: postData.title,
  }
}

export default async function Post({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const postData: PostData = await getPostData(id)

  return (
    <div className="min-h-screen bg-white py-16 px-6">
      <article className="max-w-3xl mx-auto">
        <Link
          href="/blog"
          className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-12 inline-block"
        >
          ← Blog
        </Link>

        <header className="mb-12">
          <time className="text-sm text-neutral-400 font-light mb-4 block">
            {new Date(postData.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-neutral-900">
            {postData.title}
          </h1>
        </header>

        <div
          className="prose prose-neutral prose-lg max-w-none
            prose-headings:font-light prose-headings:tracking-tight prose-headings:text-neutral-900
            prose-p:text-neutral-600 prose-p:leading-relaxed prose-p:font-light
            prose-a:text-neutral-900 prose-a:underline prose-a:decoration-neutral-300 hover:prose-a:decoration-neutral-900
            prose-code:text-neutral-800 prose-code:bg-neutral-100 prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:font-mono prose-code:text-sm prose-code:font-normal
            prose-pre:bg-neutral-50 prose-pre:text-neutral-800 prose-pre:border prose-pre:border-neutral-200 prose-pre:rounded-lg prose-pre:shadow-sm
            prose-pre:code:bg-transparent prose-pre:code:p-0 prose-pre:code:text-neutral-800
            prose-strong:text-neutral-900 prose-strong:font-medium
            prose-ul:text-neutral-600 prose-ol:text-neutral-600
            prose-li:text-neutral-600 prose-li:font-light"
          dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
        />
      </article>
    </div>
  )
}
