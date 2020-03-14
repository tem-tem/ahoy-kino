import { ConfigContext } from '~/components/ConfigContext'
import React, { useContext, useCallback, useState, useEffect } from 'react'
import SearchTMDB from '../SearchTMDB'
import ImageInput from './ImageInput'
import Link from 'next/link'
import makeLink from '~/helpers/makeLink'

export default () => {
  const { db, storage, currentUser } = useContext(ConfigContext)
  const storageRef = storage.ref()
  const screensRef = storageRef.child('screens')
  const [selectedMovie, setSelectedMovie] = useState<any>()
  const [uploadPending, setPending] = useState(false)
  const [movieList, setMovieList] = useState([])
  const [tmdbIds, setTmdbIds] = useState([])

  // Movies listener
  //
  useEffect(() => {
    const unsubscribe = db
      .collection('movies')
      .orderBy('createdAt')
      .onSnapshot(moviesSnapshot => {
        const moviesData = []
        moviesSnapshot.forEach(movieDoc => {
          moviesData.push({ id: movieDoc.id, ...movieDoc.data() })
        })
        setMovieList(moviesData)
      })
    return () => {
      unsubscribe()
    }
  }, [db])

  useEffect(() => {
    setTmdbIds(movieList.map(m => m.tmdb_id))
  }, [movieList])

  const add = useCallback(
    async (files: File[]) => {
      setPending(true)
      const uploadedScreens = await Promise.all(
        files.map((f, index) => uploadFile(f, index))
      )

      const name = selectedMovie.title || selectedMovie.name
      db.collection('movies')
        .add({
          name,
          directLink: makeLink(name),
          createdAt: -new Date().getTime(),
          screens: uploadedScreens,
          userUid: currentUser.uid,
          ...selectedMovie,
        })
        .then(() => {
          setPending(false)
        })
        .catch(error => {
          console.error('Error adding document: ', error)
        })
    },
    [selectedMovie]
  )
  // screen upload
  const uploadFile = useCallback(
    (file: File, order: number) => {
      const fileName = `${selectedMovie.tmdb_id}-${getRandomInt(
        new Date().getTime()
      )}`
      return screensRef
        .child(fileName)
        .put(file)
        .then(snapshot => {
          return snapshot.ref.getDownloadURL().then((url: string) => {
            return { url, path: `screens/${fileName}`, order }
          })
        })
    },
    [selectedMovie]
  )
  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max))
  }

  const handleImagesSubmit = (files: File[]) => {
    add(files)
    setSelectedMovie(null)
  }

  const getPosterPath = path => `http://image.tmdb.org/t/p/w342${path}`

  return (
    <div>
      <style jsx>{`
        .uploadInterfaceContainer {
          min-height: 50vh;
          margin: 0 50px;
        }
        .history {
          margin-top: 100px;
          padding: 0 20px 20px 20px;
          width: 100vw;
          border-top: 1px solid #e2e2e2;
        }
        .selectedMovie {
          display: flex;
          margin: 50px 0;
        }
        .selectedMovie img {
          margin-right: 15px;
        }
      `}</style>
      <h3 className='pageTitle'>Add movie</h3>
      <div className='uploadInterfaceContainer'>
        {uploadPending && <h1>Uploading...</h1>}
        {!uploadPending && (
          <SearchTMDB onMovieChange={setSelectedMovie} existingIds={tmdbIds} />
        )}
        {selectedMovie && (
          <div>
            <div className='selectedMovie'>
              <img
                src={getPosterPath(selectedMovie.poster_path)}
                alt='poster'
                height={180}
              />
              <div>
                <h1>{selectedMovie.name || selectedMovie.title}</h1>
                <div>
                  {selectedMovie.first_air_date || selectedMovie.release_date}
                </div>
              </div>
            </div>
            <ImageInput onSubmit={handleImagesSubmit} />
          </div>
        )}
      </div>
      {movieList.length > 0 && (
        <div className='history'>
          <h3>History of your uploads</h3>
          {movieList
            .filter(m => m.userUid === currentUser.uid)
            .map(movie => (
              <div key={movie.id}>
                <Link href={movie.directLink}>
                  <a>
                    [{new Date(-movie.createdAt).toLocaleString()}]:{' '}
                    {movie.name}
                  </a>
                </Link>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
