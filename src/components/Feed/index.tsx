import { useContext, useState, useEffect, useCallback } from 'react'
import { ConfigContext } from '../ConfigContext'
import { Movie as MovieType } from '~/types'
import MovieComponent from '~/components/Movie'
import InfiniteScroll from 'react-infinite-scroller'

interface Props {
  initMovies: MovieType[]
  ELEMENTS_ON_PAGE: number
}

export default ({ initMovies, ELEMENTS_ON_PAGE }: Props) => {
  const { db } = useContext(ConfigContext)
  const [movies, setMovies] = useState<MovieType[]>(initMovies)
  const [lastMovie, setLast] = useState(null)

  useEffect(() => {
    db.collection('movies')
      .doc(movies[movies.length - 1].id)
      .get()
      .then(snap => {
        setLast(snap)
      })
  }, [])

  const loadPage = async () => {
    if (lastMovie) {
      const newPageMovies = await new Promise(
        (
          resolve: (val: { movies: MovieType[]; newLast: any }) => void,
          reject
        ) => {
          console.log('start')
          db.collection('movies')
            .orderBy('createdAt')
            .startAfter(lastMovie)
            .limit(ELEMENTS_ON_PAGE)
            .get()
            .then(snaps => {
              console.log(snaps.docs.length)

              if (snaps.docs.length > 0) {
                const newMovies = []
                snaps.forEach(movieDoc => {
                  newMovies.push({ id: movieDoc.id, ...movieDoc.data() })
                })
                const newLast = snaps.docs[snaps.docs.length - 1]
                resolve({ movies: newMovies, newLast })
              }
              resolve({ movies: [], newLast: undefined })
            })
        }
      )
      setLast(newPageMovies.newLast)
      setMovies(olds => {
        return [...olds, ...newPageMovies.movies]
      })
    }
    return
  }

  return (
    <div>
      <style jsx>{`
        .loader {
          text-align: center;
          padding: 20px;
        }
        .endMessage {
          text-align: center;
          padding: 40px;
          opacity: 0.7;
        }
      `}</style>
      <InfiniteScroll
        pageStart={0}
        initialLoad={false}
        loadMore={loadPage}
        hasMore={lastMovie && true}
        loader={
          <div className='loader' key={0}>
            Loading ...
          </div>
        }
      >
        {movies.map(movie => (
          <MovieComponent key={movie.id} movie={movie} />
        ))}
      </InfiniteScroll>
      {!lastMovie && <div className='endMessage'>This is it for now ♡</div>}
    </div>
  )
}
