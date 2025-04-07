import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import TasksProvider from '../tasks/context/tasks-context'
import BarcodeScannerModal from './components/BarcodeScannerModal'
import DiaChiGiaoHang from './components/DiaChiGiaoHang'
import HoaDonCho from './components/HoaDonCho'
import TableHoaDonChiTiet from './components/TableHoaDonChiTiet'
import TableKhachHang from './components/TableKhachHang'
import ThanhToan from './components/ThanhToan'
import ThemSanPham from './components/ThemSanPham'
import './css/print_hoaDon.css'
import './custom-toast.css'
// Thêm CSS tùy chỉnh
import {
  addHDCT,
  addHoaDon,
  addKhachHang,
  createImeiSold,
  deleteProduct,
  findBill,
  findImeiById,
  findImeiByIdProductDaBan,
  findKhachHang,
  findVoucherByAccount,
  getAccountKhachHang,
  getByIdBillDetail,
  getData,
  getDataChoThanhToan,
  getImei,
  getProductDetail,
  getVoucherDangSuDung,
  huyHoaDon,
  quetBarCode,
  thanhToan,
  updateImeiSold,
  updateVoucher,
} from './service/BanHangTaiQuayService'
import { showDialog } from './service/ConfirmDialog'
import {
  AccountKhachHang,
  BillRespones,
  BillSchema,
  Imei,
  ProductDetail,
  SearchBillDetail,
  Voucher,
} from './service/Schema'

function BanHangTaiQuay() {
  const [listBill, setListBill] = useState<BillSchema[]>([]);
  const [billChoThanhToan, setBillChoThanhToan] = useState<BillSchema[]>([]);
  const [searchBill, setSearchBill] = useState<BillRespones>();
  const [listProduct, setListProductDetail] = useState<ProductDetail[]>([]);
  const [listAccount, setListAccount] = useState<AccountKhachHang[]>([]);
  const [listKhachHang, hienThiKhachHang] = useState<AccountKhachHang>();
  const [listImei, setListImei] = useState<Imei[]>([]);
  const [idHoaDon, setIdBill] = useState<number>(0);
  const [idProductDetail, setIdProductDetail] = useState<number>(0);
  const [selectedImei, setSelectedImei] = useState<number[]>([]);
  const [idBillDetail, setIdBillDetail] = useState<number>(0);
  const [product, setProduct] = useState<SearchBillDetail[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<'product' | 'imei'>('product');
  const [isKhachHang, setIsKhachHang] = useState(false);
  const [isVoucher, setIsVoucher] = useState(false);
  const [isCapNhatImei, setIsCapNhatImei] = useState(false);
  const [setVoucherDangDung, setDuLieuVoucherDangDung] = useState<Voucher>();
  const [ListVoucherTheoAccount, setListVoucherTheoAccount] = useState<Voucher[]>([]);
  const [isBanGiaoHang, setIsBanGiaoHang] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<number | null>(null); // 1 = Tiền mặt, 2 = Chuyển khoản
  const [customerPayment, setCustomerPayment] = useState<number>(0);
  const [phiShip, setPhiShip] = useState<number>(0);
  const [tongTienKhachTra, setTongTienKhachTra] = useState(0);
  const tongTien = (searchBill?.totalDue ?? 0) + phiShip;
  const tienThua = Math.max(customerPayment - tongTien);
  const [scanError, setScanError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState('');
  const [barcode, setBarcode] = useState<string | null>(null);
  const [isThanhToanNhanHang, setIsThanhToanNhanHang] = useState(false); // Trạng thái của Switch
  // Lấy danh sách hóa đơn, sản phẩm chi tiết, khách hàng, imei
  useEffect(() => {
    loadBill()
    loadProductDet()
    loadAccountKH()
    loadBillChoThanhToan()
    chuyenPhiShip()
    // console.log("idBill cập nhật:", idBill);
  }, [isBanGiaoHang, tongTien])
  const signupData = JSON.parse(localStorage.getItem('profile') || '{}')
  const { id } = signupData
  const printRef = useRef<HTMLDivElement>(null)
  const [printData, setPrintData] = useState<any>(null)

  // Lấy danh sách hóa đơn top 5
  const loadBill = async () => {
    try {
      const data = await getData()
      setListBill(data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  // Lấy danh sách hóa đơn cho thanh toan
  const loadBillChoThanhToan = async () => {
    try {
      const data = await getDataChoThanhToan()
      setBillChoThanhToan(data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  // Lấy danh sách sản phẩm chi tiết
  const loadProductDet = async () => {
    try {
      const data = await getProductDetail();
      setListProductDetail(data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  // Lấy danh sách khách hàng
  const loadAccountKH = async () => {
    try {
      const data = await getAccountKhachHang()
      setListAccount(data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  // Lấy danh sách voucher theo account
  const loadVoucherByAcount = async (idBillAC: number) => {
    try {
      const data = await findVoucherByAccount(idBillAC)
      setListVoucherTheoAccount(data)
    } catch (error) {
      setListVoucherTheoAccount([])
      console.error('Error fetching data:', error)
    }
  }

  // Lấy danh sách imei
  const loadImei = async (idProductDetail: number) => {
    try {
      // console.log("ID product detail tat ca:", idProductDetail);
      const data = await getImei(idProductDetail)
      setListImei(data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  // Tìm kiêm bill theo id hoa don
  const findBillById = async (id: number) => {
    try {
      const data = await findBill(id)
      setSearchBill(data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  // Huy hoa don
  const huyHoaDonTheoId = async (idBillHuy: number) => {
    try {
      await huyHoaDon(idBillHuy)
      await loadBill()
      loadProductDet()
      setProduct([])
      loadBillChoThanhToan()
      // setIdBill(0);
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  // Lấy hóa đơn chi tiet theo ID bill
  const getById = async (id: number) => {
    try {
      setIdBill(id)
      const data = await getByIdBillDetail(id)
      setProduct(data) // Cập nhật state
      const khachHang = await findKhachHang(id)
      hienThiKhachHang(khachHang)
      findBillById(id)
      const voucher = await getVoucherDangSuDung(id)
      setDuLieuVoucherDangDung(voucher)
      findBillById(id)
      await loadVoucherByAcount(id)
      setIsBanGiaoHang(false)
      // console.log("id bill khi chon "+ id);
    } catch (error) {
      setProduct([]) // Xóa danh sách cũ
      // setIdBill(0);
      console.error('Error fetching data:', error)
    }
  }

  // Tìm kiếm imei theo idProductDetail
  const findImeiByIdProductDetail = async (
    idProductDetail: number,
    idBillDetai: number
  ) => {
    try {
      const data = await findImeiById(idProductDetail, idBillDetai)
      setListImei(data)
      setIdProductDetail(idProductDetail)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  // Xoa san pham trong hoa don chi tiet
  const deleteBillDetail = async (idBillDetail: number) => {
    try {
      const result = await showDialog({
        type: 'confirm',
        title: 'Xác nhận xóa sản phẩm',
        message: 'Bạn chắc chắn muốn xóa không?',
        confirmText: 'Xác nhận',
        cancelText: 'Hủy bỏ',
      })

      if (result) {
        // console.log(idBillDetail);
        await deleteProduct(idBillDetail, idHoaDon)
        await loadProductDet()
        await loadImei(idProductDetail)
        await getById(idHoaDon)
        fromThanhCong('Xóa sản phẩm chi tiết thành công')
      } else {
        // console.log('Hủy thao tác');
        fromThatBai('Xóa sản phẩm chi tiết không thành công')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  // Thêm hóa đơn mới
  const handleAddBill = async () => {
    try {
      const newBill = await addHoaDon({ idNhanVien: id }) // Truyền trực tiếp idNhanVien
      // console.log("Hóa đơn mới:", newBill);
      setListBill([...listBill, newBill]) // Cập nhật danh sách
      loadBill()
      loadBillChoThanhToan()
      fromThanhCong('Thêm hóa đơn thành công')
    } catch (error) {
      // toast.error("Lỗi khi thêm hóa đơn!");
      console.error('Lỗi API:', error)
    }
  }

  // Thêm sản phẩm chi tiết vào hóa đơn chi tiết
  const handleAddProduct = async (product: ProductDetail) => {
    try {
      // console.log("ID bill san pham " + idBill);
      if (idHoaDon == 0 || idBillDetail == null) {
        fromThatBai('Vui lòng chọn hóa đơn')
        setIsDialogOpen(false)
        return
      }
      const newProduct = await addHDCT({
        idBill: idHoaDon,
        idProductDetail: product.id,
      })
      setIdBillDetail(newProduct.id)
      setIdProductDetail(product.id)
      setSelectedImei([])
      loadImei(product.id)
      getById(idHoaDon)
      // console.log("id product detail: " + idProductDetail)
      setDialogContent('imei') // Chuyển nội dung dialog sang IMEI
      fromThanhCong('Thêm sản phẩm vào hóa đơn thành công')
    } catch (error) {
      console.error('Lỗi API:', error)
    }
  }

  // Lấy danh sách imei
  const handleCheckboxChange = (id: number) => {
    console.log('ID imei:', id)
    setSelectedImei((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // Them imei vao hoa don chi tiet
  const handleAddImei = async () => {
    try {
      console.log('id id_Imei' + selectedImei)
      console.log('id idBillDetail' + idBillDetail)
      console.log('id idHoaDon' + idHoaDon)
      console.log('id idProductDetail' + idProductDetail)
      const newImei = await createImeiSold(
        {
          id_Imei: selectedImei,
          idBillDetail: idBillDetail,
        },
        idHoaDon,
        idProductDetail
      )
      console.log('Imei mới:', newImei)
      setSelectedImei([])
      setIsDialogOpen(false) // Đóng dialog
      await loadProductDet()
      await loadImei(idProductDetail)
      await getById(idHoaDon)
      fromThanhCong('Thêm IMEI thành công')
    } catch (error) {
      console.error('Lỗi API:', error)
    }
  }

  const updateHandleImeiSold = async (idBillDetail: number) => {
    try {
      const newImei = await updateImeiSold(
        {
          id_Imei: selectedImei,
          idBillDetail: idBillDetail,
        },
        idHoaDon,
        idProductDetail
      )
      console.log('Imei mới:', newImei)
      setSelectedImei([])
      setIsCapNhatImei(false)
      await loadProductDet()
      await loadImei(idProductDetail)
      await getById(idHoaDon)
      fromThanhCong('Cập nhật IMEI thành công')
    } catch (error) {
      console.error('Lỗi API:', error)
    }
  }

  // Ca
  const handleUpdateProduct = async (idPD: number, billDetaill: number) => {
    setSelectedImei([]);
    try {
      const data = await findImeiByIdProductDaBan(idPD, billDetaill)
      if (!Array.isArray(data)) {
        console.error('Dữ liệu trả về không phải là một mảng:', data)
        return
      }
      const ids: number[] = data.map((imei) => imei.id)
      setSelectedImei(ids)
    } catch (error) {
      console.error('Lỗi khi lấy danh sách IMEI đã bán:', error)
    }
    findImeiByIdProductDetail(idPD, billDetaill)
  }

  const updateVoucherKhiChon = (idVoucher: number) => {
    try {
      updateVoucher(idHoaDon, idVoucher);
      getById(idHoaDon);
      setIsVoucher(false);
      fromThanhCong("Cập nhật voucher thành công ")
    } catch (error) {
      console.error('Lỗi khi cập nhật voucher:', error)
    }
  }

  // Thêm khách hàng vào hóa đơn
  const handleAddKhachHang = async (idAccount: number) => {
    if (idHoaDon == 0 || idHoaDon == null) {
      fromThatBai('Vui lòng chọn hóa đơn')
      setIsKhachHang(false)
      return
    }
    try {
      console.log('Khách hàng mới:', idHoaDon)
      await addKhachHang(idHoaDon, idAccount)
      await loadAccountKH()
      setIsKhachHang(false)
      const khachHang = await findKhachHang(idHoaDon)
      hienThiKhachHang(khachHang)
      await findBillById(idHoaDon)
      setIsBanGiaoHang(false)
      const voucher = await getVoucherDangSuDung(idHoaDon)
      setDuLieuVoucherDangDung(voucher)
      await loadVoucherByAcount(idHoaDon)
      fromThanhCong('Thêm khách hàng thành công')
    } catch (error) {
      console.error('Lỗi khi thêm khách hàng:', error)
    }
  }

  // chọn check box bán giao hàng 
  const handleBanGiaoHangChange = () => {
    try {
      const errors = [
        { condition: idHoaDon === 0 || searchBill?.id === undefined, message: "Vui lòng chọn hóa đơn" },
        { condition: product.length === 0, message: "Vui lòng thêm sản phẩm" },
        { condition: searchBill?.idAccount === 1, message: "Khách lẻ không bán giao hàng" },
        { condition: searchBill?.idAccount == null, message: "Vui lòng chọn khách hàng!" }
      ];

      for (const error of errors) {
        if (error.condition) {
          fromThatBai(error.message);
          return;
        }
      }
      setIsBanGiaoHang(prev => !prev);
    } catch (error) {
      console.error('Lỗi khi bán giao hàng:', error)
    }
  }


  const chuyenPhiShip = async () => {
    try {
      const newPhiShip = isBanGiaoHang == true ? 30000 : 0
      setPhiShip(newPhiShip)

      // Tính tổng tiền khách cần trả
      const newTotal = (searchBill?.totalDue ?? 0) + newPhiShip
      setTongTienKhachTra(newTotal)
    } catch (error) {
      console.error('Lỗi khi bán giao hàng:', error)
    }
  }

  const handlePrint = (invoiceData: any) => {
    setPrintData(invoiceData)

    // Đợi React cập nhật DOM trước khi in
    setTimeout(() => {
      const printElement = printRef.current
      if (printElement) {
        const printWindow = window.open('', '_blank')
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>In hóa đơn</title>
                <link rel="stylesheet" href="/path-to-your-tailwind.css">
              </head>
              <body onload="window.print()">
                ${printElement.innerHTML}
              </body>
            </html>
          `)
          printWindow.document.close()
        }
      }
    }, 100)
  }

  // // Thanh toán hóa đơn
  // const handleThanhToan = async (status: string, billType: number) => {

  //   const result = await showDialog({
  //     type: 'confirm',
  //     title: 'Xác nhận thanh toán đơn hàng',
  //     message: `Bạn chắc chắn muốn thanh toán đơn hàng 
  //     <strong style="color:rgb(8, 122, 237)">${searchBill?.nameBill ?? ''}</strong>  <br />
  //     với số tiền đã nhận được là 
  //     <span style="color: red; font-weight: 700; background-color: #f8f9fa; padding: 2px 6px; border-radius: 4px">
  //     ${customerPayment.toLocaleString()}đ
  //     </span>?`,
  //     confirmText: 'Xác nhận',
  //     cancelText: 'Hủy bỏ'
  //   });
  //   try {
  //     if (result) {
  //       if (searchBill == null || searchBill?.id === undefined) {
  //         fromThatBai("Vui lòng chọn hóa đơn trước khi thanh toán");
  //         return;
  //       } else if (product.length === 0) {
  //         fromThatBai("Vui lòng thêm sản phẩm trước khi thanh toán");
  //         return;
  //       } else if (searchBill?.idAccount == null) {
  //         fromThatBai("Vui lòng chọn khách hàng");
  //         return;
  //       } else if (paymentMethod == null
  //         && isThanhToanNhanHang == false) {
  //         fromThatBai("Vui lòng chọn phương thức thanh toán");
  //         return;
  //       } else if (tienThua < 0 && isThanhToanNhanHang == false && paymentMethod === 1) {
  //         fromThatBai("Số tiền thanh toán không đủ");
  //         return;
  //       } else {



  //         await thanhToan({
  //           id: searchBill?.id,
  //           nameBill: searchBill?.nameBill,
  //           idAccount: searchBill?.idAccount ?? null,
  //           idNhanVien: searchBill?.idNhanVien ?? null,
  //           idVoucher: searchBill?.idVoucher ?? null,
  //           totalPrice: searchBill?.totalPrice ?? 0,
  //           customerPayment: customerPayment,
  //           amountChange: tienThua,
  //           deliveryFee: phiShip ?? 0,
  //           totalDue: tongTien ?? 0,
  //           customerRefund: searchBill?.customerRefund ?? 0,
  //           discountedTotal: searchBill?.discountedTotal ?? 0,
  //           deliveryDate: searchBill?.deliveryDate ?? null,
  //           customerPreferred_date: searchBill?.customerPreferred_date ?? null,
  //           customerAppointment_date: searchBill?.customerAppointment_date ?? null,
  //           receiptDate: searchBill?.receiptDate ?? null,
  //           paymentDate: new Date().toISOString(),
  //           billType: billType,
  //           status: status,
  //           address: searchBill?.address ?? null,
  //           email: searchBill?.email ?? null,
  //           note: searchBill?.note ?? null,
  //           phone: searchBill?.phone ?? null,
  //           name: searchBill?.name ?? null,
  //           idPayment: paymentMethod,
  //           idDelivery: searchBill?.idDelivery ?? null,
  //           itemCount: searchBill?.itemCount ?? 0
  //         });

  //         const invoiceData = {
  //           invoiceNumber: searchBill?.nameBill || "",
  //           date: searchBill?.paymentDate,
  //           staff: signupData?.name,
  //           customer: listKhachHang?.fullName || "Khách lẻ",
  //           phone: listKhachHang?.phone || "",
  //           items: product.map(p => ({
  //             product: p.nameProduct,
  //             imei: listImei.map(i => i.imeiCode),
  //             price: p.price,
  //             quantity: p.quantity
  //           })),
  //           total: searchBill?.totalPrice,
  //           discount: searchBill?.discountedTotal || 0,
  //           payment: customerPayment,
  //           change: tienThua
  //         };

  //         // Gọi hàm in
  //         handlePrint(invoiceData);
  //         setSearchBill(undefined);
  //         hienThiKhachHang(undefined);
  //         setProduct([]);
  //         setCustomerPayment(0);
  //         setPaymentMethod(null);
  //         setIsBanGiaoHang(false);
  //         fromThanhCong("Thanh toán thành công");
  //       }
  //     } else {
  //       fromThatBai(`Thanh toán đơn hàng ${searchBill?.nameBill ?? ''} không thành công`);
  //     }

  //   } catch (error) {
  //     console.error("Lỗi khi thanh toán:", error);
  //   }
  // }
  const handleThanhToan = async (status: string, billType: number) => {
    const result = await showDialog({
      type: 'confirm',
      title: 'Xác nhận thanh toán đơn hàng',
      message: `Bạn chắc chắn muốn thanh toán đơn hàng 
        <strong style="color:rgb(8, 122, 237)">${searchBill?.code ?? ''}</strong> <br />
        với số tiền đã nhận được là 
        <span style="color: red; font-weight: 700; background-color: #f8f9fa; padding: 2px 6px; border-radius: 4px">
        ${customerPayment.toLocaleString()}đ
        </span>?`,
      confirmText: 'Xác nhận',
      cancelText: 'Hủy bỏ'
    });

   
    if (searchBill == null || searchBill?.id === undefined) {
      fromThatBai("Vui lòng chọn hóa đơn trước khi thanh toán");
      return;
    }
    // Kiểm tra đầu vào
    const validations = [
      { condition: product.length === 0, message: "Vui lòng thêm sản phẩm trước khi thanh toán" },
      { condition: !searchBill?.idAccount, message: "Vui lòng chọn khách hàng" },
      { condition: !paymentMethod && !isThanhToanNhanHang, message: "Vui lòng chọn phương thức thanh toán" },
      { condition: tienThua < 0 && !isThanhToanNhanHang && paymentMethod === 1, message: "Số tiền thanh toán không đủ" }
    ];

    for (const v of validations) {
      if (v.condition) {
        fromThatBai(v.message);
        return;
      }
    }
    if (!result && paymentMethod != 2) {
      fromThatBai(`Thanh toán đơn hàng ${searchBill?.code ?? ''} không thành công`);
      return;
    }
    try {
      await thanhToan({
        id: searchBill?.id,
        nameBill: searchBill?.code,
        idAccount: searchBill?.idAccount ?? null,
        idNhanVien: searchBill?.idNhanVien ?? null,
        idVoucher: searchBill?.idVoucher ?? null,
        totalPrice: searchBill?.totalPrice ?? 0,
        customerPayment: customerPayment,
        amountChange: tienThua,
        deliveryFee: phiShip ?? 0,
        totalDue: tongTien ?? 0,
        customerRefund: searchBill?.customerRefund ?? 0,
        discountedTotal: searchBill?.discountedTotal ?? 0,
        deliveryDate: searchBill?.deliveryDate ?? null,
        customerPreferred_date: searchBill?.customerPreferredDate ?? null,
        customerAppointment_date: searchBill?.customerAppointmentDate ?? null,
        receiptDate: searchBill?.receiptDate ?? null,
        paymentDate: new Date().toISOString(),
        billType: billType,
        status: status,
        address: searchBill?.address ?? null,
        email: searchBill?.email ?? null,
        note: searchBill?.note ?? null,
        phone: searchBill?.phone ?? null,
        name: searchBill?.name ?? null,
        idPayment: paymentMethod,
        idDelivery: searchBill?.delivery ?? null,
        itemCount: searchBill?.detailCount ?? 0
      });

      const invoiceData = {
        code: searchBill?.code,
        paymentDate: searchBill?.paymentDate,
        staff: searchBill?.fullNameNV,
        customer: searchBill?.name,
        phone: searchBill?.phone,
        items: searchBill?.billDetailResponesList.map(detail => ({
          product: detail.productDetail.productName,
          imei: detail.imeiSoldRespones.map(imeiSold => imeiSold.id_Imei.imeiCode),
          price: detail.price,
          quantity: detail.quantity,
        })) || [],
        totalPrice: searchBill?.totalPrice || 0,
        discountedTotal: searchBill?.discountedTotal || 0,
        customerPayment: customerPayment || 0,
        change: tienThua || 0,
      };
      

      handlePrint(invoiceData);

      // Reset trạng thái
      setSearchBill(undefined);
      hienThiKhachHang(undefined);
      setProduct([]);
      setCustomerPayment(0);
      setPaymentMethod(null);
      setIsBanGiaoHang(false);

      fromThanhCong("Thanh toán thành công");
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
      fromThatBai("Đã xảy ra lỗi khi thanh toán");
    }
  };


  // Quét mã vạch
  const isProcessing = useRef(false);
  const handleScanSuccess = async (imei: string) => {
    console.log('id bill khi chon ' + idHoaDon)
    if (isProcessing.current) {
      console.log('⚠ handleScanSuccess bị chặn do đã chạy trước đó!')
      return
    }

    isProcessing.current = true // Đánh dấu đang xử lý

    // ⛔ Dừng camera ngay lập tức để tránh quét lại
    if (window.Quagga) {
      window.Quagga.stop()
      console.log('📸 Camera đã dừng để tránh quét lại')
    }

    try {
      setIsScanning(true)
      setScanError('')
      setScanResult(imei)
      console.log('id bill chuẩn bị chon ' + idHoaDon)
      const productDetail = await quetBarCode(imei)
      if (!productDetail?.idImei) {
        fromThatBai('IMEI không tồn tại trong hệ thống')
        return
      }

      if (!idHoaDon || idHoaDon === 0) {
        fromThatBai('Vui lòng chọn hóa đơn trước khi quét mã')
        return
      }

      console.log('id bill trước luc chạy ' + idHoaDon)
      const newBillDetail = await addHDCT({
        idBill: idHoaDon,
        idProductDetail: productDetail.id,
      })

      if (!newBillDetail?.id) {
        fromThatBai('Tạo hóa đơn chi tiết thất bại')
        return
      }
      console.log('id bill luc chạy ' + idHoaDon)
      await createImeiSold(
        {
          id_Imei: [productDetail.idImei],
          idBillDetail: newBillDetail.id,
        },
        idHoaDon,
        productDetail.id
      )

      setProduct((prev) =>
        prev.filter((p) => p.idProductDetail !== productDetail.id)
      )

      await Promise.all([loadImei(productDetail.id), getById(idHoaDon)])

      fromThanhCong(`Đã thêm sản phẩm ${productDetail.name}`)
    } catch (error: any) {
      fromThatBai('Lỗi khi thêm sản phẩm !')
      // console.error("[❌ LỖI]", error);
    } finally {
      isProcessing.current = false // Cho phép quét tiếp
      setIsScanning(false)
      setSelectedImei([])

      // ✅ Bật lại camera sau khi xử lý xong
      setTimeout(() => {
        if (window.Quagga) {
          window.Quagga.start()
          console.log('📸 Camera đã bật lại để quét tiếp')
        }
      }, 1000) // Delay 1 giây để tránh quét quá nhanh
    }
  }

  const fromThanhCong = (message: string) => {
    toast.success(message, {
      position: 'top-right',
      className: 'custom-toast',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  }

  const fromThatBai = (message: string) => {
    toast.success(message, {
      position: 'top-right',
      className: 'custom-thatBai',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  }

  return (
    <>
      <div>
        <TasksProvider>
          <Header>
            <Search />
            <div className='ml-auto flex items-center space-x-4'>
              <ThemeSwitch />
              <ProfileDropdown />
            </div>
          </Header>
        </TasksProvider>
      </div>
      <br />
      <div
        className='mr-1.5 rounded-lg border border-gray-300 bg-white p-2 shadow-md'
        style={{ paddingTop: '18px', margin: '0 13px' }}
      >
        {/* Thêm hóa đơn chờ tại quầy */}
        <HoaDonCho
          listBill={listBill}
          billChoThanhToan={billChoThanhToan}
          huyHoaDonTheoId={huyHoaDonTheoId}
          getById={getById}
          handleAddBill={handleAddBill}
          idBill={idHoaDon}
        />
        <hr />

        <Main>
          <div className='mb-2 flex items-center justify-between'>
            <h1 className='font-bold tracking-tight'>Giỏ hàng</h1>
            <div className='flex space-x-2'>
              {/* Quét Barcode để check sản phẩm */}
              <Button
                onClick={() => setIsScanning(true)}
                className='bg-white-500 rounded-sm border border-blue-500 border-opacity-50 text-blue-600 hover:bg-gray-300'
              >
                Quét Barcode
              </Button>

              {/* {scanResult && (
                <div className="mt-2 p-2 bg-green-100 rounded">
                  Mã đã quét: <span className="font-bold">{scanResult}</span>
                </div>
              )}

              {scanError && (
                <div className="text-red-500 mt-2 p-2 bg-red-100 rounded">
                  {scanError}
                </div>
              )} */}

              <BarcodeScannerModal
                isOpen={isScanning}
                onClose={() => setIsScanning(false)}
                onScanSuccess={handleScanSuccess}
              />
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
                setListProduct={setListProductDetail} // Pass the state setter
              />
            </div>
          </div>
          <hr className='border-t-1.5 border-gray-600' />

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
          />
        </Main>
      </div>
      <br />
      <TableKhachHang
        listKhachHang={listKhachHang}
        listAccount={listAccount}
        setIsKhachHang={setIsKhachHang}
        isKhachHang={isKhachHang}
        handleAddKhachHang={handleAddKhachHang}
      />
      <br />
      <div
        className='mr-1.5 rounded-lg border border-gray-300 bg-white p-2 shadow-md'
        style={{
          margin: '0 13px',
          padding: '22px 23px',
        }}
      >
        <div className='mb-2 flex items-center justify-between'>
          <div className='ml-[750px] mr-[40px] flex space-x-2'>
            <Button
              variant='outline'
              className='text-2xs rounded-lg border border-blue-500 px-3 text-blue-600 hover:border-orange-600 hover:text-orange-600'
            >
              <Checkbox
                id='ban-giao-hang'
                className='text-blue-600'
                checked={isBanGiaoHang}
                onCheckedChange={handleBanGiaoHangChange}
              />
              Bán giao hàng
            </Button>
          </div>
        </div>
        <hr className='border-gray-600' />
        <br />

        <div className='grid grid-cols-2 gap-4'>
          {/* --------- cot 1 ----------- */}
          <DiaChiGiaoHang
            isBanGiaoHang={isBanGiaoHang}
            khachHang={listKhachHang}
          />

          {/* Cột 2 */}
          <ThanhToan
            searchBill={searchBill}
            setPaymentMethod={setPaymentMethod}
            paymentMethod={paymentMethod}
            customerPayment={customerPayment}
            setCustomerPayment={setCustomerPayment}
            handleThanhToan={handleThanhToan}
            ListVoucherTheoAccount={ListVoucherTheoAccount}
            setVoucherDangDung={setVoucherDangDung}
            updateVoucherKhiChon={updateVoucherKhiChon}
            isVoucher={isVoucher}
            setIsVoucher={setIsVoucher}
            tienThua={tienThua}
            isBanGiaoHang={isBanGiaoHang}
            phiShip={phiShip}
            printData={printData}
            printRef={printRef}
            setIsThanhToanNhanHang={setIsThanhToanNhanHang}
            isThanhToanNhanHang={isThanhToanNhanHang}
          />
        </div>
      </div > <br />
      <br />
    </>
  )
}
export default BanHangTaiQuay
