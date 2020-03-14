import Head from 'next/head'
import NewMovie from '~/components/NewMovie'
import { useContext } from 'react'
import { ConfigContext } from '~/components/ConfigContext'

const Home = () => {
  const { currentUser } = useContext(ConfigContext)
  return (
    <div className='container'>
      <Head>
        <title>Add Ahoy Kino</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>{currentUser && <NewMovie />}</main>
    </div>
  )
}

export default Home
