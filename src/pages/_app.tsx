import { ConfigProvider } from '~/components/ConfigContext'
import loadFirebase from '~/lib/loadFirebase'
import Auth from '~/components/Auth'
import fetch from 'node-fetch'
import Link from 'next/link'
import Head from 'next/head'
import '~/styles/global.css'
import { ImgOProvider } from '~/components/ImageOverlay'
import Modal from 'react-modal'
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  HttpLink,
} from '@apollo/client'
import { useEffect } from 'react'
import importScript from '~/hooks/import'
Modal.setAppElement('#__next')

function MyApp({ Component, pageProps }) {
  importScript('/swipedEvents.min.js')
  importScript('/lethargy.min.js')

  const firebase = loadFirebase()
  const db = firebase.firestore()
  const storage = firebase.storage()
  const auth = firebase.auth()
  const open = () => undefined

  const gqlClient = new ApolloClient({
    // uri: 'http://localhost:3000/graphql',

    link: new HttpLink({ uri: 'http://api.ahoy.tem-tem.com/graphql', fetch }),
    cache: new InMemoryCache(),
  })

  // useEffect(() => {
  //   const script = document.createElement('script')
  //   script.src = '/swipedEvents.min.js'
  //   script.async = true
  //   document.body.appendChild(script)
  //   return () => {
  //     document.body.removeChild(script)
  //   }
  // }, [])

  return (
    <ApolloProvider client={gqlClient}>
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
          {/* <div className='main-logo-container'>
            <Link href='/'>
              <h1 className='main-logo'>ahoy-kino</h1>
            </Link>
          </div> */}
          <Component {...pageProps} />
        </ImgOProvider>
      </ConfigProvider>
    </ApolloProvider>
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
