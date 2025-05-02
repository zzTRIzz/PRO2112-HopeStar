import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast'
import { Bill } from '../taikhoan/service/schema';
const TraCuu: React.FC = () => {
  const [maDonHang, setMaDonHang] = useState(""); // Lưu mã đơn hàng
  const [bill, setBill] = useState<Bill | null>(null);

  const traCuuDonHang = async () => {
    if (!maDonHang.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập mã đơn hàng',
        variant: 'destructive'
      })
      return;
    }
    if (maDonHang.length != 15) {
      toast({
        title: 'Lỗi',
        description: 'Mã đơn hàng bắt buộc 15 chữ số ',
        variant: 'destructive'
      })
      return;

    }

    try {
      // Gọi API để kiểm tra mã hóa đơn
      const response = await fetch(`http://localhost:8080/bill/client/findBillByMaBill/${maDonHang}`);
      if (!response.ok) {
        toast({
          title: 'Lỗi',
          description: 'Không thể tra cứu mã đơn hàng này!',
          variant: 'destructive'
        })
        return;
      }
      
      // Nếu mã hóa đơn hợp lệ, lưu mã và chuyển hướng
      localStorage.setItem("ma-don-hang", maDonHang);
      window.location.href = `/tra_cuu_don_hang/thong-tin`;
    } catch (error) {
      alert(error.message || "Có lỗi xảy ra, vui lòng thử lại!");
    }
  };
  return (
    <>
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-7xl flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-1/2">
            <img
              src="https://didongviet.vn/_next/image?url=%2Ficon%2Ftracuu%2Ftracuu.png&w=1920&q=75"
              alt="Tracking Illustration"
              className="w-full h-auto object-contain"
            />
          </div>

          <div className="w-full md:w-1/2 flex flex-col items-center justify-center mt-2 md:mt-0 md:pl-12">
            {/* <input
            type="text"
            placeholder="Số điện thoại"
            className="w-full max-w-md mb-4 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
          /> */}
            <input
              type="number"
              placeholder="Mã đơn hàng"
              className="w-full max-w-md mb-6 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
              value={maDonHang} // Liên kết giá trị input với state
              onChange={(e) => setMaDonHang(e.target.value)} // Cập nhật state khi người dùng nhập
            />
            <button
              onClick={traCuuDonHang} // Gọi hàm tra cứu khi nhấn nút
              className="w-full max-w-md py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Tra cứu đơn hàng
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TraCuu;