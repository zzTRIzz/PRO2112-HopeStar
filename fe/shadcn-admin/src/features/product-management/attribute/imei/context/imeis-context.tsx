import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { ImeiResponse } from '../data/schema'

type ImeisDialogType = 'create' | 'update' | 'delete'

interface ImeisContextType {
  open: ImeisDialogType | null
  setOpen: (str: ImeisDialogType | null) => void
  currentRow: ImeiResponse | null
  setCurrentRow: React.Dispatch<React.SetStateAction<ImeiResponse | null>>
}
const ImeisContext = React.createContext<ImeisContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function ImeisProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<ImeisDialogType>(null)
  const [currentRow, setCurrentRow] = useState<ImeiResponse | null>(null)
  return (
    <ImeisContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ImeisContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useImeis = () => {
  const imeisContext = React.useContext(ImeisContext)

  if (!imeisContext) {
    throw new Error('useImeis has to be used within <ImeisProvider>')
  }

  return imeisContext
}
