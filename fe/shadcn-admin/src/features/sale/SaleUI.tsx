import React, { useEffect, useState } from "react"
import { getSales, updateSale, createSale, searchSales, addProductDetailToSale } from "./data/apiSale"
import { toast } from "@/hooks/use-toast"
import axios from 'axios'
import { IconEdit } from "@tabler/icons-react" // Remove IconEye
import { Checkbox } from "@/components/ui/checkbox"
import { toServerDateTime, fromServerDateTime, toInputDateTime } from '@/utils/datetime'

interface Sale {
    id: number;
    code: string;
    name: string;
    dateStart: string;
    dateEnd: string;
    status: string;
    description: string;
    discountValue: number;
    discountType: boolean;
}

// Thêm enum cho trạng thái
enum SaleStatus {
  UPCOMING = 'UPCOMING',    // Sắp diễn ra
  ACTIVE = 'ACTIVE',       // Đang diễn ra
  INACTIVE = 'INACTIVE',   // Đã kết thúc
}

interface ProductSale {
    id: number;
    code: string; // Chuyển lên trước để match với thứ tự hiển thị
    name: string;
    description: string;
    content: string;
    weight: number;
    status: string;
}

interface ProductDetailSale {
    id: number;
    code: string;
    price: number;
    priceSell: number | null;
    inventoryQuantity: number;
    colorName: string; 
    ramSize: number;
    romSize: number;
    productName: string;
    discountValue: number | null;
    discountType: boolean | null;
}

// Thêm interface để lưu trữ sản phẩm đã chọn cho mỗi chương trình
interface SaleProducts {
  [saleId: number]: {
    selectedProducts: Set<number>;
    selectedDetails: Set<number>;
  }
}

const STORAGE_KEY = 'sale_products';

interface IProductDetails {
    [productId: number]: ProductDetailSale[]
}

export default function SaleUI() {
    const [sales, setSales] = useState<Sale[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<Omit<Sale, 'id'>>({
        code: '',
        name: '',
        dateStart: '',
        dateEnd: '',
        status: 'ACTIVE',
        description: '',
        discountValue: 0,
        discountType: false
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [searchParams, setSearchParams] = useState({
        code: "",
        dateStart: "",
        dateEnd: ""
    });

    const [showProductsModal, setShowProductsModal] = useState(false);
    const [selectedSaleProducts, setSelectedSaleProducts] = useState<ProductSale[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);

    // Thêm state cho tìm kiếm sản phẩm
    const [productSearchQuery, setProductSearchQuery] = useState("");
    const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
    const [productDetails, setProductDetails] = useState<IProductDetails>({});
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const [currentSaleId, setCurrentSaleId] = useState<number | null>(null);

    // Add new state for tracking checked product details
    const [selectedDetails, setSelectedDetails] = useState<Set<number>>(new Set());

    // Khởi tạo state với dữ liệu từ localStorage
    const [saleProducts, setSaleProducts] = useState<SaleProducts>(() => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        return savedData ? JSON.parse(savedData) : {};
    });

    // Cập nhật localStorage mỗi khi saleProducts thay đổi
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saleProducts));
    }, [saleProducts]);

    // Thêm hàm lọc sản phẩm 
    const filteredProducts = selectedSaleProducts.filter(product => {
        if (!productSearchQuery) return true;
        
        const searchLower = productSearchQuery.toLowerCase();
        return (
            (product.code?.toLowerCase() || '').includes(searchLower) ||
            (product.name?.toLowerCase() || '').includes(searchLower)
        );
    });

    const handleEdit = async (sale: Sale) => {
        setIsEditing(true);
        setEditId(sale.id);
        setCurrentSaleId(sale.id);
        
        setFormData({
            ...sale,
            dateStart: toInputDateTime(sale.dateStart),
            dateEnd: toInputDateTime(sale.dateEnd)
        });

        try {
            // 1. Load danh sách sản phẩm 
            const productsResponse = await axios.get('http://localhost:8080/api/admin/products');
            setSelectedSaleProducts(productsResponse.data);

            // 2. Load danh sách sản phẩm đã được chọn cho sale này
            const saleProductsResponse = await axios.get(`http://localhost:8080/api/admin/sale/${sale.id}/products`);
            const selectedProductIds: Set<number> = new Set(saleProductsResponse.data.map((item: any) => item.productId));
            setSelectedProducts(selectedProductIds);

            // 3. Load chi tiết sản phẩm cho mỗi sản phẩm đã chọn
            const detailsPromises = Array.from(selectedProductIds).map((productId: number) =>
                axios.get(`http://localhost:8080/api/admin/product-details/by-product/${productId}`)
            );
            
            const detailsResponses = await Promise.all(detailsPromises);
            const productDetailsMap: IProductDetails = {};
            
            detailsResponses.forEach((response, index) => {
                const productId = Array.from(selectedProductIds)[index];
                productDetailsMap[productId] = response.data;
            });

            setProductDetails(productDetailsMap);

            // 4. Load danh sách sản phẩm chi tiết đã được chọn
            const selectedDetailsResponse = await axios.get(`http://localhost:8080/api/admin/sale/${sale.id}/product-details`);
            const selectedDetailIds: Set<number> = new Set(selectedDetailsResponse.data.map((detail: any) => detail.id));
            setSelectedDetails(selectedDetailIds);

        } catch (error) {
            console.error('Error loading sale data:', error);
        }

        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            
            const formattedData = {
                ...formData,
                dateStart: toServerDateTime(formData.dateStart),
                dateEnd: toServerDateTime(formData.dateEnd)
            };

            let saleId: number;

            if (isEditing && editId) {
                await updateSale(editId, formattedData);
                saleId = editId;
                toast({
                    title: "Thành công",
                    description: "Chương trình giảm giá đã được cập nhật"
                });
            } else {
                // Bước 1: Tạo sale mới
                const newSale = await createSale(formattedData);
                saleId = newSale.id;
                toast({
                    title: "Thành công",
                    description: "Thêm mới chương trình giảm giá thành công"
                });
            }

            // Bước 2: Thêm sản phẩm chi tiết vào sale
            if (saleId) {
                // Lấy tất cả product detail IDs đã chọn
                const selectedDetailIds = Array.from(selectedDetails);
                
                if (selectedDetailIds.length > 0) {
                    // Call API để gán sản phẩm chi tiết vào sale
                    await axios.post(`http://localhost:8080/api/admin/sale/assign-products`, {
                        saleId: saleId,
                        productDetailIds: selectedDetailIds
                    });

                }
            }

            // Refresh data và đóng modal
            const newData = await getSales();
            setSales(newData);
            handleCloseModal();

        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: error.response?.data?.message || "Không thể lưu chương trình giảm giá"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setEditId(null);
        setFormData({
            code: '',
            name: '',
            dateStart: '',
            dateEnd: '',
            status: 'ACTIVE',
            description: '',
            discountValue: 0,
            discountType: false
        });
    };

    const handleCreate = async () => {
        setIsEditing(false);
        setEditId(null);
        setShowModal(true);
        
        // Load products when opening create modal
        try {
            setLoadingProducts(true);
            const response = await axios.get('http://localhost:8080/api/admin/products');
            setSelectedSaleProducts(response.data);
        } catch (error) {
            console.error('Error:', error);
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: "Không thể tải danh sách sản phẩm"
            });
        } finally {
            setLoadingProducts(false);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            
            // Prepare search params
            const params: any = {};
            
            if (searchParams.code) {
                params.code = searchParams.code;
            }
            
            if (searchParams.dateStart) {
                params.dateStart = searchParams.dateStart;
            }
            
            if (searchParams.dateEnd) {
                params.dateEnd = searchParams.dateEnd;
            }

            console.log('Searching with params:', params); // For debugging
            
            const data = await searchSales(params);
            setSales(data);
            setCurrentPage(1); // Reset to first page after search
            
        } catch (error) {
            console.error("Error searching sales:", error);
            setError(error as Error);
        } finally {
            setLoading(false);
        }
    };

    const handleResetSearch = async () => {
        setSearchParams({
            code: "",
            dateStart: "",
            dateEnd: ""
        });
        try {
            const data = await getSales();
            setSales(data);
        } catch (error) {
            console.error("Error resetting search:", error);
        }
    };

    const loadSelectedProducts = async (saleId: number) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/admin/sale/${saleId}/products`);
            const selectedProductIds: Set<number> = new Set(response.data.map((item: any) => item.productId));
            setSelectedProducts(selectedProductIds);
        } catch (error) {
            console.error('Error loading selected products:', error);
        }
    };

    // Sửa lại handleProductSelect để làm việc với Set thay vì Array
    const handleProductSelect = async (productId: number, checked: boolean) => {
        // Create a new Set from the existing selections
        const newSelectedProducts = new Set(selectedProducts);
        
        if (checked) {
            // Khi chọn sản phẩm
            newSelectedProducts.add(productId);

            // Tự động load chi tiết sản phẩm
            try {
                const response = await axios.get(`http://localhost:8080/api/admin/product-details/by-product/${productId}`);
                const productDetailsList = response.data;
                
                // Lưu chi tiết sản phẩm vào state
                setProductDetails(prev => ({
                    ...prev,
                    [productId]: productDetailsList
                }));

                // Tự động chọn tất cả các chi tiết sản phẩm
                const newSelectedDetails = new Set(selectedDetails);
                productDetailsList.forEach((detail: ProductDetailSale) => {
                    newSelectedDetails.add(detail.id);
                });
                setSelectedDetails(newSelectedDetails);

            } catch (error) {
                console.error('Error loading product details:', error);
            }
        } else {
            // Khi bỏ chọn sản phẩm
            newSelectedProducts.delete(productId);
            
            // Bỏ chọn tất cả chi tiết sản phẩm của sản phẩm này
            const newSelectedDetails = new Set(selectedDetails);
            if (productDetails[productId]) {
                productDetails[productId].forEach((detail: ProductDetailSale) => {
                    newSelectedDetails.delete(detail.id);
                });
            }
            setSelectedDetails(newSelectedDetails);

            // Xóa chi tiết sản phẩm khỏi state
            setProductDetails(prev => {
                const newDetails = { ...prev };
                delete newDetails[productId];
                return newDetails;
            });
        }
        
        setSelectedProducts(newSelectedProducts);
    };

    // Add loadSaleProducts function to load products for a specific sale
    const loadSaleProducts = async (saleId: number) => {
        try {
            setLoadingProducts(true);
            // Use the correct API endpoint
            const response = await axios.get('http://localhost:8080/api/admin/products');
            setSelectedSaleProducts(response.data);
        } catch (error) {
            console.error('Error loading sale products:', error);
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: "Không thể tải danh sách sản phẩm cho chương trình này"
            });
        } finally {
            setLoadingProducts(false);
        }
    };

    // Update calculateDiscount to prefer priceSell if available
    const calculateDiscount = (price: number, discountValue: number, discountType: boolean) => {
        let finalPrice;
        if (discountType) { // If percentage
            finalPrice = price * (1 - discountValue / 100);
        } else { // If fixed amount
            finalPrice = price - discountValue;
        }
        // Ensure final price is not negative or greater than original price
        return Math.min(Math.max(finalPrice, 0), price);
    };

    // Update handleConfirmProducts để kiểm tra theo sale ID
    const handleConfirmProducts = () => {
        if (!currentSaleId) return;

        const currentSelectedProducts: Set<number> | number[] | undefined = saleProducts[currentSaleId]?.selectedProducts;
        const selectedCount = currentSelectedProducts instanceof Set ? 
            currentSelectedProducts.size : 
            (Array.isArray(currentSelectedProducts) ? (currentSelectedProducts as number[]).length : (currentSelectedProducts as Set<number>)?.size || 0);
        
        if (selectedCount === 0) {
            toast({
                variant: "destructive", 
                title: "Lỗi",
                description: "Vui lòng chọn ít nhất một sản phẩm"
            });
            return;
        }

        toast({
            title: "Đã chọn sản phẩm",
            description: `Số sản phẩm đã chọn cho chương trình: ${selectedCount}`
        });
        setShowProductsModal(false);
    };

    const handleConfirmDetails = async () => {
        if (!currentSaleId) {
            toast({
              variant: "destructive", 
              title: "Lỗi",
              description: "Không tìm thấy chương trình giảm giá"
            });
            return;
          }
        
          if (selectedDetails.size === 0) {
            toast({
              variant: "destructive",
              title: "Lỗi",
              description: "Vui lòng chọn ít nhất một chi tiết sản phẩm"
            });
            return;
          }
        
          try {
            setLoading(true);
            // Thêm từng sản phẩm chi tiết vào sale
            for (const detailId of selectedDetails) {
              await addProductDetailToSale(currentSaleId, detailId);
            }
        
            toast({
              title: "Thành công",
              description: `Đã thêm ${selectedDetails.size} sản phẩm vào chương trình giảm giá`
            });
        
            // Reset state
            setSelectedDetails(new Set());
            setShowDetailsModal(false);
        
          } catch (error: any) {
            console.error('Error:', error);
            toast({
              variant: "destructive",
              title: "Lỗi",
              description: error.response?.data?.message || "Không thể thêm sản phẩm vào chương trình giảm giá"
            });
          } finally {
            setLoading(false);
          }
    };

    // Sửa lại handleSelectAll để lưu đúng định dạng
    const handleSelectAll = async (checked: boolean) => {
        if (checked) {
            // Chỉ chọn các sản phẩm được lọc
            const newSelectedProducts = new Set(filteredProducts.map(product => product.id));
            setSelectedProducts(newSelectedProducts);
    
            // Không cần tự động load và chọn chi tiết sản phẩm
            if (currentSaleId) {
                setSaleProducts(prev => ({
                    ...prev,
                    [currentSaleId]: {
                        selectedProducts: newSelectedProducts,
                        selectedDetails: selectedDetails // Giữ nguyên selected details hiện tại
                    }
                }));
            }
        } else {
            // Clear all selections
            setSelectedProducts(new Set());
            
            // Update storage if needed
            if (currentSaleId) {
                setSaleProducts(prev => ({
                    ...prev,
                    [currentSaleId]: {
                        selectedProducts: new Set(),
                        selectedDetails: selectedDetails // Giữ nguyên selected details hiện tại
                    }
                }));
            }
        }
    };

    // Tính toán trạng thái của checkbox "Chọn tất cả"
    const isAllSelected = filteredProducts.length > 0 && 
        filteredProducts.every(product => selectedProducts.has(product.id));

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sales.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sales.length / itemsPerPage);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const data = await getSales()
                setSales(data)
            } catch (error) {
                setError(error as Error)
            } finally {
                setLoading(false)
            }
        }

        fetchSales()
    }, [])

    // Thêm function handleViewDetails
    const handleViewDetails = async (productId: number) => {
        try {
          setLoadingProducts(true);
          const response = await axios.get(`http://localhost:8080/api/admin/product-details/by-product/${productId}`);
          setProductDetails(prev => ({
            ...prev,
            [productId]: response.data
          }));

          // Automatically select all product details when viewing
          const newSelectedDetails = new Set(selectedDetails);
          response.data.forEach((detail: ProductDetailSale) => {
            newSelectedDetails.add(detail.id);
          });
          setSelectedDetails(newSelectedDetails);
          
        } catch (error) {
          console.error('Error:', error);
          toast({
            variant: "destructive", 
            title: "Lỗi",
            description: "Không thể tải chi tiết sản phẩm"
          });
        } finally {
          setLoadingProducts(false);
        }
    };

    // Thêm hàm để cập nhật trạng thái của một sale
    const updateSaleStatus = (sale: Sale): SaleStatus => {
        const now = new Date().getTime();
        const startDate = new Date(sale.dateStart).getTime();
        const endDate = new Date(sale.dateEnd).getTime();

        if (now < startDate) {
            return SaleStatus.UPCOMING;
        } else if (now >= startDate && now <= endDate) {
            return SaleStatus.ACTIVE;
        } else {
            return SaleStatus.INACTIVE;
        }
    };

    // Thêm useEffect để kiểm tra và cập nhật trạng thái
    useEffect(() => {
        const intervalId = setInterval(() => {
            setSales(currentSales => 
                currentSales.map(sale => {
                    const newStatus = updateSaleStatus(sale);
                    if (newStatus !== sale.status) {
                        return { ...sale, status: newStatus };
                    }
                    return sale;
                })
            );
        }, 1000); // Kiểm tra mỗi giây

        return () => clearInterval(intervalId);
    }, []);

    return (
        <>
            <div className="p-6 bg-gray-100 min-h-screen">
                <form onSubmit={handleSearch} className="mb-6 bg-white p-4 rounded-lg shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Mã chương trình</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                placeholder="Nhập mã để tìm..."
                                value={searchParams.code}
                                onChange={e => setSearchParams(prev => ({...prev, code: e.target.value}))}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-1">Từ ngày</label>
                            <input
                                type="date"
                                className="w-full p-2 border rounded"
                                value={searchParams.dateStart}
                                onChange={e => setSearchParams(prev => ({...prev, dateStart: e.target.value}))}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Đến ngày</label>
                            <input
                                type="date"
                                className="w-full p-2 border rounded"
                                value={searchParams.dateEnd}
                                onChange={e => setSearchParams(prev => ({...prev, dateEnd: e.target.value}))}
                            />
                        </div>

                        <div className="flex items-end gap-2">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                disabled={loading}
                            >
                                {loading ? 'Đang tìm...' : 'Tìm kiếm'}
                            </button>
                            <button
                                type="button"
                                className="ml-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                onClick={handleCreate}
                            >
                                + Thêm mới
                            </button>
                        </div>
                    </div>
                </form>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-200 text-gray-700">
                            <tr>
                                <th className="p-3">STT</th>
                                <th className="p-3">Mã</th>
                                <th className="p-3">Tên</th>
                                <th className="p-3">Giá trị</th>
                                <th className="p-3">Mô tả</th>
                                <th className="p-3">Thời Gian</th>
                                <th className="p-3">Trạng Thái</th>
                                <th className="p-3">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((sale, index) => (
                                <tr key={sale.id} className="border-t hover:bg-gray-50">
                                    <td className="p-3">{indexOfFirstItem + index + 1}</td> {/* Thay đổi ở đây */}
                                    <td className="p-3">{sale.code}</td>
                                    <td className="p-3">{sale.name}</td>
                                    <td className="p-3">
                                        {sale.discountValue.toLocaleString('vi-VN')} {sale.discountType ? '%' : 'đ'}
                                    </td>
                                    <td className="p-3">{sale.description}</td>
                                    <td className="p-3">
                                        {fromServerDateTime(sale.dateStart)} - {fromServerDateTime(sale.dateEnd)}
                                    </td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded-full text-sm ${
                                            sale.status === 'ACTIVE'
                                            ? 'bg-green-100 text-green-800'
                                            : sale.status === 'UPCOMING'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}>
                                            {sale.status === 'ACTIVE' 
                                              ? 'Đang diễn ra' 
                                              : sale.status === 'UPCOMING'
                                              ? 'Sắp diễn ra'
                                              : 'Đã kết thúc'}
                                        </span>
                                    </td>
                                    <td className="p-3 space-x-2">
                                        <button
                                            className="inline-flex items-center justify-center size-8 rounded-full hover:bg-gray-100"
                                            onClick={() => handleEdit(sale)}
                                            title="Sửa"
                                        >
                                            <IconEdit size={18} className="text-blue-600" />
                                        </button>
                                        {/* Remove eye icon button */}
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
                    Hiển thị {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, sales.length)} 
                    trên tổng số {sales.length} chương trình giảm giá
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg w-[1000px] max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">
                            {isEditing ? 'Cập Nhật Chương Trình' : 'Thêm Chương Trình Mới'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Information Section */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                                    Thông tin cơ bản
                                </h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Mã chương trình
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={formData.code}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Tên chương trình
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    {/* Thêm trường mô tả */}
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Mô tả
                                        </label>
                                        <textarea
                                            className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows={3}
                                            placeholder="Nhập mô tả cho chương trình..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Discount Information Section */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                                    Thông tin giảm giá
                                </h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Giá trị giảm
                                        </label>
                                        <div className="flex gap-3">
                                            <input
                                                type="number"
                                                className="flex-1 p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={formData.discountValue}
                                                onChange={(e) => {
                                                    const value = Number(e.target.value);
                                                    if (formData.discountType) {
                                                        // Nếu là %, giới hạn từ 0-100
                                                        if (value >= 0 && value <= 100) {
                                                            setFormData({ ...formData, discountValue: value });
                                                        }
                                                    } else {
                                                        // Nếu là VND, chỉ cần >= 0
                                                        if (value >= 0) {
                                                            // Find minimum price from visible product details
                                                            const minPrice = Math.min(
                                                                ...Object.values(productDetails)
                                                                    .flat()
                                                                    .map(detail => detail.price)
                                                            );
                                                            // Limit discount to minPrice
                                                            const validDiscount = Math.min(value, minPrice || Infinity);
                                                            setFormData({ ...formData, discountValue: validDiscount });
                                                        }
                                                    }
                                                }}
                                                min="0"
                                                max={formData.discountType ? "100" : undefined}
                                                required
                                            />
                                            <select
                                                className="w-24 p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={formData.discountType ? "true" : "false"}
                                                onChange={(e) => {
                                                    const isPercentage = e.target.value === "true";
                                                    // Reset giá trị về 0 nếu chuyển sang %
                                                    if (isPercentage && formData.discountValue > 100) {
                                                        setFormData({ 
                                                            ...formData, 
                                                            discountType: isPercentage,
                                                            discountValue: 0 
                                                        });
                                                    } else {
                                                        setFormData({ 
                                                            ...formData, 
                                                            discountType: isPercentage 
                                                        });
                                                    }
                                                }}
                                            >
                                                <option value="false">VNĐ</option>
                                                <option value="true">%</option>
                                            </select>
                                        </div>
                                        {formData.discountType && (
                                            <p className="text-sm text-gray-500">
                                               
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Thời gian áp dụng
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                type="datetime-local"
                                                className="p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={formData.dateStart}
                                                onChange={(e) => setFormData({ ...formData, dateStart: e.target.value })}
                                                required
                                            />
                                            <input
                                                type="datetime-local"
                                                className="p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={formData.dateEnd}
                                                onChange={(e) => setFormData({ ...formData, dateEnd: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Products Section */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-700">
                                        Sản phẩm áp dụng
                                    </h3>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Tìm kiếm sản phẩm..."
                                            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={productSearchQuery}
                                            onChange={(e) => setProductSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="max-h-[400px] overflow-auto rounded-lg border border-gray-200">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50 sticky top-0">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    <Checkbox
                                                        checked={isAllSelected}
                                                        onCheckedChange={handleSelectAll}
                                                    />
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Mã SP
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tên sản phẩm
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Mô tả
                                                </th>
                                                {/* Xóa cột Chi tiết */}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredProducts.map((product, index) => (
                                                <React.Fragment key={product.id}>
                                                    <tr className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <Checkbox
                                                                checked={selectedProducts.has(product.id)}
                                                                onCheckedChange={(checked) =>
                                                                    handleProductSelect(product.id, checked as boolean)
                                                                }
                                                            />
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                            {product.code}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                            {product.name}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-500">
                                                            {product.description || "-"}
                                                        </td>
                                                        {/* Xóa cột Chi tiết */}
                                                    </tr>
                                                    {productDetails[product.id] && (
                                                        <tr>
                                                            <td colSpan={5} className="p-3 bg-gray-50">
                                                                <div className="ml-8">
                                                                    <table className="w-full">
                                                                        <thead className="bg-gray-100">
                                                                            <tr>
                                                                                <th className="p-2">Mã</th>
                                                                                <th className="p-2">Màu sắc</th>
                                                                                <th className="p-2">RAM</th>
                                                                                <th className="p-2">ROM</th>
                                                                                <th className="p-2">Giá gốc</th>
                                                                                <th className="p-2">Giá KM</th>
                                                                                <th className="p-2">Chọn</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {productDetails[product.id].map((detail) => (
                                                                                <tr key={detail.id} className="border-b">
                                                                                    <td className="p-2">{detail.code}</td>
                                                                                    <td className="p-2">{detail.colorName}</td> 
                                                                                    <td className="p-2">{detail.ramSize}GB</td>
                                                                                    <td className="p-2">{detail.romSize}GB</td>
                                                                                    <td className="p-2">{detail.price?.toLocaleString('vi-VN')}đ</td>
                                                                                    <td className="p-2">
                                                                                        {(detail.priceSell || calculateDiscount(
                                                                                            detail.price,
                                                                                            formData.discountValue, 
                                                                                            formData.discountType
                                                                                        ))?.toLocaleString('vi-VN')}đ
                                                                                    </td>
                                                                                    <td className="p-2">
                                                                                        <Checkbox
                                                                                            checked={selectedDetails.has(detail.id)}
                                                                                            onCheckedChange={(checked) => {
                                                                                                setSelectedDetails(prev => {
                                                                                                    const newSet = new Set(prev);
                                                                                                    if (checked) {
                                                                                                        newSet.add(detail.id);
                                                                                                    } else {
                                                                                                        newSet.delete(detail.id);
                                                                                                    }
                                                                                                    return newSet;
                                                                                                });
                                                                                            }}
                                                                                        />
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    disabled={loading}
                                >
                                    {loading ? "Đang lưu..." : isEditing ? "Cập nhật" : "Thêm mới"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Products Modal */}
            {showProductsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-[800px]">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Danh sách sản phẩm</h2>
                            <button
                                onClick={() => setShowProductsModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Thêm ô tìm kiếm */}
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo mã hoặc tên sản phẩm..."
                                className="w-full p-2 border rounded"
                                value={productSearchQuery}
                                onChange={(e) => setProductSearchQuery(e.target.value)}
                            />
                        </div>
                        
                        {loadingProducts ? (
                            <div className="flex justify-center py-8">
                                <span>Đang tải...</span>
                            </div>
                        ) : (
                            <div className="max-h-[500px] overflow-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="p-3">
                                                <Checkbox
                                                    checked={isAllSelected}
                                                    onCheckedChange={handleSelectAll}
                                                />
                                            </th>
                                            <th className="p-3">STT</th>
                                            <th className="p-3">Mã sản phẩm</th>
                                            <th className="p-3">Tên sản phẩm</th>
                                            <th className="p-3">Mô tả</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.map((product, index) => (
                                            <>
                                            <tr key={product.id} className="border-b">
                                                <td className="p-3">
                                                    <Checkbox
                                                        checked={selectedProducts.has(product.id)}
                                                        onCheckedChange={(checked) => 
                                                            handleProductSelect(product.id, checked as boolean)
                                                        }
                                                    />
                                                </td>
                                                <td className="p-3">{indexOfFirstItem + index + 1}</td> {/* Thay đổi ở đây */}
                                                <td className="p-3">{product.code}</td>
                                                <td className="p-3">{product.name}</td>
                                                <td className="p-3">
                                                    {product.description ? (
                                                        <div className="max-w-[300px] truncate" title={product.description}>
                                                            {product.description}
                                                        </div>
                                                    ) : "-"}
                                                </td>
                                            </tr>
                                            {/* Hiển thị chi tiết sản phẩm nếu được chọn */}
                                            {productDetails[product.id] && (
                                            <tr>
                                                <td colSpan={5} className="p-3 bg-gray-50">
                                                <div className="ml-8">
                                                    <table className="w-full">
                                                    <thead className="bg-gray-100">
                                                        <tr>
                                                        <th className="p-2">Mã</th>
                                                        <th className="p-2">Màu sắc</th>
                                                        <th className="p-2">RAM/ROM</th>
                                                        <th className="p-2">Số lượng</th>
                                                        <th className="p-2">Giá gốc</th>
                                                        <th className="p-2">Giá bán</th>
                                                        <th className="p-2">Chọn</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {productDetails[product.id].map((detail) => (
                                                        <tr key={detail.id} className="border-b">
                                                            <td className="p-2">{detail.code}</td>
                                                            <td className="p-2">{detail.colorName}</td>
                                                            <td className="p-2">{detail.ramSize}GB/{detail.romSize}GB</td>
                                                            <td className="p-2">{detail.inventoryQuantity}</td>
                                                            <td className="p-2">{detail.price?.toLocaleString('vi-VN')}đ</td>
                                                            <td className="p-2">{detail.priceSell?.toLocaleString('vi-VN') || '-'}đ</td>
                                                            <td className="p-2">
                                                            <Checkbox
                                                                checked={selectedDetails.has(detail.id)}
                                                                onCheckedChange={(checked) => {
                                                                setSelectedDetails(prev => {
                                                                    const newSet = new Set(prev);
                                                                    if (checked) {
                                                                    newSet.add(detail.id);
                                                                    } else {
                                                                    newSet.delete(detail.id);
                                                                    }
                                                                    return newSet;
                                                                });
                                                                }}
                                                            />
                                                            </td>
                                                        </tr>
                                                        ))}
                                                    </tbody>
                                                    </table>
                                                </div>
                                                </td>
                                            </tr>
                                            )}
                                        </>
                                        ))}
                                        {filteredProducts.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="p-3 text-center text-gray-500">
                                                    Không tìm thấy sản phẩm nào
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        
                        <div className="flex justify-end mt-4 gap-2">
                            <button
                                onClick={handleConfirmProducts}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Xác nhận
                            </button>
                            <button
                                onClick={() => setShowProductsModal(false)}
                                className="px-4 py-2 border rounded"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Product Details Modal */}
            {showDetailsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-[800px]">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Chi tiết sản phẩm</h2>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="max-h-[500px] overflow-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-3">Chọn</th>
                                        <th className="p-3">STT</th>
                                        <th className="p-3">Mã</th>
                                        <th className="p-3">Tên sản phẩm</th>
                                        <th className="p-3">Màu sắc</th>
                                        <th className="p-3">Giá gốc</th>
                                        <th className="p-3">Giá sau giảm</th>
                                        <th className="p-3">Mức giảm</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.values(productDetails).flat().map((detail, index) => (
                                        <tr key={detail.id} className="border-b">
                                            <td className="p-3">
                                                <Checkbox
                                                    checked={selectedDetails.has(detail.id)}
                                                    onCheckedChange={(checked) => {
                                                        setSelectedDetails(prev => {
                                                            const newSet = new Set(prev);
                                                            if (checked) {
                                                                newSet.add(detail.id);
                                                            } else {
                                                                newSet.delete(detail.id);
                                                            }
                                                            return newSet;
                                                        });
                                                    }}
                                                />
                                            </td>
                                            <td className="p-3">{index + 1}</td>
                                            <td className="p-3">{detail.code}</td>
                                            <td className="p-3">{detail.productName}</td>
                                            <td className="p-3">{detail.color}</td>
                                            <td className="p-3">{detail.price?.toLocaleString('vi-VN') || 0}đ</td>
                                            <td className="p-3">
                                                {(detail.effectivePrice || detail.price)?.toLocaleString('vi-VN') || 0}đ
                                            </td>
                                            <td className="p-3">
                                                {detail.price && detail.effectivePrice 
                                                    ? Math.round(((detail.price - detail.effectivePrice) / detail.price) * 100)
                                                    : 0}%
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-end mt-4 gap-2">
                            <button
                                onClick={handleConfirmDetails}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Xác nhận
                            </button>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="px-4 py-2 border rounded"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
