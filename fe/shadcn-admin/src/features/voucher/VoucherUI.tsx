import { useEffect, useState } from "react"
import { getVouchers } from "./data/apiVoucher"
import { useNavigate } from "@tanstack/react-router";
import axios from 'axios';
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

// Định nghĩa schema validation
const formSchema = z.object({
  code: z.string().min(1, "Mã voucher không được để trống"),
  name: z.string().min(1, "Tên voucher không được để trống"),
  discountValue: z.number().min(1, "Giá trị voucher phải lớn hơn 0"),
  voucherType: z.boolean(),
  conditionPriceMin: z.number().min(0, "Giá tối thiểu phải lớn hơn hoặc bằng 0"),
  conditionPriceMax: z.number().min(0, "Giá tối đa phải lớn hơn hoặc bằng 0"),
  quantity: z.number().min(1, "Số lượng phải lớn hơn 0"),
  startTime: z.string().min(1, "Vui lòng chọn ngày bắt đầu"),
  endTime: z.string().min(1, "Vui lòng chọn ngày kết thúc"),
  status: z.string()
})

// Thêm interface ở đầu file
interface Voucher {
    id: number;
    code: string;
    name: string;
    conditionPriceMin: number;
    conditionPriceMax: number;
    discountValue: number;
    voucherType: boolean;
    quantity: number;
    startTime: string;
    endTime: string;
    status: "ACTIVE" | "INACTIVE";
}

export default function VoucherUI() {
    const [vouchers, setVouchers] = useState<Voucher[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<Omit<Voucher, 'id'>>({
        code: '',
        name: '',
        conditionPriceMin: 0,
        conditionPriceMax: 0,
        discountValue: 0,
        voucherType: false,
        quantity: 0,
        startTime: '',
        endTime: '',
        status: 'ACTIVE'
    });

    // Thêm state để track chế độ edit/create
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    // Thêm state phân trang sau các state khác
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Thêm hàm xử lý edit
    const handleEdit = (voucher: Voucher) => {
        setIsEditing(true);
        setEditId(voucher.id);
        setFormData({
            code: voucher.code,
            name: voucher.name,
            conditionPriceMin: voucher.conditionPriceMin,
            conditionPriceMax: voucher.conditionPriceMax,
            discountValue: voucher.discountValue,
            voucherType: voucher.voucherType,
            quantity: voucher.quantity,
            startTime: voucher.startTime.split('.')[0], // Loại bỏ milliseconds
            endTime: voucher.endTime.split('.')[0],
            status: voucher.status
        });
        setShowModal(true);
    };

    // Sửa lại hàm handleSubmit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && editId) {
                // Gọi API cập nhật voucher
                await axios.put(`http://localhost:8080/api/admin/voucher/${editId}`, formData);
            } else {
                // Gọi API tạo voucher mới
                await axios.post('http://localhost:8080/api/admin/voucher', formData);
            }
            // Refresh lại danh sách
            const newData = await getVouchers();
            setVouchers(newData);
            handleCloseModal();
        } catch (error) {
            console.error('Error saving voucher:', error);
        }
    };

    // Thêm hàm đóng modal và reset form
    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setEditId(null);
        setFormData({
            code: '',
            name: '',
            conditionPriceMin: 0,
            conditionPriceMax: 0,
            discountValue: 0,
            voucherType: false,
            quantity: 0,
            startTime: '',
            endTime: '',
            status: 'ACTIVE'
        });
    };

    // Sửa lại nút tạo voucher
    const handleCreate = () => {
        setIsEditing(false);
        setEditId(null);
        setShowModal(true);
    };

    // Thêm hàm tính toán data cho phân trang
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = vouchers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(vouchers.length / itemsPerPage);

    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const data = await getVouchers()
                setVouchers(data)
            } catch (error) {
                setError(error as Error)
            } finally {
                setLoading(false)
            }
        }

        fetchVouchers()
    }, [])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          code: '',
          name: '',
          discountValue: 0,
          voucherType: false,
          conditionPriceMin: 0, 
          conditionPriceMax: 0,
          quantity: 0,
          startTime: '',
          endTime: '',
          status: 'ACTIVE'
        }
      })
    
      const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
          if (isEditing && editId) {
            await axios.put(`http://localhost:8080/api/admin/voucher/${editId}`, values)
            toast({
              title: "Cập nhật thành công",
              description: "Voucher đã được cập nhật"
            })
          } else {
            await axios.post('http://localhost:8080/api/admin/voucher', values)
            toast({
              title: "Thêm mới thành công", 
              description: "Voucher đã được tạo"
            })
          }
          // Refresh lại danh sách
          const newData = await getVouchers()
          setVouchers(newData)
          handleCloseModal()
        } catch (error) {
          toast({
            variant: "destructive",
            title: "",
            description: "Vui lòng thử lại sau"
          })
        }
      }

    return (
        <>
            <div className="p-6 bg-gray-100 min-h-screen">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <input
                        type="text"
                        placeholder="Tìm voucher"
                        className="p-2 border rounded-md w-1/3"
                    />

                    {/* Bộ lọc ngày bắt đầu */}
                    <div className="flex items-center gap-2">
                        <input
                            type="date"
                            className="p-2 border rounded-md"
                            placeholder="Ngày bắt đầu"
                        />
                    </div>

                    {/* Bộ lọc ngày kết thúc */}
                    <div className="flex items-center gap-2">
                        <input
                            type="date"
                            className="p-2 border rounded-md" placeholder="Ngày kết thúc"
                        />
                    </div>

                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-md"
                        onClick={handleCreate}
                    >
                        + Tạo voucher
                    </button>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-200 text-gray-700">
                            <tr>
                                <th className="p-3">STT</th>
                                <th className="p-3">Mã</th>
                                <th className="p-3">Tên</th>
                                <th className="p-3">Giá trị</th>
                                <th className="p-3">Điều Kiện</th>
                                <th className="p-3">Số Lượng</th>
                                <th className="p-3">Thời Gian</th>
                                <th className="p-3">Trạng Thái</th>
                                <th className="p-3">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody>
            
                            {currentItems.map((voucher, index) => (
                                <tr key={voucher.id} className="border-t hover:bg-gray-50">
                                    <td className="p-3">{index + 1}</td>
                                    <td className="p-3">{voucher.code}</td>
                                    <td className="p-3">{voucher.name}</td>
                                    <td className="p-3">
                                        {voucher.discountValue.toLocaleString('vi-VN')} {voucher.voucherType ? '%' : 'đ'}
                                    </td>
                                    <td className="p-3">
                                        {voucher.conditionPriceMin.toLocaleString('vi-VN')} đ -
                                        {voucher.conditionPriceMax.toLocaleString('vi-VN')} đ
                                    </td>
                                    <td className="p-3">{voucher.quantity.toLocaleString('vi-VN')}</td>
                                    <td className="p-3">
                                        {new Date(voucher.startTime).toLocaleDateString('vi-VN')} -
                                        {new Date(voucher.endTime).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded-full text-sm ${voucher.status === 'ACTIVE'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {voucher.status === 'ACTIVE' ? 'Hoạt động' : 'Hết hạn'}
                                        </span>
                                    </td>
                                    <td className="p-3 space-x-2">
                                        <button
                                            className="text-blue-600 hover:text-blue-800"
                                            onClick={() => handleEdit(voucher)}
                                        >
                                            Sửa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                <div className="flex justify-center gap-2 mt-4 pb-4">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded ${
                            currentPage === 1 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                        Trước
                    </button>
                    
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`px-3 py-1 rounded ${
                                currentPage === index + 1
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded ${
                            currentPage === totalPages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                        Sau
                    </button>
                </div>
                <div className="text-gray-600 text-sm mt-2 text-center">
                    Hiển thị {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, vouchers.length)} 
                    trên tổng số {vouchers.length} voucher
                </div>
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-[500px]">
                        <h2 className="text-xl font-semibold mb-4">
                            {isEditing ? 'Cập Nhật Voucher' : 'Tạo Voucher Mới'}
                        </h2>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mã voucher</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nhập mã voucher" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tên voucher</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nhập tên voucher" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="discountValue"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Giá trị</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        type="number" 
                                                        placeholder="Nhập giá trị" 
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="voucherType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Loại giảm giá</FormLabel>
                                                <FormControl>
                                                    <select
                                                        className="w-full p-2 border rounded"
                                                        value={field.value ? "true" : "false"}
                                                        onChange={(e) => field.onChange(e.target.value === "true")}
                                                    >
                                                        <option value="false">VNĐ</option>
                                                        <option value="true">%</option>
                                                    </select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="conditionPriceMin"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Giá tối thiểu</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        type="number" 
                                                        placeholder="Nhập giá tối thiểu"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="conditionPriceMax"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Giá tối đa</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        type="number"
                                                        placeholder="Nhập giá tối đa"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="quantity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Số lượng</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="number"
                                                    placeholder="Nhập số lượng"
                                                    {...field}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="startTime"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Ngày bắt đầu</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        type="datetime-local"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="endTime"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Ngày kết thúc</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        type="datetime-local"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex justify-end gap-2 mt-6">
                                    <Button 
                                        type="button"
                                        variant="outline"
                                        onClick={handleCloseModal}
                                    >
                                        Hủy
                                    </Button>
                                    <Button type="submit">
                                        {isEditing ? 'Cập nhật' : 'Tạo'}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            )}
        </>
    )
}