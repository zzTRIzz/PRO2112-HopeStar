import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { IconDownload, IconTrash } from '@tabler/icons-react'
import * as XLSX from 'xlsx'
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
import { ProductConfigRequest } from './data/schema'

// Hàm định dạng số với dấu phẩy ngăn cách hàng nghìn
const formatNumberWithCommas = (value: number | string): string => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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
}

interface ProductDetailFormProps {
  rams?: Option[]
  roms?: Option[]
  colors?: Option[]
  onTableRowsChange: (
    rows: { ramId: number; romId: number; colorId: number; price: number }[]
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
          <Button variant='outline' className='w-full justify-between'>
            {selected.length > 0
              ? selected
                  .map(
                    (id) =>
                      options.find((o) => o.id === id)?.capacity ||
                      options.find((o) => o.id === id)?.name
                  )
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
                <span>
                  {option.capacity ? `${option.capacity}GB` : option.name}
                </span>
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

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant='outline' className='w-full justify-between'>
            {selected.length > 0
              ? selected
                  .map((id) => options.find((o) => o.id === id)?.name)
                  .join(', ')
              : label}
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Select {label}</DialogTitle>
            <DialogDescription>Click save when you're done.</DialogDescription>
          </DialogHeader>
          <ScrollArea className='w-full'>
            <div className='flex space-x-4 pb-4'>
              {options.map((option) => (
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
          <div className='mt-4 flex justify-end'>
            <Button onClick={handleConfirm}>Cài đặt</Button>
          </div>
        </DialogContent>
      </Dialog>
      <FormMessage />
    </FormItem>
  )
}

interface ProductTableProps {
  ramId: number
  romId: number
  rams: Option[]
  roms: Option[]
  colors: Option[]
  tableRows: { ramId: number; romId: number; colorId: number; price: number }[]
  onDeleteRow: (ramId: number, romId: number, colorId: number) => void
  onDeleteAll: (ramId: number, romId: number) => void
  onSetGeneralPrice: (ramId: number, romId: number, price: number) => void
  onPriceChange: (
    ramId: number,
    romId: number,
    colorId: number,
    price: number
  ) => void
  onAddColors: (ramId: number, romId: number, colorIds: number[]) => void // Thêm prop mới
}

//imei
const AddImeiDialog: React.FC<{
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onFileUpload: (
    file: File,
    ramId: number,
    romId: number,
    colorId: number
  ) => void
  ramId: number
  romId: number
  colorId: number
}> = ({ isOpen, onOpenChange, onFileUpload, ramId, romId, colorId }) => {
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    if (file) {
      onFileUpload(file, ramId, romId, colorId) // Truyền ramId, romId, và colorId
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload IMEI File</DialogTitle>
          <DialogDescription>
            Please select a file containing IMEI numbers.
          </DialogDescription>
        </DialogHeader>
        <Input type='file' accept='.csv, .xlsx' onChange={handleFileChange} />
        <Button onClick={handleUpload} disabled={!file}>
          Upload
        </Button>
      </DialogContent>
    </Dialog>
  )
}

const ProductTable: React.FC<ProductTableProps> = ({
  ramId,
  romId,
  rams,
  roms,
  colors,
  tableRows,
  onDeleteRow,
  onDeleteAll,
  onSetGeneralPrice,
  onPriceChange,
  onAddColors, // Nhận prop mới
}) => {
  const { control } = useFormContext<ProductConfigRequest>()
  const [isChecked, setIsChecked] = useState<boolean>(false)
  const [isGeneralPriceDialogOpen, setIsGeneralPriceDialogOpen] =
    useState(false)
  const [isAddColorDialogOpen, setIsAddColorDialogOpen] = useState(false)
  const [generalPrice, setGeneralPrice] = useState<string>('')
  const [selectedColorsForTable, setSelectedColorsForTable] = useState<
    number[]
  >([])

  const [isAddImeiDialogOpen, setIsAddImeiDialogOpen] = useState(false)

  const handleFileUpload = (
    file: File,
    ramId: number,
    romId: number,
    colorId: number
  ) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = e.target?.result
      if (data) {
        const workbook = XLSX.read(data, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

        const imeis = jsonData
          .map((row: any) => row[0])
          .filter((imei: any) => imei)

        console.log('IMEI Data:', imeis)

        // Cập nhật tableRows với IMEI và số lượng
        setTableRows((prevRows) =>
          prevRows.map((row) => {
            if (
              row.ramId === ramId &&
              row.romId === romId &&
              row.colorId === colorId
            ) {
              return {
                ...row,
                productImeiRequests: imeis.map((imei) => ({ imei })),
                inventoryQuantity: imeis.length,
              }
            }
            return row
          })
        )
      }
    }
    reader.readAsBinaryString(file)
  }

  const filteredRows = tableRows.filter(
    (row) => row.ramId === ramId && row.romId === romId
  )

  // Khi mở Dialog "Add Color", cập nhật các màu đã được chọn trong bảng
  useEffect(() => {
    if (isAddColorDialogOpen) {
      // Lấy danh sách các màu đã có trong bảng
      const existingColorIds = filteredRows.map((row) => row.colorId)
      setSelectedColorsForTable(existingColorIds)
    }
  }, [isAddColorDialogOpen]) // Chỉ chạy khi `isAddColorDialogOpen` thay đổi

  if (filteredRows.length === 0) {
    return null
  }

  const handleGeneralPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, '')
    const numericValue = Number(rawValue)
    if (!isNaN(numericValue)) {
      setGeneralPrice(formatNumberWithCommas(rawValue))
    }
  }

  const handleSetGeneralPrice = () => {
    const numericValue = parseFormattedNumber(generalPrice)
    onSetGeneralPrice(ramId, romId, numericValue)
    setIsGeneralPriceDialogOpen(false)
  }

  const handleSelectColorForTable = (colorId: number) => {
    setSelectedColorsForTable(
      (prev) =>
        prev.includes(colorId)
          ? prev.filter((id) => id !== colorId) // Bỏ chọn nếu đã chọn
          : [...prev, colorId] // Thêm vào nếu chưa chọn
    )
  }

  const handleAddColorsToTable = () => {
    // Gọi hàm từ component cha để cập nhật tableRows
    onAddColors(ramId, romId, selectedColorsForTable)
    setIsAddColorDialogOpen(false) // Đóng Dialog
  }

  return (
    <>
      <Table key={`table-${ramId}-${romId}`} className='mt-10 rounded border'>
        <TableHeader>
          <TableRow>
            <TableHead colSpan={2} className='h-16 py-2 text-xl'>
              <Checkbox
                checked={isChecked}
                onCheckedChange={() => setIsChecked(!isChecked)}
              />
              Version {rams.find((r) => r.id === ramId)?.capacity} /{' '}
              {roms.find((r) => r.id === romId)?.capacity}GB
            </TableHead>
            {isChecked && (
              <TableHead colSpan={4} className='space-x-2 py-2 text-right'>
                <Button
                  className='bg-blue-500 hover:bg-blue-600'
                  onClick={() => setIsAddColorDialogOpen(true)}
                >
                  Add color
                </Button>
                <Button
                  className='bg-blue-500 hover:bg-blue-600'
                  onClick={() => setIsGeneralPriceDialogOpen(true)}
                >
                  General price
                </Button>
                <Button
                  className='bg-red-500 hover:bg-red-600'
                  onClick={() => onDeleteAll(ramId, romId)}
                >
                  Delete all
                </Button>
              </TableHead>
            )}
          </TableRow>
          <TableRow>
            <TableHead>STT</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRows.map((row, index) => (
            <TableRow key={`${row.ramId}-${row.romId}-${row.colorId}`}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>
                {colors.find((c) => c.id === row.colorId)?.name}
              </TableCell>
              <TableCell>0</TableCell>
              <TableCell>
                <FormControl>
                  <input
                    type='text'
                    className='w-26 h-8 rounded border'
                    placeholder='Price'
                    value={formatNumberWithCommas(row.price)}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/,/g, '')
                      const numericValue = Number(rawValue)
                      if (!isNaN(numericValue)) {
                        onPriceChange(ramId, romId, row.colorId, numericValue)
                      }
                    }}
                  />
                </FormControl>
              </TableCell>
              <TableCell className='space-x-2'>
                <Button
                  className='bg-blue-500 hover:bg-blue-600'
                  onClick={() => setIsAddImeiDialogOpen(true)} // Mở dialog khi click
                >
                  <IconDownload stroke={3} />
                </Button>
                {/* Dialog để thêm IMEI */}
                <AddImeiDialog
                  isOpen={isAddImeiDialogOpen}
                  onOpenChange={setIsAddImeiDialogOpen}
                  onFileUpload={handleFileUpload}
                  ramId={ramId}
                  romId={romId}
                  colorId={row.colorId} // Truyền colorId từ hàng hiện tại
                />
                <Button
                  className='bg-red-500 hover:bg-red-600'
                  onClick={() => onDeleteRow(ramId, romId, row.colorId)}
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
            <DialogTitle>Set General Price</DialogTitle>
            <DialogDescription>Click save when you're done.</DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <Input
              type='text'
              placeholder='Enter general price'
              value={generalPrice}
              onChange={handleGeneralPriceChange}
            />
            <Button onClick={handleSetGeneralPrice}>Cài đặt</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog để thêm màu vào bảng */}
      <Dialog
        open={isAddColorDialogOpen}
        onOpenChange={setIsAddColorDialogOpen}
      >
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Add Color</DialogTitle>
            <DialogDescription>Click save when you're done.</DialogDescription>
          </DialogHeader>
          <ScrollArea className='w-full'>
            <div className='flex space-x-4 pb-4'>
              {colors.map((color) => (
                <div
                  key={color.id}
                  className='flex cursor-pointer flex-col items-center space-y-2 p-2 hover:bg-gray-100'
                  onClick={() => handleSelectColorForTable(color.id)}
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
                    checked={selectedColorsForTable.includes(color.id)}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className='mt-4 flex justify-end'>
            <Button onClick={handleAddColorsToTable}>Cài đặt</Button>
          </div>
        </DialogContent>
      </Dialog>
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
  const { append, remove } = useFieldArray({
    control,
    name: 'productDetailRequests',
  })

  // Gộp các trạng thái lựa chọn vào một object để quản lý dễ hơn
  const [selections, setSelections] = useState({
    rams: [] as number[],
    roms: [] as number[],
    colors: [] as number[],
  })

  const [tableRows, setTableRows] = useState<
    { ramId: number; romId: number; colorId: number; price: number }[]
  >([])

  // Tối ưu hóa hàm toggleSelection với useCallback
  const toggleSelection = useCallback(
    (type: 'rams' | 'roms' | 'colors', id: number) => {
      setSelections((prev) => ({
        ...prev,
        [type]: prev[type].includes(id)
          ? prev[type].filter((item) => item !== id)
          : [...prev[type], id],
      }))
    },
    []
  )

  // Memoize việc tạo table rows
  const generateTableRows = useCallback(() => {
    if (!selections.rams.length || !selections.roms.length) {
      return []
    }
    return selections.rams.flatMap((ramId) =>
      selections.roms.flatMap((romId) =>
        selections.colors.length
          ? selections.colors.map((colorId) => ({
              ramId,
              romId,
              colorId,
              price: 0,
            }))
          : [{ ramId, romId, colorId: -1, price: 0 }]
      )
    )
  }, [selections])

  // Cập nhật tableRows khi selections thay đổi
  useEffect(() => {
    const newRows = generateTableRows()
    const mergedRows = newRows.map((newRow) => {
      const existing = tableRows.find(
        (row) =>
          row.ramId === newRow.ramId &&
          row.romId === newRow.romId &&
          row.colorId === newRow.colorId
      )
      return existing || newRow
    })
    setTableRows(mergedRows)
    onTableRowsChange(mergedRows)
  }, [selections, generateTableRows, onTableRowsChange])

  // Gộp các hàm xử lý vào một object memoized
  const handlers = useMemo(
    () => ({
      deleteRow: (ramId: number, romId: number, colorId: number) => {
        setTableRows((prev) =>
          prev.filter(
            (row) =>
              !(
                row.ramId === ramId &&
                row.romId === romId &&
                row.colorId === colorId
              )
          )
        )
      },
      deleteAll: (ramId: number, romId: number) => {
        setTableRows((prev) =>
          prev.filter((row) => !(row.ramId === ramId && row.romId === romId))
        )
      },
      setGeneralPrice: (ramId: number, romId: number, price: number) => {
        setTableRows((prev) =>
          prev.map((row) =>
            row.ramId === ramId && row.romId === romId ? { ...row, price } : row
          )
        )
      },
      updatePrice: (
        ramId: number,
        romId: number,
        colorId: number,
        price: number
      ) => {
        setTableRows((prev) =>
          prev.map((row) =>
            row.ramId === ramId &&
            row.romId === romId &&
            row.colorId === colorId
              ? { ...row, price }
              : row
          )
        )
      },
      addColors: (ramId: number, romId: number, colorIds: number[]) => {
        setTableRows((prev) => {
          const existing = prev.filter(
            (row) => !(row.ramId === ramId && row.romId === romId)
          )
          const newRows = colorIds.map((colorId) => ({
            ramId,
            romId,
            colorId,
            price: 0,
          }))
          return [...existing, ...newRows]
        })
      },
    }),
    []
  )

  return (
    <div className='mx-auto rounded border px-4 py-4'>
      <h1 className='mb-4 text-center text-2xl font-semibold'>
        Thông số sản phẩm
      </h1>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <OptionSelector
          label='RAM'
          options={rams}
          selected={selections.rams}
          onSelect={(id) => toggleSelection('rams', id)}
        />
        <OptionSelector
          label='ROM'
          options={roms}
          selected={selections.roms}
          onSelect={(id) => toggleSelection('roms', id)}
        />
        <ColorSelector
          label='Màu sắc'
          options={colors}
          selected={selections.colors}
          onSelect={(ids) =>
            setSelections((prev) => ({ ...prev, colors: ids }))
          }
        />
      </div>
      {selections.rams.map((ramId) =>
        selections.roms.map((romId) => (
          <ProductTable
            key={`table-${ramId}-${romId}`}
            ramId={ramId}
            romId={romId}
            rams={rams}
            roms={roms}
            colors={colors}
            tableRows={tableRows.filter(
              (row) => row.ramId === ramId && row.romId === romId
            )}
            onDeleteRow={handlers.deleteRow}
            onDeleteAll={handlers.deleteAll}
            onSetGeneralPrice={handlers.setGeneralPrice}
            onPriceChange={handlers.updatePrice}
            onAddColors={handlers.addColors}
          />
        ))
      )}
    </div>
  )
}
