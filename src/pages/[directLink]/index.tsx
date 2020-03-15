import Head from 'next/head'
import Movie from '~/components/Movie'
import makeLink from '~/helpers/makeLink'
import { NextPage, NextPageContext } from 'next'
import loadFirebase from '~/lib/loadFirebase'
import { Movie as MovieType } from '~/types'

interface Props {
  movieData?: MovieType
}

const MoviePage: NextPage<Props> = props => {
  const { movieData: movie } = props
  if (movie) {
    const description = `${(
      movie.first_air_date || movie.release_date
    ).substring(0, 4)} / ${movie.genres.map(g => g.name).join(' / ')}`
    return (
      <div className='container'>
        <Head>
          <title>Ahoy Kino</title>
          <link rel='icon' href='/favicon.ico' />
          <meta name='title' content={movie.name} />
          <meta name='description' content={description} />

          <meta property='og:type' content='website' />
          <meta
            property='og:url'
            content={`https://ahoy-kino.now.sh/${movie.directLink}`}
          />
          <meta property='og:title' content={movie.name} />
          <meta property='og:description' content={description} />
          <meta
            property='og:image'
            content={movie.screens[4].publicUrls.thumb}
          />
          <meta property='og:image:width' content='1280' />
          <meta property='og:image:height' content='800' />
        </Head>

        <main>
          {movie && <Movie movie={movie} moviePage={true} />}
          {!movie && 'Movie Not Found'}
        </main>
      </div>
    )
  }
}

const getProps = () => async (props: NextPageContext) => {
  const { directLink } = props.query
  const { res } = props

  if (directLink) {
    const db = loadFirebase().firestore()

    const movieData = await new Promise(
      (resolve: (val: MovieType) => void, reject) => {
        db.collection('movies')
          .where('directLink', '==', makeLink(directLink.toString()))
          .get()
          .then(querySnapshot => {
            if (res && querySnapshot.size === 0) {
              res.statusCode = 404
              res.end('Not found')
              reject()
            }
            querySnapshot.forEach(doc => {
              const movie = { id: doc.id, ...(doc.data() as MovieType) }
              resolve(movie)
            })
          })
          .catch(error => {
            reject(error)
          })
      }
    )

    return { movieData }
  }
  return { movieData: null }
}

MoviePage.getInitialProps = getProps()

export default MoviePage
