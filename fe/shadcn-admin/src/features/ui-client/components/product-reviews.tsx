import React from 'react'
import { Card, CardBody, Avatar, Progress, Button, Image } from '@heroui/react'
import { Icon } from '@iconify/react'

interface Review {
  id: number
  user: {
    name: string
    avatar: string
  }
  rating: number
  date: string
  content: string
  images?: string[]
}

export function ProductReviews() {
  const reviews: Review[] = [
    {
      id: 1,
      user: {
        name: 'Nguyễn Văn A',
        avatar: 'https://i.pravatar.cc/150?u=1',
      },
      rating: 5,
      date: '2024-03-10',
      content: 'Sản phẩm rất tốt, đóng gói cẩn thận, giao hàng nhanh!',
      images: [
        'https://picsum.photos/200/200?random=10',
        'https://picsum.photos/200/200?random=11',
      ],
    },
    {
      id: 2,
      user: {
        name: 'Trần Thị B',
        avatar: 'https://i.pravatar.cc/150?u=2',
      },
      rating: 4,
      date: '2024-03-09',
      content: 'Camera chụp đẹp, pin trâu. Chỉ có điều giá hơi cao.',
    },
  ]

  const ratingStats = {
    average: 4.8,
    total: 254,
    distribution: [
      { stars: 5, count: 200 },
      { stars: 4, count: 40 },
      { stars: 3, count: 10 },
      { stars: 2, count: 3 },
      { stars: 1, count: 1 },
    ],
  }

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <Card>
          <CardBody>
            <div className='flex items-center gap-4'>
              <div className='text-center'>
                <div className='text-3xl font-bold'>{ratingStats.average}</div>
                <div className='flex items-center gap-1'>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon
                      key={i}
                      icon='lucide:star'
                      className={
                        i < Math.floor(ratingStats.average)
                          ? 'text-warning'
                          : 'text-default-300'
                      }
                    />
                  ))}
                </div>
                <div className='text-small text-default-500'>
                  {ratingStats.total} đánh giá
                </div>
              </div>
              <div className='flex-1 space-y-2'>
                {ratingStats.distribution.map((stat) => (
                  <div key={stat.stars} className='flex items-center gap-2'>
                    <div className='w-8 text-small'>{stat.stars}★</div>
                    <Progress
                      aria-label={`${stat.stars} stars`}
                      value={(stat.count / ratingStats.total) * 100}
                      className='flex-1'
                    />
                    <div className='w-12 text-right text-small'>
                      {stat.count}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className='space-y-4'>
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardBody>
              <div className='space-y-4'>
                <div className='flex items-center gap-4'>
                  <Avatar src={review.user.avatar} name={review.user.name} />
                  <div>
                    <div className='font-semibold'>{review.user.name}</div>
                    <div className='flex items-center gap-2 text-small text-default-500'>
                      <div className='flex items-center gap-1'>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Icon
                            key={i}
                            icon='lucide:star'
                            className={
                              i < review.rating
                                ? 'text-warning'
                                : 'text-default-300'
                            }
                          />
                        ))}
                      </div>
                      <span>•</span>
                      <time dateTime={review.date}>
                        {new Date(review.date).toLocaleDateString('vi-VN')}
                      </time>
                    </div>
                  </div>
                </div>
                <p>{review.content}</p>
                {review.images && (
                  <div className='flex gap-2'>
                    {review.images.map((image, index) => (
                      <Image
                        key={index}
                        className='h-20 w-20 rounded-lg object-cover'
                        src={image}
                        alt={`Review image ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className='text-center'>
        <Button variant='flat'>Xem thêm đánh giá</Button>
      </div>
    </div>
  )
}
