import Link from 'next/link'
import { getSortedProjectsData } from '../../../lib/projects'

export const metadata = {
  title: 'Projects | Venkata Janapareddy',
  description: 'A collection of web applications and interactive demos showcasing frontend engineering, data visualization, and modern web technologies.',
}

export default function Projects() {
  const allProjectsData = getSortedProjectsData()

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
            Projects
          </h1>
          <p className="text-lg text-neutral-500 font-light">
            A collection of web applications and interactive demos showcasing frontend engineering, data visualization, and modern web technologies.
          </p>
        </header>

        {/* Projects List */}
        <div className="space-y-16">
          {allProjectsData.map(({ id, date, title, description, tech }) => (
            <article key={id} className="group">
              <Link href={`/projects/${id}`} className="block">
                <time className="text-sm text-neutral-400 font-light mb-2 block">
                  {new Date(date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                <h2 className="text-2xl md:text-3xl font-light text-neutral-900 group-hover:text-neutral-600 transition-colors mb-3">
                  {title}
                </h2>
                <p className="text-base text-neutral-500 font-light mb-4">
                  {description}
                </p>
                <div className="flex flex-wrap gap-3">
                  {tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs text-neutral-400 font-light"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
