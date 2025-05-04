import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from './data-table-pagination'
import { DataTableRowActions } from './data-table-row-actions'
import { DataTableToolbar } from './data-table-toolbar'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchValue: string
  setSearchValue: (value: string) => void
  idChip: number | undefined
  setIdChip: (value: number | undefined) => void
  idBrand: number | undefined
  setIdBrand: (value: number | undefined) => void
  idScreen: number | undefined
  setIdScreen: (value: number | undefined) => void
  idCard: number | undefined
  setIdCard: (value: number | undefined) => void
  idOs: number | undefined
  setIdOs: (value: number | undefined) => void
  idWifi: number | undefined
  setIdWifi: (value: number | undefined) => void
  idBluetooth: number | undefined
  setIdBluetooth: (value: number | undefined) => void
  idBattery: number | undefined
  setIdBattery: (value: number | undefined) => void
  idCategory: number | undefined
  setIdCategory: (value: number | undefined) => void
  status: string | undefined
  setStatus: (value: string | undefined) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchValue,
  setSearchValue,
  idChip,
  setIdChip,
  idBrand,
  setIdBrand,
  idScreen,
  setIdScreen,
  idCard,
  setIdCard,
  idOs,
  setIdOs,
  idWifi,
  setIdWifi,
  idBluetooth,
  setIdBluetooth,
  idBattery,
  setIdBattery,
  idCategory,
  setIdCategory,
  status,
  setStatus,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className='space-y-4'>
      <DataTableToolbar
        table={table}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        idChip={idChip}
        setIdChip={setIdChip}
        idBrand={idBrand}
        setIdBrand={setIdBrand}
        idScreen={idScreen}
        setIdScreen={setIdScreen}
        idCard={idCard}
        setIdCard={setIdCard}
        idOs={idOs}
        setIdOs={setIdOs}
        idWifi={idWifi}
        setIdWifi={setIdWifi}
        idBluetooth={idBluetooth}
        setIdBluetooth={setIdBluetooth}
        idBattery={idBattery}
        setIdBattery={setIdBattery}
        idCategory={idCategory}
        setIdCategory={setIdCategory}
        status={status}
        setStatus={setStatus}
      />
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
                <TableHead>Thao tác</TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <DataTableRowActions row={row} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  Không có kết quả.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
