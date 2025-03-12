import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-3xl w-full mx-6 text-center">
        {/* Name */}
        <h1 className="text-6xl md:text-7xl font-light tracking-tight text-neutral-900 mb-6">
          Venkata Janapareddy
        </h1>

        {/* Title */}
        <p className="text-xl md:text-2xl text-neutral-500 font-light mb-16">
          Senior Frontend Engineer
        </p>

        {/* Navigation Links */}
        <nav className="flex flex-wrap items-center justify-center gap-8 md:gap-12 text-base md:text-lg">
          <a
            href="https://linkedin.com/in/venkata-janapareddy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-600 hover:text-neutral-900 transition-colors duration-200 font-medium"
          >
            LinkedIn
          </a>

          <a
            href="https://github.com/venkatajanapareddy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-600 hover:text-neutral-900 transition-colors duration-200 font-medium"
          >
            GitHub
          </a>

          <Link
            href="/blog"
            className="text-neutral-600 hover:text-neutral-900 transition-colors duration-200 font-medium"
          >
            Blog
          </Link>

          <Link
            href="/projects"
            className="text-neutral-600 hover:text-neutral-900 transition-colors duration-200 font-medium"
          >
            Projects
          </Link>
        </nav>
      </div>
    </div>
  )
}
