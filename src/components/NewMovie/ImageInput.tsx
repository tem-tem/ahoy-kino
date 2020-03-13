import React, { useRef, useState, useEffect, useCallback } from 'react'

interface Props {
  onSubmit: (blobs: File[]) => void
}

export default ({ onSubmit }: Props) => {
  const activeImageRef = useRef<HTMLImageElement>(null)
  const [activeImageNumber, setActiveImageNumber] = useState(0)
  const [selectedScreens, setSelectedScreens] = useState<any[]>([])
  const [orderedFiles, setOrderedFiles] = useState<File[]>([])

  useEffect(() => {
    window.addEventListener('keydown', handleArrowKeyPress)

    return () => {
      window.removeEventListener('keydown', handleArrowKeyPress)
    }
  })

  const handleArrowKeyPress = useCallback(
    (event: KeyboardEvent) => {
      const { keyCode } = event
      let newActiveNumber = activeImageNumber

      // left arrow
      if (keyCode === 37) {
        newActiveNumber =
          activeImageNumber === 0
            ? selectedScreens.length - 1
            : activeImageNumber - 1
      }

      // right arrow
      if (keyCode === 39) {
        newActiveNumber =
          activeImageNumber === selectedScreens.length - 1
            ? 0
            : activeImageNumber + 1
      }

      setSelectedScreens(oldScreensOrder => {
        const newScreensOrder = swapInArray(
          activeImageNumber,
          newActiveNumber,
          oldScreensOrder
        )
        return newScreensOrder
      })
      setOrderedFiles(filesOldOrder => {
        const newOrder = swapInArray(
          activeImageNumber,
          newActiveNumber,
          filesOldOrder
        )
        return newOrder
      })
      setActiveImageNumber(newActiveNumber)
      // console.log(newActiveNumber)
    },
    [activeImageNumber]
  )

  const swapInArray = (oldPos, newPos, array) => {
    const tempArr = [...array]
    const temp = tempArr[oldPos]
    tempArr[oldPos] = tempArr[newPos]
    tempArr[newPos] = temp
    return tempArr
  }

  const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const target = e.currentTarget
    const number = parseInt(target.getAttribute('data-order-number'), 0)
    setActiveImageNumber(number)
  }

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      // const orderedFiles = order.map(i => {
      //   files
      // })

      onSubmit(orderedFiles)
      setSelectedScreens([])
      event.currentTarget.reset()
    },
    [onSubmit, orderedFiles]
  )

  const addBlobToSelectedScreens = useCallback((r, file) => {
    setOrderedFiles(files => [...files, file])
    setSelectedScreens(olds => [...olds, r.result])
  }, [])

  const handleFileChange = useCallback(e => {
    setSelectedScreens([])
    const { files } = e.currentTarget
    if (files.length > 9) {
      console.error('9 screens is max')
      e.currentTarget.value = null
      return
    }

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader()
      reader.onloadend = () => addBlobToSelectedScreens(reader, files.item(i))
      reader.readAsDataURL(files.item(i))
    }
  }, [])

  return (
    <div>
      <style jsx>{`
        .active-image {
          box-sizing: border-box;
          border: 5px solid red;
        }
      `}</style>

      <form action='submit' onSubmit={handleSubmit}>
        <input
          type='file'
          multiple
          name='screens'
          id='file'
          onChange={handleFileChange}
        />
        {selectedScreens.map((url, i) => (
          <img
            src={url}
            data-order-number={i}
            key={i}
            height={100}
            className={activeImageNumber === i ? 'active-image' : ''}
            ref={activeImageNumber === i ? activeImageRef : null}
            onClick={handleClick}
          />
        ))}
        <button type='submit'>Add</button>
      </form>
    </div>
  )
}
