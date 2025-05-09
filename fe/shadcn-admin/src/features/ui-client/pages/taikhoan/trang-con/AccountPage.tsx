import React, { useEffect } from 'react'
import { Input, Button, Select, SelectItem, DatePicker } from '@heroui/react'
import { parseDate, CalendarDate } from '@internationalized/date'
import { useProfile } from '@/components/layout/data/useProfile'
import { z } from 'zod'
import axios from 'axios'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

// Zod Schema Validation (Updated)
const formSchema = z.object({
  fullName: z.string().min(1, "Họ tên không được để trống"),
  phone: z.string().refine(
    (value) => {
      // Accept standard Vietnamese phone format: 10 digits starting with 0
      // Also allow some common formats with spaces or dashes
      const cleanedValue = value.replace(/[\s-]/g, '');
      return /^0\d{9}$/.test(cleanedValue);
    }, 
    { message: "Số điện thoại không hợp lệ (phải có 10 số và bắt đầu bằng số 0)" }
  ),
  gender: z.union([z.boolean(), z.null()]).refine(val => val !== null, {
    message: "Vui lòng chọn giới tính"
  }),
  birthDate: z.custom<CalendarDate | null>()
    .refine(val => val !== null, {
      message: "Vui lòng chọn ngày sinh"
    })
    .refine(val => {
      if (!val) return false;
      
      // Get current date and calculate 100 years ago
      const today = new Date();
      const minDate = new Date();
      minDate.setFullYear(today.getFullYear() - 100);
      
      // Convert CalendarDate to JavaScript Date for comparison
      const birthDate = new Date(val.year, val.month - 1, val.day);
      
      // Check if birthdate is after the minimum allowed date (less than 100 years old)
      return birthDate >= minDate && birthDate <= today;
    }, {
      message: "Tuổi không được vượt quá 100 hoặc lớn hơn ngày hiện tại",
    })
})

interface FormData {
  fullName: string
  email: string
  phone: string
  gender: boolean | null
  birthDate: CalendarDate | null
}

// Custom event for profile update notification
const PROFILE_UPDATED_EVENT = 'profile-updated';

// Helper function to safely parse dates from different formats
const safeParseDateFromString = (dateString: string | null | undefined): CalendarDate | null => {
  if (!dateString) return null;
  
  try {
    // Handle ISO format (yyyy-MM-dd)
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return parseDate(dateString);
    }
    
    // Handle yyyy-MM-ddTHH:mm:ss format
    if (dateString.includes('T')) {
      const datePart = dateString.split('T')[0];
      return parseDate(datePart);
    }
    
    // Handle other possible formats or fallback
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return parseDate(`${year}-${month}-${day}`);
    }
    
    console.warn('Could not parse date:', dateString);
    return null;
  } catch (error) {
    console.error('Error parsing date:', error, dateString);
    return null;
  }
};

export const AccountPage = () => {
  const { profile, loading, error, refetch } = useProfile()
  const [formData, setFormData] = React.useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    gender: null,
    birthDate: null,
  })
  const [formErrors, setFormErrors] = React.useState<Record<string, string[]>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false)
  const [touched, setTouched] = React.useState<Record<string, boolean>>({})

  // Cập nhật form khi nhận profile
  React.useEffect(() => {
    if (profile) {
      console.log('Received profile:', profile);
      
      const birthDate = safeParseDateFromString(profile.birthDate);
      console.log('Parsed birthDate:', birthDate);
      
      setFormData({
        fullName: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        gender: profile.gender ?? null,
        birthDate: birthDate,
      })
    }
  }, [profile])

  // Validate lại form khi dữ liệu thay đổi để xóa thông báo lỗi
  useEffect(() => {
    validateFieldsNoToast();
  }, [formData]);

  // Validate từng field riêng biệt không hiện toast
  const validateFieldsNoToast = () => {
    try {
      formSchema.parse(formData);
      // Nếu không có lỗi, xóa tất cả thông báo lỗi
      setFormErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Chỉ cập nhật errors, không hiển thị toast
        const errors: Record<string, string[]> = {}
        err.errors.forEach((error) => {
          const path = error.path[0] as string
          if (!errors[path]) errors[path] = []
          errors[path].push(error.message)
        })
        setFormErrors(errors)
      }
      return false;
    }
  }

  // Xử lý thay đổi thông tin
  const handleStringChange = (field: keyof FormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleGenderChange = (value: boolean | null) => {
    setFormData(prev => ({ ...prev, gender: value }))
    setTouched(prev => ({ ...prev, 'gender': true }))
  }

  const handleDateChange = (date: CalendarDate) => {
    setFormData(prev => ({ ...prev, birthDate: date }))
    setTouched(prev => ({ ...prev, 'birthDate': true }))
  }

  // Hàm validate form trước khi mở dialog xác nhận
  const validateForm = () => {
    try {
      formSchema.parse(formData);
      setShowConfirmDialog(true);
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Handle validation errors
        const errors: Record<string, string[]> = {}
        err.errors.forEach((error) => {
          const path = error.path[0] as string
          if (!errors[path]) errors[path] = []
          errors[path].push(error.message)
        })
        setFormErrors(errors)
        
        // Mark all fields as touched to show errors
        const allTouched = Object.keys(formData).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {} as Record<string, boolean>);
        setTouched(allTouched);
        
        toast.error('Vui lòng kiểm tra lại thông tin')
      }
      return false;
    }
  }

  const handleSubmitButtonClick = () => {
    validateForm();
  }

  // Notify Navbar to refresh profile data
  const notifyProfileUpdated = () => {
    // Dispatch a custom event that Navbar can listen for
    const event = new CustomEvent(PROFILE_UPDATED_EVENT);
    window.dispatchEvent(event);
  }

  const handleConfirmSubmit = async () => {
    try {
      setIsSubmitting(true)
      
      // Format payload according to backend AccountRequest structure
      const payload = {
        fullName: formData.fullName,
        phone: formData.phone,
        gender: formData.gender,
        birthDate: formData.birthDate?.toString() || null,
      }
  
      const jwt = Cookies.get('jwt')
      
      if (!jwt) {
        toast.error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại')
        return
      }
      
      const response = await axios.put(
        `http://localhost:8080/api/account/update-profile`,
        payload,
        {
          params: {
            email: profile?.email || ''
          },
          headers: {
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      // Check response status based on the ResponseData structure from backend
      if (response.data && response.data.status === 202) {
        toast.success(response.data.message || 'Cập nhật thông tin thành công')
        // Refresh profile data
        if (refetch) await refetch()
        
        // Notify Navbar to refresh
        notifyProfileUpdated();
        
        setShowConfirmDialog(false)
      } else {
        toast.error(response.data.message || 'Cập nhật thất bại')
      }
      
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        // Handle validation errors
        const errors: Record<string, string[]> = {}
        err.errors.forEach((error) => {
          const path = error.path[0] as string
          if (!errors[path]) errors[path] = []
          errors[path].push(error.message)
        })
        setFormErrors(errors)
        toast.error('Vui lòng kiểm tra lại thông tin')
      } else if (axios.isAxiosError(err)) {
        // Handle axios error
        const errorMessage = err.response?.data?.message || 'Lỗi kết nối đến máy chủ'
        toast.error(errorMessage)
      } else {
        // Handle other errors
        toast.error('Đã xảy ra lỗi khi cập nhật thông tin')
        console.error('Update profile error:', err)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Hiển thị lỗi khi người dùng đã tương tác với field đó
  const getErrorMessage = (field: string) => {
    if (touched[field] && formErrors[field]?.length) {
      return formErrors[field][0];
    }
    return undefined;
  }

  // Kiểm tra trường có lỗi không
  const isFieldInvalid = (field: string) => {
    return !!touched[field] && !!formErrors[field];
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="max-w-2xl">
      <h1 className="mb-8 text-2xl font-bold text-[#1A1A1A]">
        Thông tin tài khoản
      </h1>

      <div className="space-y-6">
        <Input
          label="Họ và tên"
          value={formData.fullName}
          onValueChange={handleStringChange('fullName')}
          variant="bordered"
          isRequired
          isInvalid={isFieldInvalid('fullName')}
          errorMessage={getErrorMessage('fullName')}
          onBlur={() => setTouched(prev => ({ ...prev, fullName: true }))}
        />

        <Input
          label="Email"
          value={formData.email}
          isReadOnly
        />

        <Input
          // readOnly
          label="Số điện thoại"
          value={formData.phone}
          onValueChange={handleStringChange('phone')}
          isRequired
          isInvalid={isFieldInvalid('phone')}
          errorMessage={getErrorMessage('phone')}
          onBlur={() => setTouched(prev => ({ ...prev, phone: true }))}
        />

        <Select
          label="Giới tính"
          placeholder="Chọn giới tính"
          selectedKeys={formData.gender !== null ? [String(formData.gender)] : []}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0]
            handleGenderChange(value === 'true' ? true : value === 'false' ? false : null)
          }}
          variant="bordered"
          isRequired
          isInvalid={isFieldInvalid('gender')}
          errorMessage={getErrorMessage('gender')}
          onBlur={() => setTouched(prev => ({ ...prev, gender: true }))}
        >
          <SelectItem key="true">Nam</SelectItem>
          <SelectItem key="false">Nữ</SelectItem>
          <SelectItem key="null">Khác</SelectItem>
        </Select>

        <DatePicker
          label="Ngày sinh"
          placeholder="Chọn ngày sinh"
          value={formData.birthDate}
          onChange={handleDateChange}
          className="w-full"
          isInvalid={isFieldInvalid('birthDate')}
          errorMessage={getErrorMessage('birthDate')}
          isRequired
          variant="bordered"
          onBlur={() => setTouched(prev => ({ ...prev, birthDate: true }))}
        />

        <Button 
          color="primary" 
          className="mt-8"
          onPress={handleSubmitButtonClick}
          isDisabled={isSubmitting}
        >
          {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
        </Button>

        {/* Dialog xác nhận */}
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận cập nhật thông tin</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn cập nhật thông tin tài khoản không?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Đang cập nhật..." : "Xác nhận"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}