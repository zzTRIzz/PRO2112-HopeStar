import { useDialog } from '../context/dialog-context'
import { ProductDetailImportDialog } from './product-detail-import-dialog'
import { ProductDetailUpdateDialog } from './product-detail-update-dialog'

// Define dialog types as constants
export const DialogType = {
  IMEI: 'imei',
  UPDATE: 'update',
  IMPORT: 'import',
} as const

export function ProductDetailDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useDialog()

  // Reset currentRow after dialog closes
  const handleDialogClose = () => {
    setCurrentRow(null)
  }

  return (
    <>
      {/* Import Dialog */}
      <ProductDetailImportDialog
        key='product-details-import'
        open={open === DialogType.IMPORT}
        onOpenChange={(isOpen) => {
          setOpen(isOpen ? DialogType.IMPORT : null)
          if (!isOpen) handleDialogClose()
        }}
      />

      {currentRow && (
        <>
          <ProductDetailUpdateDialog
            key={`product-detail-update-${currentRow.id}`}
            open={open === DialogType.UPDATE}
            onOpenChange={(isOpen) => {
              setOpen(isOpen ? DialogType.UPDATE : null)
              if (!isOpen) handleDialogClose()
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
