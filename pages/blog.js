import Head from 'next/head'
import Link from 'next/link'
import Date from '../components/date'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData } from '../lib/posts'

export default function Blog({ allPostsData }) {
  return (
    <Layout>
      <Head>
        <title>Blog | {siteTitle}</title>
      </Head>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/">
          <a>← Back to home</a>
        </Link>
      </div>
      <section className={utilStyles.headingMd}>
        <h1 className={utilStyles.headingXl}>Blog</h1>
        <p>
          I write about frontend development, data visualization, design systems, web accessibility, and web performance.
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}
