import { BillSchema } from '@/features/banhang/service/BillSchema';
import React from 'react';
import { format } from "date-fns";

interface AccountKhachHang {
    id: number,
    code: string,
    fullName: string,
    email: string,
    phone: string,
    address: string,
    googleId: string
}
interface Posp {
    searchBill: BillSchema | null;
    listKhachHang: AccountKhachHang | undefined;
}
const ThongTinDonHang: React.FC<Posp> = (
    { searchBill, listKhachHang }
) => {
    return (
        <div>
            <div className='bg-white rounded-xl shadow-xl p-4'>
                <h1 className='font-bold text-lg text-gray-600 ml-[15px]'>Thông tin đơn hàng</h1>
                <hr className=" border-gray-600 mt-[6px]" /><br />

                <div className="grid grid-cols-2 gap-x-10 ml-[8px]">
                    {/* Cột bên trái */}
                    <div className="space-y-2">
                        <div className="flex  pb-2 mt-[13px]">
                            <span className="text-base text-gray-700 font-bold">Mã đơn hàng:</span>
                            <p className="ml-[14px]">{searchBill?.nameBill}</p>
                        </div>
                        <div className="flex  pb-2 mt-[13px]">
                            <span className="text-base text-gray-700 font-bold">Loại đơn hàng:</span>
                            <p className="ml-[14px]">{searchBill?.billType ? "Tại quầy" : "Giao hàng"}</p>
                        </div>
                        <div className="flex  pb-2 mt-[23px]">
                            <span className="text-base text-gray-700 font-bold">Khách hàng:</span>
                            <p className="ml-[14px]">{listKhachHang?.fullName}</p>
                        </div>
                        <div className="flex  pb-2 mt-[13px] pt-[21px]">
                            <span className="text-base text-gray-700 font-bold">Số điện thoại:</span>
                            <p className="ml-[14px]">{listKhachHang?.phone}</p>
                        </div>

                    </div>

                    {/* Cột bên phải */}
                    <div className="space-y-2">
                        <div className="flex  pb-2 mt-[13px]">
                            <span className="text-base text-gray-700 font-bold">Ngày đặt hàng:</span>

                            <p className="ml-[14px]">
                                {searchBill?.paymentDate ? format(new Date(searchBill.paymentDate), "dd/MM/yyyy HH:mm") : "Chưa có"}
                            </p>                        </div>
                        <div className="flex  pb-2 mt-[13px]">
                            <span className="text-base text-gray-700 font-bold">Tổng tiền:</span>
                            <p className="ml-[14px]">{searchBill?.totalDue.toLocaleString('vi-VN')} VND</p>
                        </div>
                        <div className="flex  pb-2 mt-[13px]">
                            <span className="text-base text-gray-700 font-bold w-[100px]">Địa chỉ:</span>
                            <p className="ml-[14px]">{listKhachHang?.address}</p>
                        </div>
                        <div className="flex  pb-2 mt-[13px] ">
                            <span className="text-base text-gray-700 font-bold ">Trạng thái:</span>
                            <p className="ml-[14px] text-green-600 font-semibold">{searchBill?.status}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThongTinDonHang;