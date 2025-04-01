import React, { useState, useEffect } from "react";
import { Card, Button, Input, Select, SelectItem } from "@heroui/react";
import type { CartItem, Voucher } from "./types/cart";

// Mock vouchers data (trong thực tế sẽ lấy từ API)
const MOCK_VOUCHERS: Voucher[] = [
  {
    id: "1",
    code: "SUMMER50K",
    value: 50000,
    type: "fixed",
    description: "Giảm 50.000đ cho đơn hàng từ 500.000đ",
    minOrderValue: 500000,
  },
  {
    id: "2",
    code: "SALE10",
    value: 10,
    type: "percentage",
    description: "Giảm 10% tổng giá trị đơn hàng",
  },
  {
    id: "3",
    code: "NEWUSER100K",
    value: 100000,
    type: "fixed",
    description: "Giảm 100.000đ cho đơn hàng từ 1.000.000đ",
    minOrderValue: 1000000,
  },
];

interface OrderSummaryProps {
  onCheckout: () => void;
  products?: CartItem[];
}

export function OrderSummary({ onCheckout, products = [] }: OrderSummaryProps) {
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherError, setVoucherError] = useState("");
  
  const subtotal = products.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Chọn voucher có giá trị cao nhất mặc định
  useEffect(() => {
    if (!selectedVoucher && subtotal > 0) {
      const availableVouchers = MOCK_VOUCHERS.filter(
        v => !v.minOrderValue || subtotal >= v.minOrderValue
      );

      if (availableVouchers.length > 0) {
        const highestValueVoucher = availableVouchers.reduce((highest, current) => {
          const highestValue = highest.type === 'fixed' 
            ? highest.value 
            : Math.round(subtotal * (highest.value / 100));
          
          const currentValue = current.type === 'fixed'
            ? current.value
            : Math.round(subtotal * (current.value / 100));

          return currentValue > highestValue ? current : highest;
        }, availableVouchers[0]);

        setSelectedVoucher(highestValueVoucher);
      }
    }
  }, [subtotal]);

  const productDiscount = Math.round(subtotal * 0.1); // 10% product discount

  // Tính toán giảm giá voucher
  const calculateVoucherDiscount = (voucher: Voucher | null, subtotal: number): number => {
    if (!voucher) return 0;
    if (voucher.minOrderValue && subtotal < voucher.minOrderValue) return 0;
    
    return voucher.type === 'fixed' 
      ? voucher.value 
      : Math.round(subtotal * (voucher.value / 100));
  };

  const voucherDiscount = calculateVoucherDiscount(selectedVoucher, subtotal);
  const shipping = 0; // Free shipping
  const total = subtotal - productDiscount - voucherDiscount;
  const points = Math.floor(total * 0.00025); // 0.025% points back

  return (
    <div className="order-summary-wrapper">
      <Card className="overflow-hidden relative">
        <div className="p-6">
        <h2 className="mb-4 text-xl font-bold">Thông tin đơn hàng</h2>
        
        {/* Phần chọn voucher */}
        <div className="mb-4 space-y-3">
          <Select
            label="Chọn voucher"
            placeholder="Chọn voucher"
            value={selectedVoucher?.id || ""}
            classNames={{
              popoverContent: "select-popover"
            }}
            popoverProps={{
              placement: "bottom",
              offset: 5,
              containerPadding: 16,
              portalContainer: document.body
            }}
            onChange={(e) => {
              const selected = MOCK_VOUCHERS.find(v => v.id === e.target.value);
              setSelectedVoucher(selected || null);
              setVoucherCode("");
              setVoucherError("");
            }}
          >
            {MOCK_VOUCHERS.map((voucher) => (
              <SelectItem key={voucher.id} textValue={voucher.code}>
                <div className="flex flex-col">
                  <span>
                    {voucher.type === 'fixed' 
                      ? `Giảm ${voucher.value.toLocaleString()}đ` 
                      : `Giảm ${voucher.value}%`}
                  </span>
                  <span className="text-sm text-gray-500">{voucher.description}</span>
                </div>
              </SelectItem>
            ))}
          </Select>

          <div className="flex gap-2">
            <Input
              placeholder="Nhập mã voucher"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              color={voucherError ? "danger" : "default"}
              errorMessage={voucherError}
              disabled={!!selectedVoucher}
            />
            <Button
              color="primary"
              disabled={!voucherCode || !!selectedVoucher}
              onPress={() => {
                const found = MOCK_VOUCHERS.find(
                  (v) => v.code.toLowerCase() === voucherCode.toLowerCase()
                );
                if (found) {
                  setSelectedVoucher(found);
                  setVoucherError("");
                } else {
                  setVoucherError("Mã voucher không hợp lệ");
                }
              }}
            >
              Áp dụng
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Tổng tiền</span>
            <span>{subtotal.toLocaleString()}đ</span>
          </div>
          <div className="flex justify-between">
            <span>Khuyến mãi sản phẩm</span>
            <span className="text-[#FF3B30]">
              -{productDiscount.toLocaleString()}đ
            </span>
          </div>
          {selectedVoucher && voucherDiscount > 0 && (
            <div className="flex justify-between">
              <span>Giảm giá voucher</span>
              <span className="text-[#FF3B30]">
                -{voucherDiscount.toLocaleString()}đ
              </span>
            </div>
          )}
          {selectedVoucher && voucherDiscount === 0 && (
            <div className="text-sm text-warning-500">
              *Không thể áp dụng voucher do không đạt giá trị đơn hàng tối thiểu
            </div>
          )}
          <div className="flex justify-between">
            <span>Phí vận chuyển</span>
            <span>Miễn phí</span>
          </div>
          <div className="flex justify-between border-t pt-3">
            <span className="font-bold">Cần thanh toán</span>
            <span className="text-[#FF3B30] font-bold">
              {total.toLocaleString()}đ
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Điểm thưởng</span>
            <span className="flex items-center gap-1">
              <span className="text-warning-500">⭐</span>
              +{points.toLocaleString()}
            </span>
          </div>
        </div>

        <Button
          className="mt-6 bg-[#338cf1] text-white w-full h-12 text-lg font-medium hover:bg-[#338cf1]"
          onPress={onCheckout}
        >
          Đặt hàng
        </Button>

        <p className="mt-4 text-center text-sm text-default-500">
          Bằng việc tiến hành đặt mua hàng, bạn đồng ý với{" "}
          <a href="#" className="text-primary-500">
            Điều khoản dịch vụ
          </a>{" "}
          và{" "}
          <a href="#" className="text-primary-500">
            Chính sách xử lý dữ liệu cá nhân
          </a>{" "}
          của Hopstar Shop
        </p>
        </div>
      </Card>
    </div>
  );
}
