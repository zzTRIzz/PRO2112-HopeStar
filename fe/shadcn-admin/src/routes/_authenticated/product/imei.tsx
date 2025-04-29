import ImeiManagement from '@/features/product-management/attribute/imei'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/product/imei')({
  component: ImeiManagement,
})

