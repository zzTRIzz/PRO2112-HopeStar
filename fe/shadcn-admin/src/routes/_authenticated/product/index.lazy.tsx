import { createLazyFileRoute } from '@tanstack/react-router'
import Product from '@/features/product-management/product'
import { useEffect } from 'react'

export const Route = createLazyFileRoute('/_authenticated/product/')({
  component: RouteComponent,
})

function RouteComponent() {
  useEffect(() => {
    document.title = 'Quản lý sản phẩm | HopeStar'
    return () => {
      document.title = 'HopeStar'
    }
  }, [])
  return <Product />
}
