import Head from 'next/head'
import Link from 'next/link'
import Date from '../../components/date'
import Layout, { siteTitle } from '../../components/layout'
import utilStyles from '../../styles/utils.module.css'
import { getSortedProjectsData } from '../../lib/projects'

export default function Projects({ allProjectsData }) {
  return (
    <Layout home>
      <Head>
        <title>Projects | {siteTitle}</title>
      </Head>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/">← Back to home</Link>
      </div>
      <section className={utilStyles.headingMd}>
        <h1 className={utilStyles.headingXl}>Projects</h1>
        <p>
          A collection of web applications and interactive demos showcasing frontend engineering, data visualization, and modern web technologies.
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <ul className={utilStyles.list}>
          {allProjectsData.map(({ id, date, title, description, tech }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/projects/${id}`}>{title}</Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
              <br />
              <p style={{ margin: '0.5rem 0', color: '#666' }}>{description}</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {tech.map(item => (
                  <span
                    key={item}
                    style={{
                      fontSize: '0.875rem',
                      padding: '0.25rem 0.5rem',
                      background: '#f3f4f6',
                      borderRadius: '0.25rem',
                      color: '#374151'
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const allProjectsData = getSortedProjectsData()
  return {
    props: {
      allProjectsData
    }
  }
}
