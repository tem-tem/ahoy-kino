import React, { createContext, useState } from 'react'
import loadFirebase from '~/lib/loadFirebase'

interface IConfig {
  db: firebase.firestore.Firestore
}

const firebase = loadFirebase()

export const ConfigContext = createContext<IConfig>({
  db: firebase.firestore(),
})

export const ConfigProvider = ({
  db,
  children,
}: React.PropsWithChildren<IConfig>) => {
  return (
    <ConfigContext.Provider
      value={{
        db,
      }}
    >
      {children}
    </ConfigContext.Provider>
  )
}
