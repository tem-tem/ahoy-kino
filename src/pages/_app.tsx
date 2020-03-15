// import App from 'next/app'

import { ConfigProvider } from '~/components/ConfigContext'
import loadFirebase from '~/lib/loadFirebase'
import Auth from '~/components/Auth'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  const firebase = loadFirebase()
  const db = firebase.firestore()
  const storage = firebase.storage()
  const auth = firebase.auth()

  return (
    <ConfigProvider {...{ db, storage, auth }}>
      <style jsx global>{`
        body {
          margin: 0;
          background: black;
          color: white;
        }
        .pageTitle {
          text-align: center;
          padding: 50px 0;
          font-weight: 100;
        }
        .flex-between {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .flex-left {
          display: flex;
          align-items: center;
        }
        .main-logo {
          text-align: center;
          font-weight: 100;
          font-size: 1.3rem;
          margin: 100px;
          cursor: pointer;
        }
        a {
          color: white;
        }
      `}</style>
      <Auth />
      <Link href='/'>
        <h1 className='main-logo'>ahoy-kino</h1>
      </Link>
      <Component {...pageProps} />
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
