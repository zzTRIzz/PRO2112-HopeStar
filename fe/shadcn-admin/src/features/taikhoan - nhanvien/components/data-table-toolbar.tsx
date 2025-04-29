import { Table } from "@tanstack/react-table"
import { Cross2Icon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { TaiKhoan } from "../schema/schema"

interface DataTableToolbarProps {
  table: Table<TaiKhoan>
}

const statuses = [
  {
    value: "ACTIVE",
    label: "Hoạt động",
  },
  {
    value: "IN_ACTIVE",
    label: "Không hoạt động",
  },
]

const genders = [
  {
    value: "Nam",
    label: "Nam",
  },
  {
    value: "Nữ",
    label: "Nữ",
  },
]

export function DataTableToolbar({
  table,
}: DataTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0

  const handleSearchChange = (value: string) => {
    // Kiểm tra nếu chuỗi chỉ chứa khoảng trắng hoặc rỗng
    if (value.trim() === "") {
      table.getColumn("fullName")?.setFilterValue("")
    } else {
      table.getColumn("fullName")?.setFilterValue(value)
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Tìm kiếm theo tên..."
          value={(table.getColumn("fullName")?.getFilterValue() as string) ?? ""}
          onChange={(event) => handleSearchChange(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Trạng thái"
            options={statuses}
          />
        )}
        {table.getColumn("gender") && (
          <DataTableFacetedFilter
            column={table.getColumn("gender")}
            title="Giới tính"
            options={genders}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Xóa bộ lọc
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
