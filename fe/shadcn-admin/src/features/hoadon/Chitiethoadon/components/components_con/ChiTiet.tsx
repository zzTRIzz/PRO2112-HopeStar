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
import { CreditCard, CheckCircle, Truck, Clock, RefreshCw, XCircle, WalletCards, PackageSearch, PackageOpen, BadgeCheck, ClipboardCheck, Hourglass, XOctagon } from "lucide-react";
import { cn } from '@/lib/utils';

interface ChiTietPros {
    searchBill: BillRespones | null;
}

const ChiTiet: React.FC<ChiTietPros> =
    ({
        searchBill
    }) => {
        const statusMap: Record<string, {
            title: string;
            icon: React.ReactNode;
            color_bg: string;
            color_text: string;
            color_boder: string;
        }> = {
            CHO_XAC_NHAN: {
                title: "Chờ xác nhận",
                icon: <Hourglass className="w-4 h-4" />,
                color_bg: "bg-blue-100",
                color_text: "text-blue-600",
                color_boder: "border-blue-400",
            },
            DA_XAC_NHAN: {
                title: "Đã xác nhận",
                icon: <ClipboardCheck className="w-4 h-4" />,
                color_bg: "bg-blue-100",
                color_text: "text-blue-600",
                color_boder: "border-blue-400",
            },
            DANG_CHUAN_BI_HANG: {
                title: "Đang chuẩn bị hàng",
                icon: <PackageOpen className="w-4 h-4" />,
                color_bg: "bg-blue-100",
                color_text: "text-blue-600",
                color_boder: "border-blue-400",
            },
            DANG_GIAO_HANG: {
                title: "Đang giao hàng",
                icon: <PackageSearch className="w-4 h-4" />,
                color_bg: "bg-blue-100",
                color_text: "text-blue-600",
                color_boder: "border-blue-400",
            },
            HOAN_THANH: {
                title: "Hoàn thành",
                icon: <BadgeCheck className="w-4 h-4" />,
                color_bg: "bg-green-100",
                color_text: "text-green-600",
                color_boder: "border-green-400",
            },
            DA_HUY: {
                title: "Đã hủy",
                icon: <XOctagon className="w-4 h-4" />,
                color_bg: "bg-red-100",
                color_text: "text-red-600",
                color_boder: "border-red-400",
            },
            CHO_THANH_TOAN: {
                title: "Chờ thanh toán",
                icon: <WalletCards className="w-4 h-4" />,
                color_bg: "bg-blue-100",
                color_text: "text-blue-600",
                color_boder: "border-blue-400",
            },
            CAP_NHAT_DON_HANG: {
                title: "Cập nhật đơn hàng",
                icon: <RefreshCw className="w-4 h-4" />,
                color_bg: "bg-yellow-100",
                color_text: "text-yellow-600",
                color_boder: "border-yellow-400",
            },
        };
        const getOrderStatusText = (status: string) => {
            const data = statusMap[status];
            if (!data) {
                return (
                    <div className="flex items-center gap-2">
                        <XCircle className="w-8 h-7 text-gray-500" />
                        <span>Không rõ trạng thái</span>
                    </div>
                );
            }

            return (
                <div className="flex items-center gap-2">
                    <div className="relative z-10">
                        <div className={cn(
                            "w-[50px] h-[35px] rounded-full flex items-center justify-center",
                            "border-2 transition-all duration-300",
                            data.color_boder
                        )}>
                            <div className={cn(
                                "w-[45px] h-[30px] rounded-full flex items-center justify-center",
                                "transition-colors duration-300",
                                data.color_text,
                                data.color_bg
                            )}>
                                {data.icon}
                            </div>
                        </div>
                    </div>
                    <span>{data.title}</span>
                </div>
            );
        };

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
                                        <TableCell align='left'>Ghi chú</TableCell>
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
                                            <TableCell ><p className='text-blue-600 font-bold'>{bh?.fullName}</p></TableCell>
                                            <TableCell align="left">{bh?.note}</TableCell>
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