import Head from 'next/head'
import fetch from 'node-fetch'
import { NextPage, NextPageContext } from 'next'
import { Movie, AllMoviesStats } from '~/types'
import Slider from '~/components/Slider'
import { useState, useCallback, useEffect } from 'react'

// fullList -- big list of movies (it loads 1000 items)
//    it's used in combination with BLOCK_LENGTH, and lMark:
//    starting with the index of lMark, the BLOCK_LENGTH amount of items is considered as a BLOCK of slides
//    TODO: create a pagination for it?
// BLOCK_LENGTH -- size of the block
// lMark -- index of the current block's first item
// currentBlock -- this block is used in Slider

interface Props {
  initMovies?: { data: { movies: Movie[] } }
}

const BLOCK_LENGTH = 5

const Slides: NextPage<Props> = (props) => {
  const { initMovies } = props
  const [fullList] = useState(initMovies.data.movies)
  const [lMark, setLMark] = useState(0)
  const [currentBlock, setCurrentBlock] = useState(
    fullList.slice(lMark, lMark + BLOCK_LENGTH)
  )

  useEffect(() => {
    setCurrentBlock(fullList.slice(lMark, lMark + BLOCK_LENGTH))
  }, [lMark])

  const setNextBlock = useCallback(
    (slideNumber) => {
      if (
        slideNumber === BLOCK_LENGTH - 1 &&
        lMark <= fullList.length - BLOCK_LENGTH
      ) {
        // slideNumber is at the right edge -- no next slide
        // moving lMark to load next block of slides
        setLMark((old) => old + BLOCK_LENGTH)
        return true
      }
      // no need to load next block of slides
      return false
    },
    [lMark, fullList]
  )

  const setPrevBlock = useCallback(
    (slideNumber) => {
      if (slideNumber === 0 && lMark >= BLOCK_LENGTH) {
        // slideNumber is at the left edge -- no previous slide
        // moving lMark to the lefft, to load previous block of slides
        setLMark((old) => old - BLOCK_LENGTH)
        return true
      }
      // no need to load previous block of slides
      return false
    },
    [lMark]
  )

  return (
    <div className='container'>
      <Head>
        <title>ahoy-kino</title>
        <link rel='icon' href='/favicon.ico' />
        <meta name='title' content='придумайте название' />
        <meta name='description' content='название придумайте умоляю' />

        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://metatags.io/' />
        <meta property='og:title' content='придумайте название' />
        <meta property='og:description' content='название придумайте умоляю' />
        <meta property='og:image' content='/preview.jpg' />
        <meta property='og:image:width' content='1280' />
        <meta property='og:image:height' content='800' />

        <meta name='twitter:card' content='summary_large_image' />
        <meta property='twitter:url' content={`https://ahoy-kino.now.sh`} />
        <meta name='twitter:title' content='придумайте название' />
        <meta name='twitter:description' content='название придумайте умоляю' />
        <meta name='twitter:image' content='/preview.jpg' />
      </Head>

      <main>
        <Slider
          movies={currentBlock}
          setNextBlock={setNextBlock}
          setPrevBlock={setPrevBlock}
        />
      </main>
    </div>
  )
}

const getProps = () => async (props: NextPageContext) => {
  const url = 'http://api.ahoy.tem-tem.com/graphql'
  const query = `query {
    movies(movieCount: 1000, page: 1) {
      name
      genres {
        name
      }
      release_date
      screens {
        public_urls {
          thumb
          full
        }
      }
    }
  }`

  const movies = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ query }),
  }).then((r) => r.json())

  console.log(movies)

  return {
    initMovies: movies,
  }
}

Slides.getInitialProps = getProps()

export default Slides

// const [movies, setmovies] = useState<Movie[]>(initMovies.data.movies)

// const [page, setPage] = useState(2)

// const moviesQuery = gql`
//   query Movies($page: Int!) {
//     movies(movieCount: 5, page: $page) {
//       name
//       genres {
//         name
//       }
//       release_date
//       screens {
//         public_urls {
//           thumb
//           full
//         }
//       }
//     }
//   }
// `
// const { loading, error, data: moviesPage, fetchMore } = useQuery(
//   moviesQuery,
//   {
//     variables: {
//       page,
//     },
//     fetchPolicy: 'cache-and-network',
//   }
// )

// const loadNewPage = () =>
//   fetchMore({
//     variables: {
//       page: moviesPage.movies.length / 5 + 1,
//     },
//     updateQuery: (prevPage, { fetchMoreResult }) => {
//       console.log('fetchMoreResult', fetchMoreResult)
//       if (!fetchMoreResult) return prevPage
//       return {
//         ...prevPage,
//         ...{ movies: [...prevPage.movies, ...fetchMoreResult.movies] },
//       }
//       // return Object.assign({}, prevPage, {
//       //   feed: [...prevPage.movies, ...fetchMoreResult.movies],
//       // })
//     },
//   })

// console.log('error', error)
// console.log('newPageMovies', newPageMovies)

// useEffect(() => {
//   if (movies) {
//     console.log('newPageMovies', movies)
//     setmovies((old) => [...movies.movies, ...old])
//   }
// }, [movies])

// if (loading) return <p>Loading...</p>
// if (error) return <p>Error :(</p>
