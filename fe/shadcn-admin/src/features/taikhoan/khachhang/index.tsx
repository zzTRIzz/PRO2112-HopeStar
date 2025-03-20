import { useEffect, useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { DataTable } from "./components/data-table"
import { Customer, columns } from "./components/columns"
import { khachHangService } from "./services/khachHangService"
import { toast } from "sonner"

export default function KhachHangList() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      const data = await khachHangService.getList()
      setCustomers(data)
    } catch (error) {
      toast.error("Không thể tải danh sách khách hàng")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (id: number, checked: boolean) => {
    try {
      await khachHangService.updateStatus(id, checked ? "ACTIVE" : "IN_ACTIVE")
      toast.success("Cập nhật trạng thái thành công")
      await loadCustomers()
    } catch (error) {
      toast.error("Cập nhật trạng thái thất bại")
      console.error(error)
    }
  }

  const handleEdit = (customer: Customer) => {
    navigate({ 
      to: "/taikhoan/khachhang/edit/$id",
      params: { id: String(customer.id) }
    })
  }

  if (isLoading) {
    return <div>Đang tải...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Quản lý khách hàng</h1>
        <Button 
          onClick={() => navigate({ to: "/taikhoan/khachhang/add" })}
        >
          Thêm mới
        </Button>
      </div>

      <div className="rounded-md border">
        <DataTable 
          columns={columns}
          data={customers}
          meta={{
            onStatusChange: handleStatusChange,
            onEdit: handleEdit
          }}
        />
      </div>
    </div>
  )
}
