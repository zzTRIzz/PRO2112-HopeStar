import { createFileRoute } from '@tanstack/react-router'
import Battery from '@/features/product-management/attribute/battery'

export const Route = createFileRoute('/_authenticated/product/battery')({
  component: Battery,
})
