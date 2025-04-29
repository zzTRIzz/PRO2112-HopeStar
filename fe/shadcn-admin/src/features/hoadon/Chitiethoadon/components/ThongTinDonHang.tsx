import { BillRespones, BillSchema } from '@/features/banhang/service/Schema';
import React, { useState } from 'react';
import { format } from "date-fns";
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import DiaChiGiaoHang from '../components/components_con/CapNhatDiaChi';

interface Posp {
    searchBill: BillRespones | null;
    loadTongBill: () => void;
    themBillHistory: (actionType: string, note: string) => void;

}
const ThongTinDonHang: React.FC<Posp> =
    ({
        searchBill,
        loadTongBill,
        themBillHistory
    }) => {
        const getOrderStatusText = (status: string | undefined) => {
            switch (status) {
                case "CHO_THANH_TOAN": return "Chờ thanh toán";
                case "DA_HUY": return "Đã hủy";
                case "CHO_XAC_NHAN": return "Chờ xác nhận";
                case "DA_XAC_NHAN": return "Đã xác nhận";
                case "DA_THANH_TOAN": return "Đã thanh toán";
                case "HOAN_THANH": return "Hoàn thành";
                case "DANG_CHUAN_BI_HANG": return "Đang chuẩn bị hàng";
                case "DANG_GIAO_HANG": return "Đang giao hàng";
                default: return "Không rõ trạng thái";
            }
        };

        const [isDialogOpen, setIsDialogOpen] = useState(false);
        return (
            <div>
                <div className='bg-white rounded-xl shadow-xl p-4'>
                    <div className="flex items-center justify-between px-4">
                        <h1 className="font-bold text-lg text-gray-600">Thông tin đơn hàng</h1>
                        {/* {searchBill?.billType == 1 && ( */}
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <Button onClick={() => setIsDialogOpen(true)}
                                disabled={searchBill?.status === "DANG_GIAO_HANG" ||
                                    searchBill?.status === "HOAN_THANH" ||
                                    searchBill?.status === "CHO_THANH_TOAN" ||
                                    searchBill?.status === "DA_HUY"
                                }
                            >Cập nhật
                            </Button>

                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Cập nhật thông tin giao hàng</DialogTitle>
                                </DialogHeader>
                                <DiaChiGiaoHang
                                    idBill={searchBill?.id}
                                    fullName={searchBill?.name??""}
                                    phone={searchBill?.phone??""}
                                    address={searchBill?.address??""}
                                    onClose={() => setIsDialogOpen(false)}
                                    loadTongBill={loadTongBill}
                                    themBillHistory={themBillHistory}
                                />
                            </DialogContent>
                        </Dialog>
                        {/* )} */}
                    </div>

                    <hr className=" border-gray-600 mt-[6px]" /><br />

                    <div className="grid grid-cols-2 gap-x-10 ml-[8px]">
                        {/* Cột bên trái */}
                        <div className="space-y-2">
                            <div className="flex  pb-2 mt-[13px]">
                                <span className="text-base text-gray-700 font-bold">Mã đơn hàng:</span>
                                <p className="ml-[14px]">{searchBill?.maBill}</p>
                            </div>
                            <div className="flex  pb-2 mt-[13px]">
                                <span className="text-base text-gray-700 font-bold">Loại đơn hàng:</span>
                                <p className="ml-[14px]">{searchBill?.billType == 0 ? "Tại quầy" : "Giao hàng"}</p>
                            </div>
                            <div className="flex  pb-2 mt-[23px]">
                                <span className="text-base text-gray-700 font-bold">Khách hàng:</span>
                                <p className="ml-[14px]">{searchBill?.name}</p>
                            </div>
                            <div className="flex  pb-2 mt-[13px] pt-[21px]">
                                <span className="text-base text-gray-700 font-bold">Số điện thoại:</span>
                                <p className="ml-[14px]">{searchBill?.phone}</p>
                            </div>

                        </div>

                        {/* Cột bên phải */}
                        <div className="space-y-2">
                            <div className="flex  pb-2 mt-[13px]">
                                <span className="text-base text-gray-700 font-bold">Ngày đặt hàng:</span>

                                <p className="ml-[14px]">
                                    {searchBill?.paymentDate ? format(new Date(searchBill.paymentDate), "HH:mm dd/MM/yyyy") : ""}
                                </p>                        </div>
                            <div className="flex  pb-2 mt-[13px]">
                                <span className="text-base text-gray-700 font-bold">Tổng tiền:</span>
                                <p className="ml-[14px]">{searchBill?.totalDue != null ? searchBill?.totalDue.toLocaleString('vi-VN') : 0} VND</p>
                            </div>
                            <div className="flex  pb-2 mt-[13px]">
                                <span className="text-base text-gray-700 font-bold w-[100px]">Địa chỉ:</span>
                                <p className="ml-[14px]">{searchBill?.address}</p>
                            </div>
                            <div className="flex  pb-2 mt-[13px] ">
                                <span className="text-base text-gray-700 font-bold ">Trạng thái:</span>
                                <p className="ml-[14px] text-green-600 font-semibold">{getOrderStatusText(searchBill?.status)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

export default ThongTinDonHang;