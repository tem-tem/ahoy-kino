import React, { useContext, useCallback, useState } from 'react'
import { Movie } from '~/types'
import { ConfigContext } from '../ConfigContext'
import Router from 'next/router'
import Link from 'next/link'

interface IMovieProps {
  movie: Movie
  moviePage?: boolean
}

export default (movieProps: IMovieProps) => {
  const { movie, moviePage } = movieProps
  const { currentUser, db } = useContext(ConfigContext)
  const [deleted, setDeleted] = useState(false)
  // const deleteMovie = () => deleteById(movie.id)
  const screenshots = []
  for (let i = 0; i < movie.screens.length; i++) {
    screenshots.push(movie.screens.find(s => s.order === i))
  }

  const deleteFromDB = useCallback(id => {
    db.collection('movies')
      .doc(id)
      .delete()
      .then(() => {
        setDeleted(true)
        Router.push('/')
      })
      .catch(error => {
        console.error('Error removing document: ', error)
      })
  }, [])

  const deleteMovie = useCallback(() => {
    if (confirm(`Delete ${movie.name}?`)) {
      deleteFromDB(movie.id)
    }
  }, [movie])

  return (
    <div
      style={{
        borderBottom: '1px solid',
        paddingBottom: 10,
        display: `${deleted ? 'none' : 'block'}`,
      }}
    >
      <br />
      {moviePage && <div>{movie.name}</div>}
      {!moviePage && (
        <Link href='/[movieId]' as={movie.directLink}>
          <a>{movie.name}</a>
        </Link>
      )}
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
