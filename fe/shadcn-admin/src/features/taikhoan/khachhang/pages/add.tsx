import { useNavigate } from "@tanstack/react-router"
import { CustomerForm } from "../components/customer-form"
import { khachHangService } from "../services/khachHangService"
import { toast } from "sonner"
import { useState } from "react"
import { CustomerFormData } from "../types"

export default function AddCustomer() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: CustomerFormData) => {
    setIsSubmitting(true)
    try {
      await khachHangService.create(data)
      toast.success("Thêm khách hàng thành công")
      navigate({ to: "/taikhoan/khachhang" })
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Thêm khách hàng thất bại")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Thêm khách hàng</h1>
      </div>

      <div className="rounded-md border p-4">
        <CustomerForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  )
}
