import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@/components/ui/button';
import { getAllBill } from './service/HoaDonService';
import { cn } from '@/lib/utils';

interface Bill {
    id: number;
    nameBill: string;
    idAccount?: number | null;
    tenKhachHang?: string | null;
    soDienThoai?: string | null;
    idNhanVien?: number | null;
    idVoucher?: number | null;
    totalPrice: number | null;
    customerPayment: number | null;
    amountChange: number | null;
    deliveryFee: number | null;
    totalDue: number;
    customerRefund: number | null;
    discountedTotal: number | null;
    deliveryDate?: string | null;
    customerPreferred_date?: string | null;
    customerAppointment_date?: string | null;
    receiptDate?: string | null;
    paymentDate?: string | null;
    address?: string | null;
    email?: string | null;
    note?: string | null;
    phone?: string | null;
    name: string;
    paymentId?: number | null;
    namePayment?: number | null;
    deliveryId?: number | null;
    itemCount: number;
    billType: number | null;
    status: string;
}
const statusStyles: Record<string, string> = {
    "CHO_THANH_TOAN": "bg-slate-500 text-white",
    "DA_HUY": "bg-sky-500 text-white",
    "CHO_XAC_NHAN": "bg-blue-500 text-white",
    "DA_THANH_TOAN": "bg-red-500 text-white",
};

const TableHoaDon: React.FC = () => {
    const [listHoaDon, setListHoaDon] = useState<Bill[]>([]);
    useEffect(() => {
        loadHoaDon();
    }, []);
    // Chuyển trang hóa đơn chi tiết
    // const goToPage = () => {
    //     window.location.assign("/hoadon/hoadonchitiet");
    //   };

    const loadHoaDon = async () => {
        try {
            const data = await getAllBill();
            setListHoaDon(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }


    const getPaymentMethod = (method: number | null) => {
        switch (method) {
            case 1: return "Tiền mặt";
            case 2: return "Chuyển khoản";
            case 3: return "Ví VNPAY";
            default: return "";
        }
    };
    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">STT</TableCell>
                            <TableCell align="center">Mã đơn hàng</TableCell>
                            <TableCell align="right" className='w-[160px]'>Khách hàng</TableCell>
                            <TableCell align="right" className='w-[110px]'>Loại hóa đơn </TableCell>
                            <TableCell align="center">Trạng thái</TableCell>
                            <TableCell align="center">Tổng tiền</TableCell>
                            <TableCell align="center">Thanh toán</TableCell>
                            <TableCell align="center">Ngày tạo</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {listHoaDon.map((hd, index) => (
                            <TableRow
                                key={hd.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell align="right">{index + 1}</TableCell>
                                <TableCell component="th" scope="row" align="left" ><p className="font-bold tracking-tight">{hd.nameBill}</p> </TableCell>
                                <TableCell align="right" >{hd.idAccount == null ? "" : hd.tenKhachHang + ' ' + hd.soDienThoai}</TableCell>
                                <TableCell align="center">
                                    <span className={cn(
                                        "px-4 py-2 text-white font-medium rounded-full text-xs",
                                        hd.billType === 0 ? "bg-emerald-500" : "bg-orange-500"
                                    )}>{hd.billType == 0 ? "Tại quầy" : "Giao hàng"}</span>
                                </TableCell>
                                <TableCell align="center"
                                ><span className={cn(
                                    "px-3 py-2 font-medium rounded-full text-xs",
                                    statusStyles[hd.status] || "bg-gray-500 text-white"
                                )}>{hd.status}</span></TableCell>
                                <TableCell align="right">{hd.totalDue == null ? 0 : hd.totalDue.toLocaleString('vi-VN')} VND</TableCell>
                                <TableCell align="right">{hd.namePayment == null ? "" : getPaymentMethod(hd.namePayment)}</TableCell>
                                <TableCell align="right">{hd.paymentDate}</TableCell>
                                <TableCell align="center" style={{}}>
                                    <Button className="bg-blue-600 text-white hover:bg-green-600">
                                        <a href={`/hoadon/hoadonchitiet?id=${hd.id}`} >
                                        Chi tiết
                                        </a>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </>
    );
};

export default TableHoaDon;