import Head from 'next/head'
import NewMovie from '~/components/NewMovie'
import Feed from '~/components/Feed'

const Home = () => {
  return (
    <div className='container'>
      <Head>
        <title>Ahoy Kino</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <NewMovie />
        <Feed />
      </main>
    </div>
  )
}

export default Home
