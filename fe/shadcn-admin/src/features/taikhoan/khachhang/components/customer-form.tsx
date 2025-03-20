import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AddressForm } from "./address-form"
import { CustomerFormData } from "../types"

const formSchema = z.object({
  fullName: z
    .string()
    .min(3, 'Họ và tên phải có ít nhất 3 ký tự')
    .max(50, 'Họ và tên không được quá 50 ký tự')
    .regex(/^[\p{L}\s]+$/u, 'Họ tên chỉ được chứa chữ cái và khoảng trắng'),

  email: z
    .string()
    .email('Email không hợp lệ')
    .min(5, 'Email phải có ít nhất 5 ký tự'),

  phone: z
    .string()
    .min(10, 'Số điện thoại phải có ít nhất 10 số')
    .max(15, 'Số điện thoại không được quá 15 số')
    .regex(/^[0-9+]+$/, 'Số điện thoại chỉ được chứa số và dấu +'),

  gender: z.boolean(),

  birthDate: z.string().refine((date) => {
    if (!date) return false
    const birthDate = new Date(date)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--
    }
    return age >= 15
  }, 'Người dùng phải đủ 15 tuổi'),

  // Address fields
  province: z.string().min(1, "Vui lòng chọn tỉnh/thành phố"),
  district: z.string().min(1, "Vui lòng chọn quận/huyện"),
  ward: z.string().min(1, "Vui lòng chọn phường/xã"),
  street: z.string().min(1, "Vui lòng nhập địa chỉ cụ thể"),
  address: z.string(),

  status: z.enum(["ACTIVE", "IN_ACTIVE"]).default("ACTIVE"),
})

export type CustomerFormValues = z.infer<typeof formSchema>

interface CustomerFormProps {
  initialData?: Partial<CustomerFormValues>
  onSubmit: (data: CustomerFormData) => void
  isSubmitting?: boolean
}

export function CustomerForm({ 
  initialData,
  onSubmit,
  isSubmitting = false
}: CustomerFormProps) {
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      status: "ACTIVE",
      gender: true,
      address: "",
      province: "",
      district: "",
      ward: "",
      street: ""
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ và tên</FormLabel>
                <FormControl>
                  <Input placeholder="Nguyễn Văn A" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giới tính</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(value === "true")}
                  defaultValue={field.value ? "true" : "false"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="true">Nam</SelectItem>
                    <SelectItem value="false">Nữ</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@gmail.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input placeholder="0123456789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngày sinh</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <AddressForm form={form} />

        <div className="flex justify-end space-x-4">
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
