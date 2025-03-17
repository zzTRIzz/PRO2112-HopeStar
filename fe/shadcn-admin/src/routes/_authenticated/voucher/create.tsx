import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/voucher/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/voucher/create"!</div>
}
