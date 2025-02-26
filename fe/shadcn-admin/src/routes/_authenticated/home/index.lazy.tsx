import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/home/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/client/home/"!</div>
}
