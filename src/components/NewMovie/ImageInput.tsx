import React, { useRef, useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface Props {
  onSubmit: (blobs: File[]) => void
}

export default ({ onSubmit }: Props) => {
  const activeImageRef = useRef<HTMLImageElement>(null)
  const [activeImageNumber, setActiveImageNumber] = useState(null)
  const [previews, setPreviews] = useState<any[]>([])
  const [orderedImages, setOrderedImages] = useState<File[]>([])
  const [removeMode, setRemoveMode] = useState(false)

  const toggleRemoveMode = useCallback(() => setRemoveMode(old => !old), [])

  const onDrop = useCallback(
    files => {
      // Do something with the files
      // setPreviews([])

      if (orderedImages.length + files.length > 9) {
        console.error('9 screens is max')
        return
      }

      files.map(f => {
        const reader = new FileReader()
        reader.onloadend = () => addBlobTopreviews(reader, f)
        reader.readAsDataURL(f)
      })
    },
    [orderedImages]
  )

  const addBlobTopreviews = useCallback((r, file) => {
    setOrderedImages(files => [...files, file])
    setPreviews(olds => [...olds, r.result])
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

  const removePreview = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    const clickedPosNum = parseInt(target.getAttribute('data-order-number'), 0)
    setPreviews(old => {
      const temp = [...old]
      temp.splice(clickedPosNum, 1)
      return temp
    })
    setOrderedImages(old => {
      const temp = [...old]
      temp.splice(clickedPosNum, 1)
      return temp
    })
  }

  const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const target = e.currentTarget
    const clickedPosNum = parseInt(target.getAttribute('data-order-number'), 0)
    if (activeImageNumber !== null) {
      swapInArray(activeImageNumber, clickedPosNum, setPreviews)
      swapInArray(activeImageNumber, clickedPosNum, setOrderedImages)
      setActiveImageNumber(null)
    } else {
      setActiveImageNumber(clickedPosNum)
    }
  }

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      onSubmit(orderedImages)
      setPreviews([])
      event.currentTarget.reset()
    },
    [onSubmit, orderedImages]
  )

  return (
    <div>
      <style jsx>{`
        .active-image {
          z-index: 99999;
          box-shadow: 0 0 100px white;
          transform: scale(1.08);
        }
        .dropzone {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 50px;
          border-width: 2px;
          border-radius: 2px;
          border-style: dashed;
          // background-color: #fafafa;
          color: #bdbdbd;
          outline: none;
          transition: border 0.24s ease-in-out;
          margin-bottom: 30px;
        }
        .imagesContainer {
          display: grid;
          grid-template-columns: auto auto auto;
          margin-bottom: 40px;
        }
        .imageContainer {
          display: inline-grid;
          position: relative;
        }
        .imageContainer img {
          width: 100%;
          box-sizing: border-box;
        }
        .removeButton {
          position: absolute;
          top: 10px;
          right: 10px;
        }
        .dangerButton {
          cursor: pointer;
          background: red;
          padding: 10px 20px;
        }
        .justButton {
          cursor: pointer;
          background: black;
          color: white;
          padding: 10px 20px;
        }
        .greenButton {
          cursor: pointer;
          background: green;
          color: white;
          padding: 10px 20px;
        }
        .buttomButtons {
          cursor: pointer;
          display: flex;
          justify-content: space-between;
        }
      `}</style>

      <form action='submit' onSubmit={handleSubmit}>
        {previews.length < 9 && (
          <div {...getRootProps()} className='dropzone'>
            {previews.length === 0
              ? 'Drop Screenshots Here'
              : `Add ${9 - previews.length} More Screenshots`}
            <input {...getInputProps()} />
          </div>
        )}
        <div className='imagesContainer'>
          {previews.map((url, i) => (
            <div key={i} className='imageContainer'>
              <img
                src={url}
                data-order-number={i}
                className={activeImageNumber === i ? 'active-image' : ''}
                ref={activeImageNumber === i ? activeImageRef : null}
                onClick={handleClick}
              />
              {removeMode && (
                <div
                  onClick={removePreview}
                  data-order-number={i}
                  className='removeButton dangerButton'
                >
                  Remove
                </div>
              )}
            </div>
          ))}
        </div>
        <div className='buttomButtons'>
          <div>
            {previews.length > 0 && (
              <>
                {removeMode && (
                  <div className='justButton' onClick={toggleRemoveMode}>
                    Hide Remove Buttons
                  </div>
                )}
                {!removeMode && (
                  <div className='justButton' onClick={toggleRemoveMode}>
                    Show Remove Buttons
                  </div>
                )}
              </>
            )}
          </div>
          <button type='submit' className='greenButton'>
            Add Movie
          </button>
        </div>
      </form>
    </div>
  )
}
