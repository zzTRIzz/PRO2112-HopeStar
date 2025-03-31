import { useState } from 'react'
import { ImagePlus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
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
  const [isUploading, setIsUploading] = useState(false)

  const uploadToCloudinary = async (file: File) => {
    setIsUploading(true)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'upload_hopestar') // Preset đã được cấu hình

    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/domlvyqqe/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!response.ok) {
        throw new Error('Lỗi khi tải ảnh lên')
      }

      const data = await response.json()
      setPreviewUrl(data.secure_url)
      onImageChange(data.secure_url) // Gọi callback để cập nhật ảnh lên component cha
      toast.success('Tải ảnh lên thành công')
    } catch (error) {
      // Xử lý lỗi mà không dùng console.log
      const errorMessage =
        error instanceof Error ? error.message : 'Lỗi không xác định'
      toast.error(`Không thể tải ảnh lên: ${errorMessage}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Kiểm tra kích thước file (giới hạn 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn 5MB.')
      return
    }

    // Kiểm tra định dạng file
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast.error(
        'Định dạng ảnh không hỗ trợ. Vui lòng sử dụng JPEG, PNG hoặc WebP.'
      )
      return
    }

    // Hiển thị preview trước khi upload
    const localPreviewUrl = URL.createObjectURL(file)
    setPreviewUrl(localPreviewUrl)

    // Upload lên Cloudinary
    await uploadToCloudinary(file)
  }

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault() // Ngăn chặn hành vi mặc định của nút
    e.stopPropagation() // Ngăn chặn sự kiện lan truyền lên form
    document.getElementById(`imageInput-${previewUrl}`)?.click()
  }

  return (
    <div className='flex flex-col items-center space-y-2'>
      <p className='font-medium text-gray-700'>
        Ảnh {currentImage ? 'hiện tại' : 'sản phẩm'}
      </p>
      {previewUrl ? (
        <div className='relative h-64 w-40 overflow-hidden rounded'>
          <img
            src={previewUrl}
            alt='Xem trước sản phẩm'
            className='h-full w-full object-cover'
          />
          <Button
            size='sm'
            variant='outline'
            className='absolute bottom-0 right-0 h-6 w-6 rounded-full p-0'
            onClick={handleButtonClick}
            disabled={isUploading}
            title='Thay đổi ảnh'
          >
            {isUploading ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <ImagePlus className='h-4 w-4' />
            )}
          </Button>
        </div>
      ) : (
        <>
          <p className='text-sm text-muted-foreground'>Chọn ảnh để tải lên</p>
          <Button
            variant='outline'
            className='h-16 w-16 border-dashed'
            onClick={handleButtonClick}
            disabled={isUploading}
            title='Tải ảnh lên'
          >
            {isUploading ? (
              <Loader2 className='h-6 w-6 animate-spin' />
            ) : (
              <ImagePlus className='h-6 w-6' />
            )}
          </Button>
        </>
      )}
      <input
        id={`imageInput-${previewUrl}`}
        type='file'
        accept='image/*'
        className='hidden'
        onChange={handleFileChange}
      />
      {isUploading && (
        <p className='text-xs text-muted-foreground'>Đang tải ảnh lên...</p>
      )}
    </div>
  )
}
