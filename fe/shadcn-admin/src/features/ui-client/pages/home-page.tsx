import Footer from '@/components/layout/footer'
import Categories from '../components/categories'
import FeaturedProducts from '../components/featured-products'
import HeroSection from '../components/hero-section'
import Navbar from '../components/navbar'
import { useEffect, useState } from 'react'
import CustomerChat from '../components/custom-chat'

export default function HomePage() {
  useEffect(() => {
    document.title = 'HopeStar | Cửa hàng điện thoại giá tốt'
    return () => {
      document.title = 'HopeStar'
    }
  }, [])
  const [isCustomerChatOpen, setIsCustomerChatOpen] = useState(false);
  return (
    <div className='min-h-screen bg-background'>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedProducts />
        <CustomerChat
        isOpen={isCustomerChatOpen}
        toggleChat={() => setIsCustomerChatOpen(!isCustomerChatOpen)}
      />
        <Categories />
      </main>
      <Footer />
    </div>
  )
}
