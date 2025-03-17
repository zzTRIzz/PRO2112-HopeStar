import { createFileRoute } from '@tanstack/react-router'
import FrontCamera from '@/features/product-management/attribute/front-camera'

export const Route = createFileRoute('/_authenticated/product/front-camera')({
  component: FrontCamera,
})
