import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/header';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { Main } from '@/components/layout/main';
import { Button } from '@/components/ui/button';
import {
    getData, findImeiByIdProductDaBan, findBill,
    findKhachHang, addKhachHang, addHoaDon, findImeiById,
    createImeiSold, deleteProduct, getImei, getAccountKhachHang,
    getProductDetail, addHDCT, getByIdBillDetail, getVoucherDangSuDung,
    findVoucherByAccount, huyHoaDon, getDataChoThanhToan, updateImeiSold,
    updateVoucher
} from '@/features/banhang/service/BanHangTaiQuayService';
import * as z from "zod"
import { toast } from 'react-toastify';
interface Bill {
    id: number;
    nameBill: string;
    idAccount?: number | null;
    tenKhachHang?: string | null;
    soDienThoai?: string | null;
    idNhanVien?: number | null;
    idVoucher?: number | null;
    totalPrice: number | null;
    customerPayment: number | null;
    amountChange: number | null;
    deliveryFee: number | null;
    totalDue: number;
    customerRefund: number | null;
    discountedTotal: number | null;
    deliveryDate?: string | null;
    customerPreferred_date?: string | null;
    customerAppointment_date?: string | null;
    receiptDate?: string | null;
    paymentDate?: string | null;
    address?: string | null;
    email?: string | null;
    note?: string | null;
    phone?: string | null;
    name: string;
    paymentId?: number | null;
    namePayment?: number | null;
    deliveryId?: number | null;
    itemCount: number;
    billType: number | null;
    status: string;
}

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

const formSchema = z.object({
    fullName: z.string().min(1),
    phone: z.string().min(1),
    province: z.string().min(1),
    district: z.string().min(1),
    ward: z.string().min(1),
    address: z.string().min(1),
    note: z.string().optional()
});

import TrangThaiDonHang from './TrangThaiDonHang';
import TasksProvider from '@/features/tasks/context/tasks-context';
import ThemSanPham from '@/features/banhang/components/ThemSanPham';
import TableHoaDonChiTiet from '@/features/banhang/components/TableHoaDonChiTiet';
export type OrderStatus =
    | "pending_payment"
    | "processing"
    | "shipping"
    | "delivered"
    | "completed";


const ChiTietHoaDon: React.FC = () => {


    const [searchBill, setSearchBill] = useState<Bill>();
    const [listProduct, setListProductDetail] = useState<ProductDetail[]>([]);
    const [listAccount, setListAccount] = useState<AccountKhachHang[]>([]);
    const [listKhachHang, hienThiKhachHang] = useState<AccountKhachHang>();
    const [listImei, setListImei] = useState<imei[]>([]);
    const [idBill, setIdBill] = useState<number>(0);
    const [idProductDetail, setIdProductDetail] = useState<number>(0);
    const [selectedImei, setSelectedImei] = useState<number[]>([]);
    const [idBillDetail, setIdBillDetail] = useState<number>(0);
    const [product, setProduct] = useState<SearchBillDetail[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState<'product' | 'imei'>('product');
    // const [hoveredBillId, setHoveredBillId] = useState<number | null>(null);
    const [isKhachHang, setIsKhachHang] = useState(false);
    const [isVoucher, setIsVoucher] = useState(false);
    const [isCapNhatImei, setIsCapNhatImei] = useState(false);
    const [setVoucherDangDung, setDuLieuVoucherDangDung] = useState<Voucher>();
    const [ListVoucherTheoAccount, setListVoucherTheoAccount] = useState<Voucher[]>([]);
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


    const loadTongBill = async() => {
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
                    <TrangThaiDonHang />
                </div> <br />
                <div className='bg-white rounded-xl shadow-xl p-4'>
                    <h1 className='font-bold text-lg text-gray-600 ml-[15px]'>Thông tin đơn hàng</h1>
                    <hr className=" border-gray-600 mt-[6px]" /><br />

                    <div className="grid grid-cols-2 gap-x-10 ml-[8px]">
                        {/* Cột bên trái */}
                        <div className="space-y-2">
                            <div className="flex  pb-2 mt-[13px]">
                                <span className="text-base text-gray-700 font-bold">Mã đơn hàng:</span>
                                <p className="ml-[14px]">{searchBill?.nameBill}</p>
                            </div>
                            <div className="flex  pb-2 mt-[23px]">
                                <span className="text-base text-gray-700 font-bold">Khách hàng:</span>
                                <p className="ml-[14px]">{listKhachHang?.fullName}</p>
                            </div>
                            <div className="flex  pb-2 mt-[13px]">
                                <span className="text-base text-gray-700 font-bold">Số điện thoại:</span>
                                <p className="ml-[14px]">{listKhachHang?.phone}</p>
                            </div>
                            <div className="flex  pb-2 mt-[13px]">
                                <span className="text-base text-gray-700 font-bold">Địa chỉ:</span>
                                <p className="ml-[14px]">{listKhachHang?.address}</p>
                            </div>
                        </div>

                        {/* Cột bên phải */}
                        <div className="space-y-2">
                            <div className="flex  pb-2 mt-[13px]">
                                <span className="text-base text-gray-700 font-bold">Ngày đặt hàng:</span>
                                <p className="ml-[14px]">{searchBill?.paymentDate}</p>
                            </div>
                            <div className="flex  pb-2 mt-[13px]">
                                <span className="text-base text-gray-700 font-bold">Tổng tiền:</span>
                                <p className="ml-[14px]">{searchBill?.totalDue.toLocaleString('vi-VN')} VND</p>
                            </div>
                            <div className="flex  pb-2 mt-[13px]">
                                <span className="text-base text-gray-700 font-bold">Phương thức thanh toán:</span>
                                <p className="ml-[14px]">{searchBill?.paymentId}</p>
                            </div>
                            <div className="flex  pb-2 mt-[13px]">
                                <span className="text-base text-gray-700 font-bold">Trạng thái:</span>
                                <p className="ml-[14px] text-green-600 font-semibold">{searchBill?.status}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <br />
                <div className="bg-white rounded-xl shadow-xl p-4">
                    <div className="mb-2 flex items-center justify-between">
                        <h1 className="font-bold tracking-tight">Giỏ hàng</h1>
                        <div className="flex space-x-2">
                            {/* Quét Barcode để check sản phẩm */}
                            <Button className="bg-white-500 border border-blue-500 rounded-sm border-opacity-50 text-blue-600 hover:bg-gray-300">
                                Quét Barcode
                            </Button>


                            {/* Thêm sản phẩm chi tiết vào hóa đơn chờ*/}
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
                        deleteBillDetail={deleteBillDetail} />
                    <br />
                </div>

            </Main >
        </>
    );
};

export default ChiTietHoaDon;