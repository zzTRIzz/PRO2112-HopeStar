import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/trangchu/trangchu')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/trangchu/trangchu"!</div>
}
