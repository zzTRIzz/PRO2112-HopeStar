import Categories from '../components/categories'
import FeaturedProducts from '../components/featured-products'
import HeroSection from '../components/hero-section'
import Navbar from '../components/navbar'

export default function HomePage() {
  return (
    <div className='min-h-screen bg-background'>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedProducts />
        <Categories />
      </main>
    </div>
  )
}
