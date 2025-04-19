import { useEffect } from "react"; // 👈 Thêm import useEffect
import { createFileRoute } from "@tanstack/react-router";
import { AccountLayout } from "../../../../features/ui-client/pages/taikhoan/AccountLayout";
import { OrdersPage } from "../../../../features/ui-client/pages/taikhoan/trang-con/OrderPage";
import Navbar from "@/features/ui-client/components/navbar";

// 👇 Tạo một functional component riêng để sử dụng hooks
const OrderComponent = () => {
  // Thêm useEffect ở đây
  useEffect(() => {
    // Thay đổi tiêu đề khi component mount
    document.title = "Đơn hàng của tôi | HopeStar";
    
    // Cleanup: Khôi phục tiêu đề khi component unmount
    return () => {
      document.title = "HopeStar";
    };
  }, []); // 👈 Dependency array rỗng → Chỉ chạy 1 lần

  return (
    <>
      <Navbar />
      <AccountLayout>
        <OrdersPage />
      </AccountLayout>
    </>
  );
};

// 👇 Sử dụng component đã định nghĩa
export const Route = createFileRoute(
  "/(auth)/taikhoan/don-hang-cua-toi/"
)({
  component: OrderComponent, // 👈 Truyền component vào đây
});