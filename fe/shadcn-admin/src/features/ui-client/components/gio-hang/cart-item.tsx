import React from "react";
import { Card, CardBody, Image, Button, Checkbox } from "@heroui/react";
import { Icon } from "@iconify/react";
import type { CartItem } from "./types/cart";

interface CartItemProps {
  item: CartItem;
  isSelected: boolean;
  onSelect: (isSelected: boolean) => void;
  onUpdateQuantity: (quantity: number) => void;
  onDelete: () => void;
}

export function CartItemCard({
  item,
  isSelected,
  onSelect,
  onUpdateQuantity,
  onDelete,
}: CartItemProps) {
  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, item.quantity + delta);
    onUpdateQuantity(newQuantity);
  };

  return (
    <Card className="mb-4">
      <CardBody>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <Checkbox
              isSelected={isSelected}
              onValueChange={onSelect}
              aria-label={`Select ${item.name}`}
            />
            <Image
              src={item.image}
              className="h-24 w-24 rounded-lg object-cover"
              alt={item.name}
            />
          </div>
          <div className="flex-grow space-y-3">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {item.name}
              </h3>
              <p className="text-sm text-default-500">{item.sku}</p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="text-lg font-bold text-danger">
                {new Intl.NumberFormat("vi-VN").format(item.price)}₫
              </span>
              <div className="flex items-center gap-2">
                <Button
                  isIconOnly
                  variant="flat"
                  size="sm"
                  onPress={() => handleQuantityChange(-1)}
                  aria-label="Decrease quantity"
                >
                  <Icon icon="lucide:minus" className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center text-medium">{item.quantity}</span>
                <Button
                  isIconOnly
                  variant="flat"
                  size="sm"
                  onPress={() => handleQuantityChange(1)}
                  aria-label="Increase quantity"
                >
                  <Icon icon="lucide:plus" className="h-4 w-4" />
                </Button>
                <Button
                  isIconOnly
                  variant="flat"
                  color="danger"
                  size="sm"
                  onPress={onDelete}
                  aria-label="Remove item"
                >
                  <Icon icon="lucide:trash-2" className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}