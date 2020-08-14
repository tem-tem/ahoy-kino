import React, { useState, useEffect } from 'react'
import styles from './styles.module.scss'
import { Movie } from '~/types'
import { useQuery, gql } from '@apollo/client'
import Screens from '../Screens'

const SCROLL_STRENGTH = 500
const SCROLL_HOLD_TIME = 500

interface ISlider {
  initMovies: { data: { movies: Movie[] } }
}

export default (props: ISlider) => {
  // TODO: deal with pagination
  // TODO: use real data
  const { initMovies } = props
  const [allMovies, setAllMovies] = useState<Movie[]>(initMovies.data.movies)

  const [page, setPage] = useState(2)

  const moviesQuery = gql`
    query {
      movies(movieCount: 5, page: ${page}) {
        name
        screens {
          public_urls {
            thumb,
            full
          }
        }
      }
    }
  `
  const { loading, error, data: newPageMovies } = useQuery(moviesQuery)

  console.log(error)
  useEffect(() => {
    if (newPageMovies) {
      console.log(newPageMovies.data)
      setAllMovies((old) => [...old, ...newPageMovies.data.movies])
    }
  }, [newPageMovies])

  // if (loading) return <p>Loading...</p>
  // if (error) return <p>Error :(</p>

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isFirst, setFirst] = useState(true)
  const [isLast, setLast] = useState(false)

  // const data = ['grey', 'yellow', 'green', 'blue', 'orange', 'pink']

  const next = () => {
    console.log('next')
    setCurrentSlide((old) =>
      currentSlide === allMovies.length - 1 ? old : old + 1
    )
  }
  const prev = () => {
    console.log('prev')
    setCurrentSlide((old) => (currentSlide === 0 ? old : old - 1))
  }
  useEffect(() => {
    console.log('currentSlide', currentSlide)
    setFirst(false)
    setLast(false)
    if (currentSlide === 0) {
      setFirst(true)
    }
    if (currentSlide === allMovies.length - 1) {
      setLast(true)
    }
  }, [currentSlide])

  const slides = allMovies
    // .reverse()
    .map((movie, index) => (
      <Slide
        key={index}
        movie={movie}
        above={index > allMovies.length - currentSlide - 1}
      />
    ))
  return (
    <div>
      <ScrollMaster {...{ next, prev, isFirst, isLast }} />
      {slides}
    </div>
  )
}

interface ISlide {
  movie: Movie
  above: boolean
}

const Slide = (props: ISlide) => {
  const top = props.above ? '-120vh' : 0

  useEffect(() => {
    console.log('props.above', props.above)
  }, [props.above])

  return (
    <>
      <div className={styles.slideContainer} style={{ top }}>
        {props.movie.name}
        <Screens screens={props.movie.screens} title={props.movie.name} />
      </div>
    </>
  )
}

// Scroll controller + indicator

interface IScrollMaster {
  next: () => void
  prev: () => void
  isFirst: boolean
  isLast: boolean
}

const ScrollMaster = (props: IScrollMaster) => {
  const [wheelLoad, setWheelLoad] = useState(0)
  const { next, prev, isFirst, isLast } = props

  const [timer, setTimer] = useState(null)

  useEffect(() => {
    window.addEventListener('wheel', handleWheelChange)
    window.addEventListener('swiped-up', handleSwipeUp)
    window.addEventListener('swiped-down', handleSwipeDown)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('wheel', handleWheelChange)
      window.removeEventListener('swiped-up', handleSwipeUp)
      window.removeEventListener('swiped-down', handleSwipeDown)
    }
  })

  const handleKeyDown = (e) => {
    if (e.code === 'Space' || e.code === 'ArrowDown') {
      next()
    }
    if (e.code === 'ArrowUp') {
      prev()
    }
  }

  const handleSwipeUp = (e) => {
    next()
  }
  const handleSwipeDown = (e) => {
    prev()
  }

  const handleWheelChange = (e) => {
    // e.preventDefault()
    e.stopPropagation()
    setWheelLoad((old) => old + e.deltaY)
    return false
  }

  useEffect(() => {
    clearTimeout(timer)
    setTimer(setTimeout(() => setWheelLoad(0), SCROLL_HOLD_TIME))
  }, [wheelLoad])

  useEffect(() => {
    if (Math.abs(wheelLoad) > SCROLL_STRENGTH) {
      if (wheelLoad > 0) {
        next()
      } else {
        prev()
      }
      setWheelLoad(0)
    }
  }, [wheelLoad])

  const wheelLoadPercent = wheelLoad / (SCROLL_STRENGTH / 100)
  const indicatorHeight =
    wheelLoadPercent < 0
      ? isFirst
        ? 0
        : wheelLoadPercent
      : isLast
      ? 0
      : wheelLoadPercent

  const position = indicatorHeight > 0 ? { bottom: 0 } : { top: 0 }
  const indicatorDimensions = {
    height: `${Math.abs(indicatorHeight)}vh`,
    ...position,
  }

  return (
    <div style={{ position: 'fixed', right: '0', zIndex: 999 }}>
      {/* wheel load {wheelLoadPercent} % */}
      <div
        className={styles.scrollState}
        style={{
          left: 0,
          ...indicatorDimensions,
        }}
      />
      <div
        className={styles.scrollState}
        style={{
          right: 0,
          ...indicatorDimensions,
        }}
      />
    </div>
  )
}
