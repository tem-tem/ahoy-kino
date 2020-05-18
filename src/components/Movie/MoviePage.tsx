import React, { useContext, useCallback, useState, useEffect } from 'react'
import { Movie } from '~/types'
import { ConfigContext } from '../ConfigContext'
import Router from 'next/router'
import Genres from '../Genres'
import styles from './styles.module.scss'
import Screens from '../Screens'
import Vibrant from 'node-vibrant'

interface IMovieProps {
  movie: Movie
  moviePage?: boolean
}

export default (movieProps: IMovieProps) => {
  const { movie } = movieProps
  const { db } = useContext(ConfigContext)
  const [deleted, setDeleted] = useState(false)
  const [accent, setAccent] = useState('')
  const [titleStyle, setTitleStyle] = useState(styles.neonTitle)
  const screenshots = []

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

  const getAccentColor = async (pic) => {
    const a = await new Promise((resolve: (val: number[]) => void) =>
      Vibrant.from(pic)
        .getPalette()
        .then((palette) => resolve(palette.Vibrant.rgb))
    )
    return a
  }

  useEffect(() => {
    getAccentColor(getPosterPath(movie.poster_path)).then((a) =>
      setAccent(a.join(','))
    )
    setTitleStyle(`${styles.neonTitle} accent`)
  }, [])

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
              <h2 className={`${titleStyle}`}>{movie.name}</h2>
              {/* <h2 className={styles.movieTitle}>
                <div>{movie.name}</div>
              </h2> */}
              <div className={styles.movieDetails}>
                <div className={styles.overview}>{movie.overview}</div>

                <Genres genres={movie.genres} />
              </div>
            </div>
          </div>
          <div>
            <div className={`${styles.posterContainer} posterAccent`}>
              <img
                src={getPosterPath(movie.poster_path)}
                alt='poster'
                className={styles.poster}
              />
              {/* <div>Ahoy Rating: ???</div> */}
            </div>

            <div className={styles.subPosterDetails}>
              <span className={styles.movieSubDetails}>
                {subDetails.join(' / ')}
              </span>
              <div>Status: {movie.status}</div>

              <span style={{ display: 'block' }}>
                {new Date(
                  movie.release_date || movie.first_air_date
                ).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>

              <div>Average Rating: {movie.vote_average}</div>
              <div>Popularity: {movie.popularity}</div>
            </div>
          </div>
        </div>

        {/* <div className={styles.lineContainer}>
          <div className={styles.line}>{movie.overview}</div>
        </div> */}

        <Screens screens={movie.screens} title={movie.name} />

        <div style={{ textAlign: 'center', margin: 40, color: '#ffffff54' }}>
          🌚
        </div>
        <br />
      </div>
      <style jsx>{`
        .accent {
          // text-shadow: 0px 1px 20px rgb(${accent});
          // -webkit-text-stroke: 1px rgb(${accent});
          color: rgb(${accent});
        }
        .posterAccent {
          box-shadow: 10px 10px 0 rgb(${accent});
        }
      `}</style>
    </>
  )
}
