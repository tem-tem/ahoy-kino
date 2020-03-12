import { ConfigContext } from '~/components/ConfigContext'
import React, { useContext, useCallback } from 'react'

export default () => {
  const { db, storage } = useContext(ConfigContext)
  const storageRef = storage.ref()
  const screensRef = storageRef.child('screens')

  const add = useCallback(async (data: { name: string; files: File[] }) => {
    let uploadedScreens = []
    if (data.files[0].size > 0) {
      uploadedScreens = await Promise.all(data.files.map(f => uploadFile(f)))
    }
    db.collection('movies')
      .add({
        name: data.name,
        screens: uploadedScreens,
      })
      .catch(error => {
        console.error('Error adding document: ', error)
      })
  }, [])
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
    const name = data.get('name').toString()
    const fileInput = event.currentTarget.children.namedItem(
      'file'
    ) as HTMLInputElement
    const nameInput = event.currentTarget.children.namedItem(
      'name'
    ) as HTMLInputElement

    if (name.length < 1) {
      console.error('Enter something')
      nameInput.value = null
      return
    }
    if (files.length > 9) {
      console.error('9 screens is max')
      fileInput.value = null
      return
    }
    add({ name, files })
    event.currentTarget.reset()
  }

  return (
    <div>
      <div>Add movie</div>
      <form action='submit' onSubmit={handleSubmit}>
        <input type='text' name='name' id='name' />
        <input type='file' multiple name='screens' id='file' />
        <button type='submit'>Add</button>
      </form>
    </div>
  )
}
