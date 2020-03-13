import React, { useContext, useCallback, useState } from 'react'
import { Movie } from '~/types'
import { ConfigContext } from '../ConfigContext'

interface IMovieProps {
  movie: Movie
}

export default (movieProps: IMovieProps) => {
  const { movie } = movieProps
  const { currentUser, db } = useContext(ConfigContext)
  const [deleted, setDeleted] = useState(false)
  // const deleteMovie = () => deleteById(movie.id)
  const screenshots = []
  for (let i = 0; i < movie.screens.length; i++) {
    screenshots.push(movie.screens.find(s => s.order === i))
  }

  const deleteMovie = useCallback(() => {
    db.collection('movies')
      .doc(movie.id)
      .delete()
      .then(() => {
        setDeleted(true)
      })
      .catch(function(error) {
        console.error('Error removing document: ', error)
      })
  }, [])

  return (
    <div
      style={{
        borderBottom: '1px solid',
        paddingBottom: 10,
        display: `${deleted ? 'none' : 'block'}`,
      }}
    >
      <br />
      <div>{movie.id}</div>
      <div>{movie.name}</div>
      <div>
        {screenshots &&
          screenshots.map(screen => (
            <img src={screen.url} height={100} key={screen.url} />
          ))}
      </div>
      {currentUser && <button onClick={deleteMovie}>Delete</button>}
      <br />
    </div>
  )
}
