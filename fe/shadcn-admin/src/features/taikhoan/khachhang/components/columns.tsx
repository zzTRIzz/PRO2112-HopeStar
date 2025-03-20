import { ColumnDef } from "@tanstack/react-table"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { format } from "date-fns";

// Customer interface based on API response
export interface Customer {
  id: number
  fullName: string
  code: string
  email: string
  phone: string
  address: string
  gender: boolean
  birthDate: string
  status: "ACTIVE" | "IN_ACTIVE"
  imageAvatar: string
}

export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "code",
    header: "Mã",
  },
  {
    accessorKey: "fullName",
    header: "Họ và tên",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Số điện thoại",
  },
  {
    accessorKey: "gender",
    header: "Giới tính",
    cell: ({ row }) => (
      <div>{row.original.gender ? "Nam" : "Nữ"}</div>
    ),
  },
  {
    accessorKey: "birthDate",
    header: "Ngày sinh",
    cell: ({ row }) => {
      return format(new Date(row.original.birthDate), "dd/MM/yyyy")
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row, table }) => {
      const isActive = row.original.status === "ACTIVE"
      return (
        <Switch
          checked={isActive}
          onCheckedChange={(checked) => {
            if (table.options.meta?.onStatusChange) {
              table.options.meta.onStatusChange(row.original.id, checked)
            }
          }}
        />
      )
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row, table }) => {
      return (
        <Button
          variant="link"
          onClick={() => {
            if (table.options.meta?.onEdit) {
              table.options.meta.onEdit(row.original)
            }
          }}
        >
          Chỉnh sửa
        </Button>
      )
    }
  }
]
