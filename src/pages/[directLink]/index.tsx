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

  return (
    <div className='container'>
      <Head>
        <title>Ahoy Kino</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        {movie && <Movie movie={movie} moviePage={true} />}
        {!movie && 'Movie Not Found'}
      </main>
    </div>
  )
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
            console.log(querySnapshot.size)
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
