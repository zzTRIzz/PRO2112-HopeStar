import { createLazyFileRoute } from '@tanstack/react-router'
import HomePageDienThoai from '@/features/ui-client/pages/home-page-dien-thoai'
import { useEffect } from 'react'

export const Route = createLazyFileRoute('/(auth)/dienthoai/')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      brand: search.brand ? Number(search.brand) : undefined,
      chip: search.chip ? Number(search.chip) : undefined,
      category: search.category ? Number(search.category) : undefined,
      os: search.os ? Number(search.os) : undefined,
      ram: search.ram ? Number(search.ram) : undefined,
      rom: search.rom ? Number(search.rom) : undefined,
      nfc: search.nfc ? Boolean(search.nfc) : undefined,
      typeScreen: search.typeScreen,
      priceStart: search.priceStart ? Number(search.priceStart) : undefined,
      priceEnd: search.priceEnd ? Number(search.priceEnd) : undefined,
      priceMax: search.priceMax ? Boolean(search.priceMax) : undefined,
      priceMin: search.priceMin ? Boolean(search.priceMin) : undefined,
      productSale: search.productSale ? Boolean(search.productSale) : undefined,
    }
  },
})

function RouteComponent() {
  useEffect(() => {
    document.title = 'Điện thoại | HopeStar'
    return () => {
      document.title = 'HopeStar'
    }
  }, [])
  return <>
    <HomePageDienThoai />
</>
}
