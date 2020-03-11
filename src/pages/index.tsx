import Head from 'next/head'
import { ConfigContext } from '~/components/ConfigContext'
import { useContext, useCallback, useState } from 'react'

interface Movie {
  name: string
  screens: Screen[]
}

interface Screen {
  url: string
  path: string
}

const Home = () => {
  const { db, storage } = useContext(ConfigContext)
  const storageRef = storage.ref()
  const screensRef = storageRef.child('screens')
  const [movies, setMovies] = useState<Movie[]>([])

  db.collection('movies').onSnapshot(moviesSnapshot => {
    const moviesData = []
    moviesSnapshot.forEach(movieDoc => {
      moviesData.push(movieDoc.data())
    })

    setMovies(old => {
      if (old.length < moviesData.length) {
        return moviesData
      }
      return old
    })
  })

  const uploadFile = (file: File) =>
    screensRef
      .child(file.name)
      .put(file)
      .then(snapshot => {
        return snapshot.ref.getDownloadURL().then((url: string) => {
          return { url, path: `screens/${file.name}` }
        })
      })

  const add = useCallback(async (data: { name: string; files: File[] }) => {
    const uploadedScreens = await Promise.all(
      data.files.map(f => uploadFile(f))
    )
    db.collection('movies')
      .add({
        name: data.name,
        screens: uploadedScreens,
      })
      .catch(error => {
        console.error('Error adding document: ', error)
      })
  }, [])

  // TODO: add tmdb requests
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

    if (name.length < 1 || name.length > 324) {
      console.error('Either name is too long, or you havent entered nothing')
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
            <div key={movie.name}>
              <div>{movie.name}</div>
              {movie.screens.map(screen => (
                <img src={screen.url} height={100} key={screen.url} />
              ))}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Home
