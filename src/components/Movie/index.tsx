import React, { useContext } from 'react'
import { Movie } from '~/types'
import { ConfigContext } from '../ConfigContext'

interface IMovieProps {
  movie: Movie
  deleteById: (id: string) => void
}

export default (movieProps: IMovieProps) => {
  const { movie, deleteById } = movieProps
  const { currentUser } = useContext(ConfigContext)
  const deleteMovie = () => deleteById(movie.id)
  const screenshots = []
  for (let i = 0; i < movie.screens.length; i++) {
    screenshots.push(movie.screens.find(s => s.order === i))
  }

  return (
    <div style={{ borderBottom: '1px solid', paddingBottom: 10 }}>
      <br />
      <div>{movie.id}</div>
      <div>{movie.name}</div>
      <div>
        {screenshots &&
          screenshots.map(screen => (
            <img src={screen.url} height={100} key={screen.url} />
          ))}
      </div>
      <div>
        {movie.screens &&
          movie.screens.map(screen => (
            <img src={screen.url} height={100} key={screen.url} />
          ))}
      </div>
      {currentUser && <button onClick={deleteMovie}>Delete</button>}
      <br />
    </div>
  )
}
