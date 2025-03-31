import BoLocDienThoai from '../components/bo-loc-dien-thoai'
import Categories from '../components/categories'
import FeaturedProducts from '../components/featured-products'
import HeroSection from '../components/hero-section'
import Navbar from '../components/navbar'
import TatCaDienThoai from '../components/tat-ca-dien-thoai'

export default function HomePageDienThoai() {
  return (
    <div className='min-h-screen bg-background'>
          <Navbar />
          <main>
            {/* <Categories /> */}
            {/* Bộ lọc ở trong component này TatCaDienThoai */}
            <TatCaDienThoai />
          </main>
        </div>
  )
}
