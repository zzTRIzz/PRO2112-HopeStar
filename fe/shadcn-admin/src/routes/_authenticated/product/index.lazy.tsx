import { createLazyFileRoute } from '@tanstack/react-router'
import Product from '@/features/product-management/product'

export const Route = createLazyFileRoute('/_authenticated/product/')({
  component: Product,
})
