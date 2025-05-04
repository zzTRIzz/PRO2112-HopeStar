import { useCallback, useEffect, useMemo, useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { IconDownload, IconTrash } from '@tabler/icons-react'
import AddIcon from '@mui/icons-material/Add'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ColorMutateDialog } from '@/features/product-management/attribute/color/components/color-mutate-dialog'
import { RamMutateDialog } from '@/features/product-management/attribute/ram/components/ram-mutate-dialog'
import { RomMutateDialog } from '@/features/product-management/attribute/rom/components/rom-mutate-dialog'
import { ProductConfigRequest } from '../../data/schema'
import { ProductImeiRequest } from '../../data/schema'
import { AddImeiDialog } from './add-imei-dialog'
import { ImageUploader } from './upload-image'

// Hàm định dạng số với dấu phẩy ngăn cách hàng nghìn
const formatNumberWithCommas = (value: number | string): string => {
  const str = value.toString()
  if (str === '-' || str === '') return str // Giữ nguyên dấu "-" hoặc chuỗi rỗng

  // Xử lý số âm
  const isNegative = str.startsWith('-')
  const numStr = isNegative ? str.slice(1) : str

  return isNegative
    ? `-${numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
    : numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// Hàm loại bỏ dấu phẩy và chuyển đổi thành số
const parseFormattedNumber = (value: string): number => {
  return Number(value.replace(/,/g, ''))
}

interface Option {
  id: number
  capacity?: number
  name?: string
  hex?: string
  description?: string
}

interface ProductDetailFormProps {
  rams?: Option[]
  roms?: Option[]
  colors?: Option[]
  onTableRowsChange: (
    rows: {
      idRam: number
      idRom: number
      idColor: number
      price: number
      inventoryQuantity?: number
      productImeiRequests?: { imeiCode: string }[]
      imageUrl: string
    }[]
  ) => void
}

const OptionSelector: React.FC<{
  label: string
  options: Option[]
  selected: number[]
  onSelect: (id: number) => void
}> = ({ label, options, selected, onSelect }) => {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='outline' className='w-full justify-between overflow-hidden text-ellipsis whitespace-nowrap'>
            {selected.length > 0
              ? selected
                  .map((id) => {
                    const option = options.find((o) => o.id === id)
                    return option
                      ? `${option.capacity}${option.description}`
                      : ''
                  })
                  .filter(Boolean) // Lọc bỏ các giá trị undefined/empty
                  .join(', ')
              : label}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[280px] p-0'>
          <ScrollArea className='h-40'>
            {options.map((option) => (
              <div
                key={option.id}
                className='flex cursor-pointer items-center space-x-2 p-2 hover:bg-gray-100'
                onClick={() => onSelect(option.id)}
              >
                <Checkbox checked={selected.includes(option.id)} />
                <span>{`${option.capacity} ${option.description}`}</span>
              </div>
            ))}
          </ScrollArea>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  )
}

const ColorSelector: React.FC<{
  label: string
  options: Option[]
  selected: number[]
  onSelect: (ids: number[]) => void
}> = ({ label, options, selected, onSelect }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [tempSelected, setTempSelected] = useState<number[]>([])

  useEffect(() => {
    if (isDialogOpen) {
      setTempSelected([...selected])
    }
  }, [isDialogOpen, selected])

  const handleSelectColor = (id: number) => {
    setTempSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleConfirm = () => {
    onSelect(tempSelected)
    setIsDialogOpen(false)
  }
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant='outline' className='w-full justify-between overflow-hidden text-ellipsis whitespace-nowrap'>
            {selected.length > 0
              ? selected
                  .map((id) => options.find((o) => o.id === id)?.name)
                  .join(', ')
              : label}
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[515px]'>
          <DialogHeader>
            <DialogTitle>Chọn {label}</DialogTitle>
            <DialogDescription>
              Chọn xác nhận khi bạn đã hoàn tất.
            </DialogDescription>
          </DialogHeader>

          {/* Thêm ô tìm kiếm */}
          <div className='relative mb-4'>
            <Input
              type='text'
              placeholder='Tìm kiếm...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-8'
            />
            {/* <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' /> */}
          </div>

          <ScrollArea className='h-60 w-full'>
            <div className='grid grid-cols-5 space-x-4 pb-1'>
              {options
                .filter((option) =>
                  option.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((option) => (
                  <div
                    key={option.id}
                    className='flex cursor-pointer flex-col items-center space-y-2 p-2 hover:bg-gray-100'
                    onClick={() => handleSelectColor(option.id)}
                  >
                    <div
                      className='h-12 w-12 rounded-full'
                      style={{
                        backgroundColor: option.hex,
                        border:
                          option.name?.toLowerCase() === 'white'
                            ? '2px solid #ccc'
                            : 'none',
                      }}
                    ></div>
                    <span>{option.name}</span>
                    <Checkbox checked={tempSelected.includes(option.id)} />
                  </div>
                ))}
            </div>
          </ScrollArea>
          <div className='mt-1 flex justify-end'>
            <Button onClick={handleConfirm}>Xác nhận</Button>
          </div>
        </DialogContent>
      </Dialog>
      <FormMessage />
    </FormItem>
  )
}

interface ProductTableProps {
  idRam: number
  idRom: number
  rams: Option[]
  roms: Option[]
  colors: Option[]
  tableRows: {
    idRam: number
    idRom: number
    idColor: number
    price: number
    inventoryQuantity?: number
    productImeiRequests?: { imeiCode: string }[]
    imageUrl: string
  }[]
  onDeleteRow: (idRam: number, idRom: number, idColor: number) => void
  onDeleteAll: (idRam: number, idRom: number) => void
  onSetGeneralPrice: (idRam: number, idRom: number, price: number) => void
  onPriceChange: (
    idRam: number,
    idRom: number,
    idColor: number,
    price: number
  ) => void
  //
  onAddColors: (idRam: number, idRom: number, colorIds: number[]) => void
  //
  onAddImeis: (
    idRam: number,
    idRom: number,
    idColor: number,
    imeis: ProductImeiRequest[],
    quantity: number
  ) => void
  //
  onImageChange: (
    idRam: number,
    idRom: number,
    idColor: number,
    imageUrl: string
  ) => void
}

const ProductTable: React.FC<ProductTableProps> = ({
  idRam,
  idRom,
  rams,
  roms,
  colors,
  tableRows,
  onDeleteRow,
  onDeleteAll,
  onSetGeneralPrice,
  onPriceChange,
  onAddColors,
  onAddImeis,
  onImageChange,
}) => {
  const { control } = useFormContext<ProductConfigRequest>()
  const [isChecked, setIsChecked] = useState<boolean>(false)
  const [isGeneralPriceDialogOpen, setIsGeneralPriceDialogOpen] =
    useState(false)
  const [generalPrice, setGeneralPrice] = useState<string>('')
  const [priceError, setPriceError] = useState<string>('')
  //xu ly color them
  const [isAddColorDialogOpen, setIsAddColorDialogOpen] = useState(false)
  const [selectedColorsForTable, setSelectedColorsForTable] = useState<
    number[]
  >([])

  // Lọc các hàng thuộc cặp RAM/ROM hiện tại
  const filteredRows = useMemo(() => {
    return tableRows.filter((row) => row.idRam === idRam && row.idRom === idRom)
  }, [tableRows, idRam, idRom])

  // Lấy danh sách màu đã có trong bảng
  const existingColorIds = useMemo(() => {
    return filteredRows.map((row) => row.idColor)
  }, [filteredRows])

  // Khi mở Dialog "Thêm màu", khởi tạo lại danh sách màu đã chọn
  useEffect(() => {
    if (isAddColorDialogOpen) {
      // Khởi tạo với một mảng rỗng để chỉ chọn màu mới
      setSelectedColorsForTable([])
    }
  }, [isAddColorDialogOpen])

  // For IMEI dialog
  const [isAddImeiDialogOpen, setIsAddImeiDialogOpen] = useState(false)
  const [currentColorId, setCurrentColorId] = useState<number | null>(null)

  if (filteredRows.length === 0) {
    return null
  }

  const handleGeneralPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, '')

    // Cho phép: số âm, số dương, hoặc chuỗi rỗng (khi xóa)
    if (rawValue === '' || /^-?\d*$/.test(rawValue)) {
      setGeneralPrice(rawValue === '-' ? '-' : formatNumberWithCommas(rawValue))
      setPriceError('') // Clear error khi người dùng sửa
    }
  }

  const handleSetGeneralPrice = () => {
    const numericValue = parseFormattedNumber(generalPrice)

    if (generalPrice === '' || generalPrice === '-') {
      setPriceError('Vui lòng nhập giá trị')
      return
    }

    if (numericValue <= 0) {
      setPriceError('Giá trị phải lớn hơn 0') // Báo lỗi nếu ≤ 0 (bao gồm số âm)
      return
    }

    // Hợp lệ -> Lưu giá
    onSetGeneralPrice(idRam, idRom, numericValue)
    setIsGeneralPriceDialogOpen(false)
  }

  const handleSelectColorForTable = (idColor: number) => {
    // Kiểm tra xem màu này đã có trong bảng chưa
    const isExistingColor = existingColorIds.includes(idColor)

    // Chỉ cho phép thêm màu mới, không cho phép chọn màu đã có
    if (!isExistingColor) {
      setSelectedColorsForTable(
        (prev) =>
          prev.includes(idColor)
            ? prev.filter((id) => id !== idColor) // Bỏ chọn nếu đã chọn
            : [...prev, idColor] // Thêm vào nếu chưa chọn
      )
    }
  }

  const handleAddColorsToTable = () => {
    // Chỉ xử lý nếu có màu mới được chọn
    if (selectedColorsForTable.length > 0) {
      // Gọi hàm từ component cha để cập nhật tableRows
      onAddColors(idRam, idRom, selectedColorsForTable)
    }

    // Đóng Dialog và reset state
    setIsAddColorDialogOpen(false)
    setSelectedColorsForTable([])
  }

  const handleOpenImeiDialog = (e: React.MouseEvent, idColor: number) => {
    // Prevent event bubbling to parent form
    e.preventDefault()
    e.stopPropagation()

    setCurrentColorId(idColor)
    setIsAddImeiDialogOpen(true)
  }

  const handleImeiAdd = (imeis: ProductImeiRequest[], quantity: number) => {
    if (currentColorId !== null) {
      onAddImeis(idRam, idRom, currentColorId, imeis, quantity)
      setCurrentColorId(null)
    }
  }

  return (
    <>
      <Table key={`table-${idRam}-${idRom}`} className='mt-10 rounded border'>
        <TableHeader>
          <TableRow>
            <TableHead colSpan={2} className='h-16 py-2 text-xl'>
              <Checkbox
                checked={isChecked}
                onCheckedChange={() => setIsChecked(!isChecked)}
              />
              Phiên bản {rams.find((r) => r.id === idRam)?.capacity} /{' '}
              {roms.find((r) => r.id === idRom)?.capacity}
              {roms.find((r) => r.id === idRom)?.description}
            </TableHead>
            {isChecked && (
              <TableHead colSpan={4} className='space-x-2 py-2 text-right'>
                <Button
                  type='button' // Thêm type="button"
                  className='bg-blue-500 hover:bg-blue-600'
                  onClick={() => setIsAddColorDialogOpen(true)}
                >
                  Thêm màu
                </Button>
                <Button
                  type='button' // Thêm type="button"
                  className='bg-blue-500 hover:bg-blue-600'
                  onClick={() => setIsGeneralPriceDialogOpen(true)}
                >
                  Giá chung
                </Button>
                <Button
                  type='button' // Thêm type="button"
                  className='bg-red-500 hover:bg-red-600'
                  onClick={() => onDeleteAll(idRam, idRom)}
                >
                  Xóa tất cả
                </Button>
              </TableHead>
            )}
          </TableRow>
          <TableRow>
            <TableHead>STT</TableHead>
            <TableHead>Màu sắc</TableHead>
            <TableHead>Số lượng</TableHead>
            <TableHead>Giá</TableHead>
            <TableHead>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRows.map((row, index) => (
            <TableRow key={`${row.idRam}-${row.idRom}-${row.idColor}`}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                {colors.find((c) => c.id === row.idColor)?.name}
              </TableCell>
              <TableCell>{row.inventoryQuantity || 0}</TableCell>
              <TableCell>
                <FormControl>
                  <input
                    type='text'
                    className='w-26 h-8 rounded border'
                    placeholder='Giá'
                    value={formatNumberWithCommas(row.price)}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/,/g, '')
                      const numericValue = Number(rawValue)
                      if (!isNaN(numericValue)) {
                        onPriceChange(idRam, idRom, row.idColor, numericValue)
                      }
                    }}
                  />
                </FormControl>
              </TableCell>
              <TableCell className='space-x-2'>
                <Button
                  type='button'
                  className='bg-blue-500 hover:bg-blue-600'
                  onClick={(e) => handleOpenImeiDialog(e, row.idColor)}
                >
                  <IconDownload stroke={3} />
                </Button>
                <Button
                  type='button' // Thêm type="button"
                  className='bg-red-500 hover:bg-red-600'
                  onClick={() => onDeleteRow(idRam, idRom, row.idColor)}
                >
                  <IconTrash stroke={3} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog để nhập giá chung */}
      <Dialog
        open={isGeneralPriceDialogOpen}
        onOpenChange={setIsGeneralPriceDialogOpen}
      >
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Giá chung</DialogTitle>
            <DialogDescription>
              Chọn xác nhận khi bạn đã hoàn tất.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <Input
              type='text'
              placeholder='Nhập giá...'
              value={generalPrice}
              onChange={handleGeneralPriceChange}
            />
            {priceError && <p className='text-sm text-red-500'>{priceError}</p>}
            <Button onClick={handleSetGeneralPrice}>Xác nhận</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog để thêm màu vào bảng */}
      <Dialog
        open={isAddColorDialogOpen}
        onOpenChange={(open) => {
          setIsAddColorDialogOpen(open)
          if (open) {
            // When opening dialog, initialize with existing colors
            setSelectedColorsForTable(existingColorIds)
          }
        }}
      >
        <DialogContent className='sm:max-w-[515px]'>
          <DialogHeader>
            <DialogTitle>Thêm màu</DialogTitle>
            <DialogDescription>
              Chọn màu và nhấn Lưu khi hoàn tất.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className='h-60 w-full'>
            <div className='grid grid-cols-5 space-x-4 pb-1'>
              {colors.map((color) => {
                const isExistingColor = existingColorIds.includes(color.id)

                return (
                  <div
                    key={color.id}
                    className={`flex flex-col items-center space-y-2 p-2 ${
                      isExistingColor
                        ? 'opacity-70'
                        : 'cursor-pointer hover:bg-gray-100'
                    }`}
                  >
                    <div
                      className='h-12 w-12 rounded-full'
                      style={{
                        backgroundColor: color.hex,
                        border:
                          color.name?.toLowerCase() === 'white'
                            ? '2px solid #ccc'
                            : 'none',
                      }}
                    ></div>
                    <span>{color.name}</span>
                    <Checkbox
                      checked={
                        isExistingColor ||
                        selectedColorsForTable.includes(color.id)
                      }
                      disabled={isExistingColor}
                      onCheckedChange={(checked) => {
                        if (!isExistingColor) {
                          if (checked) {
                            setSelectedColorsForTable((prev) => [
                              ...prev,
                              color.id,
                            ])
                          } else {
                            setSelectedColorsForTable((prev) =>
                              prev.filter((id) => id !== color.id)
                            )
                          }
                        }
                      }}
                    />
                  </div>
                )
              })}
            </div>
          </ScrollArea>
          <div className='mt-4 flex justify-end space-x-2'>
            <Button
              type='button' // Thêm type="button"
              variant='outline'
              onClick={() => {
                setIsAddColorDialogOpen(false)
                setSelectedColorsForTable([])
              }}
            >
              Hủy
            </Button>
            <Button
              type='button' // Thêm type="button"
              onClick={handleAddColorsToTable}
              disabled={selectedColorsForTable.length === 0}
            >
              Lưu
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Using the new extracted AddImeiDialog component */}
      <AddImeiDialog
        isOpen={isAddImeiDialogOpen}
        onOpenChange={(open) => {
          // Ensure the dialog state change doesn't affect the parent form
          setTimeout(() => {
            setIsAddImeiDialogOpen(open)
          }, 0)
        }}
        onImeiAdd={handleImeiAdd}
        idRam={idRam}
        idRom={idRom}
        idColor={currentColorId || 0}
      />
    </>
  )
}

export function ProductDetailForm({
  rams = [],
  roms = [],
  colors = [],
  onTableRowsChange,
}: ProductDetailFormProps) {
  const { control } = useFormContext<ProductConfigRequest>()
  const { append: _append, remove: _remove } = useFieldArray({
    control,
    name: 'productDetailRequests',
  })

  const [selections, setSelections] = useState({
    rams: [] as number[],
    roms: [] as number[],
    colors: [] as number[],
  })

  const [tableRows, setTableRows] = useState<
    {
      idRam: number
      idRom: number
      idColor: number
      price: number
      inventoryQuantity: number
      productImeiRequests: ProductImeiRequest[]
      imageUrl: string
    }[]
  >([])

  const [uniqueColors, setUniqueColors] = useState<number[]>([])
  const [colorImages, setColorImages] = useState<{ [key: number]: string }>({})

  const [deletedVersions, setDeletedVersions] = useState<
    {
      ram: number
      rom: number
      color?: number
    }[]
  >([])

  useEffect(() => {
    const colorIds = tableRows.map((row) => row.idColor)
    const uniqueColorIds = Array.from(new Set(colorIds)) // Loại bỏ các màu sắc trùng lặp
    setUniqueColors(uniqueColorIds)
  }, [tableRows])

  const generateTableRows = useCallback(() => {
    if (!selections.rams.length || !selections.roms.length) {
      return []
    }

    // Tạo các hàng mới và lọc ra các phiên bản đã xóa
    return selections.rams.flatMap((idRam) =>
      selections.roms.flatMap((idRom) => {
        // Kiểm tra xem cặp RAM/ROM này đã bị xóa hoàn toàn chưa
        const isVersionDeleted = deletedVersions.some(
          (v) => v.ram === idRam && v.rom === idRom && v.color === undefined
        )

        if (isVersionDeleted) {
          return []
        }

        return selections.colors.length
          ? selections.colors
              .map((idColor) => {
                // Kiểm tra xem phiên bản cụ thể này đã bị xóa chưa
                const isColorVersionDeleted = deletedVersions.some(
                  (v) =>
                    v.ram === idRam && v.rom === idRom && v.color === idColor
                )

                if (isColorVersionDeleted) {
                  return null
                }

                return {
                  idRam,
                  idRom,
                  idColor,
                  price: 0,
                  inventoryQuantity: 0,
                  productImeiRequests: [],
                  imageUrl: colorImages[idColor] || '',
                }
              })
              .filter(Boolean)
          : [
              {
                idRam,
                idRom,
                idColor: -1,
                price: 0,
                inventoryQuantity: 0,
                productImeiRequests: [],
                imageUrl: '',
              },
            ]
      })
    )
  }, [selections, colorImages, deletedVersions])

  const toggleSelection = useCallback(
    (type: 'rams' | 'roms' | 'colors', id: number) => {
      // Kiểm tra xem id có trong danh sách chọn hiện tại không
      const isCurrentlySelected = selections[type].includes(id)

      // Cập nhật danh sách lựa chọn
      const newSelections = {
        ...selections,
        [type]: isCurrentlySelected
          ? selections[type].filter((item) => item !== id)
          : [...selections[type], id],
      }

      setSelections(newSelections)

      // Nếu đang thêm một lựa chọn mới (không phải bỏ chọn), cập nhật deletedVersions
      if (!isCurrentlySelected) {
        if (type === 'rams') {
          setDeletedVersions((prev) => prev.filter((v) => v.ram !== id))
        } else if (type === 'roms') {
          setDeletedVersions((prev) => prev.filter((v) => v.rom !== id))
        } else if (type === 'colors') {
          setDeletedVersions((prev) => prev.filter((v) => v.color !== id))
        }
      }
    },
    [selections]
  )

  // Tách biệt việc tạo hàng mới và việc cập nhật tableRows
  const mergeWithExistingRows = useCallback(
    (newRows) => {
      if (!tableRows || tableRows.length === 0) return newRows

      return newRows.map((newRow) => {
        const existing = tableRows.find(
          (row) =>
            row.idRam === newRow.idRam &&
            row.idRom === newRow.idRom &&
            row.idColor === newRow.idColor
        )
        return existing || newRow
      })
    },
    [tableRows]
  )

  // Sử dụng useEffect để cập nhật tableRows khi selections hoặc deletedVersions thay đổi
  useEffect(() => {
    // Chỉ cập nhật khi có RAM và ROM được chọn
    if (!selections.rams.length || !selections.roms.length) return

    const newRows = generateTableRows()
    const mergedRows = mergeWithExistingRows(newRows)

    // Chỉ cập nhật nếu có sự thay đổi thực sự
    if (JSON.stringify(mergedRows) !== JSON.stringify(tableRows)) {
      setTableRows(mergedRows)
    }
  }, [
    selections,
    deletedVersions,
    generateTableRows,
    mergeWithExistingRows,
    tableRows,
  ])

  // Sử dụng useEffect riêng biệt để gọi onTableRowsChange mỗi khi tableRows thay đổi
  useEffect(() => {
    if (tableRows && tableRows.length > 0) {
      onTableRowsChange(tableRows)
    }
  }, [tableRows, onTableRowsChange])

  const handlers = useMemo(
    () => ({
      deleteRow: (idRam: number, idRom: number, idColor: number) => {
        // Thêm vào danh sách phiên bản đã xóa
        setDeletedVersions((prev) => [
          ...prev,
          { ram: idRam, rom: idRom, color: idColor },
        ])

        setTableRows((prev) => {
          const newRows = prev.filter(
            (row) =>
              !(
                row.idRam === idRam &&
                row.idRom === idRom &&
                row.idColor === idColor
              )
          )
          return newRows
        })
      },
      deleteAll: (idRam: number, idRom: number) => {
        // Thêm vào danh sách phiên bản đã xóa (toàn bộ cặp RAM/ROM)
        setDeletedVersions((prev) => [...prev, { ram: idRam, rom: idRom }])

        setTableRows((prev) => {
          const newRows = prev.filter(
            (row) => !(row.idRam === idRam && row.idRom === idRom)
          )
          return newRows
        })
      },
      setGeneralPrice: (idRam: number, idRom: number, price: number) => {
        setTableRows((prev) => {
          const newRows = prev.map((row) =>
            row.idRam === idRam && row.idRom === idRom ? { ...row, price } : row
          )
          return newRows
        })
      },
      updatePrice: (
        idRam: number,
        idRom: number,
        idColor: number,
        price: number
      ) => {
        setTableRows((prev) => {
          const newRows = prev.map((row) =>
            row.idRam === idRam &&
            row.idRom === idRom &&
            row.idColor === idColor
              ? { ...row, price }
              : row
          )
          return newRows
        })
      },
      addColors: (idRam: number, idRom: number, colorIds: number[]) => {
        // Xóa các màu đã bị xóa khỏi danh sách deletedVersions
        setDeletedVersions((prev) =>
          prev.filter(
            (v) =>
              !(
                v.ram === idRam &&
                v.rom === idRom &&
                (v.color === undefined || colorIds.includes(v.color || -1))
              )
          )
        )

        // Lấy danh sách màu hiện tại cho cặp RAM/ROM này
        const existingColors = tableRows
          .filter((row) => row.idRam === idRam && row.idRom === idRom)
          .map((row) => row.idColor)

        // Chỉ thêm những màu mới chưa có trong bảng
        const newColorIds = colorIds.filter(
          (id) => !existingColors.includes(id)
        )

        if (newColorIds.length === 0) {
          return // Không có màu mới để thêm
        }

        // Tạo các hàng mới cho màu mới
        const newRows = newColorIds.map((idColor) => ({
          idRam,
          idRom,
          idColor,
          price: 0,
          inventoryQuantity: 0,
          productImeiRequests: [],
          imageUrl: colorImages[idColor] || '',
        }))

        // Cập nhật tableRows
        setTableRows((prev) => [...prev, ...newRows])

        // Cập nhật selections.colors để đảm bảo màu mới được hiển thị
        setSelections((prev) => {
          // Tạo một mảng mới chứa tất cả các màu đã chọn và các màu mới
          const updatedColors = [...new Set([...prev.colors, ...newColorIds])]
          return {
            ...prev,
            colors: updatedColors,
          }
        })
      },
      addImeis: (
        idRam: number,
        idRom: number,
        idColor: number,
        imeis: ProductImeiRequest[],
        quantity: number
      ) => {
        setTableRows((prev) => {
          const newRows = prev.map((row) =>
            row.idRam === idRam &&
            row.idRom === idRom &&
            row.idColor === idColor
              ? {
                  ...row,
                  productImeiRequests: imeis,
                  inventoryQuantity: quantity,
                }
              : row
          )
          return newRows
        })
      },

      updateImage: (
        _idRam: number,
        _idRom: number,
        idColor: number,
        imageUrl: string
      ) => {
        // Cập nhật trong colorImages
        setColorImages((prev) => ({
          ...prev,
          [idColor]: imageUrl,
        }))

        // Cập nhật imageUrl trong tất cả các hàng có màu này
        // Chỉ cập nhật các hàng chưa bị xóa
        setTableRows((prev) => {
          return prev.map((row) => {
            // Kiểm tra xem hàng này đã bị xóa chưa
            const isDeleted = deletedVersions.some(
              (v) =>
                v.ram === row.idRam &&
                v.rom === row.idRom &&
                (v.color === undefined || v.color === row.idColor)
            )

            // Nếu hàng đã bị xóa, không cập nhật
            if (isDeleted) {
              return row
            }

            return row.idColor === idColor ? { ...row, imageUrl } : row
          })
        })
      },
    }),
    [colorImages, deletedVersions, tableRows]
  )

  const [isRamDialogOpen, setIsRamDialogOpen] = useState(false)
  const [isRomDialogOpen, setIsRomDialogOpen] = useState(false)
  const [isColorDialogOpen, setIsColorDialogOpen] = useState(false)
  const queryClient = useQueryClient()
  const handleRamDialogClose = async () => {
    // Invalidate and refetch brands data
    await queryClient.invalidateQueries({ queryKey: ['productAttributes'] })
    setIsRamDialogOpen(false)
  }
  const handleRomDialogClose = async () => {
    // Invalidate and refetch brands data
    await queryClient.invalidateQueries({ queryKey: ['productAttributes'] })
    setIsRomDialogOpen(false)
  }
  const handleColorDialogClose = async () => {
    // Invalidate and refetch brands data
    await queryClient.invalidateQueries({ queryKey: ['productAttributes'] })
    setIsColorDialogOpen(false)
  }
  return (
    <>
      <div className='mx-auto rounded border px-4 py-4 shadow'>
        <h1 className='mb-4 text-center text-2xl font-semibold'>
          Thông số sản phẩm
        </h1>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          <div className='grid grid-cols-6 items-center'>
            <div className='col-span-5'>
              <OptionSelector
                label='RAM'
                options={rams}
                selected={selections.rams}
                onSelect={(id) => toggleSelection('rams', id)}
              />
            </div>
            <div className='col-span-1 flex items-center pt-8'>
              <Button
                type='button'
                variant='ghost'
                className='w-4 justify-center text-sm font-normal'
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  setIsRamDialogOpen(true)
                }}
              >
                <AddIcon className='h-6 w-6' />
              </Button>
            </div>
            <RamMutateDialog
              open={isRamDialogOpen}
              onOpenChange={handleRamDialogClose}
            />
          </div>

          <div className='grid grid-cols-6 items-center'>
            <div className='col-span-5'>
              <OptionSelector
                label='ROM'
                options={roms}
                selected={selections.roms}
                onSelect={(id) => toggleSelection('roms', id)}
              />
            </div>
            <div className='col-span-1 flex items-center pt-8'>
              <Button
                type='button'
                variant='ghost'
                className='w-4 justify-center text-sm font-normal'
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  setIsRomDialogOpen(true)
                }}
              >
                <AddIcon className='h-6 w-6' />
              </Button>
            </div>
            <RomMutateDialog
              open={isRomDialogOpen}
              onOpenChange={handleRomDialogClose}
            />
          </div>
          <div className='grid grid-cols-6 items-center'>
            <div className='col-span-5'>
              <ColorSelector
                label='Màu sắc'
                options={colors}
                selected={selections.colors}
                onSelect={(ids) => {
                  // Tìm các màu mới được thêm vào
                  const newColors = ids.filter(
                    (id) => !selections.colors.includes(id)
                  )

                  // Cập nhật selections
                  setSelections((prev) => ({ ...prev, colors: ids }))

                  // Cập nhật deletedVersions nếu có màu mới
                  if (newColors.length > 0) {
                    setTimeout(() => {
                      setDeletedVersions((prev) =>
                        prev.filter((v) => !newColors.includes(v.color || -1))
                      )
                    }, 0)
                  }
                }}
              />
            </div>
            <div className='col-span-1 flex items-center pt-8'>
              <Button
                type='button'
                variant='ghost'
                className='w-4 justify-center text-sm font-normal'
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  setIsColorDialogOpen(true)
                }}
              >
                <AddIcon className='h-6 w-6' />
              </Button>
            </div>
            <ColorMutateDialog
              open={isColorDialogOpen}
              onOpenChange={handleColorDialogClose}
            />
          </div>
        </div>
        {selections.rams.map((idRam) =>
          selections.roms.map((idRom) => (
            <ProductTable
              key={`table-${idRam}-${idRom}`}
              idRam={idRam}
              idRom={idRom}
              rams={rams}
              roms={roms}
              colors={colors}
              tableRows={tableRows.filter(
                (row) => row.idRam === idRam && row.idRom === idRom
              )}
              onDeleteRow={handlers.deleteRow}
              onDeleteAll={handlers.deleteAll}
              onSetGeneralPrice={handlers.setGeneralPrice}
              onPriceChange={handlers.updatePrice}
              onAddColors={handlers.addColors}
              onAddImeis={handlers.addImeis}
              onImageChange={handlers.updateImage}
            />
          ))
        )}
      </div>
      <div className='mx-auto rounded border px-4 py-4 shadow'>
        <h1 className='mb-4 text-center text-2xl font-semibold'>
          Tải hình ảnh
        </h1>
        <div className='grid grid-cols-1 gap-4 py-4 md:grid-cols-3'>
          {uniqueColors.map((idColor) => {
            const color = colors.find((c) => c.id === idColor)
            if (!color) return null

            return (
              <div
                key={color.id}
                className='flex flex-col items-center space-y-2 border-l border-r'
              >
                <div
                  className='h-12 w-12 rounded-full'
                  style={{
                    backgroundColor: color.hex,
                    border:
                      color.name?.toLowerCase() === 'white'
                        ? '2px solid #ccc'
                        : 'none',
                  }}
                ></div>
                <ImageUploader
                  currentImage={colorImages[idColor] || ''}
                  onImageChange={(imageUrl) => {
                    // Cập nhật ảnh cho màu sắc cụ thể và tất cả các hàng có màu này
                    handlers.updateImage(0, 0, idColor, imageUrl)
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
