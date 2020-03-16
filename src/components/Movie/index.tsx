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

  const getPosterPath = path => `https://image.tmdb.org/t/p/w780${path}`

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
          margin: 0 0 50px 20px;
          position: sticky;
          top: 0;
          z-index: 999;
          max-width: calc(100vw - 200px);
          display: inline-block;
        }
        .movieInfo {
          padding-bottom: 10px;
        }
        .movieTitle {
          margin: 0;
        }
        .movieTitle + a {
          cursor: pointer;
        }
        .movieTitle a {
          text-decoration: none;
          // border-bottom: 2px transparent;
          color: inherit;
        }
        .movieTitle a:hover {
          cursor: pointer;
          // border-bottom: 2px solid;
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
        .poster {
          height: 250px;
          padding-bottom: 30px;
        }
      `}</style>
      <div
        style={{
          display: `${deleted ? 'none' : 'block'}`,
        }}
      >
        {moviePage && (
          <img
            src={getPosterPath(movie.poster_path)}
            alt='poster'
            className='poster'
          />
        )}
        <div className='movieTitleContainer flex-between'>
          <div className='movieInfo'>
            <h2 className='movieTitle'>
              {moviePage && <div>{movie.name}</div>}
              {!moviePage && (
                <Link href='/[directLink]' as={movie.directLink}>
                  <a>{movie.name}</a>
                </Link>
              )}
            </h2>
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
            screenshots.map(screen => {
              if (screen.publicUrls) {
                let url = screen.publicUrls.thumb
                if (moviePage) {
                  url = screen.publicUrls.full
                }
                return (
                  <div key={url} className='imageContainer'>
                    <img src={url} />
                  </div>
                )
              }
            })}
        </div>

        {/* <div className='imagesContainer'>
          {screenshots &&
            screenshots.map(screen => (
              <div key={screen.url} className='imageContainer'>
                <img src={screen.url} />
              </div>
            ))}
        </div> */}
        <br />
      </div>
    </>
  )
}
