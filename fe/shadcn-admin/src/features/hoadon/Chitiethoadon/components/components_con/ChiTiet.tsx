import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { BillRespones } from '@/features/banhang/service/Schema';

interface ChiTietPros {
    searchBill: BillRespones | null;
}

const ChiTiet: React.FC<ChiTietPros> =
    ({
        searchBill
    }) => {
        const getOrderStatusText = (status: string) => {
            switch (status) {
                case "CHO_THANH_TOAN": return "Chờ thanh toán";
                case "DA_HUY": return "Đã hủy";
                case "CHO_XAC_NHAN": return "Chờ xác nhận";
                case "DA_XAC_NHAN": return "Đã xác nhận";
                case "DA_THANH_TOAN": return "Đã thanh toán";
                case "HOAN_THANH": return "Hoàn thành";
                case "DANG_CHUAN_BI_HANG": return "Đang chuẩn bị hàng";
                case "DANG_GIAO_HANG": return "Đang giao hàng";
                case "CAP_NHAT_DON_HANG": return "Cập nhật đơn hàng";
                default: return "Không rõ trạng thái";
            }
        }
        return (
            <div>
                <Dialog >
                    <DialogTrigger asChild>
                        <Button
                            className='bg-yellow-500 hover:bg-yellow-600 '>
                            Chi tiết
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[980px] ">
                        <TableContainer className='h-full max-h-[470px] z-[1000] overflow-auto'>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell>Thời gian </TableCell>
                                        <TableCell>Người xác nhận </TableCell>
                                        <TableCell align='center'>Ghi chú</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {searchBill?.billHistoryRespones?.map((bh) => (
                                        <TableRow key={bh?.id}>
                                            <TableCell align="center">{getOrderStatusText(bh?.actionType)}</TableCell>
                                            <TableCell>{bh?.actionTime
                                                ? new Date(bh?.actionTime).toLocaleDateString("vi-VN", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    second: "2-digit",
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour12: false
                                                })
                                                : ""}</TableCell>
                                            <TableCell>{bh?.fullName}</TableCell>
                                            <TableCell align="center">{bh?.note}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </DialogContent>
                </Dialog>
            </div>
        );
    };

export default ChiTiet;