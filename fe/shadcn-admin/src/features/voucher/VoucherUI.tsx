import { useEffect, useState, useCallback } from "react";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import { 
    getVouchers, 

    checkVoucherCode,  // Make sure this is imported
    assignVoucherToCustomers,
    VoucherSearchParams,
    searchVouchers,
    getVoucherUsageStatuses,
    VoucherStatus
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
    status: VoucherStatus; // Sửa kiểu từ StatusType thành VoucherStatus
    moTa?: string;
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
    voucherStatus?: VoucherAccountStatus; // Add voucherStatus field
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

enum VoucherAccountStatus {
    NOT_USED = "NOT_USED",
    USED = "USED",
    EXPIRED = "EXPIRED"
}



// Add helper function to check voucher status


// Sửa lại getStatusDisplay
const getStatusDisplay = (status: VoucherStatus) => {
    switch (status) {
        case VoucherStatus.UPCOMING:
            return {
                text: "Sắp diễn ra",
                className: "bg-yellow-100 text-yellow-800"
            };
        case VoucherStatus.ACTIVE:
            return {
                text: "Đang hoạt động",
                className: "bg-green-100 text-green-800"
            };
        case VoucherStatus.EXPIRED:
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

// Update VoucherStatusBadge component
const VoucherStatusBadge = ({ status }: { status: VoucherAccountStatus | null }) => {
    if (status === null) {
        return (
            <span className="px-2 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                Chưa kích hoạt
            </span>
        );
    }

    switch (status) {
        case VoucherAccountStatus.NOT_USED:
            return (
                <span className="px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    Chưa sử dụng
                </span>
            );
        case VoucherAccountStatus.USED:
            return (
                <span className="px-2 py-1 rounded-full text-sm bg-green-100 text-green-800">
                    Đã sử dụng
                </span>
            );
        case VoucherAccountStatus.EXPIRED:
            return (
                <span className="px-2 py-1 rounded-full text-sm bg-red-100 text-red-800">
                    Hết hạn
                </span>
            );
    }
};

export default function VoucherUI() {
    const [vouchers, setVouchers] = useState<Voucher[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<Omit<Voucher, 'id'>>({
        code: '',
        name: '',
        moTa: '',
        conditionPriceMin: 0,
        conditionPriceMax: 0,
        discountValue: 0,
        voucherType: false,
        quantity: 0,
        startTime: '',
        endTime: '',
        status: VoucherStatus.UPCOMING, // Sửa từ 'IN_ACTIVE' thành VoucherStatus.UPCOMING
        isPrivate: false,
        maxDiscountAmount: 0,
    });
    const getVoucherStatus = useCallback((startTime: string, endTime: string): VoucherStatus => {
        const now = new Date();
        const startDate = new Date(startTime);
        const endDate = new Date(endTime);
    
        if (now < startDate) {
            return VoucherStatus.UPCOMING;
        } else if (now > endDate) {
            return VoucherStatus.EXPIRED;
        } else {
            return VoucherStatus.ACTIVE;
        }
    }, []);
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

    // Thêm vào phần đầu của VoucherUI component
    const [accounts, setAccounts] = useState<AccountResponse[]>([]);
    const [selectedAccounts, setSelectedAccounts] = useState<number[]>([]);

    // Thêm state để track trạng thái cập nhật
    const [lastUpdate, setLastUpdate] = useState(new Date());

    // Thêm state cho form tìm kiếm với type cụ thể
    const [searchParams, setSearchParams] = useState<VoucherSearchParams>({
        keyword: '',
        startTime: '',
        endTime: '',
        isPrivate: undefined,
        status: undefined
    });

    // Thêm useEffect để load danh sách accounts khi cần
    useEffect(() => {
        const fetchCustomers = async () => {
            if (!showModal || !formData.isPrivate) return;

            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/account/list`);
                const customers = response.data.data.filter((account: AccountResponse) => 
                    account.idRole?.id === 4 && account.status === 'ACTIVE'
                );
                setAccounts(customers);
            } catch (error) {
                console.error('Error fetching customers:', error);
                toast.error('Không thể tải danh sách khách hàng');
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, [showModal, formData.isPrivate]);

    // Thêm useEffect để tự động cập nhật trạng thái
    useEffect(() => {
        const updateVoucherStatuses = async () => {
            const now = new Date();
            const updatedVouchers = await Promise.all(
                vouchers.map(async (voucher) => {
                    const startDate = new Date(voucher.startTime);
                    const endDate = new Date(voucher.endTime);
                    let newStatus = voucher.status;

                    if (now < startDate) {
                        newStatus = VoucherStatus.UPCOMING;
                    } else if (now > endDate) {
                        newStatus = VoucherStatus.EXPIRED;
                    } else {
                        newStatus = VoucherStatus.ACTIVE;
                    }

                    if (newStatus !== voucher.status) {
                        try {
                            // Gọi API để cập nhật status
                            await axios.put(`${API_BASE_URL}/admin/voucher/update-status/${voucher.id}`);
                        } catch (error) {
                            console.error('Error updating voucher status:', error);
                        }
                    }
                    return { ...voucher, status: newStatus };
                })
            );

            if (JSON.stringify(updatedVouchers) !== JSON.stringify(vouchers)) {
                setVouchers(updatedVouchers);
                setLastUpdate(now);
            }
        };

        const intervalId = setInterval(updateVoucherStatuses, 60000);
        updateVoucherStatuses();

        return () => clearInterval(intervalId);
    }, [vouchers]);

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
            moTa: voucher.moTa,
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
        if (!code.trim()) {
            toast.error('Mã voucher không được để trống');
            return false;
        }
        
        try {
            setIsCheckingCode(true);
            const response = await axios.get(`${API_BASE_URL}/admin/voucher/check-code`, {
                params: {
                    code: code.trim(),
                    excludeId: isEditing ? editId : undefined
                }
            });
            if (response.data) {
                toast.error('Mã voucher đã tồn tại');
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error checking code:', error);
            toast.error('Lỗi kiểm tra mã voucher');
            return false;
        } finally {
            setIsCheckingCode(false);
        }
    };

    // Modify the handleSubmit function
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate required fields
        if (!formData.code.trim()) {
            toast.error('Mã voucher không được để trống');
            return;
        }

        if (!formData.name.trim()) {
            toast.error('Tên voucher không được để trống');
            return;
        }

        if (formData.discountValue <= 0) {
            toast.error('Giá trị giảm phải lớn hơn 0');
            return;
        }

        if (formData.voucherType && formData.discountValue > 100) {
            toast.error('Giảm giá theo % không được vượt quá 100%');
            return;
        }

        if (formData.conditionPriceMin <= 0) {
            toast.error('Giá tối thiểu phải lớn hơn 0');
            return;
        }

        if (formData.conditionPriceMax <= formData.conditionPriceMin) {
            toast.error('Giá tối đa phải lớn hơn giá tối thiểu');
            return;
        }

        if (formData.quantity <= 0) {
            toast.error('Số lượng phải lớn hơn 0');
            return;
        }

        if (!formData.startTime || !formData.endTime) {
            toast.error('Vui lòng chọn thời gian bắt đầu và kết thúc');
            return;
        }

        const startDate = new Date(formData.startTime);
        const endDate = new Date(formData.endTime);
        if (startDate >= endDate) {
            toast.error('Thời gian kết thúc phải sau thời gian bắt đầu');
            return;
        }

        // Check for duplicate code
        if (!isEditing) {
            const isValidCode = await checkCode(formData.code);
            if (!isValidCode) {
                return;
            }
        }

        try {
            if (isEditing) {
                // Handle edit case
                const response = await axios.put(`${API_BASE_URL}/admin/voucher/${editId}`, formData);
                toast.success('Cập nhật voucher thành công!');
            } else {
                // Handle create case
                const response = await axios.post(`${API_BASE_URL}/admin/voucher`, formData);
                const newVoucher = response.data;

                // If it's a private voucher and we have selected accounts, assign them
                if (formData.isPrivate && selectedAccounts.length > 0) {
                    await axios.post(`${API_BASE_URL}/admin/voucher/assign`, {
                        voucherId: newVoucher.id,
                        customerIds: selectedAccounts
                    });
                    toast.success('Tạo voucher và thêm khách hàng thành công!');
                } else {
                    toast.success('Tạo voucher mới thành công!');
                }
            }

            // Refresh data and close modal
            await refreshVouchers();
            handleCloseModal();
        } catch (error) {
            console.error('Error:', error);
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi lưu voucher');
            } else {
                toast.error('Có lỗi xảy ra khi lưu voucher');
            }
        }
    };

    // Thêm hàm đóng modal và reset form
    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setEditId(null);
        setSelectedAccounts([]); // Reset selected accounts
        setFormData({
            code: '',
            name: '',
            moTa: '',
            conditionPriceMin: 0,
            conditionPriceMax: 0,
            discountValue: 0,
            voucherType: false,
            quantity: 0,
            startTime: '',
            endTime: '',
            status: VoucherStatus.UPCOMING, // Sửa từ 'IN_ACTIVE' thành VoucherStatus.UPCOMING
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
            setError(null);

            // Only include non-empty values
            const searchParamsToSend: VoucherSearchParams = {};

            if (searchParams.keyword?.trim()) searchParamsToSend.keyword = searchParams.keyword.trim();
            if (searchParams.startTime) searchParamsToSend.startTime = searchParams.startTime;
            if (searchParams.endTime) searchParamsToSend.endTime = searchParams.endTime;
            if (searchParams.isPrivate !== undefined) searchParamsToSend.isPrivate = searchParams.isPrivate;
            if (searchParams.status) searchParamsToSend.status = searchParams.status;

            const results = await searchVouchers(searchParamsToSend);
            setVouchers(results);
            setCurrentPage(1);
            
            if (results.length === 0) {
                toast.info('Không tìm thấy voucher phù hợp');
            }
        } catch (error) {
            console.error('Error searching:', error);
            const message = error instanceof Error ? error.message : 'Có lỗi xảy ra khi tìm kiếm';
            toast.error(message);
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
                setLoading(true);
                setError(null);
                const data = await getVouchers();
                setVouchers(data);
            } catch (error) {
                console.error('Error:', error);
                setError(error as Error);
                toast.error('Không thể tải danh sách voucher');
            } finally {
                setLoading(false);
            }
        };

        fetchVouchers();
    }, [])

    return (
        <>
            <div className="p-6 bg-gray-100 min-h-screen">

                {/* Thay thế phần tìm kiếm cũ bằng code sau */}
                <div className="mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-medium mb-4">Tìm kiếm voucher</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Từ khóa</label>
                                <input
                                    type="text"
                                    placeholder="Tìm theo mã hoặc tên..."
                                    className="w-full p-2 border rounded-md"
                                    value={searchParams.keyword || ''}
                                    onChange={(e) => setSearchParams({
                                        ...searchParams,
                                        keyword: e.target.value
                                    })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Từ ngày</label>
                                <input
                                    type="date"
                                    className="w-full p-2 border rounded-md"
                                    value={searchParams.startTime || ''}
                                    onChange={(e) => setSearchParams({
                                        ...searchParams,
                                        startTime: e.target.value
                                    })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Đến ngày</label>
                                <input
                                    type="date"
                                    className="w-full p-2 border rounded-md"
                                    value={searchParams.endTime || ''}
                                    onChange={(e) => setSearchParams({
                                        ...searchParams,
                                        endTime: e.target.value
                                    })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Loại voucher</label>
                                <select
                                    className="w-full p-2 border rounded-md"
                                    value={searchParams.isPrivate === undefined ? '' : String(searchParams.isPrivate)}
                                    onChange={(e) => setSearchParams({
                                        ...searchParams,
                                        isPrivate: e.target.value === '' ? undefined : e.target.value === 'true'
                                    })}
                                >
                                    <option value="">Tất cả</option>
                                    <option value="true">Riêng tư</option>
                                    <option value="false">Công khai</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Trạng thái</label>
                                <select
                                    className="w-full p-2 border rounded-md"
                                    value={searchParams.status || ''}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setSearchParams({
                                            ...searchParams,
                                            status: value === '' ? undefined : value as VoucherStatus
                                        });
                                    }}
                                >
                                    <option value="">Tất cả</option>
                                    <option value={VoucherStatus.UPCOMING}>Sắp diễn ra</option>
                                    <option value={VoucherStatus.ACTIVE}>Đang hoạt động</option>
                                    <option value={VoucherStatus.EXPIRED}>Đã hết hạn</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end mt-4 gap-2">
                            <button
                                onClick={() => {
                                    setSearchParams({});
                                    handleSearch();
                                }}
                                className="px-4 py-2 border rounded-md hover:bg-gray-100"
                            >
                                Làm mới
                            </button>
                            <button
                                onClick={handleSearch}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Tìm kiếm
                            </button>
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

                {/* Thay đổi phần table trong component chính */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto"> {/* Thêm div với overflow-x-auto */}
                        <table className="w-full text-left border-collapse min-w-[1200px]"> {/* Thêm min-width */}
                            <thead className="bg-gray-200 text-gray-700">
                                <tr>
                                    <th className="p-3 whitespace-nowrap">STT</th>
                                    <th className="p-3 whitespace-nowrap">Mã</th>
                                    <th className="p-3 whitespace-nowrap">Tên</th>
                                    <th className="p-3 whitespace-nowrap">Giá trị</th>
                                    <th className="p-3 whitespace-nowrap">Điều Kiện</th>
                                    <th className="p-3 whitespace-nowrap">Số Lượng</th>
                                    <th className="p-3 whitespace-nowrap">Thời Gian</th>
                                    <th className="p-3 whitespace-nowrap">Trạng Thái</th>
                                    <th className="p-3 whitespace-nowrap">Loại</th>
                                    <th className="p-3 whitespace-nowrap">Thao Tác</th>
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
                                                {new Date(voucher.startTime).toLocaleString('vi-VN', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })} 
                                                {' - '}
                                                {new Date(voucher.endTime).toLocaleString('vi-VN', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
                                            <td className="p-3">
                                                {(() => {
                                                    const currentStatus = getVoucherStatus(voucher.startTime, voucher.endTime);
                                                    const statusDisplay = getStatusDisplay(currentStatus);
                                                    return (
                                                        <span 
                                                            className={`px-2 py-1 rounded-full text-sm whitespace-nowrap ${statusDisplay.className}`}
                                                            title={`Cập nhật lần cuối: ${lastUpdate.toLocaleTimeString()}`}
                                                        >
                                                            {statusDisplay.text}
                                                        </span>
                                                    );
                                                })()}
                                            </td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded-full text-sm whitespace-nowrap ${
                                                    voucher.isPrivate 
                                                        ? 'bg-purple-100 text-purple-800' 
                                                        : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {voucher.isPrivate ? 'Riêng tư' : 'Công khai'}
                                                </span>
                                            </td>
                                            <td className="p-3 space-x-2 whitespace-nowrap">
                                                <button
                                                    className="text-blue-600 hover:text-blue-800"
                                                    onClick={() => handleEdit(voucher)}
                                                >
                                                    <SaveAsIcon/>
                                                </button>
                                                {voucher.isPrivate && (
                                                    <button
                                                        className=""
                                                        onClick={() => {
                                                            setSelectedVoucher(voucher);
                                                            setShowAssignModal(true);
                                                        }}
                                                    >
                                                        <PersonAddIcon/>
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
            {/* Thay đổi phần modal form */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg w-[900px] max-h-[90vh] flex flex-col"> {/* Tăng width từ 500px lên 1000px */}
                        <div className="p-6 border-b flex-shrink-0"> {/* Thêm border-b */}
                            <h2 className="text-2xl font-semibold"> {/* Tăng kích thước text */}
                                {isEditing ? 'Cập Nhật Voucher' : 'Tạo Voucher Mới'}
                            </h2>
                        </div>
                        
                        <div className="px-6 py-4 overflow-y-auto flex-grow">
                            {error && (
                                <div className="mb-4 p-3 bg-red-100 text-red-600 rounded">
                                    {error.message}
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-2 gap-6"> {/* Chia layout thành 2 cột */}
                                    <div className="space-y-4">
                                        {/* Cột trái */}
                                        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                                            <h3 className="font-medium text-lg mb-2">Thông tin cơ bản</h3>
                                            <div>
                                                <label className="block mb-1 font-medium">Mã voucher</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2 border rounded"
                                                    value={formData.code}
                                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                                    disabled={isEditing} // Disable input when editing
                                                />
                                            </div>
                                            <div>
                                                <label className="block mb-1 font-medium">Tên voucher</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2 border rounded"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    
                                                />
                                            </div>
                                            {/* Sửa lại phần input giá trị trong form */}
                                            <div>
                                                <label className="block mb-1 font-medium">Giá trị</label>
                                                <div className="space-y-2">
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
                                                            placeholder="Nhập giá trị giảm"
                                                        />
                                                        <select
                                                            className="p-2 border rounded"
                                                            value={formData.voucherType ? "true" : "false"}
                                                            onChange={(e) => setFormData({ 
                                                                ...formData, 
                                                                voucherType: e.target.value === "true",
                                                                // Reset maxDiscountAmount when switching to VND
                                                                maxDiscountAmount: e.target.value === "false" ? 0 : formData.maxDiscountAmount
                                                            })}
                                                        >
                                                            <option value="false">VNĐ</option>
                                                            <option value="true">%</option>
                                                        </select>
                                                    </div>
                                                    
                                                    {/* Hiển thị input giá trị giảm tối đa khi chọn % */}
                                                    {formData.voucherType && (
                                                        <div>
                                                            <label className="block mb-1 text-sm text-gray-600">
                                                                Giá trị giảm tối đa (VNĐ)
                                                            </label>
                                                            <input
                                                                type="number"
                                                                className="w-full p-2 border rounded"
                                                                value={formData.maxDiscountAmount === 0 ? '' : formData.maxDiscountAmount}
                                                                onChange={(e) => setFormData({
                                                                    ...formData,
                                                                    maxDiscountAmount: e.target.value ? Math.max(0, Number(e.target.value)) : 0
                                                                })}
                                                                min="0"
                                                                placeholder="Nhập giá trị giảm tối đa"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                {formData.voucherType && (
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        Giảm {formData.discountValue}% tối đa {formData.maxDiscountAmount?.toLocaleString('vi-VN')}đ
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                                            <h3 className="font-medium text-lg mb-2">Điều kiện áp dụng</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block mb-1 font-medium">Giá tối thiểu</label>
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
                                                    <label className="block mb-1 font-medium">Giá tối đa</label>
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
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Cột phải */}
                                        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                                            <h3 className="font-medium text-lg mb-2">Thời gian & Số lượng</h3>
                                            <div>
                                                <label className="block mb-1 font-medium">Số lượng</label>
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
                                                    <label className="block mb-1 font-medium">Ngày bắt đầu</label>
                                                    <input
                                                        type="datetime-local"
                                                        className="w-full p-2 border rounded"
                                                        value={formData.startTime}
                                                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                                        
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block mb-1 font-medium">Ngày kết thúc</label>
                                                    <input
                                                        type="datetime-local"
                                                        className="w-full p-2 border rounded"
                                                        value={formData.endTime}
                                                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                                        
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                                            <h3 className="font-medium text-lg mb-2">Loại voucher</h3>
                                            <div>
                                                <label className="block mb-1 font-medium">Loại voucher</label>
                                                <div className="space-y-2">
                                                    <label className={`flex items-center space-x-2 ${isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                        <input
                                                            type="radio"
                                                            checked={!formData.isPrivate}
                                                            onChange={() => setFormData({ ...formData, isPrivate: false })}
                                                            className="rounded"
                                                            disabled={isEditing} // Disable when editing
                                                        />
                                                        <span>
                                                            Công khai
                                                            <span className="text-sm text-gray-500 ml-1">
                                                                (Áp dụng cho tất cả khách hàng đủ điều kiện)
                                                            </span>
                                                        </span>
                                                    </label>
                                                    <label className={`flex items-center space-x-2 ${isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                        <input
                                                            type="radio"
                                                            checked={formData.isPrivate}
                                                            onChange={() => setFormData({ ...formData, isPrivate: true })}
                                                            className="rounded"
                                                            disabled={isEditing} // Disable when editing
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
                                    </div>
                                </div>

                                {/* Phần chọn khách hàng với layout mới */}
                                {!isEditing && formData.isPrivate && (
                                    <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-medium">Chọn khách hàng</h3>
                                            <span className="text-sm text-gray-500">
                                                Đã chọn {selectedAccounts.length} khách hàng
                                            </span>
                                        </div>
                                        
                                        {loading ? (
                                            <div className="flex items-center justify-center py-8">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                            </div>
                                        ) : (
                                            <div className="border rounded-lg bg-white max-h-[400px] overflow-y-auto"> {/* Giới hạn chiều cao và thêm scroll */}
                                                <table className="w-full">
                                                    <thead className="bg-gray-50 sticky top-0"> {/* Giữ header cố định */}
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
                                                            <th className="px-4 py-3 text-left font-medium">Họ tên</th>
                                                            <th className="px-4 py-3 text-left font-medium">Email</th>
                                                            <th className="px-4 py-3 text-left font-medium">Số điện thoại</th>
                                                            <th className="px-4 py-3 text-left font-medium">Trạng thái sử dụng</th>
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
                                                                <td className="px-4 py-3">
                                                                    {account.voucherStatus ? (
                                                                        <VoucherStatusBadge status={account.voucherStatus} />
                                                                    ) : (
                                                                        <span className="text-sm text-gray-500">-</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </form>
                        </div>

                        <div className="p-6 border-t flex-shrink-0 bg-gray-50">
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    className="px-6 py-2 border rounded-lg hover:bg-gray-100"
                                    onClick={handleCloseModal}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    disabled={loading}
                                >
                                    {isEditing ? 'Cập nhật' : 'Tạo'}
                                </button>
                            </div>
                        </div>
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
    const [usageStatuses, setUsageStatuses] = useState<Record<number, VoucherAccountStatus>>({});

    // Fetch customers when component mounts
    useEffect(() => {
        const fetchCustomersAndStatus = async () => {
            try {
                setLoading(true);
                // Lấy danh sách khách hàng
                const response = await axios.get(`${API_BASE_URL}/account/list`);
                
                // Lấy danh sách tài khoản đã có voucher này
                const voucherAccountsResponse = await axios.get(
                    `${API_BASE_URL}/admin/voucher/${voucher.id}/accounts`
                );
                
                const existingAccountIds = voucherAccountsResponse.data.data.map(
                    (account: AccountResponse) => account.id
                );

                // Lấy trạng thái sử dụng của voucher
                const usageStatusResponse = await getVoucherUsageStatuses(voucher.id);
                const statusMap = usageStatusResponse.reduce((acc, status) => ({
                    ...acc,
                    [status.accountId]: status.status
                }), {});
                setUsageStatuses(statusMap);

                // Lọc khách hàng
                const customers = response.data.data.filter((account: AccountResponse) => 
                    account.idRole?.id === 4 && 
                    account.status === 'ACTIVE'
                );

                setAccounts(customers);
            } catch (error) {
                console.error('Error:', error);
                setError('Không thể tải danh sách khách hàng');
            } finally {
                setLoading(false);
            }
        };

        fetchCustomersAndStatus();
    }, [voucher.id]);

    // Handle assign button click
    const handleAssign = async () => {
        try {
            setLoading(true);

            // Kiểm tra trạng thái hiện tại của voucher
            const currentStatus = getVoucherStatus(voucher.startTime, voucher.endTime);
            
            // Xác định trạng thái mới cho VoucherAccount dựa trên trạng thái Voucher
            let initialStatus = null;
            if (currentStatus === VoucherStatus.ACTIVE) {
                initialStatus = VoucherAccountStatus.NOT_USED;
            }
            // Nếu UPCOMING hoặc EXPIRED thì giữ null

            const response = await axios.post(`${API_BASE_URL}/admin/voucher/assign`, {
                voucherId: voucher.id,
                customerIds: selectedAccounts,
                initialStatus: initialStatus // Thêm trạng thái ban đầu vào request
            });

            if (response.data.success) {
                toast.success('Đã thêm voucher thành công');
                await onRefresh();
                onClose();
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Có lỗi xảy ra khi thêm voucher');
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
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Trạng thái sử dụng</th>
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
                                            <td className="px-4 py-3">
                                                {usageStatuses[account.id] ? (
                                                    <VoucherStatusBadge status={usageStatuses[account.id]} />
                                                ) : (
                                                    <span className="text-sm text-gray-500">
                                                        {(() => {
                                                            const voucherStatus = getVoucherStatus(voucher.startTime, voucher.endTime);
                                                            if (voucherStatus === VoucherStatus.ACTIVE) {
                                                                return "Chưa sử dụng";
                                                            } else {
                                                                return "Chưa kích hoạt";
                                                            }
                                                        })()}
                                                    </span>
                                                )}
                                            </td>
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

// Thêm helper function để xác định trạng thái voucher
const getVoucherStatus = (startTime: string, endTime: string): VoucherStatus => {
    const now = new Date();
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (now < startDate) {
        return VoucherStatus.UPCOMING;
    } else if (now > endDate) {
        return VoucherStatus.EXPIRED;
    } else {
        return VoucherStatus.ACTIVE;
    }
};