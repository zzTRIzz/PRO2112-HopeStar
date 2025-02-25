import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/product/screen')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/product/screen"!</div>
}
