import Head from 'next/head'
import Link from 'next/link'
import NewMovie from '~/components/NewMovie'
import Feed from '~/components/Feed'
import { useContext } from 'react'
import { ConfigContext } from '~/components/ConfigContext'
import Auth from '~/components/Auth'

const Home = () => {
  return (
    <div className='container'>
      <Head>
        <title>Ahoy Kino</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <Feed />
      </main>
    </div>
  )
}

export default Home
