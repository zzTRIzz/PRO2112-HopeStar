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

  const handleUpload = () => {
    if (!file) {
      setErrorMessage('Please select a file to upload')
      return
    }

    setIsUploading(true)
    setErrorMessage('')

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = e.target?.result
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
              `Found ${invalidImeis.length} invalid IMEI format(s). IMEI must be 15 digits.`
            )
            setIsUploading(false)
            return
          }

          // Check for duplicates
          const uniqueImeis = new Set(imeis)
          if (uniqueImeis.size !== imeis.length) {
            setErrorMessage(
              `Found ${imeis.length - uniqueImeis.size} duplicate IMEI(s) in the file.`
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

          // Process the data completely before modifying state
          onImeiAdd(productImeiRequests, productImeiRequests.length)

          // Reset state and close dialog
          setFile(null)
          setIsUploading(false)
          onOpenChange(false)
        }
      } catch (error) {
        console.error('Error parsing file:', error)
        setErrorMessage(
          'Error parsing file. Please ensure it is a valid Excel or CSV file.'
        )
        setIsUploading(false)
      }
    }

    reader.onerror = () => {
      setErrorMessage('Error reading file. Please try again.')
      setIsUploading(false)
    }

    reader.readAsBinaryString(file)
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
      >
        <DialogHeader>
          <DialogTitle>Upload IMEI File</DialogTitle>
          <DialogDescription>
            Please select a file containing IMEI numbers. Each IMEI should be 15
            digits.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
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
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              type='button'
              onClick={handleUpload}
              disabled={!file || isUploading}
              className='bg-blue-500 hover:bg-blue-600'
            >
              {isUploading ? 'Processing...' : 'Upload'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddImeiDialog
