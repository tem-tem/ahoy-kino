import React, {
  useEffect,
  createContext,
  useCallback,
  useMemo,
  useState,
  useRef,
} from 'react'
import Modal from 'react-modal'
import styles from './styles.module.scss'

interface IImgOverlay {
  open: (images: string[], index: number, title: string) => void
}

export const ImgOContext = createContext<IImgOverlay>({
  open: () => undefined,
})

export const ImgOProvider = ({
  children,
}: React.PropsWithChildren<IImgOverlay>) => {
  const [isOpen, setOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState<number>(-1)
  const [imagesToShow, setImages] = useState<string[]>([])
  const [title, setTitle] = useState<string>('')
  const ref = useRef(null)
  // const style = useStyles()

  const open = (srcs: string[], number: number, newTitle: string) => {
    setCurrentIndex(number)
    setImages(srcs)
    setTitle(newTitle)
    setOpen(true)
  }

  const handleArrowKeyPress = (event: KeyboardEvent) => {
    if (!isOverlayOpen) {
      return
    }
    const { keyCode } = event
    let newIndex = currentIndex

    // left arrow
    if (keyCode === 37) {
      newIndex = currentIndex - 1
      if (newIndex < 0) {
        newIndex = imagesToShow.length - 1
      }
    }

    // right arrow
    if (keyCode === 39) {
      newIndex = currentIndex + 1
      if (newIndex === imagesToShow.length) {
        newIndex = 0
      }
    }

    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleArrowKeyPress)
    // window.document.getElementById()

    return () => {
      window.removeEventListener('keydown', handleArrowKeyPress)
    }
  })

  const close = useCallback(() => {
    setCurrentIndex(-1)
    setImages([])
    setTitle('')
    // document.getElementsByTagName('html')[0].removeAttribute('style')
    setOpen(false)
  }, [])

  const isOverlayOpen = useMemo(() => {
    return currentIndex > -1 && isOpen
  }, [currentIndex, isOpen])

  return (
    <ImgOContext.Provider value={{ open }}>
      <Modal
        isOpen={isOpen}
        onRequestClose={close}
        contentLabel={`${currentIndex + 1} of ${imagesToShow.length}`}
        style={{
          overlay: {
            zIndex: 999,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            cursor: 'pointer',
          },
          content: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            right: '0',
            bottom: 'auto',
            overflow: 'visible',
            WebkitOverflowScrolling: 'touch',
            borderRadius: '10px',
            outline: 'none',
            padding: 0,
            transform: 'translate(-50%, -50%)',
            height: 10,
            width: 10,
            background: 'white',
            border: '0',
          },
        }}
      >
        {/* <div className={styles.title}>{title}</div> */}
        <img
          ref={ref}
          src={imagesToShow[currentIndex]}
          style={{
            objectFit: 'contain',
            maxWidth: '90vw',
            maxHeight: '90vh',
            cursor: 'default',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </Modal>
      {children}
    </ImgOContext.Provider>
  )
}
