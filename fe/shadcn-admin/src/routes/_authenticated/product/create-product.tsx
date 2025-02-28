import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/product/create-product')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/product/create-product"!</div>
}
