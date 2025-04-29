import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { ProductResponse } from '../data/schema'

type ProductDialogType = 'create' | 'update' | 'display' | 'import'

interface ProductContextType {
  open: ProductDialogType | null
  setOpen: (str: ProductDialogType | null) => void
  currentRow: ProductResponse | null
  setCurrentRow: React.Dispatch<React.SetStateAction<ProductResponse | null>>
}

const ProductContext = React.createContext<ProductContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function ProductProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<ProductDialogType>(null)
  const [currentRow, setCurrentRow] = useState<ProductResponse | null>(null)
  return (
    <ProductContext.Provider
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </ProductContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useProduct = () => {
  const productContext = React.useContext(ProductContext)

  if (!productContext) {
    throw new Error('useProduct has to be used within <ProductProvider>')
  }

  return productContext
}
