import React, { createContext, useState } from 'react'
import loadFirebase from '~/lib/loadFirebase'

interface IConfig {
  db: firebase.firestore.Firestore
  storage: firebase.storage.Storage
}

const firebase = loadFirebase()

export const ConfigContext = createContext<IConfig>({
  db: firebase.firestore(),
  storage: firebase.storage(),
})

export const ConfigProvider = ({
  db,
  storage,
  children,
}: React.PropsWithChildren<IConfig>) => {
  return (
    <ConfigContext.Provider
      value={{
        db,
        storage,
      }}
    >
      {children}
    </ConfigContext.Provider>
  )
}
