import Head from 'next/head'
import Link from 'next/link'
import NewMovie from '~/components/NewMovie'
import Feed from '~/components/Feed'
import { useContext } from 'react'
import { ConfigContext } from '~/components/ConfigContext'

const Home = () => {
  const { currentUser } = useContext(ConfigContext)
  return (
    <div className='container'>
      <Head>
        <title>Ahoy Kino</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      {!currentUser && <Link href='/login'>LOGIN</Link>}

      <main>
        {currentUser && <NewMovie />}
        <Feed />
      </main>
    </div>
  )
}

export default Home
