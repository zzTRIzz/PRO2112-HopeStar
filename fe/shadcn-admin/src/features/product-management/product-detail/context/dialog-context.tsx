import { createContext, useContext, useState } from 'react'
import { ProductDetailResponse } from '../data/schema'

type DialogState = {
  type: 'imei' | null
  data?: ProductDetailResponse
}

interface DialogContextType {
  open: DialogState | null
  setOpen: (state: DialogState | null) => void
}

const DialogContext = createContext<DialogContextType | undefined>(undefined)

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<DialogState | null>(null)

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  )
}

export function useDialog() {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error('useDialog must be used within DialogProvider')
  }
  return context
}
