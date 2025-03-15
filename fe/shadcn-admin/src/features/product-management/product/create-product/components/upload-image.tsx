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

    const fileUrl = URL.createObjectURL(file)
    setPreviewUrl(fileUrl)
    onImageChange(fileUrl) // Gọi callback để cập nhật ảnh lên component cha
  }

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault() // Ngăn chặn hành vi mặc định của nút
    e.stopPropagation() // Ngăn chặn sự kiện lan truyền lên form
    document.getElementById(`imageInput-${previewUrl}`)?.click()
  }

  return (
    <div className='flex flex-col items-center space-y-2'>
      {previewUrl ? (
        <div className='relative h-64 w-40 overflow-hidden rounded'>
          <img
            src={previewUrl}
            alt='Product preview'
            className='h-full w-full object-cover'
          />
          <Button
            size='sm'
            variant='outline'
            className='absolute bottom-0 right-0 h-6 w-6 rounded-full p-0'
            onClick={handleButtonClick} // Sử dụng hàm xử lý sự kiện mới
          >
            <ImagePlus className='h-4 w-4' />
          </Button>
        </div>
      ) : (
        <Button
          variant='outline'
          className='h-16 w-16 border-dashed'
          onClick={handleButtonClick} // Sử dụng hàm xử lý sự kiện mới
        >
          <ImagePlus className='h-6 w-6' />
        </Button>
      )}
      <input
        id={`imageInput-${previewUrl}`}
        type='file'
        accept='image/*'
        className='hidden'
        onChange={handleFileChange}
      />
    </div>
  )
}
