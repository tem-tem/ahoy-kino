import React, { createContext, useCallback, useMemo, useState } from 'react'

type ModalTypes =
  | 'DeleteDialog'
  | 'ImageOverlay'
  | 'EditPost'
  | 'ShareDialog'
  | null

interface IModal {
  open: (component: ModalTypes, data: {}) => void
}

export const ModalContext = createContext<IModal>({
  open: () => undefined,
})

export const ModalProvider = ({
  children,
}: React.PropsWithChildren<IModal>) => {
  const [isOpen, setOpen] = useState(false)
  const [activeModal, setActiveModal] = useState<ModalTypes>(null)
  const [data, setData] = useState({})

  const InnerModal = useMemo(() => {
    // const innerProps = { ...data, ...{ isOpen, setOpen } }
    switch (activeModal) {
      case 'ImageOverlay': {
        return <h1>Image</h1>
      }
      default: {
        return <div />
      }
    }
  }, [activeModal, data, isOpen])

  const open = useCallback(
    (component: ModalTypes, componentData: {}) => {
      setOpen(true)
      setActiveModal(component)
      setData(componentData)
    },
    [isOpen, data]
  )

  return (
    <ModalContext.Provider value={{ open }}>
      {InnerModal}
      {children}
    </ModalContext.Provider>
  )
}
