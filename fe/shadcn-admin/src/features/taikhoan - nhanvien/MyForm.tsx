'use client'

import { useEffect, useState } from 'react'
import * as z from 'zod'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarDate } from '@internationalized/date'
import { CalendarIcon } from 'lucide-react'
import {
  Button as Buttons,
  DatePicker,
  Dialog,
  Group,
  Label as RacLabel,
  Popover,
} from 'react-aria-components'
import { toast, Toaster } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar-rac'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Province, District, Ward } from '../tinhthanh/schema/types'
import { createColumns } from './components/taikhoan-columns'
import { TaiKhoanTable } from './components/taikhoan-table'
import { TaiKhoan } from './schema/schema'
import { code } from '@heroui/react'
import Cookies from 'js-cookie'

// const formSchema = z.object({
//   fullName: z
//     .string()
//     .min(3, 'Họ và tên phải có ít nhất 3 ký tự')
//     .max(50, 'Họ và tên không được quá 50 ký tự')
//     .regex(/^[\p{L}\s]+$/u, 'Họ tên chỉ được chứa chữ cái và khoảng trắng'),
//   gender: z.enum(['Nam', 'Nữ', 'Khác'], {
//     required_error: 'Vui lòng chọn giới tính',
//   }),
//   email: z
//     .string()
//     .email('Email không hợp lệ')
//     .min(5, 'Email phải có ít nhất 5 ký tự'),
//   phone: z
//     .string()
//     .min(10, 'Số điện thoại phải có ít nhất 10 số')
//     .max(15, 'Số điện thoại không được quá 15 số')
//     .regex(/^[0-9+]+$/, 'Số điện thoại chỉ được chứa số và dấu +')
//     .regex(/^(?:\+?84|0[35789])[0-9]{8}$/, 'Số điện thoại không đúng định dạng'),
//   address: z
//     .string()
//     .min(10, 'Địa chỉ phải có ít nhất 10 ký tự')
//     .max(200, 'Địa chỉ không được quá 200 ký tự'),
//   birthDate: z.string().refine((date) => {
//     if (!date) return false
//     const birthDate = new Date(date)
//     const today = new Date()
//     let age = today.getFullYear() - birthDate.getFullYear()
//     const monthDiff = today.getMonth() - birthDate.getMonth()
//     if (
//       monthDiff < 0 ||
//       (monthDiff === 0 && today.getDate() < birthDate.getDate())
//     ) {
//       age--
//     }
//     return age >= 15 && age < 61
//   }, 'Người dùng phải từ 15 tuổi đến dưới 61 tuổi'),
//   status: z.enum(['ACTIVE', 'IN_ACTIVE']).default('ACTIVE'),
//   googleId: z.string().default('string'),
//   imageAvatar: z
//     .string()
//     .default(
//       'https://thumbs.dreamstime.com/b/creative-illustration-default-avatar-profile-placeholder-isolated-background-art-design-grey-photo-blank-template-mockup-144857620.jpg'
//     ),
//   // Thêm các trường cho địa chỉ
//   province: z.union([z.string(), z.number()]).transform(val => String(val)),
//   district: z.union([z.string(), z.number()]).transform(val => String(val)),
//   ward: z.union([z.string(), z.number()]).transform(val => String(val)),
//   street: z.string().min(3, "Vui lòng nhập địa chỉ cụ thể")
// })

const jwt = Cookies.get('jwt')
const formSchema = z.object({
  fullName: z
    .string({ required_error: 'Họ và tên không được bỏ trống' })
    .min(3, 'Họ và tên phải có ít nhất 3 ký tự')
    .max(50, 'Họ và tên không được quá 50 ký tự')
    .regex(/^[\p{L}\s]+$/u, 'Họ tên chỉ được chứa chữ cái và khoảng trắng'),
  gender: z.enum(['Nam', 'Nữ', 'Khác'], {
    required_error: 'Vui lòng chọn giới tính',
  }),
  code: z
    .string()
    .min(1, 'Mã tài khoản không được để trống')
    .max(50, 'Mã tài khoản không được quá 50 ký tự'),
  email: z
    .string({ required_error: 'Email không được bỏ trống' })
    .email('Email không hợp lệ')
    .min(5, 'Email phải có ít nhất 5 ký tự'),
  phone: z
    .string({ required_error: 'Số điện thoại không được bỏ trống' })
    .min(10, 'Số điện thoại phải có ít nhất 10 số')
    .max(15, 'Số điện thoại không được quá 15 số')
    .regex(/^[0-9+]+$/, 'Số điện thoại chỉ được chứa số và dấu +')
    .regex(
      /^(?:\+?84|0[35789])[0-9]{8}$/,
      'Số điện thoại không đúng định dạng'
    ),
  address: z
    .string({ required_error: 'Địa chỉ không được bỏ trống' })
    .min(10, 'Địa chỉ phải có ít nhất 10 ký tự')
    .max(200, 'Địa chỉ không được quá 200 ký tự'),
  birthDate: z
    .string({ required_error: 'Ngày sinh không được bỏ trống' })
    .refine((date) => {
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
      return age >= 15 && age < 61
    }, 'Người dùng phải từ 15 tuổi đến dưới 61 tuổi'),
  status: z.enum(['ACTIVE', 'IN_ACTIVE']).default('ACTIVE'),
  googleId: z.string().default('string'),
  imageAvatar: z
    .string()
    .default(
      'https://thumbs.dreamstime.com/b/creative-illustration-default-avatar-profile-placeholder-isolated-background-art-design-grey-photo-blank-template-mockup-144857620.jpg'
    ),
  province: z
    .union([z.string(), z.number()], {
      required_error: 'Vui lòng chọn tỉnh/thành phố',
    })
    .transform((val) => String(val)),
  district: z
    .union([z.string(), z.number()], {
      required_error: 'Vui lòng chọn quận/huyện',
    })
    .transform((val) => String(val)),
  ward: z
    .union([z.string(), z.number()], {
      required_error: 'Vui lòng chọn phường/xã',
    })
    .transform((val) => String(val)),
  street: z
    .string({ required_error: 'Vui lòng nhập địa chỉ cụ thể' })
    .min(3, 'Vui lòng nhập địa chỉ cụ thể'),
})

type FormData = z.infer<typeof formSchema>

export default function MyForm() {
  const [accounts, setAccounts] = useState<TaiKhoan[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // States cho địa chỉ
  const [provinces, setProvinces] = useState<Province[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [loading, setLoading] = useState({
    provinces: true,
    districts: false,
    wards: false,
  })
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(
    null
  )
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(
    null
  )
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: 'ACTIVE',
      googleId: 'string',
      imageAvatar:
        'https://thumbs.dreamstime.com/b/creative-illustration-default-avatar-profile-placeholder-isolated-background-art-design-grey-photo-blank-template-mockup-144857620.jpg',
      // code: '', // Giá trị mặc định cho code
    },
  })

  // Fetch provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get('https://provinces.open-api.vn/api/p/')
        setProvinces(response.data)
      } catch (error) {
        toast.error('Không thể tải danh sách tỉnh thành')
        console.error('Error fetching provinces:', error)
      } finally {
        setLoading((prev) => ({ ...prev, provinces: false }))
      }
    }
    fetchProvinces()
  }, [])

  // Fetch districts when province changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!selectedProvince) {
        setDistricts([])
        return
      }
      setLoading((prev) => ({ ...prev, districts: true }))
      try {
        const response = await axios.get(
          `https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`
        )
        setDistricts(response.data.districts || [])
      } catch (error) {
        toast.error('Không thể tải danh sách quận huyện')
        console.error('Error fetching districts:', error)
        setDistricts([])
      } finally {
        setLoading((prev) => ({ ...prev, districts: false }))
      }
    }
    fetchDistricts()
  }, [selectedProvince])

  // Fetch wards when district changes
  useEffect(() => {
    const fetchWards = async () => {
      if (!selectedDistrict) {
        setWards([])
        return
      }
      setLoading((prev) => ({ ...prev, wards: true }))
      try {
        const response = await axios.get(
          `https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`
        )
        setWards(response.data.wards || [])
      } catch (error) {
        toast.error('Không thể tải danh sách phường xã')
        console.error('Error fetching wards:', error)
        setWards([])
      } finally {
        setLoading((prev) => ({ ...prev, wards: false }))
      }
    }
    fetchWards()
  }, [selectedDistrict])

  // Cập nhật địa chỉ đầy đủ khi các thành phần thay đổi
  useEffect(() => {
    if (selectedProvince && selectedDistrict && selectedWard) {
      const streetValue = form.getValues('street') || ''
      if (streetValue) {
        const fullAddress = `${streetValue}, ${selectedWard.name}, ${selectedDistrict.name}, ${selectedProvince.name}`
        form.setValue('address', fullAddress)
      }
    }
  }, [selectedProvince, selectedDistrict, selectedWard, form.watch('street')])

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/api/account/list-nhan-vien',{
          headers: {
            Authorization: `Bearer ${Cookies.get('jwt')}`,
          },
        }
      )
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
      let genderValue = false
      if (account.gender === 'Nam') {
        genderValue = true
      }

      const response = await axios.put(
        `http://localhost:8080/api/account/update-nhan-vien/${account.id}`,
        {
          fullName: account.fullName,
          code: account.code, // Thêm trường code vào payload
          email: account.email,
          phone: account.phone,
          address: account.address,
          googleId: 'string',
          imageAvatar: account.imageAvatar,
          idRole: 3,
          gender: genderValue,
          birthDate: account.birthDate,
          status: newStatus ? 'ACTIVE' : 'IN_ACTIVE',
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('jwt')}`,
          },
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
      const errorMessage =
        error.response?.data?.message || 'Không thể cập nhật trạng thái'
      toast.error(errorMessage)
      return false
    }
  }

  useEffect(() => {
    fetchAccounts()
  }, [])

  const handleProvinceChange = (value: string) => {
    const province = provinces.find((p) => p.code === value)
    if (province) {
      setSelectedProvince(province)
      setSelectedDistrict(null)
      setSelectedWard(null)
      form.setValue('province', province.code)
      form.setValue('district', '')
      form.setValue('ward', '')
      form.trigger('province')
    }
  }

  const handleDistrictChange = (value: string) => {
    const district = districts.find((d) => d.code === value)
    if (district) {
      setSelectedDistrict(district)
      setSelectedWard(null)
      form.setValue('district', district.code)
      form.setValue('ward', '')
      form.trigger('district')
    }
  }

  const handleWardChange = (value: string) => {
    const ward = wards.find((w) => w.code === value)
    if (ward) {
      setSelectedWard(ward)
      form.setValue('ward', ward.code)
      form.trigger('ward')
    }
  }

  async function onSubmit(values: FormData) {
    // Báo lỗi nếu các trường địa chỉ không hợp lệ
    if (
      !selectedProvince ||
      !selectedDistrict ||
      !selectedWard ||
      !values.street
    ) {
      // Trigger validation cho tất cả các trường địa chỉ
      await form.trigger(['province', 'district', 'ward', 'street'])
      return
    }

    setIsSubmitting(true)
    try {
      const formattedBirthDate = new Date(values.birthDate).toISOString()

      let genderValue = false
      if (values.gender === 'Nam') {
        genderValue = true
      }

      // Xây dựng địa chỉ đầy đủ nếu chưa được cập nhật
      if (!values.address || values.address.length < 10) {
        values.address = `${values.street}, ${selectedWard?.name}, ${selectedDistrict?.name}, ${selectedProvince?.name}`
      }

      const payload = {
        fullName: values.fullName,
        code: values.code,
        email: values.email,
        phone: values.phone,
        address: values.address,
        birthDate: formattedBirthDate.split('T')[0],
        idRole: 3,
        gender: genderValue,
        status: values.status,
        googleId: 'string',
        imageAvatar:
          'https://thumbs.dreamstime.com/b/creative-illustration-default-avatar-profile-placeholder-isolated-background-art-design-grey-photo-blank-template-mockup-144857620.jpg',
      }

      console.log('Sending payload:', payload)

      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get('jwt')}`,
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.post(
        'http://localhost:8080/api/account/add-nhan-vien',
        payload,
        config
      )

      if (response.data) {
        toast.success('Đã tạo tài khoản mới.')
        form.reset({
          fullName: '',
          code: '', // Reset trường code
          email: '',
          phone: '',
          address: '',
          gender: undefined,
          birthDate: undefined,
          status: 'ACTIVE',
          googleId: 'string',
          imageAvatar: 'string',
          province: '',
          district: '',
          ward: '',
          street: '',
        })
        // Reset các state địa chỉ
        setSelectedProvince(null)
        setSelectedDistrict(null)
        setSelectedWard(null)
        setDistricts([])
        setWards([])

        await fetchAccounts()
      } else {
        throw new Error(response.data?.message || 'Có lỗi xảy ra')
      }
    } catch (error: any) {
      console.error('Form submission error:', error)

      if (error.response) {
        const message = error.response.data?.message || 'Lỗi server'
        toast.error(`${message}`)
      } else if (error.request) {
        toast.error(
          'Không thể kết nối đến server. Vui lòng kiểm tra lại kết nối.'
        )
      } else {
        toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='mx-auto max-w-3xl space-y-8 py-10'
        >
          <div className='grid grid-cols-12 gap-4'>
            <div className='col-span-12'>
              <FormField
                control={form.control}
                name='fullName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='VD: Nguyễn Văn A'
                        type='text'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Nhập đẩy đủ họ và tên</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='col-span-6'>
              <FormField
                control={form.control}
                name='code'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã tài khoản</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='VD: USER_1'
                        type='text'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Nhập mã tài khoản</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='col-span-6'>
              <FormField
                control={form.control}
                name='gender'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giới tính</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Vui lòng chọn giới tính' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='Nam'>Nam</SelectItem>
                        <SelectItem value='Nữ'>Nữ</SelectItem>
                        <SelectItem value='Khác'>Khác</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Vui lòng chọn giới tính</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className='grid grid-cols-12 gap-4'>
            <div className='col-span-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='nguyenvana@gmail.com'
                        type='email'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='col-span-4'>
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='0912345678'
                        type='string'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='col-span-4'>
              <FormField
                control={form.control}
                name='birthDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày sinh</FormLabel>
                    <DatePicker
                      value={
                        field.value
                          ? (() => {
                              const [year, month, day] = field.value
                                .split('-')
                                .map(Number)
                              return new CalendarDate(year, month, day)
                            })()
                          : null
                      }
                      onChange={(date) => {
                        if (date) {
                          const formattedDate = `${date.year}-${String(
                            date.month
                          ).padStart(
                            2,
                            '0'
                          )}-${String(date.day).padStart(2, '0')}`
                          field.onChange(formattedDate)
                        } else {
                          field.onChange(null)
                        }
                      }}
                    >
                      <div className='flex'>
                        <Group className='w-full'>
                          <DateInput className='pe-9' />
                        </Group>
                        <Buttons className='data-focus-visible:border-ring data-focus-visible:ring-ring/50 data-focus-visible:ring-[3px] z-10 -me-px -ms-9 flex w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground'>
                          <CalendarIcon size={16} />
                        </Buttons>
                      </div>
                      <Popover className='data-entering:animate-in data-exiting:animate-out outline-hidden z-50 rounded-lg border bg-background text-popover-foreground shadow-lg data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2'>
                        <Dialog className='max-h-[inherit] overflow-auto p-2'>
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

          {/* Phần địa chỉ tích hợp với FormField */}
          <Card className='w-full'>
            <CardHeader>
              <CardTitle>Chọn Địa Chỉ</CardTitle>
              <CardDescription>
                Chọn tỉnh/thành phố, quận/huyện, phường/xã và nhập địa chỉ cụ
                thể
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid grid-cols-12 gap-4'>
                <div className='col-span-4'>
                  <FormField
                    control={form.control}
                    name='province'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor='province'>Tỉnh/Thành phố</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={handleProvinceChange}
                          disabled={loading.provinces}
                        >
                          <FormControl>
                            <SelectTrigger id='province'>
                              <SelectValue
                                placeholder={
                                  loading.provinces
                                    ? 'Đang tải...'
                                    : 'Chọn tỉnh/thành phố'
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {provinces.map((province) => (
                              <SelectItem
                                key={province.code}
                                value={province.code}
                              >
                                {province.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='col-span-4'>
                  <FormField
                    control={form.control}
                    name='district'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor='district'>Quận/Huyện</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={handleDistrictChange}
                          disabled={!selectedProvince || loading.districts}
                        >
                          <FormControl>
                            <SelectTrigger
                              id='district'
                              className={loading.districts ? 'opacity-50' : ''}
                            >
                              <SelectValue
                                placeholder={
                                  loading.districts
                                    ? 'Đang tải...'
                                    : 'Chọn quận/huyện'
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {districts.map((district) => (
                              <SelectItem
                                key={district.code}
                                value={district.code}
                              >
                                {district.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='col-span-4'>
                  <FormField
                    control={form.control}
                    name='ward'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor='ward'>Phường/Xã</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={handleWardChange}
                          disabled={!selectedDistrict || loading.wards}
                        >
                          <FormControl>
                            <SelectTrigger
                              id='ward'
                              className={loading.wards ? 'opacity-50' : ''}
                            >
                              <SelectValue
                                placeholder={
                                  loading.wards
                                    ? 'Đang tải...'
                                    : 'Chọn phường/xã'
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {wards.map((ward) => (
                              <SelectItem key={ward.code} value={ward.code}>
                                {ward.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name='street'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor='street'>Địa chỉ cụ thể</FormLabel>
                    <FormControl>
                      <Input
                        id='street'
                        placeholder='VD: Đường 123'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <FormField
            control={form.control}
            name='status'
            render={({ field }) => (
              <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                <div className='space-y-0.5'>
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

          <Toaster position='top-right' />
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Đang xử lý...' : 'Thêm mới tài khoản'}
          </Button>
        </form>
      </Form>

      <div className='mx-auto my-8 w-full max-w-full space-y-4 p-5'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            Danh sách khách hàng
          </h2>
          <p className='text-muted-foreground'>Quản lý danh sách khách hàng.</p>
        </div>
        {isLoading ? (
          <div className='py-4 text-center'>Đang tải dữ liệu...</div>
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
