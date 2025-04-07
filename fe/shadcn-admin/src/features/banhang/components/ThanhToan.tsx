import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Input } from "@/components/ui/input"
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { BillSchema, Voucher } from '../service/Schema';
import InHoaDon from './InHoaDon';
import "../css/print_hoaDon.css"
import TaoMaQr from './TaoMaQr';
import { fromThanhCong, fromThatBai } from './ThongBao';
interface ThanhToanProps {
    searchBill: BillSchema | undefined;
    setPaymentMethod: any;
    paymentMethod: number | null;
    customerPayment: number;
    setCustomerPayment: any;
    handleThanhToan: any;
    ListVoucherTheoAccount: Voucher[];
    setVoucherDangDung: any;
    updateVoucherKhiChon: any;
    isVoucher: boolean;
    setIsVoucher: any;
    tienThua: number;
    isBanGiaoHang: boolean;
    phiShip: number;
    printData: any;
    printRef: React.RefObject<HTMLDivElement | null>;
    setIsThanhToanNhanHang: (open: boolean) => void;
    isThanhToanNhanHang: boolean;

}


const ThanhToan: React.FC<ThanhToanProps> =
    ({
        searchBill,
        setPaymentMethod,
        paymentMethod,
        customerPayment,
        setCustomerPayment,
        handleThanhToan,
        ListVoucherTheoAccount,
        setVoucherDangDung,
        updateVoucherKhiChon,
        isVoucher,
        setIsVoucher,
        tienThua,
        isBanGiaoHang,
        phiShip,
        printData,
        printRef,
        setIsThanhToanNhanHang,
        isThanhToanNhanHang
    }) => {
        const [dateTime, setDateTime] = useState<Date>(new Date());
        const tongTien = searchBill?.totalDue == null ? 0 : searchBill?.totalDue + phiShip;

        const handleSwitchChange = (checked: boolean) => {
            if (checked) {
                setPaymentMethod(4);
                setCustomerPayment(0);
            } else {
                setCustomerPayment(0);
                setPaymentMethod(null);
            }
            setIsThanhToanNhanHang(checked);
        };

        const handlePaymentMethodChange = (method: number) => {
            if (!searchBill) return fromThatBai("Vui lòng chọn hóa đơn trước khi thanh toán!");
            if (tongTien <= 0) return fromThatBai("Giá tiền hiện tại là 0đ !");


            setPaymentMethod(method);
            if (method === 2) {
                setDateTime(new Date());
                setCustomerPayment(tongTien);
            }
            if (isThanhToanNhanHang) setIsThanhToanNhanHang(false);
        };
console.log('tong tien '+customerPayment);

        return (
            <>
                <div className="w-[460px] min-w-[400px]  bg-white  p-4 rounded-lg">
                    <div className="ml-auto mr-5 w-fit text-lg">
                        <div className="mb-4 flex items-center gap-2">
                            <p className="font-bold text-base">Mã Giảm Giá</p>
                            <div className="flex items-center border rounded-md px-2 py-1 bg-gray-100">
                                <span className="text-gray-700  text-sm">{searchBill?.idVoucher == null ? 'No voucher' : setVoucherDangDung?.code}</span>
                                <button className="ml-2 text-sm text-gray-500 hover:text-gray-700">✖</button>
                            </div>
                            <Dialog open={isVoucher} onOpenChange={setIsVoucher}>
                                <DialogTrigger asChild>
                                    <Button variant="outline"
                                        className="bg-yellow-400 text-black font-semibold 
                                        px-4 py-2 rounded-md hover:bg-yellow-500">
                                        Chọn Mã Giảm Giá
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[980px]">
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Stt</TableCell>
                                                    <TableCell>Mã</TableCell>
                                                    <TableCell>Giá min</TableCell>
                                                    <TableCell>Giá max</TableCell>
                                                    <TableCell>Giá trị giảm</TableCell>
                                                    <TableCell>Kiểu</TableCell>
                                                    <TableCell>Số lượng </TableCell>
                                                    <TableCell>Số lượng </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {ListVoucherTheoAccount.map((ac, index) => (
                                                    <TableRow key={ac.id}>
                                                        <TableCell>{index + 1}</TableCell>
                                                        <TableCell>{ac.code}</TableCell>
                                                        <TableCell>{ac.conditionPriceMin.toLocaleString('vi-VN')}</TableCell>
                                                        <TableCell>{ac.conditionPriceMax.toLocaleString('vi-VN')}</TableCell>
                                                        <TableCell>{ac.discountValue.toLocaleString('vi-VN')}</TableCell>
                                                        <TableCell>{ac.voucherType == true ? " % " : " VNĐ "}</TableCell>
                                                        <TableCell>{ac.quantity}</TableCell>
                                                        <TableCell>
                                                            <Button color="primary" onClick={() => updateVoucherKhiChon(ac.id)}>
                                                                Chọn
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="space-y-1" >
                            <div className="bg-white p-6 rounded-lg shadow">
                                <div className="space-y-4">
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-gray-700 text-base">Tổng tiền hàng: </span>
                                        <p className="font-semibold">{searchBill?.totalPrice == null ? 0.00 : searchBill?.totalPrice.toLocaleString('vi-VN')} đ</p>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <p className="text-gray-700 text-base">Giảm giá:</p>
                                        <p className="font-semibold">{searchBill?.discountedTotal == null ? 0 : searchBill?.discountedTotal.toLocaleString('vi-VN')} đ</p>
                                    </div>
                                    {isBanGiaoHang == true && (
                                        <div className="flex justify-between border-b pb-2">
                                            <p className="text-gray-700 text-base">Phí ship:</p>
                                            <p className="font-semibold">{phiShip.toLocaleString('vi-VN')} đ</p>
                                        </div>
                                    )}
                                    <div className="flex justify-between border-b pb-2">
                                        <p className="text-gray-700 text-base">Khách cần trả:</p>
                                        <p className="font-semibold text-green-600">{searchBill?.totalDue == null ? 0 : (searchBill?.totalDue + phiShip).toLocaleString('vi-VN')} đ</p>
                                    </div>

                                    <div className="flex gap-x-2 justify-between border-b pb-2 pl-[45px] pr-[40px]">
                                        <Button
                                            variant="outline"
                                            className={`border border-emerald-500 text-emerald-600 rounded-lg hover:border-orange-700 hover:text-orange-700 px-3 text-2xs
                           ${paymentMethod === 1 ? 'border-yellow-700 text-yellow-700 bg-slate-300' : 'border-emerald-500 text-emerald-600'}`}
                                            onClick={() => handlePaymentMethodChange(1)} >
                                            Tiền mặt
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className={`border rounded-lg px-3 hover:border-orange-700 hover:text-orange-700 text-2xs 
                              ${paymentMethod === 2 ? 'border-red-600 text-red-600 bg-slate-300' : 'border-blue-500 text-blue-600'}`}
                                            onClick={() => handlePaymentMethodChange(2)}>
                                            Chuyển khoản
                                        </Button>
                                    </div>
                                    {paymentMethod == 1 && (
                                        <div>
                                            <div className="flex justify-between border-b pb-2">
                                                <p className="text-gray-700 text-base"> Khách thanh toán:</p>
                                                <p className="font-semibold text-green-600">
                                                    <Input
                                                        type="number"
                                                        className="customer-payment w-[150px]"
                                                        placeholder="Nhập số tiền"
                                                        value={customerPayment}
                                                        onChange={(e) => setCustomerPayment(Number(e.target.value))}
                                                        disabled={isThanhToanNhanHang} // Vô hiệu hóa ô input khi "Thanh toán khi nhận hàng" bật
                                                    />
                                                </p>
                                            </div>
                                            {/* Tổng tiền */}
                                            <div className="mt-4 flex justify-between border-b  pb-2 items-center font-bold text-lg text-red-600">
                                                <p className='text-base'>Tiền thừa trả khách:</p>
                                                <p>{tienThua.toLocaleString('vi-VN')} đ</p>

                                            </div>
                                        </div>
                                    )}
                                    {/* // Trong phần return, thêm đoạn này sau phần hiển thị nút chuyển khoản */}
                                    {paymentMethod === 2 && (
                                        <TaoMaQr
                                            searchBill={searchBill}
                                            tongTien={tongTien}
                                            dateTime={dateTime}
                                            handleThanhToan={handleThanhToan}
                                        />
                                    )}


                                    {isBanGiaoHang === true && (
                                        <div className="flex items-center  space-x-2 ">
                                            {/* <Switch id="thanhToanNhanHang" /> */}
                                            <Switch
                                                id="thanhToanNhanHang"
                                                checked={isThanhToanNhanHang}
                                                onCheckedChange={handleSwitchChange} />
                                            <Label htmlFor="thanhToanNhanHang">Thanh toán khi nhận hàng </Label>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* {isBanGiaoHang === false ? (
                                <Button
                                    className="w-[270px] h-[50px] bg-blue-500 text-white hover:bg-blue-600 ml-[60px]"
                                    onClick={() => handleThanhToan("HOAN_THANH", 0) // Khi Switch tắt
                                    }
                                >
                                    Xác nhận thanh toán
                                </Button>
                            ) : (
                                <Button
                                    className="w-[270px] h-[50px] bg-red-500 text-white hover:bg-blue-600 ml-[60px]"
                                    onClick={() => handleThanhToan("CHO_XAC_NHAN", 1) // Khi Switch tắt
                                    }
                                >
                                    Xác nhận thanh toán
                                </Button>
                            )} */}

                            {paymentMethod != 2 && (
                                <Button
                                    className="w-[270px] h-[50px] bg-blue-500 text-white hover:bg-blue-600 ml-[60px]"
                                    onClick={() => {
                                        if (isBanGiaoHang === false) {
                                            handleThanhToan("HOAN_THANH", 0) // Khi Switch tắt
                                        } else {
                                            handleThanhToan("CHO_XAC_NHAN", 1) // Khi Switch tắt
                                        }
                                    }
                                    }

                                >
                                    Xác nhận thanh toán
                                </Button>
                            )}


                            <div style={{ position: 'fixed', left: '-9999px' }}>
                                {printData && (
                                    <div ref={printRef} className="invoice-container">
                                        <InHoaDon billData={printData} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    };

export default ThanhToan;