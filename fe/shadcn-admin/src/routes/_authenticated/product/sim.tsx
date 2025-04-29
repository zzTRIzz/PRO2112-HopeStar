import { createFileRoute } from '@tanstack/react-router'
import Sim from '@/features/product-management/attribute/sim'

export const Route = createFileRoute('/_authenticated/product/sim')({
  component: Sim,
})
