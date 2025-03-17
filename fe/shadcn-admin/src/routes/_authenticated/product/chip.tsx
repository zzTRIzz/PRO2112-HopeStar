import { createFileRoute } from '@tanstack/react-router'
import Chip from '@/features/product-management/attribute/chip'

export const Route = createFileRoute('/_authenticated/product/chip')({
  component: Chip,
})
