import { useContext, useState, useEffect, useCallback } from 'react'
import { ConfigContext } from '../ConfigContext'
import { Movie as MovieType, AllMoviesStats } from '~/types'
import MovieComponent from '~/components/Movie'
import InfiniteScroll from 'react-infinite-scroller'

interface Props {
  initMovies: MovieType[]
  ELEMENTS_ON_PAGE: number
  stats: AllMoviesStats
}

export default ({ initMovies, ELEMENTS_ON_PAGE, stats }: Props) => {
  const { db } = useContext(ConfigContext)
  const [movies, setMovies] = useState<MovieType[]>(initMovies)
  const [lastMovie, setLast] = useState(null)

  useEffect(() => {
    db.collection('movies')
      .doc(movies[movies.length - 1].id)
      .get()
      .then((snap) => {
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
          db.collection('movies')
            .orderBy('createdAt')
            .startAfter(lastMovie)
            .limit(ELEMENTS_ON_PAGE)
            .get()
            .then((snaps) => {
              if (snaps.docs.length > 0) {
                const newMovies = []
                snaps.forEach((movieDoc) => {
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
      setMovies((olds) => {
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

        .statsContainer {
          display: flex;
          justify-content: flex-end;
        }
        .stats {
          display: inline-block;
          padding: 50px 0 30px;
          margin-right: 20px;
          margin-bottom: 180px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.192);
        }
        .statsTitle {
          font-weight: 100;
          margin: 0;
          color: rgba(255, 255, 255, 0.9);
        }
        .statsTitle span {
          font-weight: 900;
          font-size: 4rem;
          color: white;
        }
        .totalMovies {
          text-align: right;
          color: rgba(255, 255, 255, 0.7);
        }
      `}</style>
      <div className='statsContainer'>
        {/* <div className='stats'>
          <h1 className='statsTitle'>
            <span>{stats.totalAmount * 9}</span> screens
          </h1>
          <div className='totalMovies'>
            from {stats.totalAmount} movies and shows
          </div>
        </div> */}
      </div>
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
        {movies.map((movie) => (
          <MovieComponent key={movie.id} movie={movie} />
        ))}
      </InfiniteScroll>
      {!lastMovie && <div className='endMessage'>This is it for now ♡</div>}
    </div>
  )
}
