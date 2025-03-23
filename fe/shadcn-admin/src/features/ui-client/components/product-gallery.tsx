import React from 'react'
import { Card, CardBody, Image } from '@heroui/react'

interface ProductImage {
  id: number
  url: string
  alt: string
}

interface ProductGalleryProps {
  defaultImage: string // URL hình ảnh mặc định
  imageUrls: string[] // Danh sách các URL hình ảnh
}

export function ProductGallery({
  defaultImage,
  imageUrls,
}: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = React.useState(0)

  // Loại bỏ các URL trùng lặp trong imageUrls
  const uniqueImageUrls = Array.from(new Set(imageUrls))

  // Kết hợp hình ảnh mặc định và danh sách hình ảnh (loại bỏ trùng lặp)
  const images: ProductImage[] = [
    { id: 0, url: defaultImage, alt: 'Default Image' }, // Hình ảnh mặc định
    ...uniqueImageUrls
      .filter((url) => url !== defaultImage) // Loại bỏ defaultImage nếu có trong imageUrls
      .map((url, index) => ({
        id: index + 1,
        url,
        alt: `Product Image ${index + 1}`,
      })),
  ]

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className='space-y-4'>
      <Card className='overflow-hidden'>
        <CardBody className='group relative p-0'>
          <Image
            removeWrapper
            className='aspect-square w-full object-cover'
            src={images[selectedImage].url}
            alt={images[selectedImage].alt}
          />
          {/* Navigation Buttons - Hidden by default, shown on hover */}
          <button
            onClick={prevImage}
            className='absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-gray-800/70 text-white opacity-0 transition-opacity hover:bg-gray-800 group-hover:opacity-100'
            aria-label='Previous image'
          >
            ◀
          </button>
          <button
            onClick={nextImage}
            className='absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-gray-800/70 text-white opacity-0 transition-opacity hover:bg-gray-800 group-hover:opacity-100'
            aria-label='Next image'
          >
            ▶
          </button>
        </CardBody>
      </Card>
      <div className='scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 flex gap-2 overflow-x-auto pb-2'>
        {images.map((image, index) => (
          <button
            key={image.id}
            className={`relative w-1/4 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg transition-all ${
              selectedImage === index
                ? 'ring-2 ring-primary'
                : 'hover:opacity-80'
            }`}
            onClick={() => setSelectedImage(index)}
          >
            <Image
              removeWrapper
              className='aspect-square w-full object-cover'
              src={image.url}
              alt={image.alt}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
