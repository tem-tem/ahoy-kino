import Head from 'next/head'
import Feed from '~/components/Feed'
import fetch from 'node-fetch'
import { NextPage, NextPageContext } from 'next'
import { Movie, AllMoviesStats } from '~/types'
import loadFirebase from '~/lib/loadFirebase'
import Slider from '~/components/Slider'

interface Props {
  initMovies?: { data: { movies: Movie[] } }
}

const Slides: NextPage<Props> = (props) => {
  const { initMovies } = props
  // const { loading, error, data } = useQuery(MOVIES)

  // if (loading) return <p>Loading...</p>
  // if (error) return <p>Error :(</p>

  // console.log(data)

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
        <Slider initMovies={initMovies} />
        {/* <Feed
          initMovies={pageMovies}
          ELEMENTS_ON_PAGE={ELEMENTS_ON_PAGE}
          stats={stats}
        /> */}
      </main>
    </div>
  )
}

const getProps = () => async (props: NextPageContext) => {
  const url = 'http://api.ahoy.tem-tem.com/graphql'
  const query = `query {
    movies(movieCount: 5, page: 1) {
      name
      screens {
        public_urls {
          thumb
          full
        }
      }
    }
  }`

  const movies = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ query }),
  }).then((r) => r.json())

  console.log(movies)

  return {
    initMovies: movies,
  }
}

Slides.getInitialProps = getProps()

export default Slides
