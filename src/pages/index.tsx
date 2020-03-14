import Head from 'next/head'
import Feed from '~/components/Feed'

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
