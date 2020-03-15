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
  const { directLink } = router.query

  useEffect(() => {
    if (directLink) {
      db.collection('movies')
        .where('directLink', '==', makeLink(directLink.toString()))
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
  }, [directLink])

  return (
    <div className='container'>
      <Head>
        <title>Ahoy Kino</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        {pending && <div>Loading...</div>}
        {movie && !pending && <Movie movie={movie} moviePage={true} />}
        {!movie && !pending && 'Movie Not Found'}
      </main>
    </div>
  )
}

export default MoviePage
