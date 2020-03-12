import { useContext, useState, useEffect, useCallback } from 'react'
import { ConfigContext } from '../ConfigContext'
import { Movie } from '~/types'
import MovieComponent from '~/components/Movie'

export default () => {
  const { db } = useContext(ConfigContext)
  const [movies, setMovies] = useState<Movie[]>([])

  // Movies listener
  //
  useEffect(() => {
    const unsubscribe = db.collection('movies').onSnapshot(moviesSnapshot => {
      const moviesData = []
      moviesSnapshot.forEach(movieDoc => {
        moviesData.push({ id: movieDoc.id, ...movieDoc.data() })
      })
      setMovies(moviesData)
    })
    return () => {
      unsubscribe()
    }
  }, [db])

  const deleteById = useCallback(id => {
    db.collection('movies')
      .doc(id)
      .delete()
      .then(() => {
        console.log('Document successfully deleted!')
      })
      .catch(function(error) {
        console.error('Error removing document: ', error)
      })
  }, [])

  return (
    <div>
      {movies.map(movie => (
        <MovieComponent key={movie.id} movie={movie} deleteById={deleteById} />
      ))}
    </div>
  )
}
