import React from 'react'
import { Movie } from '~/types'

interface IMovieProps {
  movie: Movie
  deleteById: (id: string) => void
}

export default (movieProps: IMovieProps) => {
  const { movie, deleteById } = movieProps
  const deleteMovie = () => deleteById(movie.id)

  return (
    <div style={{ borderBottom: '1px solid', paddingBottom: 10 }}>
      <br />
      <div>{movie.id}</div>
      <div>{movie.name}</div>
      <div>
        {movie.screens.map(screen => (
          <img src={screen.url} height={100} key={screen.url} />
        ))}
      </div>
      <button onClick={deleteMovie}>Delete</button>
      <br />
    </div>
  )
}
