// import App from 'next/app'

import { ConfigProvider } from '~/components/ConfigContext'
import loadFirebase from '~/lib/loadFirebase'
import Auth from '~/components/Auth'

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
        }
        .pageTitle {
          text-align: center;
          padding: 50px 0;
        }
      `}</style>
      <Auth />
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
