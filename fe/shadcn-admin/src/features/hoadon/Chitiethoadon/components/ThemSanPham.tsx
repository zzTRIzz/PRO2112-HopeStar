import React, { useEffect, useState } from 'react';
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
import { IconQuestionMark } from '@tabler/icons-react';
import { imei, ProductDetail } from '../ChiTietHoaDon';
import { BillRespones } from '@/features/banhang/service/Schema';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area';



interface SanPhamChiTiet {
    listProduct: ProductDetail[];
    listImei: imei[];
    handleAddProduct: (product: ProductDetail) => void;
    handleAddImei: () => void;
    handleCheckboxChange: (id: number) => void;
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
        useEffect(() => {
            console.log(listImei);
        }
            , [listProduct, listImei]);
          const [searchImeiKey, setSearchImeiKey] = useState('');
    
        const filteredImeiList = listImei.filter((imei) =>
            imei.imeiCode.toLowerCase().includes(searchImeiKey.toLowerCase())
          );
         return (
            <> 
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant='outline'
                    className='bg-blue-600 text-white hover:bg-gray-300 hover:text-blue-600'
                    onClick={() => setDialogContent('product')}
                    disabled={["DANG_GIAO_HANG", "HOAN_THANH", "CHO_THANH_TOAN", "DA_HUY"].includes(searchBill?.status ?? "")}
                  >
                    Thêm sản phẩm
                  </Button>
                </DialogTrigger>
                <DialogContent className={dialogContent === 'product' ? 'sm:max-w-[980px]' : 'sm:max-w-[730px]'}>
                  {dialogContent === 'product' ? (
                    <div>
                      {/* <div className='mb-4 flex flex-wrap gap-4'>
                        <Input
                          placeholder='Tìm mã sản phẩm, tên sản phẩm'
                          className='max-w-sm'
                          value={searchKey}
                          onChange={(e) => setSearchKey(e.target.value)}
                        />
                        <Button
                          className='bg-blue-600 text-white hover:bg-gray-300 hover:text-blue-600 ml-[420px]'
                          color='primary'
                          onClick={resetSearch}
                        >
                          Làm mới
                        </Button>
                        <div className='grid grid-cols-5 space-x-2'>
                          <Select
                            value={selectedBrand?.toString()}
                            onValueChange={(value) => setSelectedBrand(Number(value))}
                          >
                            <SelectTrigger className='w-[180px]'>
                              <SelectValue placeholder='Chọn thương hiệu' />
                            </SelectTrigger>
                            <SelectContent>
                              <ScrollArea className='h-40'>
        
                                {brands.map((brand) => (
                                  <SelectItem key={brand.id} value={brand.id.toString()}>
                                    {brand.name}
                                  </SelectItem>
                                ))}
                              </ScrollArea>
                            </SelectContent>
                          </Select>
        
                          <Select
                            value={selectedChip?.toString()}
                            onValueChange={(value) => setSelectedChip(Number(value))}
                          >
                            <SelectTrigger className='w-[180px]'>
                              <SelectValue placeholder='Chọn chip' />
                            </SelectTrigger>
                            <SelectContent>
                              <ScrollArea className='h-40'>
                                {chips.map((chip) => (
                                  <SelectItem key={chip.id} value={chip.id.toString()}>
                                    {chip.name}
                                  </SelectItem>
                                ))}
                              </ScrollArea>
                            </SelectContent>
                          </Select>
        
                          <Select
                            value={selectedCategory?.toString()}
                            onValueChange={(value) => setSelectedCategory(Number(value))}
                          >
                            <SelectTrigger className='w-[180px]'>
                              <SelectValue placeholder='Chọn danh mục' />
                            </SelectTrigger>
                            <SelectContent>
                              <ScrollArea className='h-40'>
                                {categories.map((category) => (
                                  <SelectItem
                                    key={category.id}
                                    value={category.id.toString()}
                                  >
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </ScrollArea>
                            </SelectContent>
                          </Select>
        
                          <Select
                            value={selectedOs?.toString()}
                            onValueChange={(value) => setSelectedOs(Number(value))}
                          >
                            <SelectTrigger className='w-[180px]'>
                              <SelectValue placeholder='Chọn hệ điều hành' />
                            </SelectTrigger>
                            <SelectContent>
                              <ScrollArea className='h-40'>
                                {os.map((item) => (
                                  <SelectItem key={item.id} value={item.id.toString()}>
                                    {item.name}
                                  </SelectItem>
                                ))}
                              </ScrollArea>
                            </SelectContent>
                          </Select>
        
                          <Select
                            value={selectedScreen?.toString()}
                            onValueChange={(value) => setSelectedScreen(Number(value))}
                          >
                            <SelectTrigger className='w-[180px]'>
                              <SelectValue placeholder='Chọn màn hình' />
                            </SelectTrigger>
                            <SelectContent>
                              <ScrollArea className='h-40'>
                                {screens.map((screen) => (
                                  <SelectItem
                                    key={screen.id}
                                    value={screen.id.toString()}
                                  >
                                    {screen.type}
                                  </SelectItem>
                                ))}
                              </ScrollArea>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
         */}
                      <TableContainer>
                        <ScrollArea className='h-[500px] pr-2'>
                          {listProduct.length > 0 ? (
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Stt</TableCell>
                                  {/* <TableCell>Hình ảnh</TableCell> */}
                                  <TableCell>Sản phẩm</TableCell>
                                  <TableCell>Giá tiền </TableCell>
                                  <TableCell>Số lượng tồn kho</TableCell>
                                  <TableCell>Thao Tác</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {listProduct.map((product, index) => (
                                  <TableRow key={product.id}>
                                    <TableCell>{index + 1}</TableCell>
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
                                          {product?.name + " " + product?.ram + "/" + product?.rom + product.descriptionRom + " (" + product?.color + ")"}
                                        </span>
                                      </div>
                                    </TableCell>
        
                                    <TableCell>
                                      {product?.priceSell?.toLocaleString('vi-VN')}
                                    </TableCell>
                                    <TableCell align='center'>
                                      {product?.inventoryQuantity}
                                    </TableCell>
                                    <TableCell>
                                      <Button
                                        className='bg-blue-600 text-white hover:bg-gray-300 hover:text-blue-600'
                                        color='primary'
                                        onClick={() => handleAddProduct(product)}
                                      >
                                        Chọn
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          ) : (
                            <div className='flex h-[300px] items-center justify-center'>
                              <div className='text-center'>
                                <p className='text-lg font-medium text-gray-500'>
                                  Không tìm thấy sản phẩm nào
                                </p>
                                <p className='mt-1 text-sm text-gray-400'>
                                  Vui lòng thử tìm kiếm với từ khóa khác
                                </p>
                              </div>
                            </div>
                          )}
                        </ScrollArea>
                      </TableContainer>
                    </div>
                  ) : (
                    <div>
                      <Input
                        placeholder="Tìm mã imei"
                        className="max-w-sm"
                        value={searchImeiKey}
                        onChange={(e) => setSearchImeiKey(e.target.value)}
                      />
                      <TableContainer >
                        <ScrollArea className="h-full max-h-[500px] overflow-auto">
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell></TableCell>
                                <TableCell>Stt</TableCell>
                                <TableCell>Mã imei</TableCell>
                                <TableCell align='center' className='w-[320px]'>Mã vạch</TableCell>
                                {/* <TableCell>Trạng thái</TableCell> */}
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
                        onClick={() => handleAddImei()}
                      >
                        Chọn
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </>
          )
    };

export default ThemSanPham;