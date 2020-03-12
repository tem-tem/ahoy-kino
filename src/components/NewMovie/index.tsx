import { ConfigContext } from '~/components/ConfigContext'
import React, { useContext, useCallback, useState } from 'react'
import SearchTMDB from '../SearchTMDB'

export default () => {
  const { db, storage, currentUser } = useContext(ConfigContext)
  const storageRef = storage.ref()
  const screensRef = storageRef.child('screens')
  const [selectedMovie, setSelectedMovie] = useState<any>()

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
  const uploadFile = (file: File) =>
    screensRef
      .child(file.name)
      .put(file)
      .then(snapshot => {
        return snapshot.ref.getDownloadURL().then((url: string) => {
          return { url, path: `screens/${file.name}` }
        })
      })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
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
  }
  console.log(selectedMovie)
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
            <input type='file' multiple name='screens' id='file' />
            <button type='submit'>Add</button>
          </form>
        </div>
      )}
    </div>
  )
}
