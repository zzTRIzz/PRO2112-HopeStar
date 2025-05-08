import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import TasksProvider from '../tasks/context/tasks-context'
import BarcodeScannerModal from './components/components_con/BarcodeScannerModal'
import DiaChiGiaoHang from './components/components_con/DiaChiGiaoHang'
import HoaDonCho from './components/HoaDonCho'
import TableHoaDonChiTiet from './components/TableHoaDonChiTiet'
import TableKhachHang from './components/TableKhachHang'
import ThanhToan from './components/ThanhToan'
import ThemSanPham from './components/ThemSanPham'
import './css/print_hoaDon.css'
import {
  addBillHistory,
  addHoaDon,
  addKhachHang,
  addBillDetailAndCreateImeiSold,
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
import { fromThatBai, fromThanhCong } from './components/components_con/ThongBao'

function BanHangTaiQuay() {
  const [listBill, setListBill] = useState<BillSchema[]>([]);
  const [billChoThanhToan, setBillChoThanhToan] = useState<BillSchema[]>([]);
  const [searchBill, setSearchBill] = useState<BillRespones>();
  const [listProduct, setListProductDetail] = useState<ProductDetail[]>([]);
  const [listAccount, setListAccount] = useState<AccountKhachHang[]>([]);
  const [khachHang, hienThiKhachHang] = useState<AccountKhachHang>();
  const [listImei, setListImei] = useState<Imei[]>([]);
  const [idHoaDon, setIdBill] = useState<number>(0);
  const [idProductDetail, setIdProductDetail] = useState<number>(0);
  const [selectedImei, setSelectedImei] = useState<number[]>([]);
  const [product, setProduct] = useState<SearchBillDetail[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<'product' | 'imei'>('product');
  const [isKhachHang, setIsKhachHang] = useState(false);
  const [isVoucher, setIsVoucher] = useState(false);
  const [setVoucherDangDung, setDuLieuVoucherDangDung] = useState<Voucher>();
  const [ListVoucherTheoAccount, setListVoucherTheoAccount] = useState<Voucher[]>([]);
  const [isBanGiaoHang, setIsBanGiaoHang] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<number | null>(null); // 1 = Tiền mặt, 2 = Chuyển khoản
  const [customerPayment, setCustomerPayment] = useState<number|null>(null);
  const [shippingFee, setShippingFee] = useState(0);
  const [insuranceFee, setInsuranceFee] = useState(0);
  const [isProcessingBillChange, setIsProcessingBillChange] = useState(false);
  const currentBillRef = useRef<number>(0);
  const tongTien = (searchBill?.totalDue ?? 0) + (isBanGiaoHang == true ? shippingFee : 0) + insuranceFee;
  const tienThua = Math.max(customerPayment - tongTien);
  const tienKhachThieu = tienThua > 0 ? tienThua : 0;
  const [isScanning, setIsScanning] = useState(false);
  const [isThanhToanNhanHang, setIsThanhToanNhanHang] = useState(false); // Trạng thái của Switch
  const [openDialogId, setOpenDialogId] = useState<number | null>(null);
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullAddress: "",
    customerName: "",
    customerPhone: "",
    note: ""
  });
  useEffect(() => {
    currentBillRef.current = idHoaDon;
    if (isScanning) {
      setIsScanning(false);
    }
  }, [idHoaDon]);

  useEffect(() => {
    loadBill()
    loadProductDet()
    loadAccountKH()
    loadBillChoThanhToan()
    loadVoucherByAcount(khachHang?.id);
  }, [isBanGiaoHang, tongTien, khachHang, idHoaDon]);
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
      // console.log('Danh sách sản phẩm chi tiết:', data)
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
  const loadVoucherByAcount = async (idAccount?: number) => {
    try {
      const data = await findVoucherByAccount(idAccount);
      setListVoucherTheoAccount(data)
    } catch (error) {
      setListVoucherTheoAccount([])
      console.error('Error fetching data:', error)
    }
  }

  // Lấy danh sách imei
  const loadImei = async (idProductDetail: number) => {
    try {
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
      const result = await showDialog({
        type: 'confirm',
        title: 'Xác nhận hủy hóa đơn',
        message: 'Bạn chắc chắn muốn hủy hóa đơn này không?',
        confirmText: 'Xác nhận',
        cancelText: 'Hủy bỏ',
      })
      if (!result) {
        fromThatBai('Hủy hóa đơn không thành công')
        return
      }
      await huyHoaDon(idBillHuy)
      await addBillHistory({
        actionType: "DA_HUY",
        idBill: idBillHuy,
        note: "Đơn hàng đã hủy",
      })
      await loadBill()
      loadProductDet()
      setProduct([])
      loadBillChoThanhToan()
      setSearchBill(undefined);
      hienThiKhachHang(undefined);
      setCustomerPayment(0);
      setPaymentMethod(null);
      setIsBanGiaoHang(false);
      setIdBill(0);
      fromThanhCong('Hủy hóa đơn thành công');

    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  // Lấy hóa đơn chi tiet theo ID bill
  const getById = async (id: number) => {
    try {
      setIsProcessingBillChange(true);
      setIdBill(id)
      const data = await getByIdBillDetail(id)
      setProduct(data)
      console.log('Danh sách hóa đơn chi tiết:', data)
      const khachHang = await findKhachHang(id)
      hienThiKhachHang(khachHang)
      const voucher = await getVoucherDangSuDung(id)
      setDuLieuVoucherDangDung(voucher)
      loadVoucherByAcount(khachHang?.id);
      findBillById(id)
      setIsBanGiaoHang(false)
    } catch (error) {
      setProduct([])
      console.error('Error fetching data:', error)
    } finally {
      setIsProcessingBillChange(false); // End processing
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
        fromThatBai('Xóa sản phẩm chi tiết không thành công')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  // Thêm hóa đơn mới
  const handleAddBill = async () => {
    try {
      const newBill = await addHoaDon();
      setListBill([...listBill, newBill]);
      loadBill();
      loadBillChoThanhToan()
      fromThanhCong('Thêm hóa đơn thành công')
    } catch (error) {
      console.error('Lỗi API:', error)
      fromThatBai('Nhân viên chưa đăng nhập!');

    }
  }

  // Thêm sản phẩm chi tiết vào hóa đơn chi tiết
  const handleAddProduct = async (product: ProductDetail) => {
    try {
      // console.log("ID bill san pham " + idBill);
      if (idHoaDon == 0) {
        fromThatBai('Vui lòng chọn hóa đơn')
        return
      }
      setIdProductDetail(product.id)
      setSelectedImei([]);
      loadImei(product.id)
      setDialogContent('imei')
      // fromThanhCong('Thêm sản phẩm chi tiết vào hóa đơn thành công')
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
      if (idHoaDon == 0) {
        fromThatBai('Vui lòng chọn hóa đơn')
        return
      }
      if (selectedImei.length == 0) {
        fromThatBai("Vui lòng chọn imei");
        return;
      }
      await addBillDetailAndCreateImeiSold({
        idBill: idHoaDon,
        idProductDetail: idProductDetail,
        id_Imei: selectedImei,
      })
      setSelectedImei([])
      setIsDialogOpen(false)
      await loadProductDet()
      await loadImei(idProductDetail)
      await getById(idHoaDon)
      fromThanhCong('Thêm sản phẩm chi tiết thành công')
    } catch (error) {
      console.error('Lỗi API:', error)
    }
  }

  const updateHandleImeiSold = async (idBillDetail: number) => {
    try {
      if (selectedImei.length == 0) {
        fromThatBai("Vui lòng chọn imei");
        return;
      }
      await updateImeiSold(
        {
          id_Imei: selectedImei,
          idBillDetail: idBillDetail,
        },
        idHoaDon,
        idProductDetail
      )
      setSelectedImei([])
      await loadProductDet()
      await loadImei(idProductDetail)
      await getById(idHoaDon)
      fromThanhCong('Cập nhật số lượng hóa đơn chi tiết thành công')
    } catch (error) {
      console.error('Lỗi API:', error)
    }
  }

  // Cập nhật danh sách IMEI đã bán
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


  const updateVoucherKhiChon = async (idVoucher: number | null) => {
    try {

      await updateVoucher(idHoaDon, idVoucher);
      await getById(idHoaDon);
      setIsVoucher(false);
      fromThanhCong("Áp dụng voucher thành công!");
    } catch (error) {
      console.error('Lỗi khi cập nhật voucher:', error);
    }
  };


  // Thêm khách hàng vào hóa đơn
  const handleAddKhachHang = async (idAccount: number) => {
    if (idHoaDon == 0 || idHoaDon == null) {
      fromThatBai('Vui lòng chọn hóa đơn')
      return
    }
    try {
      await addKhachHang(idHoaDon, idAccount)
      // await loadAccountKH()
      setIsKhachHang(false)
      const khachHang = await findKhachHang(idHoaDon)
      hienThiKhachHang(khachHang)
      await findBillById(idHoaDon)
      // setIsBanGiaoHang(false)
      const voucher = await getVoucherDangSuDung(idHoaDon)
      setDuLieuVoucherDangDung(voucher)
      loadVoucherByAcount(idAccount);
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
  const isValidFullAddress = (address: string) => {
    if (!address) return false;

    const parts = address.split(",").map((part) => part.trim());

    return parts.length >= 4 && parts.every((part) => part.length > 0);
  };

  const handleThanhToan = async (status: string) => {
    let result = true;
    if (paymentMethod != 2) {
      result = await showDialog({
        type: 'confirm',
        title: 'Xác nhận thanh toán đơn hàng',
        message: `Bạn chắc chắn muốn thanh toán đơn hàng 
        <strong style="color:rgb(8, 122, 237)">${searchBill?.code ?? ''}</strong> <br />
        với số tiền đã nhận được là 
        <span style="color: red; font-weight: 700; background-color: #f8f9fa; padding: 2px 6px; border-radius: 4px">
        ${customerPayment?.toLocaleString()}đ
        </span>?`,
        confirmText: 'Xác nhận',
        cancelText: 'Hủy bỏ'
      });
    }
  
    if (searchBill == null || searchBill?.id === undefined) {
      fromThatBai("Vui lòng chọn hóa đơn trước khi thanh toán");
      return;
    }
    // Kiểm tra đầu vào
    const validations = [
      { condition: product.length === 0, message: "Vui lòng thêm sản phẩm trước khi thanh toán" },
      { condition: !searchBill?.idAccount, message: "Vui lòng chọn khách hàng" },
      { condition: !paymentMethod && !isThanhToanNhanHang, message: "Vui lòng chọn phương thức thanh toán" },
      { condition: tienThua < 0 && !isThanhToanNhanHang && paymentMethod === 1, message: "Số tiền thanh toán không đủ" },
      { condition: tienThua > 10000000, message: "Tiền thừa trả khách vượt quá giới hạn cho phép (10 triệu)" }
    ];

    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/
    const deliveryValidations =
      isBanGiaoHang === true
        ? [
          { condition: !deliveryInfo, message: "Thiếu thông tin giao hàng" },
          { condition: !deliveryInfo?.customerName?.trim(), message: "Vui lòng nhập: Tên khách hàng" },
          { condition: !deliveryInfo?.customerPhone?.trim(), message: "Vui lòng nhập: Số điện thoại" },
          {
            condition:
              deliveryInfo?.customerPhone &&
              !phoneRegex.test(deliveryInfo.customerPhone.trim()),
            message: "Số điện thoại không hợp lệ",
          },
          { condition: !deliveryInfo?.fullAddress?.trim(), message: "Vui lòng nhập: Địa chỉ" },
          {
            condition: deliveryInfo?.fullAddress && !isValidFullAddress(deliveryInfo.fullAddress),
            message: "Địa chỉ giao hàng đang thiếu",
          },
        ]
        : [];

    const allValidations = [...deliveryValidations, ...validations];

    for (const { condition, message } of allValidations) {
      if (condition) {
        fromThatBai(message);
        return;
      }
    }

    if (!result) {
      fromThatBai(`Thanh toán đơn hàng ${searchBill?.code ?? ''} không thành công`);
      return;
    } else {
      try {
        await thanhToan({
          id: searchBill?.id,
          nameBill: searchBill?.code,
          maBill: searchBill?.maBill,
          idAccount: searchBill?.idAccount ?? null,
          idNhanVien: searchBill?.idNhanVien ?? null,
          idVoucher: searchBill?.idVoucher ?? null,
          totalPrice: searchBill?.totalPrice ?? 0,
          customerPayment: customerPayment || 0,
          amountChange: tienKhachThieu,
          totalDue: tongTien ?? 0,
          deliveryFee: (isBanGiaoHang == true ? shippingFee : 0),
          payInsurance: insuranceFee ?? 0,
          customerRefund: searchBill?.customerRefund ?? 0,
          discountedTotal: searchBill?.discountedTotal ?? 0,
          receiptDate: searchBill?.receiptDate,
          paymentDate: searchBill?.paymentDate,
          billType: searchBill?.billType,
          status: status,
          address: (isBanGiaoHang == true ? deliveryInfo?.fullAddress : searchBill?.address),
          email: searchBill?.email ?? null,
          note: (isBanGiaoHang == true ? deliveryInfo?.note : searchBill?.note),
          phone: (isBanGiaoHang == true ? deliveryInfo?.customerPhone : searchBill?.phone),
          name: (isBanGiaoHang == true ? deliveryInfo?.customerName : searchBill?.name),
          idPayment: paymentMethod,
          idDelivery: (isBanGiaoHang == true ? 2 : 1),
          itemCount: searchBill?.detailCount ?? 0
        });

        const invoiceData = {
          code: searchBill?.maBill,
          paymentDate: new Date().toISOString(),
          staff: searchBill?.fullNameNV,
          customer: (isBanGiaoHang == true ? deliveryInfo?.customerName : searchBill?.name),
          phone: (isBanGiaoHang == true ? deliveryInfo?.customerPhone : searchBill?.phone),
          address: (isBanGiaoHang == true ? deliveryInfo?.fullAddress : searchBill?.address),
          items: searchBill?.billDetailResponesList.map(detail => ({
            product: detail.productDetail.productName + ' ' +
              detail.productDetail.ram + '/' +
              detail.productDetail.rom + 'GB ( ' +
              detail.productDetail.color + ' )',
            imei: detail.imeiSoldRespones.map(imeiSold => imeiSold.id_Imei.imeiCode),
            price: detail.price,
            quantity: detail.quantity,
          })) || [],
          totalPrice: searchBill?.totalPrice || 0,
          discountedTotal: searchBill?.discountedTotal || 0,
          deliveryFee: (isBanGiaoHang == true ? shippingFee : 0),
          payInsurance: insuranceFee || 0,
          totalDue: tongTien || 0,
          customerPayment: customerPayment || 0,
          change: (tienThua > 0 ? tienThua : 0),
        };

        handlePrint(invoiceData);
        // Reset trạng thái
        setSearchBill(undefined);
        hienThiKhachHang(undefined);
        setProduct([]);
        setCustomerPayment(0);
        setPaymentMethod(null);
        setIsBanGiaoHang(false);
        setIdBill(0);
        fromThanhCong("Thanh toán thành công");
      } catch (error) {
        console.error("Lỗi khi thanh toán:", error);
        // fromThatBai("Đã xảy ra lỗi khi thanh toán");
      }
    }
  };


  // Quét mã vạch
  const isProcessing = useRef(false);
  const handleScanSuccess = async (imei: string) => {
    if (isProcessingBillChange) {
      fromThatBai('Đang xử lý chuyển đổi hóa đơn, vui lòng đợi');
      return;
    }

    if (isProcessing.current) {
      console.log('⚠ handleScanSuccess bị chặn do đã chạy trước đó!')
      return
    }

    isProcessing.current = true // Đánh dấu đang xử lý

    const quaggaWindow = window as unknown as { Quagga: any };
    if (quaggaWindow.Quagga) {
      quaggaWindow.Quagga.stop();
      console.log('📸 Camera đã dừng để tránh quét lại');
    }

    try {
      setIsScanning(true)
      const currentBillId = currentBillRef.current;
      console.log('id bill chuẩn bị xử lý: ' + currentBillId);
      const productDetail = await quetBarCode(imei)
      if (!productDetail?.idImei) {
        fromThatBai('IMEI không tồn tại trong hệ thống')
        return
      }

      if (!currentBillId || currentBillId === 0) {
        fromThatBai('Vui lòng chọn hóa đơn trước khi quét mã')
        return
      }

      console.log('Thực hiện thêm vào hóa đơn: ' + currentBillId)
      // const newBillDetail = await addHDCT({
      //   idBill: currentBillId,
      //   idProductDetail: productDetail.id,
      // })

      // if (!newBillDetail?.id) {
      //   fromThatBai('Tạo hóa đơn chi tiết thất bại')
      //   return
      // }
      // await createImeiSold(
      //   {
      //     id_Imei: [productDetail.idImei],
      //     idBillDetail: newBillDetail.id,
      //   },
      //   currentBillId,
      //   productDetail.id
      // )

      setProduct((prev) =>
        prev.filter((p) => p.idProductDetail !== productDetail.id)
      )

      await Promise.all([
        loadImei(productDetail.id),
        getById(currentBillId)
      ])

      fromThanhCong(`Đã thêm sản phẩm ${productDetail.name}`)
    } catch (error: any) {
      fromThatBai('Lỗi khi thêm sản phẩm!')
    } finally {
      isProcessing.current = false
      setIsScanning(false)
      setSelectedImei([])


      setTimeout(() => {
        const quaggaWindow = window as unknown as { Quagga: any };
        if (quaggaWindow.Quagga) {
          quaggaWindow.Quagga.start();
          console.log('📸 Camera đã bật lại để quét tiếp');
        }
      }, 1000)
    }
  }


  // Xử lý khi địa chỉ thay đổi
  const handleAddressUpdate = (fullAddress: string) => {
    setDeliveryInfo(prev => ({ ...prev, fullAddress }));
  };

  // Xử lý khi thông tin chi tiết thay đổi
  const handleDetailUpdate = (details: { name: string; phone: string; note: string }) => {
    setDeliveryInfo(prev => ({
      ...prev,
      customerName: details.name,
      customerPhone: details.phone,
      note: details.note
    }));
  };


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
                onClick={() => {
                  // Verify current bill before allowing scan
                  const currentBill = currentBillRef.current;
                  if (!currentBill || currentBill === 0) {
                    fromThatBai('Vui lòng chọn hóa đơn trước khi quét');
                    return;
                  }
                  setIsScanning(true);
                }}
                className='bg-white-500 rounded-sm border border-blue-500 border-opacity-50 text-blue-600 hover:bg-gray-300'
              >
                Quét Barcode
              </Button>

              <BarcodeScannerModal
                isOpen={isScanning}
                onClose={() => setIsScanning(false)}
                onScanSuccess={handleScanSuccess}
              />
              {/* Thêm sản phẩm chi tiết vào hóa đơn chờ*/}
              <ThemSanPham
                listProduct={listProduct}
                listImei={listImei}
                selectedImei={selectedImei}
                handleAddImei={handleAddImei}
                handleAddProduct={handleAddProduct}
                handleCheckboxChange={handleCheckboxChange}
                dialogContent={dialogContent}
                setDialogContent={setDialogContent}
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
                setListProduct={setListProductDetail}
              />
            </div>
          </div>
          <hr className='border-t-1.5 border-gray-600' />

          {/* Bảng hóa đơn chi tiết tìm kiếm theo id hóa đơn  */}
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
          />
        </Main>
      </div>
      <br />
      <TableKhachHang
        listKhachHang={khachHang}
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
          <div className='ml-[800px] mr-[40px] flex space-x-2'>
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
              Giao hàng
            </Button>
          </div>
        </div>
        <hr className='border-gray-600' />
        <br />

        <div className='grid grid-cols-2 gap-4'>
          {/* --------- cot 1 ----------- */}
          <DiaChiGiaoHang
            fullName={searchBill?.name ?? ""}
            phone={searchBill?.phone ?? ""}
            address={searchBill?.address ?? ""}
            isBanGiaoHang={isBanGiaoHang}
            onAddressChange={handleAddressUpdate}
            onDetailChange={handleDetailUpdate}
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
            printData={printData}
            printRef={printRef}
            setIsThanhToanNhanHang={setIsThanhToanNhanHang}
            isThanhToanNhanHang={isThanhToanNhanHang}
            tongTien={tongTien}
            setShippingFee={setShippingFee}
            setInsuranceFee={setInsuranceFee}
            confirmedAddress={deliveryInfo?.fullAddress}
          />
        </div>
      </div >
      <br />
    </>
  )
}
export default BanHangTaiQuay
