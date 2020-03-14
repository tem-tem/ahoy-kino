import React, { useRef, useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface Props {
  onSubmit: (blobs: File[]) => void
}

export default ({ onSubmit }: Props) => {
  const activeImageRef = useRef<HTMLImageElement>(null)
  const [activeImageNumber, setActiveImageNumber] = useState(null)
  const [selectedScreens, setSelectedScreens] = useState<any[]>([])
  const [orderedFiles, setOrderedFiles] = useState<File[]>([])

  const onDrop = useCallback(files => {
    // Do something with the files
    setSelectedScreens([])

    if (files.length > 9) {
      console.error('9 screens is max')
      return
    }

    files.map(f => {
      const reader = new FileReader()
      reader.onloadend = () => addBlobToSelectedScreens(reader, f)
      reader.readAsDataURL(f)
    })
  }, [])

  const addBlobToSelectedScreens = useCallback((r, file) => {
    setOrderedFiles(files => [...files, file])
    setSelectedScreens(olds => [...olds, r.result])
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/jpeg, image/png',
    multiple: true,
    onDrop,
  })

  const swapInArray = (oldPos, newPos, setter) => {
    setter(oldArr => {
      const tempArr = [...oldArr]
      const temp = tempArr[oldPos]
      tempArr[oldPos] = tempArr[newPos]
      tempArr[newPos] = temp
      return tempArr
    })
  }

  const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const target = e.currentTarget
    const clickedPosNum = parseInt(target.getAttribute('data-order-number'), 0)
    if (activeImageNumber !== null) {
      swapInArray(activeImageNumber, clickedPosNum, setSelectedScreens)
      swapInArray(activeImageNumber, clickedPosNum, setOrderedFiles)
      setActiveImageNumber(null)
    } else {
      setActiveImageNumber(clickedPosNum)
    }
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

  return (
    <div>
      <style jsx>{`
        .active-image {
          box-sizing: border-box;
          border: 5px solid red;
        }
        .dropzone {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          border-width: 2px;
          border-radius: 2px;
          border-style: dashed;
          background-color: #fafafa;
          color: #bdbdbd;
          outline: none;
          transition: border 0.24s ease-in-out;
        }
      `}</style>

      <form action='submit' onSubmit={handleSubmit}>
        <div {...getRootProps()} className='dropzone'>
          Drop Files Here
          <input {...getInputProps()} />
        </div>
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
