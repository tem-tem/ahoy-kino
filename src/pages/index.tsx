import Head from 'next/head'
import fetch from 'node-fetch'
import { NextPage, NextPageContext } from 'next'
import { Movie } from '~/types'
import Slider from '~/components/Slider'
import { useState, useCallback, useEffect } from 'react'

// fullList -- big list of movies (it loads 1000 items)
//    it's used in combination with BLOCK_LENGTH, and lMark:
//    starting with the index of lMark, the BLOCK_LENGTH amount of items is considered as a BLOCK of slides
//    TODO: create a pagination for it?
// BLOCK_LENGTH -- size of the block
// lMark -- index of the current block's first item
// currentBlock -- this block is used in Slider
// atEdge -- currentBlock is at the left or right edge of the fullList

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
  const [isFirstBlock, setFB] = useState(lMark === 0)
  const [isLastBlock, setLB] = useState(
    lMark === fullList.length - (fullList.length % BLOCK_LENGTH)
  )

  useEffect(() => {
    setCurrentBlock(fullList.slice(lMark, lMark + BLOCK_LENGTH))
    setFB(lMark === 0)
    setLB(lMark === fullList.length - (fullList.length % BLOCK_LENGTH))
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
          isFirstBlock={isFirstBlock}
          isLastBlock={isLastBlock}
          // isFirst={lMark === 0}
          // isLast={lMark === fullList.length - (fullList.length % BLOCK_LENGTH)}
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

  return {
    initMovies: movies,
  }
}

Slides.getInitialProps = getProps()

export default Slides
