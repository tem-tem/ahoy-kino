import Head from 'next/head'
import { useRouter } from 'next/router'
import { useContext, useState, useEffect } from 'react'
import { ConfigContext } from '~/components/ConfigContext'
import Movie from '~/components/Movie'

const MoviePage = () => {
  const { db } = useContext(ConfigContext)
  const [movie, setMovie] = useState(null)
  const router = useRouter()
  const { movieId } = router.query

  useEffect(() => {
    if (movieId) {
      db.collection('movies')
        .where('directLink', '==', encodeURI(movieId.toString()))
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            setMovie(doc.data())
          })
        })
        .catch(error => {
          console.error('Error getting document:', error)
        })
    }
  }, [movieId])

  return (
    <div className='container'>
      <Head>
        <title>Ahoy Kino</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        {movie && <Movie movie={movie} />}
        {!movie && 'Not Found'}
      </main>
    </div>
  )
}

export default MoviePage
