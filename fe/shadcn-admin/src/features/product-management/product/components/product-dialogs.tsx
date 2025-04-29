import { ProductResponsesUpdateDialog } from '@/features/product-management/product/components/product-update-dialog'
import { useProduct } from '../context/product-context'
import { ProductDisplayDialog } from './product-display-dialog'
import { ProductImportDialog } from './product-import-dialog'

// Define dialog types as constants
export const DialogType = {
  IMPORT: 'import',
  UPDATE: 'update',
  DISPLAY: 'display',
} as const

export function ProductDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useProduct()

  // Reset currentRow after dialog closes
  const handleDialogClose = () => {
    setCurrentRow(null)
  }

  return (
    <>
      {/* Import Dialog */}
      <ProductImportDialog
        key='products-import'
        open={open === DialogType.IMPORT}
        onOpenChange={(isOpen) => {
          setOpen(isOpen ? DialogType.IMPORT : null)
          if (!isOpen) handleDialogClose()
        }}
      />

      {/* Update and Display Dialogs (only render if currentRow exists) */}
      {currentRow && (
        <>
          <ProductResponsesUpdateDialog
            key={`product-update-${currentRow.id}`}
            open={open === DialogType.UPDATE}
            onOpenChange={(isOpen) => {
              setOpen(isOpen ? DialogType.UPDATE : null)
              if (!isOpen) handleDialogClose()
            }}
            currentRow={currentRow}
          />

          <ProductDisplayDialog
            key={`product-display-${currentRow.id}`}
            open={open === DialogType.DISPLAY}
            onOpenChange={(isOpen) => {
              setOpen(isOpen ? DialogType.DISPLAY : null)
              if (!isOpen) handleDialogClose()
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
