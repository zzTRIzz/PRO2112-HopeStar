import React from 'react'
import { Card, CardBody, CardFooter, Image } from '@heroui/react'
import { Icon } from '@iconify/react'

interface Product {
  id: number
  name: string
  image: string
  price: number
  originalPrice?: number
}

export function RelatedProducts() {
  const products: Product[] = [
    {
      id: 1,
      name: 'iPhone 15',
      image:
        'https://cdn2.fptshop.com.vn/unsafe/750x0/filters:quality(100)/iphone_16_pro_max_desert_titan_3552a28ae0.png',
      price: 22990000,
      originalPrice: 24990000,
    },
    {
      id: 2,
      name: 'iPhone 15 Plus',
      image:
        'https://cdn2.fptshop.com.vn/unsafe/750x0/filters:quality(100)/iphone_16_pro_max_desert_titan_3552a28ae0.png',
      price: 25990000,
      originalPrice: 27990000,
    },
    {
      id: 3,
      name: 'iPhone 15 Pro',
      image:
        'https://cdn2.fptshop.com.vn/unsafe/750x0/filters:quality(100)/iphone_16_pro_max_desert_titan_3552a28ae0.png',
      price: 27990000,
      originalPrice: 29990000,
    },
    {
      id: 4,
      name: 'Samsung Galaxy S24 Ultra',
      image:
        'https://cdn2.fptshop.com.vn/unsafe/750x0/filters:quality(100)/iphone_16_pro_max_desert_titan_3552a28ae0.png',
      price: 31990000,
      originalPrice: 33990000,
    },
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price)
  }

  return (
    <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
      {products.map((product) => (
        <Card key={product.id} isPressable className='overflow-hidden'>
          <CardBody className='p-0'>
            <Image
              removeWrapper
              className='aspect-square w-full object-cover'
              src={product.image}
              alt={product.name}
            />
          </CardBody>
          <CardFooter className='flex flex-col items-start gap-2'>
            <h3 className='font-semibold'>{product.name}</h3>
            <div>
              <div className='font-bold text-primary'>
                {formatPrice(product.price)}
              </div>
              {product.originalPrice && (
                <div className='text-small text-default-400 line-through'>
                  {formatPrice(product.originalPrice)}
                </div>
              )}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
