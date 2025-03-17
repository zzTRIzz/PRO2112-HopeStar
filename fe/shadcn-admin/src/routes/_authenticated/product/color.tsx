import { createFileRoute } from '@tanstack/react-router'
import Color from '@/features/product-management/attribute/color'

export const Route = createFileRoute('/_authenticated/product/color')({
  component: Color,
})
