import { useState, useEffect } from 'react'
import * as z from 'zod'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Row } from '@tanstack/react-table'
//import { MoreHorizontal, Pen } from 'lucide-react'
import { Pen } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu'
import {
  Form,
  FormControl,
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
import { TaiKhoan } from '../schema/schema'
import Cookies from 'js-cookie'

// Province/city type definitions
interface Province {
  code: string
  name: string
  division_type: string
  codename: string
  phone_code: number
}

interface District {
  code: string
  name: string
  division_type: string
  codename: string
  province_code: string
}

interface Ward {
  code: string
  name: string
  division_type: string
  codename: string
  district_code: string
}

interface DataTableRowActionsProps {
  row: Row<TaiKhoan>
  onUpdateSuccess?: () => void
}

const jwt = Cookies.get('jwt')
const updateFormSchema = z.object({
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
  phone: z
    .string()
    .min(10, 'Số điện thoại phải có ít nhất 10 số')
    .max(15, 'Số điện thoại không được quá 15 số')
    .regex(/^[0-9+]+$/, 'Số điện thoại chỉ được chứa số và dấu +')
    .regex(
      /^(?:\+?84|0[35789])[0-9]{8}$/,
      'Số điện thoại không đúng định dạng'
    ),
  address: z
    .string()
    .min(10, 'Địa chỉ phải có ít nhất 10 ký tự')
    .max(200, 'Địa chỉ không được quá 200 ký tự'),
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
    return age >= 15 && age < 61
  }, 'Người dùng phải từ 15 tuổi đến dưới 61 tuổi'),
  status: z.enum(['ACTIVE', 'IN_ACTIVE']),
})

const addressSchema = z.object({
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

type UpdateFormValues = z.infer<typeof updateFormSchema>
type AddressFormValues = z.infer<typeof addressSchema>

export function DataTableRowActions({
  row,
  onUpdateSuccess,
}: DataTableRowActionsProps) {
  const account = row.original
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentAccount, setCurrentAccount] = useState<any>(null)
  const [showAddressForm, setShowAddressForm] = useState(false)
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

  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      fullName: account.fullName || '',
      email: account.email || '',
      phone: account.phone || '',
      address: account.address || '',
      gender: account.gender || 'Khác',
      birthDate: account.birthDate || '',
      status: account.status || 'ACTIVE',
    },
  })

  const addressForm = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      province: '',
      district: '',
      ward: '',
      street: '',
    },
  })

  // Fetch account data when dialog opens
  const fetchAccountData = async () => {
    if (!isDialogOpen) return
    setIsLoading(true)
    try {
      const response = await axios.get(
        `http://localhost:8080/api/account/get/${account.id}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('jwt')}`,
          },
        }
      )
      if (response.data.status === 200) {
        setCurrentAccount(response.data.data)
        form.setValue('fullName', response.data.data.fullName || '')
        form.setValue('email', response.data.data.email || '')
        form.setValue('phone', response.data.data.phone || '')
        form.setValue('address', response.data.data.address || '')
        form.setValue(
          'gender',
          response.data.data.gender
            ? 'Nam'
            : response.data.data.gender === 'Nữ'
              ? 'Nữ'
              : 'Khác'
        )
        form.setValue('birthDate', response.data.data.birthDate || '')
        form.setValue('status', response.data.data.status || 'ACTIVE')
      }
    } catch (error) {
      console.error('Error fetching account data:', error)
      toast.error('Không thể lấy thông tin tài khoản')
    } finally {
      setIsLoading(false)
    }
  }

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

  // Update address when all components are selected
  useEffect(() => {
    if (
      showAddressForm &&
      selectedProvince &&
      selectedDistrict &&
      selectedWard
    ) {
      const streetValue = addressForm.getValues('street') || ''
      if (streetValue) {
        const fullAddress = `${streetValue}, ${selectedWard.name}, ${selectedDistrict.name}, ${selectedProvince.name}`
        form.setValue('address', fullAddress)
      }
    }
  }, [
    selectedProvince,
    selectedDistrict,
    selectedWard,
    addressForm,
    form,
    showAddressForm,
  ])

  useEffect(() => {
    if (isDialogOpen) {
      fetchAccountData()
    }
  }, [isDialogOpen])

  const handleUpdate = async (values: UpdateFormValues) => {
    setIsUpdating(true)
    try {
      const response = await axios.put(
        `http://localhost:8080/api/account/update/${account.id}`,
        {
          fullName: values.fullName,
          email: values.email,
          phone: values.phone || '',
          address: values.address,
          googleId: currentAccount?.googleId || 'string',
          imageAvatar: currentAccount?.imageAvatar || account.imageAvatar || '',
          idRole: currentAccount?.idRole?.id || account.idRole?.id || 3,
          gender: values.gender === 'Nam',
          birthDate: values.birthDate,
          status: values.status,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('jwt')}`,
          },
        }
      )

      if (response.data.status === 202) {
        toast.success('Đã cập nhật tài khoản thành công.')
        setIsDialogOpen(false)
        if (onUpdateSuccess) {
          onUpdateSuccess()
        }
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
      setIsUpdating(false)
    }
  }

  const handleProvinceChange = (value: string) => {
    const province = provinces.find((p) => p.code === value)
    if (province) {
      setSelectedProvince(province)
      setSelectedDistrict(null)
      setSelectedWard(null)
      addressForm.setValue('province', province.code)
      addressForm.setValue('district', '')
      addressForm.setValue('ward', '')
      addressForm.setValue('street', '')
    }
  }

  const handleDistrictChange = (value: string) => {
    const district = districts.find((d) => d.code === value)
    if (district) {
      setSelectedDistrict(district)
      setSelectedWard(null)
      addressForm.setValue('district', district.code)
      addressForm.setValue('ward', '')
      addressForm.setValue('street', '')
    }
  }

  const handleWardChange = (value: string) => {
    const ward = wards.find((w) => w.code === value)
    if (ward) {
      setSelectedWard(ward)
      addressForm.setValue('ward', ward.code)
      addressForm.setValue('street', '')
    }
  }

  const handleConfirmAddress = async () => {
    const result = await addressForm.trigger()
    if (!result) {
      toast.error('Vui lòng điền đầy đủ thông tin địa chỉ')
      return
    }
    setShowAddressForm(false)
  }

  const handleChangeAddress = () => {
    setShowAddressForm(true)
    setSelectedProvince(null)
    setSelectedDistrict(null)
    setSelectedWard(null)
    addressForm.reset({
      province: '',
      district: '',
      ward: '',
      street: '',
    })
    form.setValue('address', '')
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
          >
            <MoreHorizontal className='h-4 w-4' />
            <span className='sr-only'>Mở menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[160px]'>
          <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
            <Pen className='mr-2 h-4 w-4' />
            Cập nhật thông tin
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}
      {/* Thay thế dropdown menu bằng nút bấm */}
      <Button variant='outline' onClick={() => setIsDialogOpen(true)}className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 hover:text-white"
        size="sm"
      >
        <Pen className="h-4 w-4" color='white'/>
      </Button>

      <DialogContent className='max-h-[80vh] max-w-[60vw] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Cập nhật thông tin tài khoản</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className='flex items-center justify-center p-4'>
            Đang tải dữ liệu...
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleUpdate)}
              className='grid grid-cols-2 gap-4 p-4 sm:grid-cols-1'
            >
              <FormField
                control={form.control}
                name='fullName'
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
                name='email'
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
                name='phone'
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
                name='gender'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giới tính</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Chọn giới tính' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='Nam'>Nam</SelectItem>
                        <SelectItem value='Nữ'>Nữ</SelectItem>
                        <SelectItem value='Khác'>Khác</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='birthDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày sinh</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem className='col-span-2 sm:col-span-1'>
                    <FormLabel>Địa chỉ</FormLabel>
                    <Card>
                      <CardContent className='pt-4'>
                        {showAddressForm ? (
                          <Form {...addressForm}>
                            <div className='grid grid-cols-2 gap-4 sm:grid-cols-1'>
                              <FormField
                                control={addressForm.control}
                                name='province'
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Tỉnh/Thành phố</FormLabel>
                                    <Select
                                      value={field.value}
                                      onValueChange={handleProvinceChange}
                                      disabled={loading.provinces}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
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
                              <FormField
                                control={addressForm.control}
                                name='district'
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Quận/Huyện</FormLabel>
                                    <Select
                                      value={field.value}
                                      onValueChange={handleDistrictChange}
                                      disabled={
                                        !selectedProvince || loading.districts
                                      }
                                    >
                                      <FormControl>
                                        <SelectTrigger>
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
                              <FormField
                                control={addressForm.control}
                                name='ward'
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Phường/Xã</FormLabel>
                                    <Select
                                      value={field.value}
                                      onValueChange={handleWardChange}
                                      disabled={
                                        !selectedDistrict || loading.wards
                                      }
                                    >
                                      <FormControl>
                                        <SelectTrigger>
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
                                          <SelectItem
                                            key={ward.code}
                                            value={ward.code}
                                          >
                                            {ward.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={addressForm.control}
                                name='street'
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Địa chỉ cụ thể</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder='VD: Đường 123'
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className='mt-4 flex justify-end gap-4'>
                              <Button
                                variant='outline'
                                onClick={() => {
                                  setShowAddressForm(false)
                                  form.setValue(
                                    'address',
                                    currentAccount?.address || ''
                                  )
                                }}
                                disabled={isUpdating}
                              >
                                Hủy
                              </Button>
                              <Button
                                onClick={handleConfirmAddress}
                                disabled={isUpdating}
                              >
                                Xác nhận địa chỉ
                              </Button>
                            </div>
                          </Form>
                        ) : (
                          <div className='flex items-center justify-between'>
                            <span className='text-sm'>{field.value || 'Chưa có địa chỉ'}</span>
                            <Button
                              variant='outline'
                              onClick={handleChangeAddress}
                            >
                              Thay đổi địa chỉ
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Chọn trạng thái' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='ACTIVE'>Hoạt động</SelectItem>
                        <SelectItem value='IN_ACTIVE'>
                          Không hoạt động
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='col-span-2 mt-4 flex justify-end gap-4 sm:col-span-1'>
                <Button
                  variant='outline'
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isUpdating}
                >
                  Hủy
                </Button>
                <Button type='submit' disabled={isUpdating}>
                  {isUpdating ? 'Đang cập nhật...' : 'Lưu thay đổi'}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
