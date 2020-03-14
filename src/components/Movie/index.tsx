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
    <>
      <style jsx>{`
        .imagesContainer {
          display: grid;
          grid-template-columns: ${moviePage ? 'auto' : 'auto auto auto'};
          margin-bottom: 40px;
        }
        .imageContainer {
          display: inline-grid;
          position: relative;
        }
        .imageContainer img {
          width: 100%;
          box-sizing: border-box;
        }

        .movieTitleContainer {
          margin: 50px 0 50px 20px;
        }
        .movieTitle {
          font-weight: 100;
          font-size: 2rem;
        }
        .movieTitle + a {
          cursor: pointer;
        }
        .movieTitle a {
          text-decoration: none;
          border-bottom: 2px transparent;
          color: inherit;
        }
        .movieTitle a:hover {
          cursor: pointer;
          border-bottom: 2px solid;
          text-decoration: none;
          color: inherit;
        }
        .deleteButton {
          margin-right: 50px;
          font-size: 1rem;
        }
        .movieDetails {
          margin-top: 20px;
        }
      `}</style>
      <div
        style={{
          display: `${deleted ? 'none' : 'block'}`,
        }}
      >
        <div className='movieTitleContainer flex-between'>
          <div>
            <div className='movieTitle'>
              {moviePage && <div>{movie.name}</div>}
              {!moviePage && (
                <Link href='/[movieId]' as={movie.directLink}>
                  <a>{movie.name}</a>
                </Link>
              )}
            </div>
            <div className='movieDetails'>
              {(movie.first_air_date || movie.release_date).substring(0, 4)} /{' '}
              {movie.genres.map(g => g.name).join(' / ')}
            </div>
          </div>
          {currentUser && (
            <button className='deleteButton' onClick={deleteMovie}>
              Delete
            </button>
          )}
        </div>

        <div className='imagesContainer'>
          {screenshots &&
            screenshots.map(screen => (
              <div key={screen.url} className='imageContainer'>
                <img src={screen.url} />
              </div>
            ))}
        </div>
        <br />
      </div>
    </>
  )
}
