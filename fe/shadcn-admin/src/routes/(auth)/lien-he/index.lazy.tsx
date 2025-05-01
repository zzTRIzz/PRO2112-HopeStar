import Footer from '@/components/layout/footer'
import Navbar from '@/features/ui-client/components/navbar'
import { LienHe } from '@/features/ui-client/pages/lien-he/LienHe'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createLazyFileRoute('/(auth)/lien-he/')({
  component: RouteComponent,
})

function RouteComponent() {
  useEffect(() => {
    document.title = 'Liên hệ với chúng tôi | HopeStar';
    return () => {
      document.title = 'HopeStar'; 
    };
  }, []);
  return <>
    <Navbar />
    <LienHe />
    <Footer />
  </>
}
