import React, { useState, useEffect, useCallback } from 'react'
import styles from './styles.module.scss'
import { Movie } from '~/types'
import Screens from '../Screens'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'

const SCROLL_STRENGTH = 500
const SCROLL_HOLD_TIME = 500

interface ISlider {
  movies: Movie[]
  setNextBlock?: (currentSlideNumber: number) => boolean
  setPrevBlock?: (currentSlideNumber: number) => boolean
  isFirstBlock: boolean
  isLastBlock: boolean
}

export default (props: ISlider) => {
  const {
    movies,
    setNextBlock,
    setPrevBlock,
    isFirstBlock,
    isLastBlock,
  } = props
  const [currentSlide, setCurrentSlide] = useState(0)
  const controls = useAnimation()
  const [isFirstSlide, setF] = useState(isFirstBlock && currentSlide === 0)
  const [isLastSlide, setL] = useState(
    isLastBlock && currentSlide === movies.length - 1
  )

  // framer-motion animation hack -- smoothes the transition to the next page
  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
    })
    setF(isFirstBlock && currentSlide === 0)
    setL(isLastBlock && currentSlide === movies.length - 1)
  }, [currentSlide])

  // next slide
  const next = useCallback(() => {
    setCurrentSlide((curr) => (curr === movies.length - 1 ? curr : curr + 1))

    if (setNextBlock && setNextBlock(currentSlide)) {
      // reset current slide on next block
      setCurrentSlide(0)
    }
  }, [currentSlide])

  // previous slide
  const prev = useCallback(() => {
    setCurrentSlide((curr) => (curr === 0 ? curr : curr - 1))

    if (setPrevBlock && setPrevBlock(currentSlide)) {
      // set current slide to last item on previous block
      setCurrentSlide(movies.length - 1)
    }
  }, [currentSlide])

  const getAnimate = useCallback((index, currentSlideNumber) => {
    if (index === currentSlideNumber) {
      return controls
    }
    if (index < currentSlideNumber) {
      if (index + 2 < currentSlideNumber) {
        return { opacity: 0, y: '100vh' }
      }
      return { opacity: 0, y: '-100vh' }
    }
    if (index > currentSlideNumber) {
      if (index - 2 > currentSlideNumber) {
        return { opacity: 0, y: '-100vh' }
      }
      return { opacity: 0, y: '100vh' }
    }
  }, [])

  const slides = movies.map((movie, index) => (
    <motion.div
      key={`${index}-motion`}
      initial={{ opacity: 0, y: '100vh' }}
      animate={getAnimate(index, currentSlide)}
      transition={{ ease: 'easeOut', duration: 0.4 }}
    >
      <Slide key={index} movie={movie} />
    </motion.div>
  ))
  return (
    <div>
      <ScrollMaster
        {...{
          next,
          prev,
          isFirstSlide,
          isLastSlide,
        }}
      />
      <AnimatePresence>{slides}</AnimatePresence>
    </div>
  )
}

interface ISlide {
  movie: Movie
}

const Slide = (props: ISlide) => {
  const { movie } = props

  const details = [
    (movie.first_air_date || movie.release_date).substring(0, 4),
    `${movie.release_date ? 'Movie' : 'Series'}`,
    movie.genres.map((g) => g.name).join(' / '),
  ]

  return (
    <div className={styles.slideContainer}>
      <h2>{movie.name}</h2>
      <div>{details.join(' / ')}</div>
      <div className={styles.screensContainer}>
        <Screens screens={movie.screens} title={movie.name} />
      </div>
    </div>
  )
}

// Scroll controller + indicator

interface IScrollMaster {
  next: () => void
  prev: () => void
  isFirstSlide: boolean
  isLastSlide: boolean
}

const ScrollMaster = (props: IScrollMaster) => {
  const [wheelLoad, setWheelLoad] = useState(0)
  const { next, prev, isFirstSlide, isLastSlide } = props

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
    setWheelLoad((curr) => curr + e.deltaY)
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
  // const indicatorHeight = wheelLoadPercent
  const indicatorHeight =
    wheelLoadPercent < 0
      ? isFirstSlide
        ? 0
        : wheelLoadPercent
      : isLastSlide
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
