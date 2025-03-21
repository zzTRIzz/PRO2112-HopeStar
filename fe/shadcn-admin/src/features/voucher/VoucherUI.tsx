import { useEffect, useState } from "react"
import { 
    getVouchers, 
    searchVoucherByCode, 
    searchVoucherByDate, 
    searchVoucherByCodeAndDate,
    getAccounts,
    assignVoucherToAccounts 
} from "./data/apiVoucher"
import { useNavigate } from "@tanstack/react-router";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PlusIcon } from "lucide-react";


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
}

interface Role {
    id: number;
    code: string;
    name: string;
}

interface Account {
    id: number;
    fullName: string;
    code: string;
    email: string;
    phone?: string;
    address?: string;
    imageAvatar?: string;
    birthDate?: string;
    gender?: boolean;
    status: string;
    idRole: {
        id: number;
        code: string;
        name: string;
    };
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
    const itemsPerPage = 10;

    // Xóa state không cần thiết
    const [searchCode, setSearchCode] = useState('');

    // Thêm state
    const [searchStartTime, setSearchStartTime] = useState('');
    const [searchEndTime, setSearchEndTime] = useState('');

    // In VoucherUI component
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

    useEffect(() => {
        console.log('Selected voucher:', selectedVoucher);
        console.log('Show assign modal:', showAssignModal);
    }, [selectedVoucher, showAssignModal]);

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

    // Add validation function
    const validateForm = (): boolean => {
        // Check empty fields
        
        if (!formData.code.trim()) {
            setError(new Error('Mã voucher không được để trống'));
            return false;
        }
        if (!formData.name.trim()) {
            setError(new Error('Tên voucher không được để trống'));
            return false;
        }
        
        // Validate numeric values
        if (formData.quantity < 0) {
            setError(new Error('Số lượng không được nhỏ hơn 0'));
            return false;
        }
        if (formData.discountValue < 0) {
            setError(new Error('Giá trị giảm không được nhỏ hơn 0'));
            return false;
        }
        if (formData.conditionPriceMin < 0) {
            setError(new Error('Giá tối thiểu không được nhỏ hơn 0'));
            return false;
        }
        if (formData.conditionPriceMax < 0) {
            setError(new Error('Giá tối đa không được nhỏ hơn 0'));
            return false;
        }

        // Validate price conditions
        if (formData.conditionPriceMin > formData.conditionPriceMax) {
            setError(new Error('Giá tối thiểu không được lớn hơn giá tối đa'));
            return false;
        }

        // Validate dates
        if (!formData.startTime || !formData.endTime) {
            setError(new Error('Vui lòng chọn thời gian bắt đầu và kết thúc'));
            return false;
        }

        const startDate = new Date(formData.startTime);
        const endDate = new Date(formData.endTime);
        if (startDate > endDate) {
            setError(new Error('Ngày bắt đầu không được sau ngày kết thúc'));
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate form trước khi submit
        if (!formData.code.trim()) {
            toast.error('Vui lòng nhập mã voucher');
            return;
        }
        if (!formData.name.trim()) {
            toast.error('Vui lòng nhập tên voucher');
            return;
        }
        if (formData.discountValue <= 0) {
            toast.error('Giá trị giảm phải lớn hơn 0');
            return;
        }
        if (formData.quantity <= 0) {
            toast.error('Số lượng phải lớn hơn 0');
            return;
        }
        if (formData.conditionPriceMin <= 0) {
            toast.error('Giá tối thiểu phải lớn hơn 0');
            return;
        }
        if (formData.conditionPriceMax <= 0) {
            toast.error('Giá tối đa phải lớn hơn 0');
            return;
        }
        if (formData.conditionPriceMin > formData.conditionPriceMax) {
            toast.error('Giá tối thiểu không được lớn hơn giá tối đa');
            return;
        }
        if (!formData.startTime || !formData.endTime) {
            toast.error('Vui lòng chọn thời gian bắt đầu và kết thúc');
            return;
        }
    
        const startDate = new Date(formData.startTime);
        const endDate = new Date(formData.endTime);
        if (startDate > endDate) {
            toast.error('Ngày bắt đầu không được sau ngày kết thúc');
            return;
        }
    
        try {
            if (isEditing && editId) {
                await axios.put(`http://localhost:8080/api/admin/voucher/${editId}`, formData);
                toast.success('Cập nhật voucher thành công!');
            } else {
                await axios.post('http://localhost:8080/api/admin/voucher', formData);
                toast.success('Tạo voucher mới thành công!');
            }
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

    // Sửa lại hàm handleSearch
    const handleSearch = async () => {
        try {
            setLoading(true);
            let data;

            // Sửa lại phần xử lý tìm kiếm kết hợp
            if (searchCode.trim() && searchStartTime && searchEndTime) {
                const startDate = new Date(searchStartTime);
                const endDate = new Date(searchEndTime);
                
                if (startDate > endDate) {
                    toast.error('Ngày bắt đầu không được sau ngày kết thúc');
                    return;
                }

                try {
                    data = await searchVoucherByCodeAndDate(
                        searchCode.trim(),
                        searchStartTime,
                        searchEndTime
                    );

                    if (data.length === 0) {
                        toast.info('Không tìm thấy voucher phù hợp với điều kiện tìm kiếm');
                    } else {
                        console.log('Found vouchers:', data); // Debug log
                    }
                } catch (error) {
                    console.error('Search error:', error);
                    toast.error('Có lỗi xảy ra khi tìm kiếm');
                }
            }
            // Nếu chỉ có mã code
            else if (searchCode.trim()) {
                data = await searchVoucherByCode(searchCode);
                if (data.length === 0) {
                    toast.info('Không tìm thấy voucher với mã này');
                }
            }
            // Nếu chỉ có ngày
            else if (searchStartTime && searchEndTime) {
                const startDate = new Date(searchStartTime);
                const endDate = new Date(searchEndTime);
                
                if (startDate > endDate) {
                    toast.error('Ngày bắt đầu không được sau ngày kết thúc');
                    return;
                }
                
                data = await searchVoucherByDate(searchStartTime, searchEndTime);
                if (data.length === 0) {
                    toast.info('Không tìm thấy voucher trong khoảng thời gian này');
                }
            }
            // Nếu không có điều kiện tìm kiếm nào
            else {
                data = await getVouchers();
            }

            setVouchers(Array.isArray(data) ? data : []);
            setCurrentPage(1);
            setError(null);
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
                                        <td className="p-3 space-x-2">
                                            <button
                                                className="text-blue-600 hover:text-blue-800"
                                                onClick={() => handleEdit(voucher)}
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                className="text-green-600 hover:text-green-800"
                                                onClick={() => {
                                                    setSelectedVoucher(voucher);
                                                    setShowAssignModal(true);
                                                }}
                                                title="Thêm voucher cho khách hàng"
                                            >
                                                <span className="flex items-center gap-1">
                                                    <PlusIcon className="w-4 h-4" />
                                                    KH
                                                </span>
                                            </button>
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
            <ToastContainer
    position="top-right"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="colored"
/>
            {showAssignModal && selectedVoucher && (
                <AssignVoucherModal
                    voucher={selectedVoucher}
                    onClose={() => {
                        setShowAssignModal(false);
                        setSelectedVoucher(null);
                    }}
                />
            )}
        </>
    )
}

const AssignVoucherModal = ({ voucher, onClose }: { voucher: Voucher; onClose: () => void }) => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [selectedAccounts, setSelectedAccounts] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchAccounts = async () => {
        try {
            setLoading(true);
            const data = await getAccounts();
            console.log('Fetched accounts:', data);
            
            if (Array.isArray(data)) {
                setAccounts(data);
            } else {
                throw new Error('Dữ liệu không hợp lệ');
            }
        } catch (error: any) {
            console.error('Error fetching accounts:', error);
            toast.error(error.message || 'Không thể tải danh sách khách hàng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleSelectAccount = (accountId: number) => {
        setSelectedAccounts(prev => {
            if (prev.includes(accountId)) {
                return prev.filter(id => id !== accountId);
            }
            return [...prev, accountId];
        });
    };

    const handleSelectAll = () => {
        if (selectedAccounts.length === accounts.length) {
            setSelectedAccounts([]);
        } else {
            setSelectedAccounts(accounts.map(a => a.id));
        }
    };

    const handleAssign = async () => {
        if (selectedAccounts.length === 0) {
            toast.warning('Vui lòng chọn ít nhất một khách hàng');
            return;
        }

        try {
            setLoading(true);
            await assignVoucherToAccounts(voucher.id, selectedAccounts);
            toast.success('Đã thêm voucher cho khách hàng thành công');
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data || 'Có lỗi xảy ra khi thêm voucher');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
                <h2 className="text-xl font-semibold mb-4">Thêm voucher cho khách hàng</h2>
                
                <div className="mb-4 p-3 bg-gray-50 rounded">
                    <p><span className="font-medium">Mã voucher:</span> {voucher.code}</p>
                    <p><span className="font-medium">Tên voucher:</span> {voucher.name}</p>
                    <p><span className="font-medium">Số lượng còn lại:</span> {voucher.quantity}</p>
                </div>

                {loading ? (
                    <div className="text-center py-4">Đang tải...</div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="selectAll"
                                    checked={selectedAccounts.length === accounts.length}
                                    onChange={handleSelectAll}
                                    className="rounded"
                                />
                                <label htmlFor="selectAll">Chọn tất cả</label>
                            </div>
                            <span className="text-sm text-gray-600">
                                Đã chọn: {selectedAccounts.length} khách hàng
                            </span>
                        </div>

                        <div className="flex-1 overflow-y-auto">
    {loading ? (
        <div className="text-center py-4">Đang tải dữ liệu...</div>
    ) : accounts.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
            Không tìm thấy khách hàng nào
        </div>
    ) : (
        <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
                <tr>
                    <th className="p-3 text-left w-10"></th>
                    <th className="p-3 text-left">Mã KH</th>
                    <th className="p-3 text-left">Tên</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Số điện thoại</th>
                    <th className="p-3 text-left">Vai trò</th>
                </tr>
            </thead>
            <tbody>
                {accounts.map(account => (
                    <tr key={account.id} className="border-t">
                        <td className="p-3">
                            <input
                                type="checkbox"
                                checked={selectedAccounts.includes(account.id)}
                                onChange={() => handleSelectAccount(account.id)}
                                className="rounded"
                            />
                        </td>
                        <td className="p-3">{account.code}</td>
                        <td className="p-3">{account.fullName}</td>
                        <td className="p-3">{account.email}</td>
                        <td className="p-3">{account.phone || 'N/A'}</td>
                        <td className="p-3">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                {account.idRole?.name || 'N/A'}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )}
</div>

                    </>
                )}

                <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                    <button
                        className="px-4 py-2 border rounded hover:bg-gray-50"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Hủy
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                        onClick={handleAssign}
                        disabled={loading || selectedAccounts.length === 0}
                    >
                        {loading ? 'Đang xử lý...' : 'Thêm voucher'}
                    </button>
                </div>
            </div>
        </div>
    );
};