import { ConfigContext } from '~/components/ConfigContext'
import React, { useContext, useCallback, useState, useEffect } from 'react'
import SearchTMDB from '../SearchTMDB'

export default () => {
  const { db, storage, currentUser } = useContext(ConfigContext)
  const storageRef = storage.ref()
  const screensRef = storageRef.child('screens')
  const [selectedMovie, setSelectedMovie] = useState<any>()
  const [selectedScreens, setSelectedScreens] = useState<any[]>([])

  const add = useCallback(
    async (files: File[]) => {
      let uploadedScreens = []
      if (files[0].size > 0) {
        uploadedScreens = await Promise.all(files.map(f => uploadFile(f)))
      }
      const name = selectedMovie.title || selectedMovie.name
      db.collection('movies')
        .add({
          name,
          createdAt: -new Date().getTime(),
          screens: uploadedScreens,
          userUid: currentUser.uid,
          ...selectedMovie,
        })
        .catch(error => {
          console.error('Error adding document: ', error)
        })
    },
    [selectedMovie]
  )
  // screen upload
  const uploadFile = useCallback(
    (file: File) => {
      const fileName = `${selectedMovie.tmdb_id}-${new Date().getTime()}`
      return screensRef
        .child(fileName)
        .put(file)
        .then(snapshot => {
          return snapshot.ref.getDownloadURL().then((url: string) => {
            return { url, path: `screens/${fileName}` }
          })
        })
    },
    [selectedMovie]
  )

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setSelectedMovie(null)
      setSelectedScreens([])
      const data = new FormData(event.currentTarget)
      const files = data.getAll('screens') as File[]
      const fileInput = event.currentTarget.children.namedItem(
        'file'
      ) as HTMLInputElement
      if (files.length > 9) {
        console.error('9 screens is max')
        fileInput.value = null
        return
      }
      add(files)
      event.currentTarget.reset()
    },
    [add]
  )

  const handleFileChange = useCallback(e => {
    setSelectedScreens([])
    const { files } = e.currentTarget
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedScreens(olds => [...olds, reader.result])
      }
      const file = files.item(i)
      reader.readAsDataURL(file)
    }
  }, [])

  const getPosterPath = path => `http://image.tmdb.org/t/p/w342${path}`

  return (
    <div>
      <div>Add movie</div>
      <SearchTMDB onMovieChange={setSelectedMovie} />
      {selectedMovie && (
        <div>
          <img
            src={getPosterPath(selectedMovie.poster_path)}
            alt='poster'
            height={180}
          />
          <div>
            {selectedMovie.first_air_date || selectedMovie.release_date}
          </div>
          <div>{selectedMovie.name || selectedMovie.title}</div>
          <form action='submit' onSubmit={handleSubmit}>
            <input
              type='file'
              multiple
              name='screens'
              id='file'
              onChange={handleFileChange}
            />
            <div>
              {selectedScreens.map((url, i) => (
                <img src={url} key={i} height={100} />
              ))}
            </div>
            <button type='submit'>Add</button>
          </form>
        </div>
      )}
    </div>
  )
}
