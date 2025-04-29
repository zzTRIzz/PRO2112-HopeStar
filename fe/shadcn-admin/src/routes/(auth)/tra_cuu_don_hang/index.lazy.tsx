import Navbar from '@/features/ui-client/components/navbar';
import TraCuu from '@/features/ui-client/pages/tra_cuu_don_hang/TraCuu';
import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react';

export const Route = createLazyFileRoute('/(auth)/tra_cuu_don_hang/')({
  component: RouteComponent,
})

function RouteComponent() {
  useEffect(() => {
    document.title = 'Tra cứu đơn hàng | HopeStar';
    return () => {
      document.title = 'HopeStar';
    };
  }, []);
  return (
    <>
      <Navbar />
      < TraCuu />
    </>
  )
}
