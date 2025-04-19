// src/routes/(auth)/dat-hang.lazy.tsx
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import Navbar from '@/features/ui-client/components/navbar'
import { CheckoutPage } from '@/features/ui-client/pages/gio-hang/CheckoutPage'
import { useEffect } from 'react'

export const Route = createFileRoute('/(auth)/dat-hang/')({
  component: RouteComponent,
  // validateSearch: z.object({
  //   selectedProducts: z.string().optional().catch(undefined),
  // }),
})

function RouteComponent() {
  useEffect(() => {
    document.title = 'Tiến hành đặt hàng | HopeStar'
    return () => {
      document.title = 'HopeStar'
    }
  }, [])
  return <>
    <Navbar />
    <CheckoutPage />
  </>
}