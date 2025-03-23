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
import { Input } from '@/components/ui/input';


interface ProductDetail {
    id: number,
    code: string,
    priceSell: number,
    inventoryQuantity: number,
    idProduct: number,
    name: string,
    ram: number,
    rom: number,
    color: string,
    imageUrl: string,
}

interface imei {
    id: number,
    imeiCode: string,
    barCode: string,
    status: string
}

interface SanPhamChiTiet {
    listProduct: ProductDetail[];
    listImei: imei[];
    handleAddProduct: (product: ProductDetail) => void;
    handleAddImei: (id: number) => void;
    handleCheckboxChange: (id: number) => void;
    idBillDetail: number;
    selectedImei: number[];
    dialogContent: "product" | "imei"; // Trạng thái hiện tại
    setDialogContent: (content: "product" | "imei") => void; // Hàm thay đổi trạng thái
    isDialogOpen: boolean; // Nhận từ file tổng
    setIsDialogOpen: (open: boolean) => void; // Nhận từ file tổng
}
const ThemSanPham: React.FC<SanPhamChiTiet> =
    ({
        listProduct,
        listImei,
        idBillDetail,
        selectedImei,
        handleAddImei,
        handleAddProduct,
        handleCheckboxChange,
        dialogContent,
        setDialogContent,
        isDialogOpen,
        setIsDialogOpen
    }) => {
        // const [isDialogOpen, setIsDialogOpen] = useState(false);
        // const [dialogContent, setDialogContent] = useState<'product' | 'imei'>('product');

        return (
            <>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="bg-blue-600 text-white hover:bg-gray-300 hover:text-blue-600"
                            onClick={() => setDialogContent('product')}>
                            Thêm sản phẩm
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[980px]">
                        <Input
                            placeholder="Tìm mã sản phẩm, tên sản phẩm  "
                            className="max-w-sm"
                        />
                        {dialogContent === 'product' ? (
                            <TableContainer>
                                {/* <h2>Sản phẩm </h2>   */}
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Stt</TableCell>
                                            <TableCell>Mã code</TableCell>
                                            <TableCell>Tên sản phẩm</TableCell>
                                            <TableCell>Giá tiền </TableCell>
                                            <TableCell>Số lượng tồn kho</TableCell>
                                            <TableCell>Thao Tác</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {listProduct.map((product, index) => (
                                            <TableRow key={product.id}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{product.code}</TableCell>
                                                <TableCell>{product.name + " " + product.ram + "/" + product.rom + "GB (" + product.color + ")"}</TableCell>
                                                <TableCell>{product.priceSell.toLocaleString('vi-VN')}</TableCell>
                                                <TableCell align="center">{product.inventoryQuantity}</TableCell>
                                                <TableCell>
                                                    <Button className='bg-blue-600 text-white hover:bg-gray-300 hover:text-blue-600'
                                                        color="primary"
                                                        onClick={() => handleAddProduct(product)}>
                                                        Chọn
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                        ) : (
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
                                <Button className="bg-blue-600 text-white hover:bg-gray-300 hover:text-blue-600"
                                    onClick={() => handleAddImei(idBillDetail)}>
                                    Chọn
                                </Button>
                            </TableContainer>
                        )}
                    </DialogContent>
                </Dialog>
            </>
        );
    };

export default ThemSanPham;