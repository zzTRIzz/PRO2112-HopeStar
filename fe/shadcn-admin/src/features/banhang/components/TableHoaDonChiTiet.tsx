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
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Paper from '@mui/material/Paper';
import { DataTablePagination } from './PhanTrang/data-table-pagination';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { IconQuestionMark } from '@tabler/icons-react';
import { Imei, SearchBillDetail } from '../service/Schema';


interface TableHoaDonChiTietProps {
    product: SearchBillDetail[],
    listImei: Imei[];
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
        deleteBillDetail
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
            imei.imeiCode.toLowerCase().includes(searchImeiKey.toLowerCase().trim())
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
                                    <TableCell align="right">STT</TableCell>
                                    <TableCell align="center">Hình ảnh</TableCell>
                                    <TableCell align="center">Sản phẩm</TableCell>
                                    <TableCell align="right">Đơn giá</TableCell>
                                    <TableCell align="right">Số lượng</TableCell>
                                    <TableCell align="right">Tổng tiền</TableCell>
                                    <TableCell align="center">Thao tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentProducts.map((pr, index) => (
                                    <TableRow
                                        key={pr.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell align="right">{(currentPage - 1) * pageSize + index + 1}</TableCell>
                                        <TableCell align="right"><div className='h-20 w-16'>
                                            {pr.imageUrl ? (
                                                <img
                                                    src={pr.imageUrl}
                                                    alt={`${pr.nameProduct}`}
                                                    className='h-full w-full rounded-sm object-cover'
                                                />
                                            ) : (
                                                <div className='flex h-full w-full items-center justify-center rounded-lg bg-muted'>
                                                    <IconQuestionMark className='h-6 w-6' />
                                                </div>
                                            )}
                                        </div></TableCell>
                                        <TableCell component="th" scope="row" align="center">
                                            {pr.nameProduct} {pr.ram + '/'}{pr.rom}{pr.descriptionRom} ({pr.mauSac})
                                        </TableCell>
                                        <TableCell align="right">{pr.price.toLocaleString('vi-VN')} VND</TableCell>
                                        {/* --------------- */}
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <TableCell
                                                    align="right"
                                                    className="text-blue-600 cursor-pointer underline hover:text-blue-500 hover:underline"
                                                >
                                                    {pr.quantity}
                                                </TableCell>

                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl">
                                                <DialogHeader>
                                                    <DialogTitle>Danh sách IMEI của sản phẩm:  {pr.nameProduct} {pr.ram + '/'}{pr.rom} {pr.descriptionRom} ({pr.mauSac})</DialogTitle>
                                                </DialogHeader>
                                                <TableContainer className="overflow-auto max-h-[520px] mt-4">
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>Stt</TableCell>
                                                                <TableCell>Mã imei</TableCell>
                                                                <TableCell align='center' className='w-[320px]'>Mã vạch</TableCell>
                                                                {/* <TableCell>Trạng thái</TableCell> */}
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {pr.imeiList.map((im, index) => (
                                                                <TableRow key={im.id}>
                                                                    <TableCell>{index + 1}</TableCell>
                                                                    <TableCell>{im.imeiCode}</TableCell>
                                                                    <TableCell>
                                                                        <img
                                                                            src={im.barCode}
                                                                            className='h-8 w-64 rounded-lg object-cover'
                                                                        />
                                                                    </TableCell>
                                                                    {/* <TableCell>{im.status}</TableCell> */}
                                                                </TableRow>
                                                            ))}
                                                            {pr.imeiList.length === 0 && (
                                                                <TableRow>
                                                                    <TableCell colSpan={4} align="center">
                                                                        Không có IMEI nào
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </DialogContent>
                                        </Dialog>
                                        {/* --------------- */}
                                        <TableCell align="right">{pr.totalPrice.toLocaleString('vi-VN')} VND</TableCell>
                                        <TableCell align="center" style={{}}>
                                            <div className="right space-x-2">
                                                <Dialog open={openDialogId === pr.id} onOpenChange={(open) => setOpenDialogId(open ? pr.id : null)}>
                                                    <DialogTrigger asChild>
                                                        <Button className="bg-white-500 border border-blue-500 rounded-sm border-opacity-50
                                   text-blue-600 hover:bg-gray-300"
                                                            onClick={() => {
                                                                handleUpdateProduct(pr.idProductDetail, pr.id);
                                                                setOpenDialogId(pr.id);
                                                            }}>
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
                                                        <TableContainer className="h-full max-h-[450px] overflow-auto">
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

                                                <Button className="bg-blue-600 text-white hover:bg-gray-300 hover:text-blue-600" onClick={() => deleteBillDetail(pr.id)}>
                                                    Xóa
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}

                            </TableBody>
                        </Table>
                    </TableContainer >
                )}
                {
                    product.length > 0 && (
                        <div className="flex justify-between items-center mt-4 ml-[400px]">
                            <DataTablePagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                pageSize={pageSize}
                                setPageSize={setPageSize}
                                setCurrentPage={setCurrentPage}
                            />
                        </div>
                    )
                }



            </>
        );
    };

export default TableHoaDonChiTiet;