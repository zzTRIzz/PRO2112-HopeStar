import { createFileRoute } from '@tanstack/react-router'
import ProductDetail from '@/features/product-management/product-detail'

export const Route = createFileRoute(
  '/_authenticated/product/$id/product-detail'
)({
  component: ProductDetail,
})
