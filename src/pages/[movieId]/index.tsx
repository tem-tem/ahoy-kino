import Head from 'next/head'
import { useRouter } from 'next/router'
import { useContext, useState, useEffect } from 'react'
import { ConfigContext } from '~/components/ConfigContext'
import Movie from '~/components/Movie'
import makeLink from '~/helpers/makeLink'

const MoviePage = () => {
  const { db } = useContext(ConfigContext)
  const [movie, setMovie] = useState(null)
  const [pending, setPending] = useState(true)
  const router = useRouter()
  const { movieId } = router.query

  useEffect(() => {
    if (movieId) {
      db.collection('movies')
        .where('directLink', '==', makeLink(movieId.toString()))
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            setMovie({ id: doc.id, ...doc.data() })
          })
        })
        .catch(error => {
          console.error('Error getting document:', error)
        })
        .finally(() => setPending(false))
    }
  }, [movieId])

  return (
    <div className='container'>
      <Head>
        <title>Ahoy Kino</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        {pending && <div>Loading...</div>}
        {movie && !pending && <Movie movie={movie} />}
        {!movie && !pending && 'Movie Not Found'}
      </main>
    </div>
  )
}

export default MoviePage
