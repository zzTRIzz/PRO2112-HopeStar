import { Link } from '@tanstack/react-router'
import { Heart, Star } from 'lucide-react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'

// Sample product data
const featuredProducts = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    brand: 'Apple',
    price: 20999990,
    rating: 4.8,
    image:
      'https://cdn2.fptshop.com.vn/unsafe/750x0/filters:quality(100)/iphone_16_pro_max_desert_titan_3552a28ae0.png',
    onSale: true,
    colors: ['#555', '#DDD', '#c19a6b', '#2b7488'],
  },
  {
    id: 2,
    name: 'Samsung Galaxy S24',
    brand: 'Samsung',
    price: 18999990,
    rating: 4.7,
    image:
      'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/a/galaxy-s24-plus-xam.png',
    onSale: false,
    colors: ['#000', '#d0cdce', '#f5d8c0'],
  },
  {
    id: 3,
    name: 'Google Pixel 8',
    brand: 'Google',
    price: 8999990,
    rating: 4.6,
    image: '/images/pixel8.png',
    onSale: true,
    colors: ['#000', '#90ee90', '#add8e6'],
  },
  {
    id: 4,
    name: 'OnePlus 12',
    brand: 'OnePlus',
    price: 10999990,
    rating: 4.5,
    image:
      'https://cdn2.fptshop.com.vn/unsafe/750x0/filters:quality(100)/2024_1_5_638400663079293145_xiaomi-redmi-note-13-xanh.png',
    onSale: false,
    colors: ['#000', '#a8c2a1', '#fff'],
  },
  {
    id: 4,
    name: 'OnePlus 12',
    brand: 'OnePlus',
    price: 10999990,
    rating: 4.5,
    image:
      'https://cdn2.fptshop.com.vn/unsafe/750x0/filters:quality(100)/2024_1_5_638400663079293145_xiaomi-redmi-note-13-xanh.png',
    onSale: false,
    colors: ['#000', '#a8c2a1', '#fff'],
  },
]

export default function FeaturedProducts() {
  return (
    <section className='container py-16'>
      <div className='mb-8 flex items-center justify-between'>
        <h2 className='text-3xl font-bold'>Điện thoại nổi bật</h2>
        <Button variant='outline' asChild>
          <Link to='/products'>Xem tất cả</Link>
        </Button>
      </div>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
        {featuredProducts.map((product) => (
          <Card
            key={product.id}
            className='group flex flex-col overflow-hidden'
          >
            <Link to={`/product/${product.id}`} className='flex-1'>
              <CardHeader className='relative aspect-square flex-1 bg-muted p-0'>
                <div className='flex h-full w-full items-center justify-center bg-neutral-50'>
                  <img
                    src={product.image}
                    alt={product.name}
                    className='h-48 w-48 transform object-contain p-4 transition-transform duration-300 group-hover:scale-105'
                  />
                </div>

                <div className='absolute right-2 top-2 flex gap-2'>
                  <Button
                    variant='secondary'
                    size='icon'
                    className='rounded-full opacity-70 shadow-sm transition-opacity hover:opacity-100'
                  >
                    <Heart className='h-4 w-4' />
                  </Button>
                </div>

                {product.onSale && (
                  <Badge
                    variant='destructive'
                    className='absolute left-2 top-2 px-2 py-1 text-xs'
                  >
                    Sale
                  </Badge>
                )}
              </CardHeader>

              <CardContent className='flex flex-col gap-2 p-4'>
                <div className='flex items-start justify-between'>
                  <h3 className='line-clamp-2 text-base font-semibold leading-tight'>
                    {product.name}
                  </h3>
                  <div className='flex shrink-0 items-center gap-1'>
                    <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                    <span className='text-sm font-medium'>
                      {product.rating}
                    </span>
                  </div>
                </div>

                <div className='flex gap-1.5'>
                  {product.colors.map((color, i) => (
                    <div
                      key={i}
                      className='h-4 w-4 rounded-full border border-muted shadow-sm'
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </CardContent>
            </Link>

            <CardFooter className='flex items-center justify-between gap-2 p-4 pt-0'>
              <div className='text-sm font-semibold'>
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(product.price)}
              </div>
              <Button size='sm' className='h-8 shrink-0 px-3 text-xs'>
                Thêm giỏ
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
