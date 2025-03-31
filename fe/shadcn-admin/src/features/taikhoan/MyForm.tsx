'use client'

import { useEffect, useState } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarDate } from '@internationalized/date'
import { CalendarIcon } from 'lucide-react'
import axios from 'axios'
import {
  Button as Buttons,
  DatePicker,
  Dialog,
  Group,
  Label,
  Popover,
} from 'react-aria-components'
import { toast, Toaster } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar-rac'
import { DateInput } from '@/components/ui/datefield-rac'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { TaiKhoan } from './schema/schema'
import { createColumns } from './components/taikhoan-columns'
import { TaiKhoanTable } from './components/taikhoan-table'
import { AddressSelect } from '../tinhthanh/components/AddressSelect'


// Hàm tạo mật khẩu ngẫu nhiên
// function generateRandomPassword(length = 12) {
//   const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
//   const lowercase = 'abcdefghijklmnopqrstuvwxyz'
//   const numbers = '0123456789'
//   const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'
//   const allChars = uppercase + lowercase + numbers + specialChars

//   let password = ''
//   password += uppercase[Math.floor(Math.random() * uppercase.length)]
//   password += lowercase[Math.floor(Math.random() * lowercase.length)]
//   password += numbers[Math.floor(Math.random() * numbers.length)]
//   password += specialChars[Math.floor(Math.random() * specialChars.length)]

//   for (let i = password.length; i < length; i++) {
//     password += allChars[Math.floor(Math.random() * allChars.length)]
//   }

//   password = password
//     .split('')
//     .sort(() => Math.random() - 0.5)
//     .join('')

//   return password
// }



const formSchema = z.object({
  fullName: z
    .string()
    .min(3, 'Họ và tên phải có ít nhất 3 ký tự')
    .max(50, 'Họ và tên không được quá 50 ký tự')
    .regex(/^[\p{L}\s]+$/u, 'Họ tên chỉ được chứa chữ cái và khoảng trắng'),
  gender: z.enum(['Nam', 'Nữ', 'Khác'], {
    required_error: 'Vui lòng chọn giới tính',
  }),
  email: z
    .string()
    .email('Email không hợp lệ')
    .min(5, 'Email phải có ít nhất 5 ký tự'),
  // password: z.string().default(generateRandomPassword(8)),
  phone: z
    .string()
    .min(10, 'Số điện thoại phải có ít nhất 10 số')
    .max(15, 'Số điện thoại không được quá 15 số')
    .regex(/^[0-9+]+$/, 'Số điện thoại chỉ được chứa số và dấu +'),
  address: z
    .string()
    .min(10, 'Địa chỉ phải có ít nhất 10 ký tự')
    .max(200, 'Địa chỉ không được quá 200 ký tự'),
  birthDate: z.string().refine(
    (date) => {
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
    },
    'Người dùng phải đủ 15 tuổi'
  ),
  status: z.enum(['ACTIVE', 'IN_ACTIVE']).default('ACTIVE'),
  googleId: z.string().default('string'),
  imageAvatar: z.string().default('https://thumbs.dreamstime.com/b/creative-illustration-default-avatar-profile-placeholder-isolated-background-art-design-grey-photo-blank-template-mockup-144857620.jpg',),
})

type FormData = z.infer<typeof formSchema>

export default function MyForm() {
  const [accounts, setAccounts] = useState<TaiKhoan[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [fullAddress, setFullAddress] = useState<string>('')

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: 'ACTIVE',
      // password: 'string',
      googleId: 'string',
      imageAvatar:
        'https://thumbs.dreamstime.com/b/creative-illustration-default-avatar-profile-placeholder-isolated-background-art-design-grey-photo-blank-template-mockup-144857620.jpg',
    },
  })

  // Cập nhật trường address trong form khi fullAddress thay đổi
  useEffect(() => {
    form.setValue('address', fullAddress)
  }, [fullAddress, form])

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/account/list-khach-hang')
      if (response.status === 200) {
        const accountsData = response.data.data.map((acc: any) => ({
          ...acc,
          status: acc.status === 'ACTIVE' ? 'ACTIVE' : 'IN_ACTIVE',
        })) as TaiKhoan[]
        setAccounts(accountsData)
      }
    } catch (error) {
      console.error('Error fetching accounts:', error)
      toast.error('Không thể tải dữ liệu tài khoản.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (account: TaiKhoan, newStatus: boolean) => {
    try {
      // Convert gender string to boolean
      let genderValue = false;
      if (account.gender === 'Nam') {
        genderValue = true;
      }

      const response = await axios.put(
        `http://localhost:8080/api/account/update/${account.id}`,
        {
          fullName: account.fullName,
          email: account.email,
          // password: 'string',
          phone: account.phone,
          address: account.address,
          googleId: 'string',
          imageAvatar: account.imageAvatar,
          idRole: 4,
          gender: genderValue, // Send as boolean instead of string
          birthDate: account.birthDate,
          status: newStatus ? 'ACTIVE' : 'IN_ACTIVE',
        }
      )

      if (response.data.status === 202) {
        toast.success('Đã cập nhật trạng thái tài khoản.')
        const updatedAccounts = accounts.map((acc) =>
          acc.id === account.id
            ? { ...acc, status: newStatus ? 'ACTIVE' : 'IN_ACTIVE' }
            : acc
        ) as TaiKhoan[]
        setAccounts(updatedAccounts)
        return true
      }
      toast.error('Không thể cập nhật trạng thái')
      return false
    } catch (error: any) {
      console.error('Status update error:', error)
      const errorMessage = error.response?.data?.message || 'Không thể cập nhật trạng thái'
      toast.error(errorMessage)
      return false
    }
  }

  useEffect(() => {
    fetchAccounts()
  }, [])

  async function onSubmit(values: FormData) {
    setIsSubmitting(true)
    try {
      // Format lại ngày sinh sang ISO 8601 
      const formattedBirthDate = new Date(values.birthDate).toISOString();

      // Convert gender string to boolean expected by backend
      let genderValue = false;
      if (values.gender === 'Nam') {
        genderValue = true;
      }

      const payload = {
        ...values,
        birthDate: formattedBirthDate.split('T')[0],
        idRole: 4,
        gender: genderValue, // Send as boolean instead of string
        googleId: 'string',
        imageAvatar: 'https://thumbs.dreamstime.com/b/creative-illustration-default-avatar-profile-placeholder-isolated-background-art-design-grey-photo-blank-template-mockup-144857620.jpg'
      }

      console.log('Sending payload:', payload)

      const config = {
        headers: {
          'Content-Type': 'application/json',
        }
      };

      const response = await axios.post(
        'http://localhost:8080/api/account/add', 
        payload,
        config
      )

      if (response.data) {
        toast.success('Đã tạo tài khoản mới.')
        form.reset({
          fullName: '',
          email: '',
          phone: '',
          address: '',
          gender: undefined,
          birthDate: undefined,
          status: 'ACTIVE',
          // password: 'string',
          googleId: 'string',
          imageAvatar: 'string',
        })
        await fetchAccounts()
      } else {
        throw new Error(response.data?.message || 'Có lỗi xảy ra')
      }
    } catch (error: any) {
      console.error('Form submission error:', error)
      
      // Xử lý các loại lỗi cụ thể
      if (error.response) {
        // Lỗi từ server
        const message = error.response.data?.message || 'Lỗi server';
        toast.error(`Lỗi: ${message}`);
      } else if (error.request) {
        // Lỗi kết nối
        toast.error('Không thể kết nối đến server. Vui lòng kiểm tra lại kết nối.');
      } else {
        // Lỗi khác
        toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto max-w-3xl space-y-8 py-10">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <Input placeholder="VD: Nguyễn Văn A" type="text" {...field} />
                    </FormControl>
                    <FormDescription>Nhập đẩy đủ họ và tên</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-6">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giới tính</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Vui lòng chọn giới tính" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Nam">Nam</SelectItem>
                        <SelectItem value="Nữ">Nữ</SelectItem>
                        <SelectItem value="Khác">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Vui lòng chọn giới tính</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="nguyenvana@gmail.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="0912345678" type="string" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-4">
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày sinh</FormLabel>
                    <DatePicker
                      value={
                        field.value
                          ? (() => {
                              const [year, month, day] = field.value.split('-').map(Number)
                              return new CalendarDate(year, month, day)
                            })()
                          : null
                      }
                      onChange={(date) => {
                        if (date) {
                          const formattedDate = `${date.year}-${String(date.month).padStart(
                            2,
                            '0'
                          )}-${String(date.day).padStart(2, '0')}`
                          field.onChange(formattedDate)
                        } else {
                          field.onChange(null)
                        }
                      }}
                    >
                      <div className="flex">
                        <Group className="w-full">
                          <DateInput className="pe-9" />
                        </Group>
                        <Buttons className="data-focus-visible:border-ring data-focus-visible:ring-ring/50 data-focus-visible:ring-[3px] z-10 -me-px -ms-9 flex w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground">
                          <CalendarIcon size={16} />
                        </Buttons>
                      </div>
                      <Popover className="data-entering:animate-in data-exiting:animate-out outline-hidden z-50 rounded-lg border bg-background text-popover-foreground shadow-lg data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2">
                        <Dialog className="max-h-[inherit] overflow-auto p-2">
                          <Calendar />
                        </Dialog>
                      </Popover>
                    </DatePicker>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Thay thế trường address bằng AddressSelect */}
          <AddressSelect onAddressChange={setFullAddress} />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Trạng thái</FormLabel>
                  <FormDescription>
                    Bật để kích hoạt tài khoản (Mặc định: Hoạt động)
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value === 'ACTIVE'}
                    onCheckedChange={(checked) =>
                      field.onChange(checked ? 'ACTIVE' : 'IN_ACTIVE')
                    }
                    aria-readonly
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Toaster />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Đang xử lý...' : 'Thêm mới tài khoản'}
          </Button>
        </form>
      </Form>

      <div className="mx-auto my-8 w-full max-w-full space-y-4 p-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Danh sách khách hàng</h2>
          <p className="text-muted-foreground">
            Quản lý danh sách khách hàng.
          </p>
        </div>
        {isLoading ? (
          <div className="text-center py-4">Đang tải dữ liệu...</div>
        ) : (
          <TaiKhoanTable
            data={accounts}
            columns={createColumns({
              onUpdateSuccess: async () => {
                await fetchAccounts()
              },
              onStatusChange: handleStatusChange,
            })}
          />
        )}
      </div>
    </>
  )
}
