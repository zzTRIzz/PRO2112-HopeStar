import { createFileRoute } from '@tanstack/react-router'
import Rom from '@/features/product-management/attribute/rom'

export const Route = createFileRoute('/_authenticated/product/rom')({
  component: Rom,
})
