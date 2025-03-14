import { useState } from 'react'
import { ImagePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ImageUploaderProps {
  onImageChange: (imageUrl: string) => void
  currentImage?: string
}

export function ImageUploader({
  onImageChange,
  currentImage,
}: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImage)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // In a real app, you would upload to a server here
    // This is just for demonstration - creating a local preview
    const fileUrl = URL.createObjectURL(file)
    setPreviewUrl(fileUrl)
    onImageChange(fileUrl)
  }

  return (
    <div className='flex flex-col items-center space-y-2'>
      {previewUrl ? (
        <div className='relative h-16 w-16 overflow-hidden rounded'>
          <img
            src={previewUrl}
            alt='Product preview'
            className='h-full w-full object-cover'
          />
          <Button
            size='sm'
            variant='outline'
            className='absolute bottom-0 right-0 h-6 w-6 rounded-full p-0'
            onClick={() => document.getElementById('imageInput')?.click()}
          >
            <ImagePlus className='h-4 w-4' />
          </Button>
        </div>
      ) : (
        <Button
          variant='outline'
          className='h-16 w-16 border-dashed'
          onClick={() => document.getElementById('imageInput')?.click()}
        >
          <ImagePlus className='h-6 w-6' />
        </Button>
      )}
      <input
        id='imageInput'
        type='file'
        accept='image/*'
        className='hidden'
        onChange={handleFileChange}
      />
    </div>
  )
}
