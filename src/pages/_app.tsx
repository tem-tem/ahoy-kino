import { ConfigProvider } from '~/components/ConfigContext'
import loadFirebase from '~/lib/loadFirebase'
import Auth from '~/components/Auth'
import Link from 'next/link'
import Head from 'next/head'
import '~/styles/global.css'
import { ImgOProvider } from '~/components/ImageOverlay'
import Modal from 'react-modal'
Modal.setAppElement('#__next')

function MyApp({ Component, pageProps }) {
  const firebase = loadFirebase()
  const db = firebase.firestore()
  const storage = firebase.storage()
  const auth = firebase.auth()
  const open = () => undefined

  return (
    <ConfigProvider {...{ db, storage, auth }}>
      <ImgOProvider open={open}>
        <Head>
          <link
            rel='preload'
            href='/fonts/Montserrat/Montserrat-Regular.ttf'
            as='font'
          />
          <link
            rel='preload'
            href='/fonts/Playfair_Display/static/PlayfairDisplay-Regular.ttf'
            as='font'
          />
          <link
            rel='preload'
            href='/fonts/Playfair_Display/static/PlayfairDisplay-Black.ttf'
            as='font'
          />
        </Head>
        <Auth />
        <div className='main-logo-container'>
          <div />
          <Link href='/'>
            <h1 className='main-logo'>ahoy-kino</h1>
          </Link>
        </div>
        <Component {...pageProps} />
      </ImgOProvider>
    </ConfigProvider>
  )
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp
