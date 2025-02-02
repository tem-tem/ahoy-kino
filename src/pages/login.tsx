import Head from 'next/head'
import { useContext } from 'react'
import { ConfigContext } from '~/components/ConfigContext'
import Router from 'next/router'

export default () => {
  // const firebase = loadFirebase()
  const { auth, setCurrentUser } = useContext(ConfigContext)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const email = data.get('email').toString()
    const password = data.get('password').toString()

    auth
      .signInWithEmailAndPassword(email, password)
      .then(userCreds => {
        if (setCurrentUser) {
          setCurrentUser(userCreds.user)
          Router.push('/')
        }
      })
      .catch(error => {
        // Handle Errors here.
        var errorCode = error.code
        var errorMessage = error.message
        console.log(errorMessage)
        // ...
      })
  }

  const logout = () => {
    auth
      .signOut()
      .then(() => {
        // Sign-out successful.
        console.log('logout succ')
      })
      .catch(error => {
        console.log(error)
        // An error happened.
      })
    if (setCurrentUser) {
      setCurrentUser(null)
    }
  }

  return (
    <div>
      <Head>
        <title>Login</title>
      </Head>

      <div>
        <form action='login' onSubmit={handleSubmit}>
          <input type='email' name='email' />
          <input type='password' name='password' />
          <button type='submit'>Login</button>
        </form>
      </div>
    </div>
  )
}
