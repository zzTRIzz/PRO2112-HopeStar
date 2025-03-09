import { createFileRoute } from '@tanstack/react-router'
import Os from '@/features/product-management/attribute/os'

export const Route = createFileRoute('/_authenticated/product/os')({
  component: Os,
})
