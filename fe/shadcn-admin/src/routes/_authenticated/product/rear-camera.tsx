import { createFileRoute } from '@tanstack/react-router'
import RearCamera from '@/features/product-management/attribute/rear-camera'

export const Route = createFileRoute('/_authenticated/product/rear-camera')({
  component: RearCamera,
})
