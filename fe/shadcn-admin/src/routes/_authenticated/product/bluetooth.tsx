import { createFileRoute } from '@tanstack/react-router'
import Bluetooth from '@/features/product-management/attribute/bluetooth'

export const Route = createFileRoute('/_authenticated/product/bluetooth')({
  component: Bluetooth,
})
