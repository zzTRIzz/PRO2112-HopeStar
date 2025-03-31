import { Row } from "@tanstack/react-table"
import { MoreHorizontal, Pen } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { TaiKhoan } from "../schema/schema"
import { useState } from "react"
import { toast } from "sonner"
import axios from "axios"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
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
import { Input } from "@/components/ui/input"

interface DataTableRowActionsProps {
  row: Row<TaiKhoan>
  onUpdateSuccess?: () => void
}

const updateFormSchema = z.object({
  fullName: z
    .string()
    .min(3, 'Họ và tên phải có ít nhất 3 ký tự')
    .max(50, 'Họ và tên không được quá 50 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  phone: z
    .string()
    .min(10, 'Số điện thoại phải có ít nhất 10 số')
    .max(15, 'Số điện thoại không được quá 15 số'),
  address: z.string().min(10, 'Địa chỉ phải có ít nhất 10 ký tự'),
  gender: z.enum(['Nam', 'Nữ']),
  birthDate: z.string(),
  status: z.enum(['ACTIVE', 'IN_ACTIVE'])
})

type UpdateFormValues = z.infer<typeof updateFormSchema>

export function DataTableRowActions({ row, onUpdateSuccess }: DataTableRowActionsProps) {
  const account = row.original
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      fullName: account.fullName,
      email: account.email,
      phone: account.phone,
      address: account.address,
      gender: account.gender ? 'Nam' : 'Nữ',
      birthDate: account.birthDate || "",
      status: account.status
    }
  })

  const handleUpdate = async (values: UpdateFormValues) => {
    setIsUpdating(true)
    try {
      const response = await axios.put(
        `http://localhost:8080/api/account/update/${account.id}`,
        {
          fullName: values.fullName,
          email: values.email,
          password: "string",
          phone: values.phone,
          address: values.address,
          googleId: "string",
          imageAvatar: account.imageAvatar,
          idRole: account.idRole.id,
          gender: values.gender === 'Nam',
          birthDate: values.birthDate,
          status: values.status
        }
      )

      if (response.data.status === 202) {
        toast.success('Đã cập nhật tài khoản thành công.')
        setIsDialogOpen(false)
        if (onUpdateSuccess) {
          onUpdateSuccess()
        }
      } else {
        throw new Error(response.data.message || 'Có lỗi xảy ra')
      }
    } catch (error: any) {
      console.error('Update error:', error)
      toast.error(error.response?.data?.message || 'Không thể cập nhật tài khoản')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Mở menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
            <Pen className="mr-2 h-4 w-4" />
            Cập nhật thông tin
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cập nhật thông tin tài khoản</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Nam">Nam</SelectItem>
                      <SelectItem value="Nữ">Nữ</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                      <SelectItem value="IN_ACTIVE">Không hoạt động</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-4 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isUpdating}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Đang cập nhật..." : "Lưu thay đổi"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
