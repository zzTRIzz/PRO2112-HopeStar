import { createContext, useContext, useState } from 'react'
import { ProductDetailResponse } from '../data/schema'

type DialogType = 'imei' | 'update' | 'import' | 'add' |'update-imei'| null

interface DialogContextType {
  open: DialogType
  setOpen: (type: DialogType) => void
  currentRow: ProductDetailResponse | null
  setCurrentRow: (row: ProductDetailResponse | null) => void
}

const DialogContext = createContext<DialogContextType | undefined>(undefined)

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<DialogType>(null)
  const [currentRow, setCurrentRow] = useState<ProductDetailResponse | null>(
    null
  )

  return (
    <DialogContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
      }}
    >
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
