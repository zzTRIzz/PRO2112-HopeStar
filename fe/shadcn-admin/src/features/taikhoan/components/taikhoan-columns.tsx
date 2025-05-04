import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { TaiKhoan } from "../schema/schema"

interface TaiKhoanColumnsProps {
  onUpdateSuccess?: () => void
  onStatusChange?: (account: TaiKhoan, newStatus: boolean) => Promise<boolean>
}

export const createColumns = (props: TaiKhoanColumnsProps): ColumnDef<TaiKhoan>[] => [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Chọn tất cả"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Chọn dòng"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorFn: (_, index) => index + 1,
    header: "STT",
    cell: ({ row }) => <div className="w-[40px] text-center">{row.index + 1}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mã" />
    ),
    cell: ({ row }) => <div>{row.getValue("code")}</div>,
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Họ và tên" />
    ),
    cell: ({ row }) => <div>{row.getValue("fullName")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Số điện thoại" />
    ),
    cell: ({ row }) => <div>{row.getValue("phone")}</div>,
  },
  {
    accessorKey: "imageAvatar",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ảnh đại diện" />
    ),
    cell: ({ row }) => {
      const imageUrl = row.getValue("imageAvatar") as string
      return imageUrl ? (
        <img 
          src={imageUrl} 
          alt="Avatar" 
          className="h-8 w-8 rounded-full object-cover"
        />
      ) : (
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
          <span className="text-xs text-muted-foreground">N/A</span>
        </div>
      )
    },
  },
  {
    accessorKey: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Giới tính" />
    ),
    cell: ({ row }) => {
      // Lấy giá trị boolean từ dữ liệu
      const genderValue = row.getValue("gender") 
      // Chuyển đổi boolean sang chuỗi "Nam"/"Nữ"
      const genderDisplay = genderValue === true ? "Nam" : "Nữ"
      return <div>{genderDisplay}</div>
    },
    // Thêm filterFn để bộ lọc hoạt động đúng
    filterFn: (row, id, filterValue) => {
      // Nếu không có giá trị lọc, trả về true
      if (!filterValue || filterValue.length === 0) return true
      
      // Chuyển đổi giá trị boolean sang "Nam"/"Nữ"
      const cellValue = row.getValue(id) === true ? "Nam" : "Nữ"
      
      // Kiểm tra giá trị đã chuyển đổi có nằm trong các giá trị lọc
      return filterValue.includes(cellValue)
    },
  },
  {
    accessorKey: "birthDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày sinh" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("birthDate") as string
      if (!date) return null
      return <div>{new Date(date).toLocaleDateString('vi-VN')}</div>
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    cell: ({ row }) => {
      const StatusCell = () => {
        const account = row.original
        const [isActive, setIsActive] = useState(account.status === "ACTIVE")
        const [isUpdating, setIsUpdating] = useState(false)

        const handleStatusChange = async (checked: boolean) => {
          if (props.onStatusChange && !isUpdating) {
            setIsUpdating(true)
            try {
              const success = await props.onStatusChange(account, checked)
              if (success) {
                setIsActive(checked)
              } else {
                // Revert back if update failed
                setIsActive(!checked)
              }
            } finally {
              setIsUpdating(false)
            }
          }
        }

        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={isActive}
              disabled={isUpdating}
              onCheckedChange={handleStatusChange}
            />
            <span className={cn(
              "text-xs",
              isActive ? "text-green-600" : "text-red-600"
            )}>
              {isActive ? "Hoạt động" : "Không hoạt động"}
            </span>
          </div>
        )
      }

      return <StatusCell />
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Thao tác" />
    ),
    cell: ({ row }) => (
      <DataTableRowActions 
        row={row} 
        onUpdateSuccess={props.onUpdateSuccess} 
      />
    ),
  },
]
















