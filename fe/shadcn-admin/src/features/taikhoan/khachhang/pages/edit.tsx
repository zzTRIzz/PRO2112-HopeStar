import { useNavigate, useParams } from "@tanstack/react-router"
import { CustomerForm, CustomerFormValues } from "../components/customer-form"
import { khachHangService } from "../services/khachHangService"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { CustomerFormData as CustomerFormDataType, CustomerResponse } from "../types"

type EditCustomerFormData = CustomerFormValues

export default function EditCustomer() {
  const navigate = useNavigate()
  const { id } = useParams({ from: "/_authenticated/taikhoan/khachhang/edit/$id" })
  const [formData, setFormData] = useState<EditCustomerFormData>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        const data = await khachHangService.getById(Number(id))
        
        // Extract address components if they exist
        const addressParts = data.address?.split(", ") || ["", "", "", ""]
        const [street = "", ward = "", district = "", province = ""] = addressParts.reverse()

        setFormData({
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          gender: data.gender,
          birthDate: data.birthDate,
          status: data.status,
          address: data.address,
          province,
          district,
          ward,
          street,
        })
      } catch (error) {
        toast.error("Không thể tải thông tin khách hàng")
        navigate({ to: "/taikhoan/khachhang" })
      } finally {
        setIsLoading(false)
      }
    }
    loadCustomer()
  }, [id, navigate])

  const handleSubmit = async (data: CustomerFormDataType) => {
    setIsSubmitting(true)
    try {
      await khachHangService.update(Number(id), data)
      toast.success("Cập nhật thông tin thành công")
      navigate({ to: "/taikhoan/khachhang" })
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Cập nhật thất bại")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div>Đang tải...</div>
  }

  if (!formData) {
    return null
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Chỉnh sửa khách hàng</h1>
      </div>

      <div className="rounded-md border p-4">
        <CustomerForm
          initialData={formData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  )
}
