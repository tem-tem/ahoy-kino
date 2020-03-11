import Head from 'next/head'
import { ConfigContext } from '~/components/ConfigContext'
import { useContext, useCallback, useState } from 'react'

const Home = () => {
  const { db } = useContext(ConfigContext)
  const [names, setNames] = useState<string[]>([])

  db.collection('users').onSnapshot(querySnapshot => {
    const users = []
    querySnapshot.forEach(doc => {
      users.push(doc.data().first)
    })
    setNames(old => {
      if (old.length < users.length) {
        return users
      }
      return old
    })
  })

  const add = useCallback(
    (data: { first: string }) =>
      db
        .collection('users')
        .add({
          first: data.first,
          last: 'Lovelace',
          born: 1815,
        })
        .then(docRef => {
          console.log('Document written with ID: ', docRef.id)
        })
        .catch(error => {
          console.error('Error adding document: ', error)
        }),
    []
  )

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const first = data.get('first').toString()
    add({ first })
    event.currentTarget.reset()
  }

  return (
    <div className='container'>
      <Head>
        <title>Ahoy Controls</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <div>Next.js + Firebase</div>
        <form action='submit' onSubmit={handleSubmit}>
          <input type='text' name='first' id='first' />
          <button type='submit'>Add</button>
        </form>
        <div>Names: {names.join(', ')}</div>
      </main>
    </div>
  )
}

export default Home
