import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/product/wifi')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/product/Wifi"!</div>
}
