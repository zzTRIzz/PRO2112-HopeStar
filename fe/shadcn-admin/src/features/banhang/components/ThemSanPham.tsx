import React, { useEffect, useState } from 'react'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getBrand } from '@/features/product-management/attribute/brand/data/api-service'
import { getCategory } from '@/features/product-management/attribute/category/data/api-service'
import { getChip } from '@/features/product-management/attribute/chip/data/api-service'
import { getOs } from '@/features/product-management/attribute/os/data/api-service'
import { getScreen } from '@/features/product-management/attribute/screen/data/api-service'
import { getProductDetail } from '../service/BanHangTaiQuayService'
import { IconQuestionMark } from '@tabler/icons-react'
import { ProductDetail } from '../service/Schema'

interface imei {
  id: number
  imeiCode: string
  barCode: string
  status: string
}

interface SanPhamChiTiet {
  listProduct: ProductDetail[]
  listImei: imei[]
  handleAddProduct: (product: ProductDetail) => void
  handleAddImei: () => void
  handleCheckboxChange: (id: number) => void
  selectedImei: number[]
  dialogContent: 'product' | 'imei'
  setDialogContent: (content: 'product' | 'imei') => void
  isDialogOpen: boolean
  setIsDialogOpen: (open: boolean) => void
  setListProduct?: (products: ProductDetail[]) => void // Make optional to avoid breaking existing usage
}

const ThemSanPham: React.FC<SanPhamChiTiet> = ({
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
  setListProduct,
}) => {
  const [searchKey, setSearchKey] = useState('')
  const [selectedBrand, setSelectedBrand] = useState<number>()
  const [selectedChip, setSelectedChip] = useState<number>()
  const [selectedCategory, setSelectedCategory] = useState<number>()
  const [selectedOs, setSelectedOs] = useState<number>()
  const [selectedScreen, setSelectedScreen] = useState<number>()
  const [brands, setBrands] = useState([])
  const [chips, setChips] = useState([])
  const [categories, setCategories] = useState([])
  const [os, setOs] = useState([])
  const [screens, setScreens] = useState([])
  const [searchImeiKey, setSearchImeiKey] = useState('');
  useEffect(() => {
    loadCategory()
    loadBrand()
    loadChip()
    loadOs()
    loadScreen()
  }, [])

  const loadCategory = async () => {
    try {
      const data = await getCategory()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const loadBrand = async () => {
    try {
      const data = await getBrand()
      setBrands(data)
    } catch (error) {
      console.error('Error fetching brands:', error)
    }
  }

  const loadScreen = async () => {
    try {
      const data = await getScreen()
      setScreens(data)
    } catch (error) {
      console.error('Error fetching screens:', error)
    }
  }

  const loadChip = async () => {
    try {
      const data = await getChip()
      setChips(data)
    } catch (error) {
      console.error('Error fetching chips:', error)
    }
  }

  const loadOs = async () => {
    try {
      const data = await getOs()
      setOs(data)
    } catch (error) {
      console.error('Error fetching OS:', error)
    }
  }

  const handleSearch = async () => {
    try {
      const searchRequest = {
        key: searchKey,
        idBrand: selectedBrand,
        idChip: selectedChip,
        idCategory: selectedCategory,
        idOs: selectedOs,
        idScreen: selectedScreen,
      }

      const data = await getProductDetail(searchRequest)
      if (setListProduct) {
        setListProduct(data)
      }
    } catch (error) {
      console.error('Error searching products:', error)
    }
  }

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      handleSearch()
    }, 300)

    return () => clearTimeout(delaySearch)
  }, [
    searchKey,
    selectedBrand,
    selectedChip,
    selectedCategory,
    selectedOs,
    selectedScreen,
  ])
  const resetSearch = async () => {
    setSearchKey('');
    setSelectedBrand(undefined);
    setSelectedChip(undefined);
    setSelectedCategory(undefined);
    setSelectedOs(undefined);
    setSelectedScreen(undefined);
    if (setListProduct) {
      getProductDetail({}) // Gọi API không có filter
        .then(data => setListProduct(data))
        .catch(error => console.error('Error resetting products:', error));
    }
  };



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
          >
            Thêm sản phẩm
          </Button>
        </DialogTrigger>
        <DialogContent className={dialogContent === 'product' ? 'sm:max-w-[980px]' : 'sm:max-w-[730px]'}>
          {dialogContent === 'product' ? (
            <div>
              <div className='mb-4 flex flex-wrap gap-4'>
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
}

export default ThemSanPham;
