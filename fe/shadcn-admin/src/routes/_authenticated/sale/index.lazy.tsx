import { createLazyFileRoute } from '@tanstack/react-router'
import SaleUI from '../../../features/sale/SaleUI'
import { useEffect } from 'react'

export const Route = createLazyFileRoute('/_authenticated/sale/')({
  component: RouteComponent,
})

function RouteComponent() {
  useEffect(() => {
    document.title = 'Quản lý sale | HopeStar'
    return () => {
      document.title = 'HopeStar'
    }
  }, [])
  return (
    <>
      <SaleUI />
    </>
  )
}
