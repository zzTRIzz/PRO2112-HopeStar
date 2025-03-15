import { useCallback, useEffect, useMemo, useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { IconDownload, IconTrash } from '@tabler/icons-react'
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
import { ProductConfigRequest } from '../../data/schema'
import { ProductImeiRequest } from '../../data/schema'
import { AddImeiDialog } from './add-imei-dialog'
import { ImageUploader } from './upload-image'

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

  //xu ly color them
  const [isAddColorDialogOpen, setIsAddColorDialogOpen] = useState(false)
  const [selectedColorsForTable, setSelectedColorsForTable] = useState<
    number[]
  >([])

  // Khi mở Dialog "Add Color", cập nhật các màu đã được chọn trong bảng
  useEffect(() => {
    if (isAddColorDialogOpen) {
      // Only update selectedColorsForTable when the dialog opens
      const existingColorIds = filteredRows.map((row) => row.idColor)
      setSelectedColorsForTable(existingColorIds)
    }
  }, [isAddColorDialogOpen])

  // For IMEI dialog
  const [isAddImeiDialogOpen, setIsAddImeiDialogOpen] = useState(false)
  const [currentColorId, setCurrentColorId] = useState<number | null>(null)

  const filteredRows = tableRows.filter(
    (row) => row.idRam === idRam && row.idRom === idRom
  )

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
    onSetGeneralPrice(idRam, idRom, numericValue)
    setIsGeneralPriceDialogOpen(false)
  }

  const handleSelectColorForTable = (idColor: number) => {
    setSelectedColorsForTable(
      (prev) =>
        prev.includes(idColor)
          ? prev.filter((id) => id !== idColor) // Bỏ chọn nếu đã chọn
          : [...prev, idColor] // Thêm vào nếu chưa chọn
    )
  }

  const handleAddColorsToTable = () => {
    // Gọi hàm từ component cha để cập nhật tableRows
    onAddColors(idRam, idRom, selectedColorsForTable)
    setIsAddColorDialogOpen(false) // Đóng Dialog
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
              Version {rams.find((r) => r.id === idRam)?.capacity} /{' '}
              {roms.find((r) => r.id === idRom)?.capacity}GB
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
                  onClick={() => onDeleteAll(idRam, idRom)}
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
            <TableRow key={`${row.idRam}-${row.idRom}-${row.idColor}`}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>
                {colors.find((c) => c.id === row.idColor)?.name}
              </TableCell>
              <TableCell>{row.inventoryQuantity || 0}</TableCell>
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
        onOpenChange={(open) => {
          setIsAddColorDialogOpen(open)
          // Don't update selectedColorsForTable here
        }}
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
                    // Remove any onCheckedChange handler here that might be causing updates
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
  const { append, remove } = useFieldArray({
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
      imageUrl?: string
    }[]
  >([])

  const [uniqueColors, setUniqueColors] = useState<number[]>([])
  const [colorImages, setColorImages] = useState<{ [key: number]: string }>({})

  useEffect(() => {
    const colorIds = tableRows.map((row) => row.idColor)
    const uniqueColorIds = Array.from(new Set(colorIds)) // Loại bỏ các màu sắc trùng lặp
    setUniqueColors(uniqueColorIds)
  }, [tableRows])

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

  const generateTableRows = useCallback(() => {
    if (!selections.rams.length || !selections.roms.length) {
      return []
    }
    return selections.rams.flatMap((idRam) =>
      selections.roms.flatMap((idRom) =>
        selections.colors.length
          ? selections.colors.map((idColor) => ({
              idRam,
              idRom,
              idColor,
              price: 0,
            }))
          : [{ idRam, idRom, idColor: -1, price: 0 }]
      )
    )
  }, [selections])

  useEffect(() => {
    const newRows = generateTableRows()
    const mergedRows = newRows.map((newRow) => {
      const existing = tableRows.find(
        (row) =>
          row.idRam === newRow.idRam &&
          row.idRom === newRow.idRom &&
          row.idColor === newRow.idColor
      )
      return existing || newRow
    })
    setTableRows(mergedRows)
    onTableRowsChange(mergedRows)
  }, [selections, generateTableRows, onTableRowsChange])

  const handlers = useMemo(
    () => ({
      deleteRow: (idRam: number, idRom: number, idColor: number) => {
        setTableRows((prev) =>
          prev.filter(
            (row) =>
              !(
                row.idRam === idRam &&
                row.idRom === idRom &&
                row.idColor === idColor
              )
          )
        )
      },
      deleteAll: (idRam: number, idRom: number) => {
        setTableRows((prev) =>
          prev.filter((row) => !(row.idRam === idRam && row.idRom === idRom))
        )
      },
      setGeneralPrice: (idRam: number, idRom: number, price: number) => {
        setTableRows((prev) =>
          prev.map((row) =>
            row.idRam === idRam && row.idRom === idRom ? { ...row, price } : row
          )
        )
      },
      updatePrice: (
        idRam: number,
        idRom: number,
        idColor: number,
        price: number
      ) => {
        setTableRows((prev) =>
          prev.map((row) =>
            row.idRam === idRam &&
            row.idRom === idRom &&
            row.idColor === idColor
              ? { ...row, price }
              : row
          )
        )
      },
      addColors: (idRam: number, idRom: number, colorIds: number[]) => {
        setTableRows((prev) => {
          const existing = prev.filter(
            (row) => !(row.idRam === idRam && row.idRom === idRom)
          )
          const newRows = colorIds.map((idColor) => ({
            idRam,
            idRom,
            idColor,
            price: 0,
          }))
          return [...existing, ...newRows]
        })
      },
      addImeis: (
        idRam: number,
        idRom: number,
        idColor: number,
        imeis: ProductImeiRequest[],
        quantity: number
      ) => {
        setTableRows((prev) =>
          prev.map((row) =>
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
        )
      },

      updateImage: (
        idRam: number,
        idRom: number,
        idColor: number,
        imageUrl: string
      ) => {
        setColorImages((prev) => ({
          ...prev,
          [idColor]: imageUrl,
        }))
      },
    }),
    []
  )

  return (
    <>
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
      <div className='mx-auto rounded border px-4 py-4'>
        <h1 className='mb-4 text-center text-2xl font-semibold'>
          Upload hình ảnh
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
                    // Cập nhật ảnh cho màu sắc cụ thể
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
