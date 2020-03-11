import Head from 'next/head'
import { ConfigContext } from '~/components/ConfigContext'
import { useContext, useCallback } from 'react'

const Home = () => {
  const { db } = useContext(ConfigContext)

  const read = useCallback(
    () =>
      db
        .collection('users')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            console.log(`${doc.id} => ${doc.data()}`)
          })
        }),
    []
  )

  const add = useCallback(
    () =>
      db
        .collection('users')
        .add({
          first: 'Ada',
          last: 'Lovelace',
          born: 1815,
        })
        .then(function(docRef) {
          console.log('Document written with ID: ', docRef.id)
        })
        .catch(function(error) {
          console.error('Error adding document: ', error)
        }),
    []
  )

  return (
    <div className='container'>
      <Head>
        <title>Ahoy Controls</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <div>Next.js + Firebase</div>
        <button onClick={add}>Add</button>
        <button onClick={read}>Read</button>
      </main>
    </div>
  )
}

export default Home
