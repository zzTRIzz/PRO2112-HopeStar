import { createFileRoute } from '@tanstack/react-router'
import createProduct from '@/features/product-management/product/create-product/create-product'

export const Route = createFileRoute('/_authenticated/product/create-product')({
  component: createProduct,
})
