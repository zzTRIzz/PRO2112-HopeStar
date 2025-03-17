import { createFileRoute } from '@tanstack/react-router'
import Card from '@/features/product-management/attribute/card'

export const Route = createFileRoute('/_authenticated/product/card')({
  component: Card,
})
