import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deleteCartItem,
  getCart,
  updateCartItem,
} from '../data/api-cart-service'
import { CartResponse } from '../data/schema'

export const CART_QUERY_KEY = ['cart'] as const

export function useCart() {
  const queryClient = useQueryClient()
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())

  const {
    data: cart,
    isLoading,
    error,
  } = useQuery<CartResponse>({
    queryKey: CART_QUERY_KEY,
    queryFn: getCart,
    staleTime: 1000, // 1s
  })

  const refreshCart = () => {
    queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY })
  }

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      await updateCartItem(itemId, quantity)
      refreshCart()
    } catch (error) {
      console.error('Failed to update quantity:', error)
      throw error
    }
  }

  const deleteItem = async (itemId: number) => {
    try {
      await deleteCartItem(itemId)
      setSelectedItems((prev) => {
        const next = new Set(prev)
        next.delete(itemId)
        return next
      })
      refreshCart()
    } catch (error) {
      console.error('Failed to delete item:', error)
      throw error
    }
  }

  const selectItem = (itemId: number, isSelected: boolean) => {
    setSelectedItems((prev) => {
      const next = new Set(prev)
      if (isSelected) {
        next.add(itemId)
      } else {
        next.delete(itemId)
      }
      return next
    })
  }

  const selectAll = (isSelected: boolean) => {
    if (isSelected && cart?.cartDetailResponseList) {
      setSelectedItems(
        new Set(cart.cartDetailResponseList.map((item) => item.id))
      )
    } else {
      setSelectedItems(new Set())
    }
  }

  const deleteSelected = async () => {
    try {
      await Promise.all(Array.from(selectedItems).map(deleteCartItem))
      setSelectedItems(new Set())
      refreshCart()
    } catch (error) {
      console.error('Failed to delete selected items:', error)
      throw error
    }
  }

  return {
    cart,
    isLoading,
    error,
    selectedItems,
    refreshCart,
    updateQuantity,
    deleteItem,
    selectItem,
    selectAll,
    deleteSelected,
  }
}
