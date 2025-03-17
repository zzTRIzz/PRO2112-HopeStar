import { createFileRoute } from '@tanstack/react-router'
import Resolution from '@/features/product-management/attribute/resolution'

export const Route = createFileRoute('/_authenticated/product/resolution')({
  component: Resolution,
})
