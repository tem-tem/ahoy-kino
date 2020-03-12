import React, { createContext, useState, useEffect } from 'react'
import loadFirebase from '~/lib/loadFirebase'

interface IConfig {
  db: firebase.firestore.Firestore
  storage: firebase.storage.Storage
  auth: firebase.auth.Auth
  setCurrentUser?: React.Dispatch<firebase.User>
  currentUser?: firebase.User
}

const firebase = loadFirebase()

export const ConfigContext = createContext<IConfig>({
  db: firebase.firestore(),
  storage: firebase.storage(),
  auth: firebase.auth(),
})

export const ConfigProvider = ({
  db,
  storage,
  auth,
  children,
}: React.PropsWithChildren<IConfig>) => {
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null)

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) {
        setCurrentUser(user)
      }
    })
  }, [auth])

  return (
    <ConfigContext.Provider
      value={{
        db,
        storage,
        auth,
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </ConfigContext.Provider>
  )
}
