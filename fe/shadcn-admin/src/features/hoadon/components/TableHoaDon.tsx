import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DataTablePagination } from './PhanTrang/data-table-pagination';
import { Bill } from '../service/HoaDonSchema';


const statusStyles: Record<string, string> = {
    "CHO_THANH_TOAN": "bg-slate-500 text-white",
    "DA_HUY": "bg-sky-500 text-white",
    "CHO_XAC_NHAN": "bg-blue-500 text-white",
    "DA_THANH_TOAN": "bg-red-500 text-white",
    "HOAN_THANH": "bg-teal-500 text-white",
    "DANG_CHUAN_BI_HANG": "bg-pink-500 text-white",
    "DANG_GIAO_HANG": "bg-violet-500 text-white",
    "DA_GIAO_HANG": "bg-green-500 text-white",
};
interface Props {
    listHoaDon?: Bill[];
}

const TableHoaDon: React.FC<Props> = ({ listHoaDon = [] }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const safeList = listHoaDon || [];
    const totalItems = safeList.length;
    const totalPages = Math.ceil(totalItems / pageSize) || 1;

    React.useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentProducts = safeList.slice(startIndex, endIndex);

        const getPaymentMethod = (method: number | null) => {
            switch (method) {
                case 1: return "Tiền mặt";
                case 2: return "Chuyển khoản";
                case 3: return "Ví VNPAY";
                case 4: return `COD`;
                default: return "";
            }
        };
        const getOrderStatusText = (status: string | null) => {
            switch (status) {
                case "CHO_THANH_TOAN": return "Chờ thanh toán";
                case "DA_HUY": return "Đã hủy";
                case "CHO_XAC_NHAN": return "Chờ xác nhận";
                case "DA_THANH_TOAN": return "Đã thanh toán";
                case "HOAN_THANH": return "Hoàn thành";
                case "DANG_CHUAN_BI_HANG": return "Đang chuẩn bị hàng";
                case "DANG_GIAO_HANG": return "Đang giao hàng";
                case "DA_GIAO_HANG": return "Đã giao hàng";
                default: return "Không rõ trạng thái";
            }
        };

    return (
        <>
            {safeList.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                    Không tìm thấy hóa đơn nào
                </div>
            ) : (


                <TableContainer component={Paper}>
                    <Table className="min-w-[650px]" aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="right">STT</TableCell>
                                <TableCell align="center">Mã đơn hàng</TableCell>
                                <TableCell align="right" className='w-[200px]'>Khách hàng</TableCell>
                                <TableCell align="right" >Loại hóa đơn </TableCell>
                                <TableCell align="center">Trạng thái</TableCell>
                                <TableCell align="center">Tổng tiền</TableCell>
                                <TableCell align="center" >Thanh toán</TableCell>
                                <TableCell align="center">Ngày tạo</TableCell>
                                <TableCell align="center" >Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentProducts.map((hd, index) => (
                                <TableRow className="whitespace-nowrap"
                                    key={hd.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell align="right">{(currentPage - 1) * pageSize + index + 1}</TableCell>
                                    <TableCell component="th" scope="row" align="left" ><p className="font-bold tracking-tight">{hd.nameBill}</p> </TableCell>
                                    <TableCell align="center" >{hd.idAccount == null ? "" : hd.tenKhachHang}<br />{hd.soDienThoai}</TableCell>
                                    <TableCell align="center" className="w-full whitespace-nowrap">
                                        <span className={cn(
                                            "px-4 py-2 text-white font-medium rounded-full text-xs",
                                            hd.billType === 0 ? "bg-emerald-500" : "bg-orange-500"
                                        )}>{hd.billType == 0 ? "Tại quầy" : "Giao hàng"}</span>
                                    </TableCell>
                                    <TableCell align="center"
                                    ><span className={cn(
                                        "px-3 py-2 font-medium rounded-full text-xs",
                                        statusStyles[hd.status] || "bg-gray-500 text-white"
                                    )}>{getOrderStatusText(hd?.status)}</span></TableCell>
                                    <TableCell align="right">{hd.totalDue == null ? 0 : hd.totalDue.toLocaleString('vi-VN')} VND</TableCell>
                                    <TableCell align="right" >{hd.namePayment == null ? "" : getPaymentMethod(hd.namePayment)}</TableCell>
                                    <TableCell align="right"> {hd.paymentDate
                                        ? new Date(hd.paymentDate).toLocaleDateString("vi-VN", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: false
                                        })
                                        : ""}</TableCell>
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
                    <hr />
                    {listHoaDon.length > 0 && (
                        <div className="flex justify-between items-center mt-4 ml-[400px] mb-[20px]">
                            <DataTablePagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                pageSize={pageSize}
                                setPageSize={setPageSize}
                                setCurrentPage={setCurrentPage}
                            />
                        </div>
                    )}
                </TableContainer>






                // <TableContainer component={Paper}>

                //     {safeList.length > 0 && (
                //         <div className="flex justify-between items-center mt-4 ml-[400px] mb-[20px]">
                //             <DataTablePagination
                //                 currentPage={currentPage}
                //                 totalPages={totalPages}
                //                 pageSize={pageSize}
                //                 setPageSize={setPageSize}
                //                 setCurrentPage={setCurrentPage}
                //             />
                //         </div>
                //     )}
                // </TableContainer>
            )}
        </>
    );
};

export default TableHoaDon;