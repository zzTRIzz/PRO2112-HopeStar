import Footer from '@/components/layout/footer'
import Categories from '../components/categories'
import FeaturedProducts from '../components/featured-products'
import HeroSection from '../components/hero-section'
import Navbar from '../components/navbar'
import { useEffect } from 'react'

export default function HomePage() {
  useEffect(() => {
    document.title = 'HopeStar | Cửa hàng điện thoại giá tốt'
    return () => {
      document.title = 'HopeStar'
    }
  }, [])
  return (
    <div className='min-h-screen bg-background'>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedProducts />
        <Categories />
      </main>
      <Footer />
    </div>
  )
}
