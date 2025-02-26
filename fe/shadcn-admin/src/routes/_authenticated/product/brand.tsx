import { createFileRoute } from '@tanstack/react-router'
import Brand from '@/features/product-management/attribute/brand'

// import Product from '@/features/product'

export const Route = createFileRoute('/_authenticated/product/brand')({
  component: Brand,
})
