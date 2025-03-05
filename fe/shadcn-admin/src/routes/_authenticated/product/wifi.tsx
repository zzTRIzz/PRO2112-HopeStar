import { createFileRoute } from '@tanstack/react-router'
import Wifi from '@/features/product-management/attribute/wifi'

export const Route = createFileRoute('/_authenticated/product/wifi')({
  component: Wifi,
})
