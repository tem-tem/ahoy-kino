import React, { useContext, useCallback, useState, useEffect } from 'react'
import { Movie } from '~/types'
import { ConfigContext } from '../ConfigContext'
import Router from 'next/router'
import Link from 'next/link'
import Screens from '../Screens'

interface IMovieProps {
  movie: Movie
}

export default (movieProps: IMovieProps) => {
  const { movie } = movieProps
  const { currentUser, db } = useContext(ConfigContext)
  const [deleted, setDeleted] = useState(false)
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

  // TODO: move posters to styles.module.scss
  // TODO: make a screen viewer modal
  return (
    <>
      <div
        style={{
          display: `${deleted ? 'none' : 'block'}`,
        }}
      >
        <div className='movieTitleContainer flex-between'>
          <div className='movieInfo'>
            <h2 className='movieTitle'>
              <Link href='/[directLink]' as={movie.directLink}>
                <a>{movie.name}</a>
              </Link>
            </h2>
            <div className='movieDetails'>
              {details.join(' / ')}{' '}
              <span className='movieSubDetails'>
                — {subDetails.join(' / ')}
              </span>
            </div>
          </div>
          {currentUser && (
            <button className='deleteButton' onClick={deleteMovie}>
              Delete
            </button>
          )}
        </div>

        <Screens screens={movie.screens} title={movie.name} />

        <div style={{ textAlign: 'center', margin: 40, color: '#ffffff54' }}>
          🌚
        </div>
        <br />
      </div>

      <style jsx>{`
        .movieTitleContainer {
          margin: 0 0 20px 20px;
          display: inline-block;
        }
        .movieInfo {
          padding-bottom: 10px;
        }
        .movieTitle {
          margin: 0;
          opacity: 0.9;
        }
        .movieTitle + a {
          cursor: pointer;
        }
        .movieTitle a {
          text-decoration: none;
          color: inherit;
        }
        .movieTitle a:hover {
          border-bottom: 1px solid #ffffff7a;
          // text-decoration: underline;
          cursor: pointer;
          // border-bottom: 2px solid;
          color: inherit;
        }
        .deleteButton {
          margin-right: 50px;
          font-size: 1rem;
        }
        .movieDetails {
          margin-top: 10px;
          opacity: 0.7;
        }
        .movieSubDetails {
          opacity: 0.3;
          white-space: pre;
        }
        .posterContainer {
          padding-left: 20px;
          padding-bottom: 30px;
        }
        .poster {
          height: 250px;
        }
      `}</style>
    </>
  )
}
