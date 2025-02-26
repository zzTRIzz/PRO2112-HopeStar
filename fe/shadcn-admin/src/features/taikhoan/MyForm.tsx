"use client"
import {
  useState
} from "react"
import {
  toast, Toaster
} from "sonner"
import {
  useForm
} from "react-hook-form"
import {
  zodResolver
} from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  cn
} from "@/lib/utils"
import {
  Button
} from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Input
} from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  PhoneInput
} from "@/components/ui/phone-input";
import {
  Switch
} from "@/components/ui/switch"

const formSchema = z.object({
  fullName: z.string().min(1),
  gender: z.string().optional(),
  email: z.string().optional(),
  password: z.string().min(1).optional(),
  phone: z.string().optional(),
  address: z.string().min(1).optional(),
  idRole: z.string().optional(),
  status: z.boolean().optional()
});

export default function MyForm() {

  const form = useForm < z.infer < typeof formSchema >> ({
    resolver: zodResolver(formSchema),

  })

  function onSubmit(values: z.infer < typeof formSchema > ) {
    try {
      console.log(values);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">
        
        <div className="grid grid-cols-12 gap-4">
          
          <div className="col-span-6">
            
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ và tên</FormLabel>
              <FormControl>
                <Input 
                placeholder="VD: Nguyễn Văn A"
                
                type="text"
                {...field} />
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
                  <SelectItem value="Giá trị lưu về API 1 (true)">Nam</SelectItem>
                  <SelectItem value="Giá trị lưu về API 2 (false)">Nữ</SelectItem>
                  <SelectItem value="Giá trị lưu về API 3">Khác</SelectItem>
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
                <Input 
                placeholder="nguyenvana@gmail.com"
                
                type="email"
                {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
          </div>
          
          <div className="col-span-4">
            
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input 
                placeholder="VD: *******"
                
                type=""
                {...field} />
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
              <FormItem className="flex flex-col items-start">
              <FormLabel>Số điện thoại</FormLabel>
                <FormControl className="w-full">
                  <PhoneInput
                    placeholder="VD: 0902038080"
                    {...field}
                    defaultCountry="VN"
                  />
                </FormControl>
              
                <FormMessage />
              </FormItem>
            )}
          />
            
          </div>
          
        </div>
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa chỉ</FormLabel>
              <FormControl>
                <Input 
                placeholder="VD: Số nhà 123, Đường ABC, Huyện XYZ, TP Hà Nội"
                
                type="text"
                {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="idRole"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quyền hạn</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Quyền lực của tài khoản ở đây" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="m@example.com">Admin (Quản lý)</SelectItem>
                  <SelectItem value="m@google.com">Nhân viên</SelectItem>
                  <SelectItem value="m@support.com">Khách hàng</SelectItem>
                </SelectContent>
              </Select>
                
              <FormMessage />
            </FormItem>
          )}
        />
        
          <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Trạng thái</FormLabel>
                    <FormDescription>Bật để kích hoạt tài khoản (Mặc định: True)</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />
        <Toaster />
        <Button type="submit">Thêm mới nhỉ (Submit)</Button>
      </form>
    </Form>
  )
}