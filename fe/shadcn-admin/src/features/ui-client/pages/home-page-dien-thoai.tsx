import Footer from '@/components/layout/footer'
import Navbar from '../components/navbar'
import TatCaDienThoai from '../components/tat-ca-dien-thoai'

export default function HomePageDienThoai() {
  return (
    <div className='min-h-screen bg-background'>
          <Navbar />
          <main>
            <TatCaDienThoai />
          </main>
          <Footer />
        </div>
  )
}
