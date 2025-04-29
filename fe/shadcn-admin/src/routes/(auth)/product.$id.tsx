import { createFileRoute } from '@tanstack/react-router'
import ProductDetail from '@/features/ui-client/pages/ProductDetail'

export const Route = createFileRoute('/(auth)/product/$id')({
  component: ProductDetail,
})
