import Head from 'next/head'
import Link from 'next/link'
import { useContext } from 'react'
import { ConfigContext } from '~/components/ConfigContext'

export default () => {
  // const firebase = loadFirebase()
  const { auth, currentUser, setCurrentUser } = useContext(ConfigContext)

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

  console.log(currentUser)
  return (
    <div>
      <Head>
        <title>Login</title>
      </Head>
      <Link href='/'>HOME</Link>

      <div>
        <form action='login' onSubmit={handleSubmit}>
          <input type='email' name='email' />
          <input type='password' name='password' />
          <button type='submit'>Login</button>
        </form>
      </div>
      {currentUser && <button onClick={logout}>Logout</button>}
    </div>
  )
}
