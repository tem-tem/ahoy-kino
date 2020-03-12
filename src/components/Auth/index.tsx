import Link from 'next/link'
import { useContext } from 'react'
import { ConfigContext } from '~/components/ConfigContext'

export default () => {
  // const firebase = loadFirebase()
  const { auth, currentUser, setCurrentUser } = useContext(ConfigContext)

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
      {!currentUser && (
        <Link href='/login'>
          <a>Entry for authors</a>
        </Link>
      )}
      {currentUser && (
        <div>
          <div>{currentUser.email}</div>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  )
}
