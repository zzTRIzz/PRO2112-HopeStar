import { createFileRoute } from '@tanstack/react-router'
import Category from '@/features/product-management/attribute/category'

export const Route = createFileRoute('/_authenticated/product/category')({
  component: Category,
})
