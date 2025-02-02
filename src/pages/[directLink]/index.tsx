import Head from 'next/head'
import makeLink from '~/helpers/makeLink'
import MoviePageComponent from '~/components/Movie/MoviePage'
import { NextPage, NextPageContext } from 'next'
import loadFirebase from '~/lib/loadFirebase'
import { Movie as MovieType } from '~/types'
import fetch from 'node-fetch'

interface Props {
  movieData?: MovieType
}
const apiKey = process.env.TMDB_KEY

const MoviePage: NextPage<Props> = (props) => {
  const { movieData: movie } = props
  console.log(movie)
  if (movie) {
    const description = `${(
      movie.first_air_date || movie.release_date
    ).substring(0, 4)} / ${movie.genres.map((g) => g.name).join(' / ')}`

    const imgUrl =
      movie.screens.length > 1
        ? movie.screens[4].publicUrls.thumb
        : `https://image.tmdb.org/t/p/w780${movie.poster_path}`
    return (
      <div className='container'>
        <Head>
          <title>Ahoy Kino</title>
          <link rel='icon' href='/favicon.ico' />
          <meta name='title' content={movie.name} />
          <meta name='description' content={description} />

          <meta property='og:type' content='website' />
          <meta
            property='og:url'
            content={`https://ahoy-kino.now.sh/${movie.directLink}`}
          />
          <meta property='og:title' content={movie.name} />
          <meta property='og:description' content={description} />
          {imgUrl && <meta name='og:image' content={imgUrl} />}

          <meta property='og:image:width' content='1280' />
          <meta property='og:image:height' content='800' />

          <meta name='twitter:card' content='summary_large_image' />
          <meta
            property='twitter:url'
            content={`https://ahoy-kino.now.sh/${movie.directLink}`}
          />
          <meta name='twitter:title' content={movie.name} />
          <meta name='twitter:description' content={description} />
          {imgUrl && <meta name='twitter:image' content={imgUrl} />}
        </Head>

        <main>
          {movie && <MoviePageComponent movie={movie} />}
          {!movie && 'Movie Not Found'}
        </main>
      </div>
    )
  }
}

const getProps = () => async (props: NextPageContext) => {
  const { directLink } = props.query
  const { res } = props

  if (directLink) {
    const db = loadFirebase().firestore()

    const movieData = await new Promise(
      (resolve: (val: MovieType) => void, reject) => {
        db.collection('movies')
          .where('directLink', '==', makeLink(directLink.toString()))
          .get()
          .then((querySnapshot) => {
            if (res && querySnapshot.size === 0) {
              res.statusCode = 404
              res.end('Not found')
              reject()
            }
            querySnapshot.forEach((doc) => {
              const movie = { id: doc.id, ...(doc.data() as MovieType) }
              resolve(movie)
            })
          })
          .catch((error) => {
            reject(error)
          })
      }
    )

    const poster = await new Promise((resolve, reject) =>
      fetch(`https://api.themoviedb.org/3/${
        movieData.first_air_date ? 'tv' : 'movie'
      }/${movieData.tmdb_id}?api_key=${apiKey}
  `)
        .then((response) => {
          return response.json()
        })
        .then((data) => {
          if (data) {
            resolve(data.poster_path)
            return
          }
          reject('fuck')
        })
    )

    if (poster !== 'fuck') {
      movieData.poster_path = poster as string
    }
    return { movieData }
  }
  return { movieData: null }
}

MoviePage.getInitialProps = getProps()

export default MoviePage
