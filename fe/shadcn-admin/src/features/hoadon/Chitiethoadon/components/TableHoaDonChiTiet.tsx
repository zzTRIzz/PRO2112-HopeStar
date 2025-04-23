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
import { BillRespones } from '@/features/banhang/service/Schema';
import { DataTablePagination } from '../../components/PhanTrang/data-table-pagination';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';


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
    searchBill: BillRespones | null;
    selectedImei: number[];
    openDialogId: number | null; // Nhận từ file tổng
    setOpenDialogId: (open: number | null) => void;
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
        openDialogId,
        setOpenDialogId,
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
        const [searchImeiKey, setSearchImeiKey] = useState('');


        const filteredImeiList = listImei.filter((imei) =>
            imei.imeiCode.toLowerCase().includes(searchImeiKey.toLowerCase())
        );



        return (
            <>
                {product.length === 0 ? (
                    <CartEmpty />
                ) : (
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    {/* <TableCell align="right">Stt</TableCell> */}
                                    <TableCell align="center">Sản phẩm</TableCell>
                                    <TableCell align="right">Đơn giá</TableCell>
                                    <TableCell align="right">Số lượng</TableCell>
                                    <TableCell align="right">Thành tiền</TableCell>
                                    <TableCell align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentProducts.map((pr) => (
                                    <TableRow
                                        key={pr.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        {/* <TableCell align="right">{index + 1}</TableCell> */}
                                        <TableCell component="th" scope="row" align="center">
                                            {pr?.nameProduct} {pr?.ram + '/'}{pr?.rom + 'GB'}({pr?.mauSac})
                                        </TableCell>
                                        <TableCell align="right" >{pr?.price?.toLocaleString('vi-VN')} VND

                                        </TableCell>
                                        <TableCell align="center" className='w-[95px]'>{pr?.quantity}
                                            {searchBill?.billDetailResponesList?.some(
                                                (item) =>
                                                    item.productDetail.id === pr.idProductDetail &&
                                                    (!item.imeiSoldRespones || item.imeiSoldRespones.length === 0) && item?.quantity > 0
                                            ) && (
                                                    <div className="text-red-500 text-xs font-medium mt-1">Thiếu imei</div>
                                                )}
                                        </TableCell>
                                        <TableCell align="right">{pr?.totalPrice?.toLocaleString('vi-VN')} VND
                                        </TableCell>
                                        <TableCell align="center" style={{}}>
                                            <div className="right space-x-2">
                                                <Dialog open={openDialogId === pr.id} onOpenChange={(open) => setOpenDialogId(open ? pr.id : null)}>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            className="bg-white-500 border border-blue-500 rounded-sm border-opacity-50 text-blue-600 hover:bg-gray-300"
                                                            onClick={() => {
                                                                handleUpdateProduct(pr.idProductDetail, pr.id);
                                                                setOpenDialogId(pr.id);
                                                            }}
                                                            disabled={!(
                                                                searchBill?.status === "CHO_XAC_NHAN" &&
                                                                Number(searchBill?.billType) === 1
                                                            )}

                                                        >
                                                            Cập nhật
                                                        </Button>

                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-[730px] z-[1000]  flex flex-col">
                                                        <Input
                                                            placeholder="Tìm mã imei"
                                                            className="max-w-sm"
                                                            value={searchImeiKey}
                                                            onChange={(e) => setSearchImeiKey(e.target.value)}
                                                        />
                                                        <TableContainer className="h-full max-h-[470px] overflow-auto">
                                                            <ScrollArea>
                                                                <Table>
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell></TableCell>
                                                                            <TableCell>Stt</TableCell>
                                                                            <TableCell>Mã imei</TableCell>
                                                                            <TableCell align='center' className='w-[320px]'>Mã vạch</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {filteredImeiList.map((im, index) => (
                                                                            <TableRow key={im.id}>
                                                                                <TableCell>
                                                                                    <div className='flex items-center space-x-2'>
                                                                                        <Checkbox
                                                                                            checked={selectedImei.includes(im.id)}
                                                                                            onCheckedChange={() =>
                                                                                                handleCheckboxChange(im.id)
                                                                                            }
                                                                                        />
                                                                                    </div>
                                                                                </TableCell>
                                                                                <TableCell>{index + 1}</TableCell>
                                                                                <TableCell>{im.imeiCode}</TableCell>
                                                                                <TableCell>
                                                                                    <img
                                                                                        src={im.barCode}
                                                                                        className='h-8 w-64 rounded-lg object-cover'
                                                                                    />
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </ScrollArea>
                                                        </TableContainer>
                                                        <Button
                                                            className='bg-blue-600 pt-2 text-white hover:bg-gray-300 hover:text-blue-600 ml-[580px] mt-[18px]'
                                                            onClick={() => {
                                                                updateHandleImeiSold(pr.id);
                                                                setOpenDialogId(null);
                                                            }}
                                                        >
                                                            Chọn
                                                        </Button>

                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
                {product.length > 0 && (
                    <div className="flex justify-between items-center mt-4 ml-[100px]">
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