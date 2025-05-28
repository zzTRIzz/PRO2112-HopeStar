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
import { getCard } from '@/features/product-management/attribute/card/data/api-service'
// import { getWifi } from '@/features/product-management/attribute/wifi/data/api-service'
import { getBluetooth } from '@/features/product-management/attribute/bluetooth/data/api-service'
import { getRam } from '@/features/product-management/attribute/ram/data/api-service'
import { getRom } from '@/features/product-management/attribute/rom/data/api-service'
import { getColor } from '@/features/product-management/attribute/color/data/api-service'
import { getProductDetail } from '../service/BanHangTaiQuayService'
import { IconQuestionMark } from '@tabler/icons-react'
import { ProductDetail } from '../service/Schema'
import { Label } from '@/components/ui/label'
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
  setListProduct?: (products: ProductDetail[]) => void
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
  const [selectedBrand, setSelectedBrand] = useState<number | undefined>()
  const [selectedChip, setSelectedChip] = useState<number | undefined>()
  const [selectedCategory, setSelectedCategory] = useState<number>()
  const [selectedOs, setSelectedOs] = useState<number>()
  const [selectedScreen, setSelectedScreen] = useState<number>()
  const [brands, setBrands] = useState([])
  const [chips, setChips] = useState([])
  const [categories, setCategories] = useState([])
  const [os, setOs] = useState([])
  const [screens, setScreens] = useState([])
  const [searchImeiKey, setSearchImeiKey] = useState('');
  const [selectedRam, setSelectedRam] = useState<number>()
  const [selectedRom, setSelectedRom] = useState<number>()
  const [selectedColor, setSelectedColor] = useState<number>()
  const [selectedCard, setSelectedCard] = useState<number>()
  const [selectedBluetooth, setSelectedBluetooth] = useState<number>()
  const [rams, setRams] = useState([])
  const [roms, setRoms] = useState([])
  const [colors, setColors] = useState([])
  const [cards, setCards] = useState([])
  const [bluetooths, setBluetooths] = useState([])

  useEffect(() => {
    loadCategory()
    loadBrand()
    loadChip()
    loadOs()
    loadScreen()
    loadRam()
    loadRom()
    loadColor()
    loadCard()
    loadBluetooth()
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
        ram: selectedRam,
        rom: selectedRom,
        color: selectedColor,
        idCard: selectedCard,
        idBluetooth: selectedBluetooth
      }

      const data = await getProductDetail(searchRequest)
      if (setListProduct) {
        setListProduct(data)
      }
    } catch (error) {
      console.error('Error searching products:', error)
    }
  }

  const loadRam = async () => {
    try {
      const data = await getRam()
      setRams(data)
    } catch (error) {
      console.error('Error fetching RAM:', error)
    }
  }

  const loadRom = async () => {
    try {
      const data = await getRom()
      setRoms(data)
    } catch (error) {
      console.error('Error fetching ROM:', error)
    }
  }

  const loadColor = async () => {
    try {
      const data = await getColor()
      setColors(data)
    } catch (error) {
      console.error('Error fetching color:', error)
    }
  }

  const loadCard = async () => {
    try {
      const data = await getCard()
      setCards(data)
    } catch (error) {
      console.error('Error fetching card:', error)
    }
  }

  const loadBluetooth = async () => {
    try {
      const data = await getBluetooth()
      setBluetooths(data)
    } catch (error) {
      console.error('Error fetching bluetooth:', error)
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
    selectedRam,
    selectedRom,
    selectedColor,
    selectedCard,
    selectedBluetooth
  ])
  const resetSearch = async () => {
    setSearchKey('');
    setSelectedBrand(undefined);
    setSelectedChip(undefined);
    setSelectedCategory(undefined);
    setSelectedOs(undefined);
    setSelectedScreen(undefined);
    setSelectedRam(undefined);
    setSelectedRom(undefined);
    setSelectedColor(undefined);
    setSelectedCard(undefined);
    setSelectedBluetooth(undefined);
    if (setListProduct) {
      getProductDetail({})
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
                <div className='grid grid-cols-5 space-x-2 gap-2'>
                  {/* <Select
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
                  </Select> */}
                  <div className='flex flex-col justify-center'>
                    <Label htmlFor='brand-select' className='mb-1 text-xs text-muted-foreground'>
                      Thương hiệu
                    </Label>
                    <Select
                      value={selectedBrand?.toString()}
                      onValueChange={(value) =>
                        setSelectedBrand(value === '0' ? undefined : Number(value))
                      }
                    >
                      <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='Tất cả' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='0'>Tất cả</SelectItem>
                        {brands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id.toString()}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* <Select
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
                  </Select> */}
                  <div className='flex flex-col justify-center'>
                    <Label
                      htmlFor='chip-select'
                      className='mb-1 text-xs text-muted-foreground'
                    >
                      Chip
                    </Label>
                    <Select
                      value={selectedChip?.toString()}
                      onValueChange={(value) =>
                        setSelectedChip(value === '0' ? undefined : Number(value))
                      }
                    >
                      <SelectTrigger id='chip-select'>
                        <SelectValue placeholder='Tất cả' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='0'>Tất cả</SelectItem>
                        {chips.map((chip) => (
                          <SelectItem key={chip.id} value={chip.id.toString()}>
                            {chip.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* <Select
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
                  </Select> */}
                  <div className='flex flex-col justify-center'>
                    <Label htmlFor='category-select' className='mb-1 text-xs text-muted-foreground'>
                      Danh mục
                    </Label>
                    <Select
                      value={selectedCategory?.toString()}
                      onValueChange={(value) =>
                        setSelectedCategory(value === '0' ? undefined : Number(value))
                      }
                    >
                      <SelectTrigger id='category-select'>
                        <SelectValue placeholder='Tất cả' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='0'>Tất cả</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* <Select
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
                  </Select> */}
                  <div className='flex flex-col justify-center'>
                    <Label htmlFor='os-select' className='mb-1 text-xs text-muted-foreground'>
                      Hệ điều hành
                    </Label>
                    <Select
                      value={selectedOs?.toString()}
                      onValueChange={(value) =>
                        setSelectedOs(value === '0' ? undefined : Number(value))
                      }
                    >
                      <SelectTrigger id='os-select'>
                        <SelectValue placeholder='Tất cả' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='0'>Tất cả</SelectItem>
                        {os.map((item) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* <Select
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
                  </Select> */}

                  <div className='flex flex-col justify-center'>
                    <Label htmlFor='screen-select' className='mb-1 text-xs text-muted-foreground'>
                      Màn hình
                    </Label>
                    <Select
                      value={selectedScreen?.toString()}
                      onValueChange={(value) =>
                        setSelectedScreen(value === '0' ? undefined : Number(value))
                      }
                    >
                      <SelectTrigger id='screen-select'>
                        <SelectValue placeholder='Tất cả' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='0'>Tất cả</SelectItem>
                        {screens.map((screen) => (
                          <SelectItem key={screen.id} value={screen.id.toString()}>
                            {screen.type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Card đồ họa */}
                  <div className='flex flex-col justify-center'>
                    <Label htmlFor='card-select' className='mb-1 text-xs text-muted-foreground'>
                      Thẻ nhớ
                    </Label>
                    <Select
                      value={selectedCard?.toString()}
                      onValueChange={(value) => setSelectedCard(value === '0' ? undefined : Number(value))}
                    >
                      <SelectTrigger id='card-select'>
                        <SelectValue placeholder='Tất cả' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='0'>Tất cả</SelectItem>
                        {cards.map((card) => (
                          <SelectItem key={card.id} value={card.id.toString()}>
                            {card.type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Bluetooth */}
                  <div className='flex flex-col justify-center'>
                    <Label htmlFor='bluetooth-select' className='mb-1 text-xs text-muted-foreground'>
                      Bluetooth
                    </Label>
                    <Select
                      value={selectedBluetooth?.toString()}
                      onValueChange={(value) => setSelectedBluetooth(value === '0' ? undefined : Number(value))}
                    >
                      <SelectTrigger id='bluetooth-select'>
                        <SelectValue placeholder='Tất cả' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='0'>Tất cả</SelectItem>
                        {bluetooths.map((item) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Ram */}
                  <div className='flex flex-col justify-center'>
                    <Label htmlFor='ram-select' className='mb-1 text-xs text-muted-foreground'>
                      Ram
                    </Label>
                    <Select   
                      value={selectedRam?.toString()}
                      onValueChange={(value) => setSelectedRam(value === '0' ? undefined : Number(value))}
                    >
                      <SelectTrigger id='ram-select'>
                        <SelectValue placeholder='Tất cả' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='0'>Tất cả</SelectItem>
                        {rams.map((ram) => (
                          <SelectItem key={ram.id} value={ram.id.toString()}>{ram.capacity} {ram.description}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* ROM */}
                  <div className='flex flex-col justify-center'>
                    <Label htmlFor='rom-select' className='mb-1 text-xs text-muted-foreground'>
                      Rom
                    </Label>
                    <Select
                      value={selectedRom?.toString()}
                      onValueChange={(value) => setSelectedRom(value === '0' ? undefined : Number(value))}
                    >
                      <SelectTrigger id='rom-select'>
                        <SelectValue placeholder='Tất cả' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='0'>Tất cả</SelectItem>
                        {roms.map((rom) => (
                          <SelectItem key={rom.id} value={rom.id.toString()}>
                            {rom.capacity} {rom.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Màu sắc */}
                  <div className='flex flex-col justify-center'>
                    <Label htmlFor='color-select' className='mb-1 text-xs text-muted-foreground'>
                      Màu sắc
                    </Label>
                    <Select
                      value={selectedColor?.toString()}
                      onValueChange={(value) => setSelectedColor(value === '0' ? undefined : Number(value))}
                    >
                      <SelectTrigger id='color-select'>
                        <SelectValue placeholder='Tất cả' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='0'>Tất cả</SelectItem>
                        {colors.map((color) => (
                          <SelectItem key={color.id} value={color.id.toString()}>
                            {color.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>


                </div>
              </div>

              <TableContainer>
                <ScrollArea className='h-[500px] pr-2'>
                  {listProduct.length > 0 ? (
                    <Table>
                      <TableHead>
                        <TableRow >
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
