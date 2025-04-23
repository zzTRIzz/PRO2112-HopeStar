import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/header';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { Main } from '@/components/layout/main';
import {
    findImeiByIdProductDaBan, findBill,
    findImeiById,
    createImeiSold, deleteProduct, getImei,
    getProductDetail, addHDCT, getByIdBillDetail, getVoucherDangSuDung,
    updateImeiSold,
    addBillHistory,

} from '@/features/hoadon/service/HoaDonService';
import { showSuccessToast, showErrorToast } from "./components/components_con/ThongBao"
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


import { OrderStatus } from './components/TrangThaiDonHangGiaoHang';
import TasksProvider from '@/features/tasks/context/tasks-context';
import { BillRespones } from '@/features/banhang/service/Schema';

import TableHoaDonChiTiet from './components/TableHoaDonChiTiet';
import ThongTinDonHang from './components/ThongTinDonHang';
import TrangThaiDonHangGiaoHang from './components/TrangThaiDonHangGiaoHang';
import ThemSanPham from './components/ThemSanPham';


const ChiTietHoaDon: React.FC = () => {


    const [searchBill, setSearchBill] = useState<BillRespones | null>(null);
    const [listProduct, setListProductDetail] = useState<ProductDetail[]>([]);
    // const [listKhachHang, hienThiKhachHang] = useState<AccountKhachHang>();
    const [listImei, setListImei] = useState<imei[]>([]);
    const [idBill, setIdBill] = useState<number>(0);
    const [idProductDetail, setIdProductDetail] = useState<number>(0);
    const [selectedImei, setSelectedImei] = useState<number[]>([]);
    const [idBillDetail, setIdBillDetail] = useState<number>(0);
    const [product, setProduct] = useState<SearchBillDetail[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState<'product' | 'imei'>('product');
    const [openDialogId, setOpenDialogId] = useState<number | null>(null);
    const [voucherDangDung, setDuLieuVoucherDangDung] = useState<Voucher>();

    // Lấy danh sách hóa đơn, sản phẩm chi tiết, khách hàng, imei
    useEffect(() => {
        loadBillByIdBill();
        loadProductDet();
    }, []);


    const loadBillByIdBill = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = Number(urlParams.get("id"));

        if (!isNaN(id) && id > 0) {
            setIdBill(id);
        }
        findBillById(id);
        getById(id);
    }
    const loadTongBill = async () => {
        findBillById(idBill);
        getById(idBill);
    }




    // Tìm kiêm bill theo id
    const findBillById = async (id: number) => {
        try {
            const data = await findBill(id);
            setSearchBill(data);
            console.log(data)
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
            showSuccessToast("Xóa sản phẩm chi tiết thành công");
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // Thêm sản phẩm chi tiết vào hóa đơn chi tiết 
    const handleAddProduct = async (product: ProductDetail) => {
        try {
            // console.log("ID bill san pham " + idBill);
            if (idBill == 0 || idBill == null) {
                showErrorToast("Vui lòng chọn hóa đơn");
                setIsDialogOpen(false);
                return;
            }
            const isMissingImei = searchBill?.billDetailResponesList.some(
                (detail) => (!detail.imeiSoldRespones || detail.imeiSoldRespones.length === 0) && detail.quantity > 0
            );

            if (isMissingImei) {
                showErrorToast("Vui lòng cập nhập imei cho tất cả sản phẩm");
                return;
            }
            const newProduct = await addHDCT({
                idBill: idBill,
                idProductDetail: product.id
            });
            themBillHistory("CAP_NHAT_DON_HANG", `Đã thêm sản phẩm ${product?.name} ${product?.ram}/${product?.rom}GB (${product?.color})`);
            setIdBillDetail(newProduct.id);
            setIdProductDetail(product.id);
            setSelectedImei([]);
            loadImei(product.id);
            loadTongBill();
            setDialogContent('imei'); // Chuyển nội dung dialog sang IMEI
            showSuccessToast("Thêm sản phẩm vào hóa đơn thành công");
        } catch (error) {
            console.error("Lỗi API:", error);
        }
    };


    // Lấy danh sách imei 
    const handleCheckboxChange = (id: number) => {
        // console.log("ID imei:", id);
        setSelectedImei((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    // Them imei vao hoa don chi tiet
    const handleAddImei = async () => {
        try {
            if (selectedImei.length <= 0) {
                showErrorToast("Vui lòng chọn imei");
                return;
            }
            await createImeiSold({
                id_Imei: selectedImei,
                idBillDetail: idBillDetail
            },
                idBill,
                idProductDetail
            );
            // console.log("Imei mới:", newImei);
            setSelectedImei([]);
            setIsDialogOpen(false); // Đóng dialog
            await loadProductDet();
            await loadImei(idProductDetail);
            loadTongBill();
            showSuccessToast("Thêm IMEI thành công");
        } catch (error) {
            console.error("Lỗi API:", error);
        }
    };


    const updateHandleImeiSold = async (idBillDetail: number) => {
        try {
            await updateImeiSold({
                id_Imei: selectedImei,
                idBillDetail: idBillDetail
            },
                idBill,
                idProductDetail
            );
            themBillHistory("CAP_NHAT_DON_HANG", `Đã cập nhật ${selectedImei.length} IMEI`);
            setSelectedImei([]);
            await loadProductDet();
            await loadImei(idProductDetail);
            loadTongBill();
            showSuccessToast("Cập nhật số lượng sản phẩm thành công");
        } catch (error) {
            console.error("Lỗi API:", error);
            showErrorToast("Lỗi cập nhật số lượng sản phẩm");

        }
    };

    // Cập nhật product 
    const handleUpdateProduct = async (idPD: number, billDetaill: number) => {
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

    const themBillHistory = async (actionType: string, note: string) => {
        addBillHistory({
            actionType: actionType,
            idBill: idBill,
            note: note
        })
        loadTongBill();
    }



    const tinhTien = (searchBill?.totalDue || 0)
        - (searchBill?.customerPayment || 0)
        + (searchBill?.amountChange || 0);

    const tienThieu = tinhTien > 0 ? tinhTien : 0;
    const tienThua = tinhTien < 0 ? Math.abs(tinhTien) : 0;
    return (
        <>
            <div>
                <div className='ml-[18px] mt-[10px]'>
                    <a href="/hoadon" className='text-sm text-blue-600'>Quản lý hóa đơn</a>
                    <a href="/hoadon/hoadonchitiet" className='text-sm text-cyan-600'>{' > '}chi tiết đơn hàng</a>
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
                    <TrangThaiDonHangGiaoHang
                        loadTongBill={loadTongBill}
                        trangThai={searchBill?.status as OrderStatus}
                        searchBill={searchBill}
                        themBillHistory={themBillHistory}
                    />
                </div> <br />

                <ThongTinDonHang
                    searchBill={searchBill}
                    loadTongBill={loadTongBill}
                    themBillHistory={themBillHistory}
                />
                <br />
                <div className="bg-white rounded-xl shadow-xl p-4">
                    <div className="mb-2 flex items-center justify-between">
                        <h1 className="font-bold tracking-tight">Hóa đơn chi tiết</h1>
                        <div className="flex space-x-2">
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
                                searchBill={searchBill}
                            />
                            {/* )} */}
                        </div>
                    </div>
                    <hr className="border-t-1.5 border-gray-600" />

                    <div className="flex flex-col lg:flex-row gap-2 px-5">
                        {/* Bảng chi tiết - Chiếm 2/3 màn hình lớn */}
                        <div className="lg:basis-3/5 xl:basis-3/4 overflow-hidden">
                            <TableHoaDonChiTiet
                                product={product}
                                listImei={listImei}
                                selectedImei={selectedImei}
                                openDialogId={openDialogId}
                                setOpenDialogId={setOpenDialogId}
                                handleUpdateProduct={handleUpdateProduct}
                                handleCheckboxChange={handleCheckboxChange}
                                updateHandleImeiSold={updateHandleImeiSold}
                                deleteBillDetail={deleteBillDetail}
                                searchBill={searchBill}
                            />
                        </div>

                        {product.length > 0 && (
                            <div className="lg:basis-2/5 xl:basis-1/4 bg-white mt-[10px]">
                                <h2 className="text-lg font-bold mb-2 border-b pb-2">Tổng tiền </h2>
                                <div className="space-y-3">
                                    {[
                                        { label: "Tổng tiền hàng:", value: searchBill?.totalPrice },
                                        {
                                            label: `Giảm giá: ${searchBill?.idVoucher ? voucherDangDung?.code : ''}`,
                                            value: searchBill?.discountedTotal
                                        },
                                        { label: "Phí vận chuyển:", value: searchBill?.deliveryFee },
                                        ...(searchBill?.payInsurance ?? 0 > 0
                                            ? [{
                                                label: "Phí bảo hiểm:",
                                                value: searchBill?.payInsurance
                                            }]
                                            : []),
                                        { label: "Tổng thanh toán:", value: searchBill?.totalDue, highlight: true },
                                        { label: "Đã thanh toán:", value: searchBill?.customerPayment },
                                        ...(searchBill?.amountChange ?? 0 > 0
                                            ? [{
                                                label: "Đã trả lại:",
                                                value: searchBill?.amountChange
                                            }]
                                            : []),
                                        ...(tienThieu > 0
                                            ? [{
                                                label: "Còn thiếu:",
                                                value: tienThieu,
                                                highlight: true
                                            }]
                                            : tienThua > 0
                                                ? [{
                                                    label: "Tiền thừa:",
                                                    value: tienThua,
                                                    highlight: true
                                                }]
                                                : [])
                                    ].map((item, index) => (
                                        <div key={index} className="flex justify-between items-center">
                                            <span className={`text-sm ${item.highlight ? "font-semibold" : "text-gray-600"}`}>
                                                {item.label}
                                            </span>
                                            <span className={`${item.highlight ? "text-red-500 font-bold" : "font-medium"}`}>
                                                {item.value?.toLocaleString('vi-VN') || '0'} ₫
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <br />
            </Main >
        </>
    );
};

export default ChiTietHoaDon;