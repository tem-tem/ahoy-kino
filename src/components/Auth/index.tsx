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
        console.error(error)
        // An error happened.
      })
    if (setCurrentUser) {
      setCurrentUser(null)
    }
  }

  return (
    <div>
      <div>
        <Link href='/'>
          <a>Home</a>
        </Link>
      </div>
      {currentUser && (
        <div>
          <div>
            <Link href='/add'>
              <a>Add</a>
            </Link>
          </div>
          <div>
            <div>{currentUser.email}</div>
            <button onClick={logout}>Logout</button>
          </div>
        </div>
      )}
      {!currentUser && (
        <Link href='/login'>
          <a>Entry for authors</a>
        </Link>
      )}
    </div>
  )
}
