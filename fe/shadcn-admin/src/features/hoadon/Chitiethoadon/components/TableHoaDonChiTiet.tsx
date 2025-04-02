import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import Paper from '@mui/material/Paper';
import { DataTablePagination } from '../../service/PhanTrang/data-table-pagination';
import { BillSchema } from '@/features/banhang/service/Schema';


interface SearchBillDetail {
    id: number
    price: number,
    quantity: number,
    totalPrice: number,
    idProductDetail: number,
    nameProduct: string,
    ram: number,
    rom: number,
    mauSac: string,
    imageUrl: string,
    idBill: number
}

interface imei {
    id: number,
    imeiCode: string,
    barCode: string,
    status: string
}
interface TableHoaDonChiTietProps {
    product: SearchBillDetail[],
    listImei: imei[];
    searchBill: BillSchema | null;
    selectedImei: number[];
    isCapNhatImei: boolean; // Nhận từ file tổng
    setIsCapNhatImei: (open: boolean) => void;
    handleUpdateProduct: (idProductDetail: number, idBillDetail: number) => void
    handleCheckboxChange: (id: number) => void;
    updateHandleImeiSold: (id: number) => void;
    deleteBillDetail: (id: number) => void;
}

const TableHoaDonChiTiet: React.FC<TableHoaDonChiTietProps> =
    ({
        product,
        listImei,
        selectedImei,
        isCapNhatImei,
        setIsCapNhatImei,
        handleUpdateProduct,
        handleCheckboxChange,
        updateHandleImeiSold,
        searchBill
    }) => {
        const CartEmpty = () => {
            return (
                <>
                    <div className="flex flex-col items-center justify-center mt-4" style={{ height: "260px" }}>
                        <img
                            src="https://media.istockphoto.com/vectors/shopping-cart-line-icon-fast-buy-vector-logo-vector-id1184670036?k=20&m=1184670036&s=170667a&w=0&h=HHWDur4nWsS7zTgNKJLPi4JiEW42MlWs2rC_SCgfcf4="
                            style={{ width: "300px", height: "250px" }}
                        />
                        <p className="text-dark font-semibold text-center text-lg">
                            Chưa có sản phẩm nào trong giỏ hàng!
                        </p>
                    </div>

                </>
            );
        };
        const [currentPage, setCurrentPage] = useState(1);
        const [pageSize, setPageSize] = useState(5);
        const totalPages = Math.ceil(product.length / pageSize);
        const currentProducts = product.slice((currentPage - 1) * pageSize, currentPage * pageSize);


        return (
            <>

              
                {product.length === 0 ? (
                    <CartEmpty />
                ) : (
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="right">Stt</TableCell>
                                    <TableCell align="center">Sản phẩm</TableCell>
                                    <TableCell align="right">Đơn giá</TableCell>
                                    <TableCell align="right">Số lượng</TableCell>
                                    <TableCell align="right">Thành tiền</TableCell>
                                    <TableCell align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentProducts.map((pr, index) => (
                                    <TableRow
                                        key={pr.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell align="right">{index + 1}</TableCell>
                                        <TableCell component="th" scope="row" align="center">
                                            {pr.nameProduct} {pr.ram + '/'}{pr.rom + 'GB'}({pr.mauSac})
                                        </TableCell>
                                        <TableCell align="right">{pr.price.toLocaleString('vi-VN')} VND</TableCell>
                                        <TableCell align="right">{pr.quantity}</TableCell>
                                        <TableCell align="right">{pr.totalPrice.toLocaleString('vi-VN')} VND</TableCell>
                                        <TableCell align="center" style={{}}>
                                            <div className="right space-x-2">

                                                {searchBill?.status !== "DA_THANH_TOAN" && searchBill?.status !== "HOAN_THANH" && (
                                                    <Dialog open={isCapNhatImei} onOpenChange={setIsCapNhatImei}>
                                                        <DialogTrigger asChild>

                                                            <Button className="bg-white-500 border border-blue-500 rounded-sm border-opacity-50
                                   text-blue-600 hover:bg-gray-300" onClick={() => handleUpdateProduct(pr.idProductDetail, pr.id)}>
                                                                Cập nhật
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="sm:max-w-[500px]">
                                                            <TableContainer>
                                                                <Table>
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell></TableCell>
                                                                            <TableCell>Stt</TableCell>
                                                                            <TableCell>Imei code</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {listImei.map((im, index) => (
                                                                            <TableRow key={im.id}>
                                                                                <TableCell>
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <Checkbox
                                                                                            checked={selectedImei.includes(im.id)}
                                                                                            onCheckedChange={() => handleCheckboxChange(im.id)}
                                                                                        />
                                                                                    </div>
                                                                                </TableCell>
                                                                                <TableCell>{index + 1}</TableCell>
                                                                                <TableCell>{im.imeiCode}</TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </TableContainer>
                                                            <Button className="bg-black text-white hover:bg-gray-600" onClick={() => updateHandleImeiSold(pr.id)}>
                                                                Chọn
                                                            </Button>
                                                        </DialogContent>
                                                    </Dialog>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
                {product.length > 0 && (
                    <div className="flex justify-between items-center mt-4 ml-[400px]">
                        <DataTablePagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            pageSize={pageSize}
                            setPageSize={setPageSize}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>
                )}



            </>
        );
    };

export default TableHoaDonChiTiet;