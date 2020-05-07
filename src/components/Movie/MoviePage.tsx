import React, { useContext, useCallback, useState } from 'react'
import { Movie } from '~/types'
import { ConfigContext } from '../ConfigContext'
import Router from 'next/router'
import Link from 'next/link'
import Genres from '../Genres'
import styles from './styles.module.scss'
import { ImgOContext } from '../ImageOverlay'
import Screens from '../Screens'

interface IMovieProps {
  movie: Movie
  moviePage?: boolean
}

export default (movieProps: IMovieProps) => {
  const { movie, moviePage } = movieProps
  const { currentUser, db } = useContext(ConfigContext)
  const { open: openImgO } = useContext(ImgOContext)
  const [deleted, setDeleted] = useState(false)
  // const deleteMovie = () => deleteById(movie.id)
  const screenshots = []

  const handleImageClick = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    const index = Number(e.currentTarget.getAttribute('data-img-index'))
    const images = movie.screens.map((s) => s.publicUrls.full)
    openImgO(images, index, movie.name)
  }

  for (let i = 0; i < movie.screens.length; i++) {
    screenshots.push(movie.screens.find((s) => s.order === i))
  }
  const deleteFromDB = useCallback((id) => {
    db.collection('movies')
      .doc(id)
      .delete()
      .then(() => {
        setDeleted(true)
        Router.push('/')
      })
      .catch((error) => {
        console.error('Error removing document: ', error)
      })
  }, [])

  const deleteMovie = useCallback(() => {
    if (confirm(`Delete ${movie.name}?`)) {
      deleteFromDB(movie.id)
    }
  }, [movie])

  const getPosterPath = (path) => `https://image.tmdb.org/t/p/w1280${path}`

  const details = [
    (movie.first_air_date || movie.release_date).substring(0, 4),
    `${movie.first_air_date ? 'Series' : 'Movie'}`,
    movie.genres.map((g) => g.name).join(' / '),
  ]

  const subDetails = []
  if (movie.runtime) {
    const hours = Math.floor(movie.runtime / 60)
    const mins = movie.runtime % 60
    subDetails.push(
      `${hours} hour${hours > 1 ? 's' : ''} ${mins} min${mins > 1 ? 's' : ''}`
    )
  }
  if (movie.number_of_seasons) {
    subDetails.push(
      `${movie.number_of_seasons} season${
        movie.number_of_seasons > 1 ? 's' : ''
      }`
    )
    subDetails.push(`${movie.number_of_episodes} episodes`)
  }

  console.log(movie)
  // TODO: move posters to styles.module.scss
  // TODO: make a screen viewer modal
  return (
    <>
      <div
        style={{
          display: `${deleted ? 'none' : 'block'}`,
        }}
      >
        <div className={styles.mainContainer}>
          <div className={styles.movieTitleContainer}>
            <div className={styles.movieInfo}>
              <h2 className={styles.movieTitle}>
                <div>{movie.name}</div>
              </h2>
              <div className={styles.movieDetails}>
                <Genres genres={movie.genres} />
                {/* {details.join(' / ')}{' '} */}
                <span className={styles.movieSubDetails}>
                  {subDetails.join(' / ')}
                </span>
                <div>
                  Release Date: {movie.release_date || movie.first_air_date}
                </div>
                <div>Ahoy Rating: ???</div>
                <div>Average Rating: {movie.vote_average}</div>
                <div>Popularity: {movie.popularity}</div>
                <div>Status: {movie.status}</div>
                <div>Overview: {movie.overview}</div>
              </div>
            </div>
            {/* {currentUser && (
            <button className={styles.deleteButton} onClick={deleteMovie}>
              Delete
            </button>
          )} */}
          </div>
          <div className={styles.posterContainer}>
            <img
              src={getPosterPath(movie.poster_path)}
              alt='poster'
              className={styles.poster}
            />
          </div>
        </div>

        <Screens screens={movie.screens} title={movie.name} />

        <div style={{ textAlign: 'center', margin: 40, color: '#ffffff54' }}>
          🌚
        </div>
        <br />
      </div>
    </>
  )
}
