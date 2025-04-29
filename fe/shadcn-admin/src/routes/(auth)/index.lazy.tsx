import { createLazyFileRoute } from '@tanstack/react-router'
import HomePage from '@/features/ui-client/pages/home-page'

export const Route = createLazyFileRoute('/(auth)/')({
  component: HomePage,
})
