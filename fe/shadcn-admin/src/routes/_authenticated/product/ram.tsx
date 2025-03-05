import { createFileRoute } from '@tanstack/react-router'
import Ram from '@/features/product-management/attribute/ram'

export const Route = createFileRoute('/_authenticated/product/ram')({
  component: Ram,
})
