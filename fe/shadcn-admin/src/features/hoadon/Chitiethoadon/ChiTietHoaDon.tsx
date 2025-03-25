import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/header';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { Main } from '@/components/layout/main';
import { Button } from '@/components/ui/button';
import {
    findImeiByIdProductDaBan, findBill,
    findKhachHang, findImeiById,
    createImeiSold, deleteProduct, getImei,
    getProductDetail, addHDCT, getByIdBillDetail, getVoucherDangSuDung,
    updateImeiSold,

} from '@/features/hoadon/service/HoaDonService';
import { toast } from 'react-toastify';


interface SearchBillDetail {
    id: number
    price: number,
    quantity: number,
    totalPrice: number,
    idProductDetail: number,
    nameProduct: string,
    ram: number,
    rom: number,
    mauSac: string,
    imageUrl: string,
    idBill: number
}

interface ProductDetail {
    id: number,
    code: string,
    priceSell: number,
    inventoryQuantity: number,
    idProduct: number,
    name: string,
    ram: number,
    rom: number,
    color: string,
    imageUrl: string,
}

interface AccountKhachHang {
    id: number,
    code: string,
    fullName: string,
    email: string,
    phone: string,
    address: string,
    googleId: string
}
interface imei {
    id: number,
    imeiCode: string,
    barCode: string,
    status: string
}
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
    status: string;
}


import TrangThaiDonHang, { OrderStatus } from './components/TrangThaiDonHang';
import TasksProvider from '@/features/tasks/context/tasks-context';
import ThemSanPham from '@/features/banhang/components/ThemSanPham';
import { BillSchema } from '@/features/banhang/service/BillSchema';

import TableHoaDonChiTiet from './components/TableHoaDonChiTiet';
import ThongTinDonHang from './components/ThongTinDonHang';


const ChiTietHoaDon: React.FC = () => {


    const [searchBill, setSearchBill] = useState<BillSchema | null>(null);
    const [listProduct, setListProductDetail] = useState<ProductDetail[]>([]);
    const [listKhachHang, hienThiKhachHang] = useState<AccountKhachHang>();
    const [listImei, setListImei] = useState<imei[]>([]);
    const [idBill, setIdBill] = useState<number>(0);
    const [idProductDetail, setIdProductDetail] = useState<number>(0);
    const [selectedImei, setSelectedImei] = useState<number[]>([]);
    const [idBillDetail, setIdBillDetail] = useState<number>(0);
    const [product, setProduct] = useState<SearchBillDetail[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState<'product' | 'imei'>('product');
    const [isCapNhatImei, setIsCapNhatImei] = useState(false);
    const [setVoucherDangDung, setDuLieuVoucherDangDung] = useState<Voucher>();
    const [isBanGiaoHang, setIsBanGiaoHang] = useState(false);
    const handleBanGiaoHangChange = () => {
        setIsBanGiaoHang((prev) => !prev);
    };
    const [customerPayment, setCustomerPayment] = useState<number>(0);

    // Lấy danh sách hóa đơn, sản phẩm chi tiết, khách hàng, imei
    useEffect(() => {
        loadTongBill();
        loadProductDet();
    }, []);


    const loadTongBill = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = Number(urlParams.get("id")); // Chuyển thành số

        if (!isNaN(id) && id > 0) {
            setIdBill(id); // Chỉ cập nhật nếu ID hợp lệ
        }
        findBillById(id);
        getById(id);
        const khachHang = await findKhachHang(id);
        hienThiKhachHang(khachHang);
    }


    // Tìm kiêm bill theo id
    const findBillById = async (id: number) => {
        try {
            const data = await findBill(id);
            setSearchBill(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // Lấy hóa đơn chi tiet theo ID bill 
    const getById = async (id: number) => {
        try {
            const data = await getByIdBillDetail(id);
            setProduct(data);
            const voucher = await getVoucherDangSuDung(id);
            setDuLieuVoucherDangDung(voucher);
        } catch (error) {
            setProduct([]); // Xóa danh sách cũ
            setIdBill(0);
            console.error("Error fetching data:", error);
        }
    };


    // Lấy danh sách sản phẩm chi tiết
    const loadProductDet = async () => {
        try {
            const data = await getProductDetail();
            setListProductDetail(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Lấy danh sách imei
    const loadImei = async (idProductDetail: number) => {
        try {
            console.log("ID product detail tat ca:", idProductDetail);
            const data = await getImei(idProductDetail);
            setListImei(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Tìm kiếm imei theo idProductDetail
    const findImeiByIdProductDetail = async (idProductDetail: number, idBillDetai: number) => {
        try {
            const data = await findImeiById(idProductDetail, idBillDetai);
            setListImei(data);
            setIdProductDetail(idProductDetail);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Xoa san pham trong hoa don chi tiet
    const deleteBillDetail = async (idBillDetail: number) => {
        try {
            console.log(idBillDetail);
            await deleteProduct(idBillDetail, idBill);
            await loadProductDet();
            await loadImei(idProductDetail);
            await getById(idBill);
            fromThanhCong("Xóa sản phẩm chi tiết thành công");
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // Thêm sản phẩm chi tiết vào hóa đơn chi tiết 
    const handleAddProduct = async (product: ProductDetail) => {
        try {
            console.log("ID bill san pham " + idBill);
            if (idBill == 0 || idBill == null) {
                fromThatBai("Vui lòng chọn hóa đơn");
                setIsDialogOpen(false);
                return;
            }
            const newProduct = await addHDCT({
                idBill: idBill,
                idProductDetail: product.id
            });
            setIdBillDetail(newProduct.id);
            setIdProductDetail(product.id);
            setSelectedImei([]);
            loadImei(product.id);
            loadTongBill();
            setDialogContent('imei'); // Chuyển nội dung dialog sang IMEI
            fromThanhCong("Thêm sản phẩm vào hóa đơn thành công");
        } catch (error) {
            console.error("Lỗi API:", error);
        }
    };


    // Lấy danh sách imei 
    const handleCheckboxChange = (id: number) => {
        console.log("ID imei:", id);
        setSelectedImei((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    // Them imei vao hoa don chi tiet
    const handleAddImei = async (idBillDetail: number) => {
        try {
            const newImei = await createImeiSold({
                id_Imei: selectedImei,
                idBillDetail: idBillDetail
            },
                idBill,
                idProductDetail
            );
            console.log("Imei mới:", newImei);
            setSelectedImei([]);
            setIsDialogOpen(false); // Đóng dialog
            await loadProductDet();
            await loadImei(idProductDetail);
            loadTongBill();
            fromThanhCong("Thêm IMEI thành công");
        } catch (error) {
            console.error("Lỗi API:", error);
        }
    };


    const updateHandleImeiSold = async (idBillDetail: number) => {
        try {
            const newImei = await updateImeiSold({
                id_Imei: selectedImei,
                idBillDetail: idBillDetail
            },
                idBill,
                idProductDetail
            );
            console.log("Imei mới:", newImei);
            setSelectedImei([]);
            setIsCapNhatImei(false);
            await loadProductDet();
            await loadImei(idProductDetail);
            loadTongBill();
            fromThanhCong("Cập nhật IMEI thành công");
        } catch (error) {
            console.error("Lỗi API:", error);
        }
    };

    // Ca
    const handleUpdateProduct = async (idPD: number, billDetaill: number) => {
        console.log("ID product detail:", idPD);
        setSelectedImei([]);  // Reset trước khi cập nhật
        try {
            const data = await findImeiByIdProductDaBan(idPD, billDetaill);
            if (!Array.isArray(data)) {
                console.error("Dữ liệu trả về không phải là một mảng:", data);
                return;
            }
            const ids: number[] = data.map((imei) => imei.id);
            setSelectedImei(ids);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách IMEI đã bán:", error);
        }
        findImeiByIdProductDetail(idPD, billDetaill);
    };

    const fromThanhCong = (message: string) => {
        toast.success(message, {
            position: "top-right",
            className: "custom-toast", // Áp dụng CSS tùy chỉnh
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    const fromThatBai = (message: string) => {
        toast.success(message, {
            position: "top-right",
            className: "custom-thatBai", // Áp dụng CSS tùy chỉnh
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };


    return (
        <>
            <div>
                <div className='ml-[18px] mt-[10px]'>
                    <a href="/hoadon" className='text-sm text-blue-600'>Quản lý sản phẩm</a><a href="/hoadon/hoadonchitiet" className='text-sm text-cyan-600'>{' > '}chi tiết đơn hàng</a>
                </div>
                <TasksProvider>
                    <Header>
                        <Search />
                        <div className="ml-auto flex items-center space-x-4">
                            <ThemeSwitch />
                            <ProfileDropdown />
                        </div>
                    </Header>
                </TasksProvider>
            </div>
            <Main>

                <div >
                    {searchBill!=null && (
                    <TrangThaiDonHang
                        trangThai={searchBill.status as OrderStatus}
                        searchBill={searchBill}
                    />
                )}
                </div> <br />

                <ThongTinDonHang
                    searchBill={searchBill}
                    listKhachHang={listKhachHang}
                />
                <br />
                <div className="bg-white rounded-xl shadow-xl p-4">
                    <div className="mb-2 flex items-center justify-between">
                        <h1 className="font-bold tracking-tight">Giỏ hàng</h1>
                        <div className="flex space-x-2">
                            {/* Quét Barcode để check sản phẩm */}
                            {searchBill?.status !== "DA_THANH_TOAN" && searchBill?.status !== "HOAN_THANH" && (
                                <Button className="bg-white-500 border border-blue-500 rounded-sm border-opacity-50 text-blue-600 hover:bg-gray-300">
                                    Quét Barcode
                                </Button>
                            )}

                            {/* Thêm sản phẩm chi tiết vào hóa đơn chờ*/}
                            {searchBill?.status !== "DA_THANH_TOAN" && searchBill?.status !== "HOAN_THANH" && (
                                <ThemSanPham
                                    listProduct={listProduct}
                                    listImei={listImei}
                                    idBillDetail={idBillDetail}
                                    selectedImei={selectedImei}
                                    handleAddImei={handleAddImei}
                                    handleAddProduct={handleAddProduct}
                                    handleCheckboxChange={handleCheckboxChange}
                                    dialogContent={dialogContent}
                                    setDialogContent={setDialogContent}
                                    isDialogOpen={isDialogOpen}
                                    setIsDialogOpen={setIsDialogOpen}
                                />
                            )}
                        </div>
                    </div>
                    <hr className="border-t-1.5 border-gray-600" />

                    {/* Bảng hóa đơn chi tiết tìm kiếm theo id hóa đơn  */}
                    <TableHoaDonChiTiet
                        product={product}
                        listImei={listImei}
                        selectedImei={selectedImei}
                        isCapNhatImei={isCapNhatImei}
                        setIsCapNhatImei={setIsCapNhatImei}
                        handleUpdateProduct={handleUpdateProduct}
                        handleCheckboxChange={handleCheckboxChange}
                        updateHandleImeiSold={updateHandleImeiSold}
                        deleteBillDetail={deleteBillDetail}
                        searchBill={searchBill} />
                    <br />
                    <div className="bg-white p-4 ml-auto mr-5 w-fit text-lg mb-2">
                        <div className="w-[380px] min-w-[380px] ">
                            <div className="space-y-4">
                                {[
                                    { label: "Tổng tiền hàng:", value: searchBill?.totalPrice },
                                    { label: "Giảm giá:", value: searchBill?.discountedTotal },
                                    { label: "Khách cần trả:", value: searchBill?.totalDue },
                                    { label: "Khách đã trả:", value: searchBill?.customerPayment },
                                    { label: "Đã trả khách:", value: searchBill?.amountChange, highlight: true },
                                ].map((item, index) => (
                                    <div key={index} className="flex justify-between border-b pb-2">
                                        <span className={`text-gray-700 text-base ${item.highlight ? "text-red-500 font-semibold" : ""}`}>
                                            {item.label}
                                        </span>
                                        <p className={`font-semibold ${item.highlight ? "text-red-500" : ""}`}>
                                            {item.value == null ? "0 đ" : item.value.toLocaleString('vi-VN') + " đ"}
                                        </p>
                                    </div>
                                ))}

                            </div>
                        </div>
                    </div>
                </div>


            </Main >

        </>
    );
};

export default ChiTietHoaDon;