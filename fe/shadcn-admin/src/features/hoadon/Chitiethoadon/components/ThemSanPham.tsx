import React, {  } from 'react';
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
import { BillRespones, Imei, ProductDetail } from '@/features/banhang/service/Schema';
import { IconQuestionMark } from '@tabler/icons-react';




interface SanPhamChiTiet {
    listProduct: ProductDetail[];
    listImei: Imei[];
    handleAddProduct: (product: ProductDetail) => void;
    handleAddImei: () => void;
    handleCheckboxChange: (id: number) => void;
    idBillDetail: number;
    selectedImei: number[];
    dialogContent: "product" | "imei";
    setDialogContent: (content: "product" | "imei") => void;
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
    searchBill: BillRespones | null;

}
const ThemSanPham: React.FC<SanPhamChiTiet> =
    ({
        listProduct,
        listImei,
        selectedImei,
        handleAddImei,
        handleAddProduct,
        handleCheckboxChange,
        dialogContent,
        setDialogContent,
        isDialogOpen,
        setIsDialogOpen,
        searchBill
    }) => {
        return (
            <>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline"
                            className="bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
                            onClick={() => setDialogContent('product')}
                            disabled={["DANG_GIAO_HANG", "HOAN_THANH", "CHO_THANH_TOAN", "DA_HUY"].includes(searchBill?.status ?? "")}>
                            Thêm sản phẩm
                        </Button>
                    </DialogTrigger>
                    <DialogContent className={dialogContent === 'product' ? 'sm:max-w-[980px]' : 'sm:max-w-[730px]'}>
                        <Input
                            placeholder="Tìm mã sản phẩm, tên sản phẩm  "
                            className="max-w-sm"
                        />
                        {dialogContent === 'product' ? (
                            <TableContainer className='h-[550px]'>
                                {/* <h2>Sản phẩm </h2>   */}
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Stt</TableCell>
                                            {/* <TableCell>Mã code</TableCell> */}
                                            <TableCell>Sản phẩm</TableCell>
                                            <TableCell>Giá tiền </TableCell>
                                            <TableCell>Số lượng tồn kho</TableCell>
                                            <TableCell>Thao Tác</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {listProduct?.map((product, index) => (
                                            <TableRow key={product?.id}>
                                                <TableCell>{index + 1}</TableCell>
                                                {/* <TableCell>{product?.code}</TableCell> */}
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="h-20 w-16 flex-shrink-0">
                                                            {product.imageUrl ? (
                                                                <img
                                                                    src={product.imageUrl}
                                                                    alt={`${product.name}`}
                                                                    className="h-full w-full rounded-sm object-cover"
                                                                />
                                                            ) : (
                                                                <div className="flex h-full w-full items-center justify-center rounded-lg bg-muted">
                                                                    <IconQuestionMark className="h-6 w-6" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <span className="whitespace-nowrap text-sm">
                                                            {product?.name + " " + product?.ram + "/" + product?.rom + "GB (" + product?.color + ")"}
                                                        </span>
                                                    </div>
                                                </TableCell>

                                                <TableCell>{product?.priceSell?.toLocaleString('vi-VN')}</TableCell>
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
                            <TableContainer className="h-full max-h-[500px] overflow-auto">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell></TableCell>
                                            <TableCell>Stt</TableCell>
                                            <TableCell>Imei code</TableCell>
                                            <TableCell>Bar code</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {listImei.map((im, index) => (
                                            <TableRow key={im?.id}>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox
                                                            checked={selectedImei.includes(im?.id)}
                                                            onCheckedChange={() => handleCheckboxChange(im?.id)}
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{im?.imeiCode}</TableCell>
                                                <TableCell>
                                                    <img src={im?.barCode}
                                                        className='h-8 w-64 rounded-lg object-cover'
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                <div className="absolute bottom-0 left-0 w-full bg-white p-4 shadow-md ">
                                    <Button
                                        className="bg-blue-600 text-white hover:bg-gray-300 hover:text-blue-600 ml-[580px] mt-[18px]"
                                        onClick={() => handleAddImei()}
                                    >
                                        Chọn
                                    </Button>
                                </div>
                            </TableContainer>
                        )}
                    </DialogContent>
                </Dialog>
            </>
        );
    };

export default ThemSanPham;