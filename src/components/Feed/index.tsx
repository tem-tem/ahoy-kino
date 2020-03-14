import { useContext, useState, useEffect, useCallback } from 'react'
import { ConfigContext } from '../ConfigContext'
import { Movie } from '~/types'
import MovieComponent from '~/components/Movie'
import InfiniteScroll from 'react-infinite-scroller'

const ELEMENTS_ON_PAGE = 5

export default () => {
  const { db } = useContext(ConfigContext)
  const [movies, setMovies] = useState<Movie[]>([])

  const [nextPage, setNextPage] = useState(
    db
      .collection('movies')
      .orderBy('createdAt')
      .limit(ELEMENTS_ON_PAGE)
  )
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    loadPage()
  }, [])

  const getMoviesFromSnapshots = useCallback(
    snaps => {
      const newMovies = []
      snaps.forEach(movieDoc => {
        newMovies.push({ id: movieDoc.id, ...movieDoc.data() })
      })
      setMovies(olds => {
        return [...olds, ...newMovies]
      })
    },
    [movies]
  )

  const loadPage = () => {
    if (!nextPage) {
      return
    }

    nextPage.get().then(documentSnapshots => {
      getMoviesFromSnapshots(documentSnapshots)

      if (documentSnapshots.docs.length === ELEMENTS_ON_PAGE) {
        setHasMore(true)
        const lastVisible =
          documentSnapshots.docs[documentSnapshots.docs.length - 1]

        setNextPage(
          db
            .collection('movies')
            .orderBy('createdAt')
            .startAfter(lastVisible)
            .limit(ELEMENTS_ON_PAGE)
        )
        return
      }
      setNextPage(null)
      setHasMore(false)
      return
    })
  }

  return (
    <div>
      <InfiniteScroll
        pageStart={0}
        initialLoad={false}
        loadMore={loadPage}
        hasMore={hasMore}
      >
        {movies.map(movie => (
          <MovieComponent key={movie.id} movie={movie} />
        ))}
      </InfiniteScroll>
      {hasMore && <button onClick={loadPage}>Load more</button>}
    </div>
  )
}
