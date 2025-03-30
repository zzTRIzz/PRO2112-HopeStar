import React from "react";
import type { CartItem } from "../types/cart";

const FAKE_PRODUCTS = [
  {
    name: "iPhone 16 128GB Xanh Lưu Ly",
    sku: "MYWY3VN/A",
    price: 31390000,
    image: "https://cdn2.fptshop.com.vn/unsafe/128x0/filters:quality(100)/iphone_16_ultramarine_523066aa94.png",
  },
  {
    name: "Honor Magic V3 5G 12GB 512GB Đen",
    sku: "MPHF3VN/A",
    price: 49990000,
    image: "https://cdn2.fptshop.com.vn/unsafe/750x0/filters:quality(100)/honor_magic_v3_den_1_09266559a7.png",
  },
  {
    name: "Xiaomi Poco X6 5G 12GB 256GB Xanh dương",
    sku: "MNXR3VN/A",
    price: 27990000,
    image: "https://cdn2.fptshop.com.vn/unsafe/128x0/filters:quality(100)/00909923_poco_x6_blue_5e570f66db.png",
  },
  {
    name: "Xiaomi Redmi Note 14 6GB 128GB Đen",
    sku: "MR9D3VN/A",
    price: 10990000,
    image: "https://cdn2.fptshop.com.vn/unsafe/128x0/filters:quality(100)/xiaomi_redmi_note_14_den_4_2f995df92e.png",
  },
];

export function useCartData() {
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = React.useState(false);

  const generateFakeCart = React.useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newItems: CartItem[] = FAKE_PRODUCTS.map((product, index) => ({
        id: `item-${Date.now()}-${index}`,
        ...product,
        quantity: Math.floor(Math.random() * 3) + 1,
      }));

      setCartItems(newItems);
      setSelectedItems(new Set());
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const handleDeleteItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    setSelectedItems((prev) => {
      const next = new Set(prev);
      next.delete(itemId);
      return next;
    });
  };

  const handleDeleteSelected = () => {
    setCartItems((prev) => prev.filter((item) => !selectedItems.has(item.id)));
    setSelectedItems(new Set());
  };

  const handleSelectItem = (itemId: string, isSelected: boolean) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (isSelected) {
        next.add(itemId);
      } else {
        next.delete(itemId);
      }
      return next;
    });
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedItems(new Set(cartItems.map((item) => item.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  React.useEffect(() => {
    generateFakeCart();
  }, [generateFakeCart]);

  return {
    cartItems,
    selectedItems,
    isLoading,
    refreshCart: generateFakeCart,
    updateQuantity: handleUpdateQuantity,
    deleteItem: handleDeleteItem,
    deleteSelected: handleDeleteSelected,
    selectItem: handleSelectItem,
    selectAll: handleSelectAll,
  };
}
