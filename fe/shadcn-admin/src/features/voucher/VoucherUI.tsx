import { useEffect, useState, useCallback } from "react";
import { 
    getVouchers, 
    searchVoucherByCode, 
    searchVoucherByDate, 
    searchVoucherByCodeAndDate,
    checkVoucherCode,  // Make sure this is imported
    assignVoucherToCustomers
} from "./data/apiVoucher";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

// Add API base URL constant
const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);
        if (error.response?.data?.message) {
            toast.error(error.response.data.message);
        } else {
            toast.error('Có lỗi xảy ra khi thực hiện yêu cầu');
        }
        return Promise.reject(error);
    }
);

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
    status: "UPCOMING" | "ACTIVE" | "EXPIRED";
    description?: string;
    isPrivate: boolean;  // true = riêng tư, false = công khai
    maxDiscountAmount?: number; // Add this field for percentage vouchers
}

interface RoleResponse {
    id: number;
    code: string;
    name: string;
}

interface AccountResponse {
    id: number;
    fullName: string;
    code: string;
    email: string;
    password?: string;
    phone?: string;
    address?: string;
    googleId?: string;
    imageAvatar?: string;
    idRole: RoleResponse;
    gender: boolean;
    status: string;
}

interface ResponseData<T> {
    status: number;
    message: string;
    data: T;
}

enum HttpStatus {
    OK = 'OK',
    BAD_REQUEST = 'BAD_REQUEST',
    CREATED = 'CREATED',
    ACCEPTED = 'ACCEPTED'
}

// Add helper function to check voucher status
const getVoucherStatus = (startTime: string, endTime: string): "UPCOMING" | "ACTIVE" | "EXPIRED" => {
    const now = new Date();
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (now < startDate) {
        return "UPCOMING";
    } else if (now > endDate) {
        return "EXPIRED";
    } else {
        return "ACTIVE";
    }
};

// Update the status display in the table
const getStatusDisplay = (status: string) => {
    switch (status) {
        case "UPCOMING":
            return {
                text: "Sắp diễn ra",
                className: "bg-yellow-100 text-yellow-800"
            };
        case "ACTIVE":
            return {
                text: "Đang hoạt động",
                className: "bg-green-100 text-green-800"
            };
        case "EXPIRED":
            return {
                text: "Đã hết hạn",
                className: "bg-red-100 text-red-800"
            };
        default:
            return {
                text: status,
                className: "bg-gray-100 text-gray-800"
            };
    }
};

// Thêm component NoData
const NoData = () => (
    <tr>
        <td colSpan={9} className="text-center py-8 text-gray-500">
            Không có dữ liệu phù hợp
        </td>
    </tr>
);

interface AssignVoucherResponse {
    success: boolean;
    message: string;
    details?: {
        alreadyHasVoucher: string[];
        assigned: string[];
    };
}

export default function VoucherUI() {
    const [vouchers, setVouchers] = useState<Voucher[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<Omit<Voucher, 'id'>>({
        code: '',
        name: '',
        description: '',
        conditionPriceMin: 0,
        conditionPriceMax: 0,
        discountValue: 0,
        voucherType: false,
        quantity: 0,
        startTime: '',
        endTime: '',
        status: 'ACTIVE',
        isPrivate: false,  // Mặc định là công khai
        maxDiscountAmount: 0,
    });

    // Thêm state để track chế độ edit/create
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    // Thêm state phân trang sau các state khác
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Xóa state không cần thiết
    const [searchCode, setSearchCode] = useState('');

    // Thêm state
    const [searchStartTime, setSearchStartTime] = useState('');
    const [searchEndTime, setSearchEndTime] = useState('');

    // Thêm state để track việc kiểm tra mã
    const [isCheckingCode, setIsCheckingCode] = useState(false);

    // Add these states in VoucherUI component
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

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
            status: voucher.status,
            description: voucher.description,
            isPrivate: voucher.isPrivate,
            maxDiscountAmount: voucher.maxDiscountAmount || 0,
        });
        setShowModal(true);
    };

    // Add validation function
    const validateForm = async (): Promise<boolean> => {
        // Basic validations
        if (!formData.code.trim()) {
            setError(new Error('Mã voucher không được để trống'));
            return false;
        }

        // Check for duplicate code
        const isValidCode = await checkCode(formData.code);
        if (!isValidCode) {
            return false;
        }

        // ...rest of your validations...
        return true;
    };

    // Thêm hàm kiểm tra mã
    const checkCode = async (code: string): Promise<boolean> => {
        if (!code.trim()) return true;
        
        try {
            setIsCheckingCode(true);
            const response = await axios.get(`${API_BASE_URL}/admin/voucher/check-code`, {
                params: {
                    code: code.trim(),
                    excludeId: isEditing ? editId : undefined
                }
            });
            return !response.data; // Return false if code exists, true if it doesn't
        } catch (error) {
            console.error('Error checking code:', error);
            return false;
        } finally {
            setIsCheckingCode(false);
        }
    };

    // Modify the handleSubmit function
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic validations first
        if (!formData.code.trim()) {
            toast.error('Vui lòng nhập mã voucher');
            return;
        }
        if (!formData.name.trim()) {
            toast.error('Vui lòng nhập tên voucher');
            return;
        }
        if (formData.discountValue <= 0) {
            toast.error('Vui lòng nhập giá trị voucher');
            return;
        }
        if (formData.quantity <= 0) {
            toast.error('Vui lòng nhập số lượng voucher');
            return;
        }
        if (!formData.startTime || !formData.endTime) {
            toast.error('Vui lòng chọn thời gian hiệu lực');
            return;
        }

        try {
            // Tạo payload với đầy đủ thông tin
            const payload = {
                ...formData,
                isPrivate: formData.isPrivate, // Đảm bảo gửi trường isPrivate
            };

            console.log('Sending data:', payload); // Debug log

            // Gọi API tương ứng
            if (isEditing && editId) {
                await axios.put(`${API_BASE_URL}/admin/voucher/${editId}`, payload);
                toast.success('Cập nhật voucher thành công!');
            } else {
                await axios.post(`${API_BASE_URL}/admin/voucher`, payload);
                toast.success('Tạo voucher mới thành công!');
            }

            // Refresh data
            const newData = await getVouchers();
            setVouchers(newData);
            handleCloseModal();
        } catch (error: any) {
            console.error('Error saving voucher:', error);
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi lưu voucher');
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
            status: 'ACTIVE',
            description: '',
            isPrivate: false,
            maxDiscountAmount: 0,
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

    // Sửa lại hàm handleSearch
    const handleSearch = async () => {
        try {
            setLoading(true);
            let data;

            // Search with both code and date
            if (searchCode.trim() && searchStartTime && searchEndTime) {
                data = await searchVoucherByCodeAndDate(
                    searchCode.trim(),
                    searchStartTime,
                    searchEndTime
                );
            }
            // Search by code only
            else if (searchCode.trim()) {
                data = await searchVoucherByCode(searchCode.trim());
            }
            // Search by date only
            else if (searchStartTime && searchEndTime) {
                data = await searchVoucherByDate(searchStartTime, searchEndTime);
            }
            // Get all vouchers
            else {
                data = await getVouchers();
            }

            if (Array.isArray(data)) {
                setVouchers(data);
                setCurrentPage(1);
                if (data.length === 0) {
                    toast.info('Không tìm thấy voucher phù hợp');
                }
            } else {
                throw new Error('Dữ liệu không hợp lệ');
            }
        } catch (error: any) {
            console.error('Error searching:', error);
            toast.error(error.message || 'Có lỗi xảy ra khi tìm kiếm');
            setVouchers([]);
        } finally {
            setLoading(false);
        }
    };

    // Thêm hàm xử lý tìm kiếm theo ngày
    const handleSearchByDate = async () => {
        try {
            setLoading(true);
            setError(null); // Reset error state

            if (!searchStartTime || !searchEndTime) {
                setError(new Error('Vui lòng chọn đầy đủ ngày bắt đầu và kết thúc'));
                return;
            }

            const startDate = new Date(searchStartTime);
            const endDate = new Date(searchEndTime);
            
            if (startDate > endDate) {
                setError(new Error('Ngày bắt đầu không được sau ngày kết thúc'));
                return;
            }

            const data = await searchVoucherByDate(searchStartTime, searchEndTime);
            
            if (Array.isArray(data)) {
                setVouchers(data);
                setCurrentPage(1);
            } else {
                throw new Error('Dữ liệu không hợp lệ');
            }
        } catch (error: any) {
            console.error('Error searching by date:', error);
            setError(new Error(error.message || 'Có lỗi xảy ra khi tìm kiếm'));
        } finally {
            setLoading(false);
        }
    };

    const refreshVouchers = useCallback(async () => {
        try {
            setLoading(true); // Add loading state
            const newData = await getVouchers();
            setVouchers(newData);
            console.log('Vouchers refreshed:', newData);
        } catch (error) {
            console.error('Error refreshing vouchers:', error);
            toast.error('Không thể cập nhật danh sách voucher');
        } finally {
            setLoading(false); // Reset loading state
        }
    }, []);

    // Update the modal closing handler
    const closeAssignModal = useCallback(async () => {
        setShowAssignModal(false);
        setSelectedVoucher(null);
        await refreshVouchers(); // Ensure data is refreshed when modal closes
    }, [refreshVouchers]);

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

    return (
        <>
            <div className="p-6 bg-gray-100 min-h-screen">

                {/* Thay thế phần tìm kiếm cũ bằng code sau */}
                <div className="mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-medium mb-4">Tìm kiếm voucher</h3>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-1">Mã voucher</label>
                                <input
                                    type="text"
                                    placeholder="Nhập mã voucher..."
                                    className="w-full p-2 border rounded-md"
                                    value={searchCode}
                                    onChange={(e) => setSearchCode(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-1">Từ ngày</label>
                                <input
                                    type="date"
                                    className="w-full p-2 border rounded-md"
                                    value={searchStartTime}
                                    onChange={(e) => setSearchStartTime(e.target.value)}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-1">Đến ngày</label>
                                <input
                                    type="date"
                                    className="w-full p-2 border rounded-md"
                                    value={searchEndTime}
                                    onChange={(e) => setSearchEndTime(e.target.value)}
                                />
                            </div>
                            <div className="flex items-end gap-2">
                                <button
                                    onClick={handleSearch}
                                    className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Tìm kiếm
                                </button>
                                <button
                                    onClick={() => {
                                        setSearchCode('');
                                        setSearchStartTime('');
                                        setSearchEndTime('');
                                        handleSearch();
                                    }}
                                    className="p-2 border rounded-md hover:bg-gray-100"
                                >
                                    Làm mới
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            onClick={handleCreate}
                        >
                            + Tạo voucher
                        </button>
                    </div>
                </div>

                {loading && (
                    <div className="text-center py-4">
                        <span className="text-gray-600">Đang tải...</span>
                    </div>
                )}

                {error && (
                    <div className="text-center py-4 text-red-600">
                        Có lỗi xảy ra: {error.message}
                    </div>
                )}

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
                                <th className="p-3">Loại</th>
                                <th className="p-3">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 ? (
                                currentItems.map((voucher, index) => (
                                    <tr key={voucher.id} className="border-t hover:bg-gray-50">
                                        <td className="p-3">
                                            {(currentPage - 1) * itemsPerPage + index + 1}
                                        </td>
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
                                            {(() => {
                                                const status = getVoucherStatus(voucher.startTime, voucher.endTime);
                                                const statusDisplay = getStatusDisplay(status);
                                                return (
                                                    <span className={`px-2 py-1 rounded-full text-sm ${statusDisplay.className}`}>
                                                        {statusDisplay.text}
                                                    </span>
                                                );
                                            })()}
                                        </td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded-full text-sm ${
                                                voucher.isPrivate 
                                                    ? 'bg-purple-100 text-purple-800' 
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                                {voucher.isPrivate ? 'Riêng tư' : 'Công khai'}
                                            </span>
                                        </td>
                                        <td className="p-3 space-x-2">
                                            <button
                                                className="text-blue-600 hover:text-blue-800"
                                                onClick={() => handleEdit(voucher)}
                                            >
                                                Sửa
                                            </button>
                                            {voucher.isPrivate && (
                                                <button
                                                    className="text-green-600 hover:text-green-800"
                                                    onClick={() => {
                                                        setSelectedVoucher(voucher);
                                                        setShowAssignModal(true);
                                                    }}
                                                >
                                                    Thêm KH
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <NoData />
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Chỉ hiển thị phân trang khi có dữ liệu */}
                {vouchers.length > 0 && (
                    <>
                        <div className="flex justify-center gap-2 mt-4 pb-4">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 rounded ${currentPage === 1
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
                                    className={`px-3 py-1 rounded ${currentPage === index + 1
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
                                className={`px-3 py-1 rounded ${currentPage === totalPages
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
                    </>
                )}
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-[500px]">
                        <h2 className="text-xl font-semibold mb-4">
                            {isEditing ? 'Cập Nhật Voucher' : 'Tạo Voucher Mới'}
                        </h2>                        
                        {error && (
                            <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
                                {error.message}
                            </div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block mb-1">Mã voucher</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                        disabled={isEditing} // Disable input when editing
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1">Tên voucher</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1">Giá trị</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            className="w-full p-2 border rounded"
                                            value={formData.discountValue === 0 ? '' : formData.discountValue}
                                            onChange={(e) => setFormData({ 
                                                ...formData, 
                                                discountValue: e.target.value ? Math.max(0, Number(e.target.value)) : 0 
                                            })}
                                            min="0"
                                        
                                        />
                                        <select
                                            className="p-2 border rounded"
                                            value={formData.voucherType ? "true" : "false"}
                                            onChange={(e) => setFormData({ ...formData, voucherType: e.target.value === "true" })}
                                        >
                                            <option value="false">VNĐ</option>
                                            <option value="true">%</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Add maximum discount amount field when type is percentage */}
                                {formData.voucherType && (
                                    <div>
                                        <label className="block mb-1">Giảm tối đa</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                className="w-full p-2 border rounded"
                                                value={formData.maxDiscountAmount === 0 ? '' : formData.maxDiscountAmount}
                                                onChange={(e) => setFormData({ 
                                                    ...formData, 
                                                    maxDiscountAmount: e.target.value ? Math.max(0, Number(e.target.value)) : 0 
                                                })}
                                                min="0"
                                                placeholder="Nhập số tiền giảm tối đa"
                                            />
                                            <span className="p-2 border rounded bg-gray-50">VNĐ</span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Giá trị giảm tối đa khi áp dụng phần trăm
                                        </p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-1">Giá tối thiểu</label>
                                        <input
                                            type="number"
                                            className="w-full p-2 border rounded"
                                            value={formData.conditionPriceMin === 0 ? '' : formData.conditionPriceMin}
                                            onChange={(e) => setFormData({ 
                                                ...formData, 
                                                conditionPriceMin: e.target.value ? Math.max(0, Number(e.target.value)) : 0 
                                            })}
                                            min="0"
                                            
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1">Giá tối đa</label>
                                        <input
                                            type="number"
                                            className="w-full p-2 border rounded"
                                            value={formData.conditionPriceMax === 0 ? '' : formData.conditionPriceMax}
                                            onChange={(e) => setFormData({ 
                                                ...formData, 
                                                conditionPriceMax: e.target.value ? Math.max(0, Number(e.target.value)) : 0 
                                            })}
                                            min="0"
                                            
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block mb-1">Số lượng</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 border rounded"
                                        value={formData.quantity === 0 ? '' : formData.quantity}
                                        onChange={(e) => setFormData({ 
                                            ...formData, 
                                            quantity: e.target.value ? Math.max(0, Number(e.target.value)) : 0 
                                        })}
                                        min="0"
                                        
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-1">Ngày bắt đầu</label>
                                        <input
                                            type="datetime-local"
                                            className="w-full p-2 border rounded"
                                            value={formData.startTime}
                                            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                            
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1">Ngày kết thúc</label>
                                        <input
                                            type="datetime-local"
                                            className="w-full p-2 border rounded"
                                            value={formData.endTime}
                                            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                            
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block mb-1">
                                        Mô tả 
                                        <span className="text-sm text-gray-500 ml-1">(không bắt buộc)</span>
                                    </label>
                                    <textarea
                                        className="w-full p-2 border rounded min-h-[100px]"
                                        value={formData.description || ''}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Nhập mô tả cho voucher..."
                                    />
                                </div>

                                {/* Add privacy setting */}
                                <div>
                                    <label className="block mb-1">Loại voucher</label>
                                    <div className="space-y-2">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                checked={!formData.isPrivate}
                                                onChange={() => setFormData({ ...formData, isPrivate: false })}
                                                className="rounded"
                                            />
                                            <span>
                                                Công khai
                                                <span className="text-sm text-gray-500 ml-1">
                                                    (Áp dụng cho tất cả khách hàng đủ điều kiện)
                                                </span>
                                            </span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                checked={formData.isPrivate}
                                                onChange={() => setFormData({ ...formData, isPrivate: true })}
                                                className="rounded"
                                            />
                                            <span>
                                                Riêng tư
                                                <span className="text-sm text-gray-500 ml-1">
                                                    (Chỉ áp dụng cho khách hàng được chỉ định)
                                                </span>
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    className="px-4 py-2 border rounded"
                                    onClick={handleCloseModal}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded"
                                >
                                    {isEditing ? 'Cập nhật' : 'Tạo'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showAssignModal && selectedVoucher && selectedVoucher.isPrivate && (
                <AssignVoucherModal
                    voucher={selectedVoucher}
                    onClose={closeAssignModal}
                    onRefresh={refreshVouchers}
                />
            )}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    )
}

// Add interface for props
interface AssignVoucherModalProps {
    voucher: Voucher;
    onClose: () => void;
    onRefresh: () => void; // Add new prop for refreshing
}

// Update the AssignVoucherModal component
const AssignVoucherModal = ({ voucher, onClose, onRefresh }: AssignVoucherModalProps) => {
    const [accounts, setAccounts] = useState<AccountResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedAccounts, setSelectedAccounts] = useState<number[]>([]);

    // Fetch customers when component mounts
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                setLoading(true);
                // First get all customers with role_4
                const response = await axios.get(`${API_BASE_URL}/account/list`);
                
                // Get list of accounts that already have this voucher
                const voucherAccountsResponse = await axios.get(
                    `${API_BASE_URL}/admin/voucher/${voucher.id}/accounts`
                );
                
                const existingAccountIds = voucherAccountsResponse.data.data.map(
                    (account: AccountResponse) => account.id
                );

                // Filter customers: role_4, active, and don't have the voucher yet
                const customers = response.data.data.filter((account: AccountResponse) => 
                    account.idRole?.id === 4 && 
                    account.status === 'ACTIVE' &&
                    !existingAccountIds.includes(account.id)
                );

                console.log('Available customers:', customers);
                setAccounts(customers);
            } catch (error) {
                console.error('Error fetching customers:', error);
                setError('Không thể tải danh sách khách hàng');
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, [voucher.id]);

    // Handle assign button click
    const handleAssign = async () => {
        if (selectedAccounts.length === 0) {
            toast.warning('Vui lòng chọn ít nhất một khách hàng');
            return;
        }

        try {
            setLoading(true);
            const selectedCustomers = accounts.filter(account => 
                selectedAccounts.includes(account.id)
            );
            
            const response = await axios.post(`${API_BASE_URL}/admin/voucher/assign`, {
                voucherId: voucher.id,
                customerIds: selectedCustomers.map(customer => customer.id)
            });

            const result = response.data;

            if (result.success) {
                toast.success('Thêm voucher và gửi mail thành công');
                // Immediately refresh data and close modal
                await onRefresh();
                onClose();
            } else {
                if (result.details?.alreadyHasVoucher?.length > 0) {
                    toast.warning(
                        `Các tài khoản sau đã có voucher: ${result.details.alreadyHasVoucher.join(', ')}`
                    );
                }
                if (result.details?.assigned?.length > 0) {
                    toast.success(
                        `Đã thêm voucher và gửi mail thành công cho: ${result.details.assigned.join(', ')}`
                    );
                    // Refresh even on partial success
                    await onRefresh();
                    onClose();
                }
            }

        } catch (error) {
            console.error('Lỗi khi thêm voucher:', error);
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm voucher');
            } else {
                toast.error('Có lỗi xảy ra khi thêm voucher');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-[800px] max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Thêm Voucher cho Khách Hàng</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <h3 className="font-medium text-blue-800 mb-2">Chi tiết voucher</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <span className="text-sm text-blue-600">Mã voucher:</span>
                            <p className="font-medium">{voucher.code}</p>
                        </div>
                        <div>
                            <span className="text-sm text-blue-600">Tên voucher:</span>
                            <p className="font-medium">{voucher.name}</p>
                        </div>
                        <div>
                            <span className="text-sm text-blue-600">Giá trị:</span>
                            <p className="font-medium">
                                {voucher.discountValue.toLocaleString('vi-VN')}{voucher.voucherType ? '%' : 'đ'}
                            </p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
                        {error}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg border">
                        <div className="p-4 border-b">
                            <h3 className="font-medium">Danh sách khách hàng</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="w-16 px-4 py-3 text-left">
                                            <input
                                                type="checkbox"
                                                className="rounded"
                                                checked={selectedAccounts.length === accounts.length}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedAccounts(accounts.map(acc => acc.id));
                                                    } else {
                                                        setSelectedAccounts([]);
                                                    }
                                                }}
                                            />
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Họ tên</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Email</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Số điện thoại</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {accounts.map((account) => (
                                        <tr key={account.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <input
                                                    type="checkbox"
                                                    id={`customer-${account.id}`}
                                                    checked={selectedAccounts.includes(account.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedAccounts([...selectedAccounts, account.id]);
                                                        } else {
                                                            setSelectedAccounts(selectedAccounts.filter(id => id !== account.id));
                                                        }
                                                    }}
                                                    className="rounded"
                                                />
                                            </td>
                                            <td className="px-4 py-3">{account.fullName}</td>
                                            <td className="px-4 py-3">{account.email}</td>
                                            <td className="px-4 py-3">{account.phone || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {accounts.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                Không có khách hàng nào
                            </div>
                        )}
                    </div>
                )}

                <div className="flex justify-end items-center space-x-3 mt-6 pt-4 border-t">
                    <span className="text-sm text-gray-600">
                        Đã chọn {selectedAccounts.length} khách hàng
                    </span>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                        disabled={loading}
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleAssign}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                        disabled={loading || selectedAccounts.length === 0}
                    >
                        {loading ? 'Đang xử lý...' : 'Thêm voucher'}
                    </button>
                </div>
            </div>
        </div>
    );
};