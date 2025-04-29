import React from "react";
import { Image } from "@heroui/react";
import type { CartItem } from "./types/cart";

interface ProductListProps {
  products?: CartItem[];
}

export function ProductList({ products }: ProductListProps) {
  if (!products || products.length === 0) {
    return <div className="text-center text-gray-500">Không có sản phẩm nào</div>;
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div key={product.id} className="flex gap-4">
          <Image
            src={product.image}
            alt={product.productName}
            className="h-[60px] w-[60px] rounded-lg object-cover"
          />
          <div className="flex-1">
            <h3 className="font-medium">{product.productName} ({product.ram}/{product.rom}/{product.color})</h3>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-[#FF3B30] font-bold">
                {new Intl.NumberFormat("vi-VN").format(product.priceSell)}đ
              </span>
              

                {product.price !== product.priceSell && (
                  <span className='text-sm text-default-500 line-through'>
                    {new Intl.NumberFormat('vi-VN').format(product.price)}₫
                  </span>
                )}
              <span className="text-sm text-default-500">
                x{product.quantity}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
