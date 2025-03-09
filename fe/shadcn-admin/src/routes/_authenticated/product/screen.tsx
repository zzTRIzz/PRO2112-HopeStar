import { createFileRoute } from '@tanstack/react-router'
import Screen from '@/features/product-management/attribute/screen'

export const Route = createFileRoute('/_authenticated/product/screen')({
  component: Screen,
})
