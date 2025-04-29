import React, { useState } from 'react'
import * as XLSX from 'xlsx'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ProductImeiRequest } from '../../data/schema'

interface AddImeiDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onImeiAdd: (imeis: ProductImeiRequest[], inventoryQuantity: number) => void
  idRam: number
  idRom: number
  idColor: number
}

export const AddImeiDialog: React.FC<AddImeiDialogProps> = ({
  isOpen,
  onOpenChange,
  onImeiAdd,
  idRam,
  idRom,
  idColor,
}) => {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
      setErrorMessage('')
    }
  }

  const validateImei = (imei: string): boolean => {
    // Basic IMEI validation - should be a numeric string of 15 digits
    const imeiRegex = /^\d{15}$/
    return imeiRegex.test(imei)
  }

  const handleUpload = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!file) {
      setErrorMessage('Vui lòng chọn tệp để tải lên')
      return
    }

    setIsUploading(true)
    setErrorMessage('')

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = event.target?.result
        if (data) {
          const workbook = XLSX.read(data, { type: 'binary' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

          const imeis = jsonData
            .flat()
            .filter(
              (imei): imei is string =>
                typeof imei === 'string' || typeof imei === 'number'
            )
            .map((imei) => String(imei).trim())
            .filter((imei) => imei)

          // Validate IMEI format
          const invalidImeis = imeis.filter((imei) => !validateImei(imei))
          if (invalidImeis.length > 0) {
            setErrorMessage(
              `Có ${invalidImeis.length} IMEI không hợp lệ. IMEI phải có 15 chữ số.`
            )
            setIsUploading(false)
            return
          }

          // Check for duplicates
          const uniqueImeis = new Set(imeis)
          if (uniqueImeis.size !== imeis.length) {
            setErrorMessage(
              `Phát hiện ${imeis.length - uniqueImeis.size} IMEI trùng lặp trong tệp.`
            )
            setIsUploading(false)
            return
          }

          // Format data for the parent component
          const productImeiRequests: ProductImeiRequest[] = Array.from(
            uniqueImeis
          ).map((imei) => ({
            imeiCode: imei,
          }))

          // Store the processed data to pass after dialog closes
          const processedData = {
            imeis: productImeiRequests,
            count: productImeiRequests.length,
          }

          // First close the dialog
          onOpenChange(false)

          // Then pass the data with a slight delay to ensure UI updates first
          setTimeout(() => {
            onImeiAdd(processedData.imeis, processedData.count)
            // Reset state
            setFile(null)
            setIsUploading(false)
          }, 100)
        }
      } catch (error) {
        console.error('Lỗi xử lý tệp:', error)
        setErrorMessage(
          'Lỗi xử lý tệp. Vui lòng đảm bảo tệp có định dạng Excel hoặc CSV hợp lệ.'
        )
        setIsUploading(false)
      }
    }

    reader.onerror = () => {
      setErrorMessage('Lỗi đọc tệp. Vui lòng thử lại.')
      setIsUploading(false)
    }

    reader.readAsBinaryString(file)
  }

  // Safe cancel handler
  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onOpenChange(false)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setFile(null)
          setErrorMessage('')
        }
        onOpenChange(open)
      }}
    >
      <DialogContent
        className='sm:max-w-[425px]'
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Tải tệp IMEI</DialogTitle>
          <DialogDescription>
            Vui lòng chọn một tệp chứa số IMEI. Mỗi IMEI phải có 15 chữ số.
          </DialogDescription>
        </DialogHeader>
        {/* Isolate dialog content from parent form */}
        <div className='space-y-4' onClick={(e) => e.stopPropagation()}>
          <Input
            type='file'
            accept='.csv, .xlsx, .xls'
            onChange={handleFileChange}
            disabled={isUploading}
            onClick={(e) => e.stopPropagation()}
          />

          {errorMessage && (
            <div className='text-sm text-red-500'>{errorMessage}</div>
          )}

          <div className='flex justify-end space-x-2'>
            <Button
              type='button'
              variant='outline'
              onClick={handleCancel}
              disabled={isUploading}
            >
              Hủy
            </Button>
            <Button
              type='button'
              onClick={handleUpload}
              disabled={!file || isUploading}
              className='bg-blue-500 hover:bg-blue-600'
            >
              {isUploading ? 'Đang xử lý...' : 'Tải lên'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddImeiDialog
