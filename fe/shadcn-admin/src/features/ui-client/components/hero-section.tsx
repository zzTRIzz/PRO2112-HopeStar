import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel'

const bannerImages = [
  [
    {
      id: 1,
      image: 'https://hoangphucphoto.com/wp-content/uploads/2019/10/7648_ede6972eba2e74288ab7f49b602f94bb.jpg',
      link: '/products/iphone-16',
      title: 'iPhone 16 Pro',
    },
    {
      id: 2,
      image: 'https://cdn.tgdd.vn/Files/2022/06/10/1438681/samsung_quangcaoiphone_1_1280x720-800-resize.jpg',
      link: '/products/samsung-s25-ultra',
      title: 'Galaxy S25 Ultra',
    },
  ],
  [
    {
      id: 3,
      image: 'https://www.phucanh.vn/media/news/2301_banner-pre-order-s24-desktop-min.jpg',
      link: '/products/apple-watch',
      title: 'Samsung',
    },
    {
      id: 4,
      image: 'https://shop.daisycomms.co.uk/wp-content/uploads/2023/09/Apple-iPhone-15-promo-banner-buy-now-scaled.jpg',
      link: '/products/macbook',
      title: 'iPhone',
    },
  ],
]

export default function HeroSection() {
  const [api, setApi] = useState()
  const [current, setCurrent] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

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

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className='relative bg-slate-50'>
      <Carousel className='w-full mt-3' setApi={setApi}>
        <CarouselContent>
          {bannerImages.map((slideGroup, slideIndex) => (
            <CarouselItem key={slideIndex}>
              <div className='flex flex-col gap-4 px-4 md:flex-row md:gap-6 md:px-6'>
                {slideGroup.map((banner) => (
                  <Link
                    key={banner.id}
                    // to={banner.link}
                    className='group relative block w-full overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl md:w-1/2'
                    aria-label={`View ${banner.title}`}
                  >
                    <div className='relative aspect-[16/9] w-full'>
                      {isLoading ? (
                        <div className='h-full w-full animate-pulse rounded-xl bg-gray-200' />
                      ) : (
                        <>
                          <img
                            src={banner.image}
                            alt={banner.title}
                            className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                            loading='lazy'
                          />
                          <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
                          <div className='absolute bottom-4 left-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                            <h3 className='text-lg font-semibold'>{banner.title}</h3>
                          </div>
                        </>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Slide indicators */}
        {/* <div className='absolute bottom-0 left-1/2 flex -translate-x-1/2 gap-2 pb-4'>
          {bannerImages.map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                current === index ? 'w-8 bg-primary' : 'w-2 bg-primary/30'
              }`}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div> */}

        {/* Navigation arrows */}
        <CarouselPrevious
          className='left-4 h-10 w-10 border border-primary/20 bg-background/80 opacity-80 hover:bg-background hover:opacity-100'
          aria-label='Previous slide'
        />
        <CarouselNext
          className='right-4 h-10 w-10 border border-primary/20 bg-background/80 opacity-80 hover:bg-background hover:opacity-100'
          aria-label='Next slide'
        />
      </Carousel>
    </section>
  )
}