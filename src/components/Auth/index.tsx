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
        console.debug('logout succ')
      })
      .catch((error) => {
        console.error(error)
        // An error happened.
      })
    if (setCurrentUser) {
      setCurrentUser(null)
    }
  }
  if (!currentUser) {
    return <div />
  }

  return (
    <>
      <style jsx>{`
        .headerContainer {
          padding: 20px 50px;
          position: absolute;
          z-index: 999999;
        }
      `}</style>
      <div className='flex-between headerContainer'>
        {currentUser && (
          <>
            <div>
              <Link href='/add'>
                <a>Add</a>
              </Link>
            </div>
            <div className='flex-between'>
              <div style={{ marginRight: 10 }}>You → {currentUser.email}</div>
              <button onClick={logout}>Logout</button>
            </div>
          </>
        )}
        {/* {!currentUser && (
          <Link href='/login'>
            <a>Entry for authors</a>
          </Link>
        )} */}
      </div>
    </>
  )
}
