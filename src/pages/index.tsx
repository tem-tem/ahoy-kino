import Head from 'next/head'
import { ConfigContext } from '~/components/ConfigContext'
import { useContext, useCallback, useState, useEffect } from 'react'
import { Movie } from '~/types'
import MovieComponent from '~/components/Movie'

const Home = () => {
  const { db, storage } = useContext(ConfigContext)
  const storageRef = storage.ref()
  const screensRef = storageRef.child('screens')
  const [movies, setMovies] = useState<Movie[]>([])

  // Movies listener
  //
  useEffect(() => {
    const unsubscribe = db.collection('movies').onSnapshot(moviesSnapshot => {
      const moviesData = []
      moviesSnapshot.forEach(movieDoc => {
        moviesData.push({ id: movieDoc.id, ...movieDoc.data() })
      })
      setMovies(moviesData)
    })
    return () => {
      unsubscribe()
    }
  }, [db])

  // TODO: move form to a separate comp
  //
  // FORM START
  //
  // Add new movie, and upload screens
  //
  const add = useCallback(async (data: { name: string; files: File[] }) => {
    let uploadedScreens = []
    console.log(data.files)
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
  //
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
  //
  // FORM END
  //

  const deleteById = useCallback(id => {
    db.collection('movies')
      .doc(id)
      .delete()
      .then(() => {
        console.log('Document successfully deleted!')
      })
      .catch(function(error) {
        console.error('Error removing document: ', error)
      })
  }, [])

  return (
    <div className='container'>
      <Head>
        <title>Ahoy Controls</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <div>Add movie</div>
        <form action='submit' onSubmit={handleSubmit}>
          <input type='text' name='name' id='name' />
          <input type='file' multiple name='screens' id='file' />
          <button type='submit'>Add</button>
        </form>
        <div>
          {movies.map(movie => (
            <MovieComponent
              key={movie.id}
              movie={movie}
              deleteById={deleteById}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

export default Home
