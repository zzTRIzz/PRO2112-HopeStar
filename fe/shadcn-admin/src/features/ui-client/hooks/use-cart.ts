import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getCart } from '../data/api-service'
import { CartResponse } from '../data/schema'

export const CART_QUERY_KEY = ['cart'] as const

export function useCart() {
  const queryClient = useQueryClient()

  const {
    data: cart,
    isLoading,
    error,
  } = useQuery<CartResponse>({
    queryKey: CART_QUERY_KEY,
    queryFn: getCart,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const refreshCart = () => {
    queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY })
  }

  return {
    cart,
    isLoading,
    error,
    refreshCart,
  }
}
