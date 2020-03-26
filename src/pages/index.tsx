import Head from 'next/head'
import Feed from '~/components/Feed'
import { NextPage, NextPageContext } from 'next'
import { Movie, AllMoviesStats } from '~/types'
import loadFirebase from '~/lib/loadFirebase'

interface Props {
  pageMovies?: Movie[]
  ELEMENTS_ON_PAGE: number
  stats: AllMoviesStats
}

const Home: NextPage<Props> = props => {
  const { pageMovies, ELEMENTS_ON_PAGE, stats } = props

  return (
    <div className='container'>
      <Head>
        <title>ahoy-kino</title>
        <link rel='icon' href='/favicon.ico' />
        <meta name='title' content='придумайте название' />
        <meta name='description' content='название придумайте умоляю' />

        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://metatags.io/' />
        <meta property='og:title' content='придумайте название' />
        <meta property='og:description' content='название придумайте умоляю' />
        <meta property='og:image' content='/preview.jpg' />
        <meta property='og:image:width' content='1280' />
        <meta property='og:image:height' content='800' />

        <meta name='twitter:card' content='summary_large_image' />
        <meta property='twitter:url' content={`https://ahoy-kino.now.sh`} />
        <meta name='twitter:title' content='придумайте название' />
        <meta name='twitter:description' content='название придумайте умоляю' />
        <meta name='twitter:image' content='/preview.jpg' />
      </Head>

      <main>
        <Feed
          initMovies={pageMovies}
          ELEMENTS_ON_PAGE={ELEMENTS_ON_PAGE}
          stats={stats}
        />
      </main>
    </div>
  )
}

const getProps = () => async (props: NextPageContext) => {
  const db = loadFirebase().firestore()
  const ELEMENTS_ON_PAGE = 3

  const stats = await new Promise((resolve: (data: AllMoviesStats) => void) => {
    db.collection('movies')
      .doc('--stats--')
      .get()
      .then(async snap => {
        resolve((await snap.data()) as AllMoviesStats)
      })
  })

  const page = db
    .collection('movies')
    .orderBy('createdAt')
    .limit(ELEMENTS_ON_PAGE)

  const pageMovies = await new Promise(
    (resolve: (val: Movie[]) => void, reject) => {
      page.get().then(snaps => {
        if (snaps.docs.length > 0) {
          const movies = []
          snaps.forEach(movieDoc => {
            movies.push({ id: movieDoc.id, ...movieDoc.data() })
          })
          resolve(movies)
        }
        resolve([])
      })
    }
  )

  return {
    pageMovies,
    ELEMENTS_ON_PAGE,
    stats,
  }
}

Home.getInitialProps = getProps()

export default Home
