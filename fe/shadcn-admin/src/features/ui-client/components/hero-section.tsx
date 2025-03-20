import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from './ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel'

const heroSlides = [
  {
    id: 1,
    title: ' Điện thoại iPhone 16',
    description:
      'iPhone 16 mang đến nhiều cải tiến đáng chú ý về hiệu năng với chip A18',
    image:
      'https://cdn2.fptshop.com.vn/unsafe/360x0/filters:quality(100)/iphone_16_f27848b783.png',
    ctaText: 'Xem chi tiết',
    ctaLink: '/products/iphone-16',
    color: 'bg-gradient-to-r from-slate-900 to-slate-700',
  },
  {
    id: 2,
    title: 'Samsung Galaxy S25 Ultra',
    description: 'Chào mừng đến với kỷ nguyên điện thoại AI của Samsung.',
    image:
      'https://cdn2.fptshop.com.vn/unsafe/360x0/filters:quality(100)/galaxy_s25_ultra_titan_silver_blue_1_8225f9e1f4.png',
    ctaText: 'Khám phá Samsung AI',
    ctaLink: '/products/samsung-s25-ultra',
    //color: "bg-gradient-to-r from-yellow-500 to-red-500"
    color: 'bg-gradient-to-r from-blue-700 to-indigo-700',
  },
]

export default function HeroSection() {
  const [api, setApi] = useState<any>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }

    api.on('select', handleSelect)
    return () => {
      api.off('select', handleSelect)
    }
  }, [api])

  return (
    <section className='relative'>
      <Carousel className='w-full' setApi={setApi}>
        <CarouselContent>
          {heroSlides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div
                className={`${slide.color} aspect-[16/9] w-full md:aspect-[21/9]`}
              >
                <div className='container flex h-full flex-col items-center justify-between px-4 py-12 md:flex-row'>
                  <div className='space-y-4 text-white md:w-1/2'>
                    <h1 className='text-4xl font-bold tracking-tight md:text-6xl'>
                      {slide.title}
                    </h1>
                    <p className='max-w-md text-xl md:text-2xl'>
                      {slide.description}
                    </p>
                    <div className='pt-4'>
                      <Button size='lg' asChild>
                        <Link to={slide.ctaLink}>{slide.ctaText}</Link>
                      </Button>
                    </div>
                  </div>
                  <div className='mt-8 flex justify-center md:mt-0 md:w-1/2'>
                    {/* Placeholder for phone image */}
                    <div className='relative h-[300px] w-[300px] md:h-[400px] md:w-[400px]'>
                      <div className='absolute inset-0 rounded-full bg-white/10 blur-3xl'></div>
                      <div className='relative z-10 flex h-full w-full items-center justify-center'>
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className='h-auto max-h-[280px] object-contain'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className='absolute bottom-4 left-1/2 flex -translate-x-1/2 transform gap-2'>
          {heroSlides.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-all ${
                current === index ? 'w-6 bg-white' : 'bg-white/30'
              }`}
              onClick={() => api?.scrollTo(index)}
            ></div>
          ))}
        </div>
        <CarouselPrevious className='left-4' />
        <CarouselNext className='right-4' />
      </Carousel>
    </section>
  )
}
