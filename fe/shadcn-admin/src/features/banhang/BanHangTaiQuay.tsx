import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/header';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import TasksProvider from '../tasks/context/tasks-context';
import { Main } from '@/components/layout/main';
import { Button } from '@/components/ui/button';
import {
  getData, findImeiByIdProductDaBan, findBill,
  findKhachHang, addKhachHang, addHoaDon, findImeiById,
  createImeiSold, deleteProduct, getImei, getAccountKhachHang,
  getProductDetail, addHDCT, getByIdBillDetail, getVoucherDangSuDung,
  findVoucherByAccount, huyHoaDon, getDataChoThanhToan, updateImeiSold,
  updateVoucher, thanhToan
}
  from './service/BanHangTaiQuayService';
import "./custom-toast.css"; // Thêm CSS tùy chỉnh
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

import { toast, ToastContainer } from 'react-toastify';


import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import HoaDonCho from './components/HoaDonCho';
import ThemSanPham from './components/ThemSanPham';
import TableHoaDonChiTiet from './components/TableHoaDonChiTiet';

import DiaChiGiaoHang from './components/DiaChiGiaoHang';
import { BillSchema, Voucher } from './service/BillSchema';
import { tr } from '@faker-js/faker';
import { set } from 'date-fns';
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

function BanHangTaiQuay() {
  const [listBill, setListBill] = useState<BillSchema[]>([]);
  const [billChoThanhToan, setBillChoThanhToan] = useState<BillSchema[]>([]);
  const [searchBill, setSearchBill] = useState<BillSchema>();
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
  const [isPTThanhToan, setIsPTThanhToan] = useState(false);

  const tienThua = Math.max(customerPayment - (searchBill?.totalDue ?? 0));

  // Lấy danh sách hóa đơn, sản phẩm chi tiết, khách hàng, imei
  useEffect(() => {
    loadBill();
    loadProductDet();
    loadAccountKH();
    loadBillChoThanhToan();
    chuyenPhiShip();
      }, [isBanGiaoHang]);

  // Lấy danh sách hóa đơn top 5 
  const loadBill = async () => {
    try {
      const data = await getData();
      setListBill(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  // Lấy danh sách hóa đơn cho thanh toan
  const loadBillChoThanhToan = async () => {
    try {
      const data = await getDataChoThanhToan();
      setBillChoThanhToan(data);
    } catch (error) {
      console.error('Error fetching data:', error);
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

  // Lấy danh sách khách hàng
  const loadAccountKH = async () => {
    try {
      const data = await getAccountKhachHang();
      setListAccount(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Lấy danh sách voucher theo account 
  const loadVoucherByAcount = async (idBillAC: number) => {
    try {
      const data = await findVoucherByAccount(idBillAC);
      // console.log("ID voucher " + idBillAC)
      setListVoucherTheoAccount(data);
    } catch (error) {
      setListVoucherTheoAccount([]);
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

  // Tìm kiêm bill theo id hoa don
  const findBillById = async (id: number) => {
    try {
      const data = await findBill(id);
      setSearchBill(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Huy hoa don 
  const huyHoaDonTheoId = async (idBillHuy: number) => {
    try {
      await huyHoaDon(idBillHuy);
      await loadBill();
      loadProductDet();
      setProduct([]);
      loadBillChoThanhToan();
      setIdBill(0);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Lấy hóa đơn chi tiet theo ID bill 
  const getById = async (id: number) => {
    try {
      const data = await getByIdBillDetail(id);
      setProduct(data); // Cập nhật state
      setIdBill(id);
      const khachHang = await findKhachHang(id);
      hienThiKhachHang(khachHang);
      findBillById(id);
      const voucher = await getVoucherDangSuDung(id);
      setDuLieuVoucherDangDung(voucher);
      findBillById(id);
      await loadVoucherByAcount(id);
      setIsBanGiaoHang(false);
    } catch (error) {
      setProduct([]); // Xóa danh sách cũ
      setIdBill(0);
      // setError(error.message);
      console.error("Error fetching data:", error);
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
      // console.log("Xoa san pham:", data);
      await loadProductDet();
      await loadImei(idProductDetail);
      await getById(idBill);
      fromThanhCong("Xóa sản phẩm chi tiết thành công");
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // Thêm hóa đơn mới
  const handleAddBill = async () => {
    try {
      const newBill = await addHoaDon({ idNhanVien: Number(9) }); // Truyền trực tiếp idNhanVien
      console.log("Hóa đơn mới:", newBill);
      setListBill([...listBill, newBill]); // Cập nhật danh sách
      loadBill();
      loadBillChoThanhToan();
      fromThanhCong("Thêm hóa đơn thành công");
    } catch (error) {
      // toast.error("Lỗi khi thêm hóa đơn!");
      console.error("Lỗi API:", error);
    }
  };

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
      getById(idBill);
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
      await getById(idBill);
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
      await getById(idBill);
      fromThanhCong("Cập nhật IMEI thành công");
    } catch (error) {
      console.error("Lỗi API:", error);
    }
  };

  // Ca
  const handleUpdateProduct = async (idPD: number, billDetaill: number) => {
    console.log("ID product detail:", idPD);
    setSelectedImei([]);  // Reset trước khi cập nhật
    // setIsCapNhatImei(true);
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

  const updateVoucherKhiChon = (idVoucher: number) => {
    try {
      updateVoucher(idBill, idVoucher);
      getById(idBill);
      setIsVoucher(false);

      fromThanhCong("Cập nhật voucher thành công ")
    } catch (error) {
      console.error("Lỗi khi cập nhật voucher:", error);
    }
  }
  // Thêm khách hàng vào hóa đơn
  const handleAddKhachHang = async (idAccount: number) => {
    if (idBill == 0 || idBill == null) {
      fromThatBai("Vui lòng chọn hóa đơn");
      setIsKhachHang(false);
      return;
    }
    try {
      const data = await addKhachHang(idBill, idAccount);
      console.log("Khách hàng mới:", data);
      await loadAccountKH();
      setIsKhachHang(false);
      const khachHang = await findKhachHang(idBill);
      hienThiKhachHang(khachHang);
      await findBillById(idBill);
      setIsBanGiaoHang(false);
      const voucher = await getVoucherDangSuDung(idBill);
      setDuLieuVoucherDangDung(voucher);
      await loadVoucherByAcount(idBill);
      fromThanhCong("Thêm khách hàng thành công");
    } catch (error) {
      console.error("Lỗi khi thêm khách hàng:", error);
    }
  }

  const handlePTThanhToan = async () => {
    try {
      if (idBill == 0 || idBill == null) {
        fromThatBai("Vui lòng chọn hóa đơn trước khi thanh toán");
        setIsPTThanhToan(false);
        return;
      }
      setPaymentMethod(2);
      setCustomerPayment(searchBill?.totalDue || 0);
      setIsPTThanhToan(false);
      // console.log(searchBill);
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
    }
  }
  // chọn check box bán giao hàng 
  const handleBanGiaoHangChange = () => {
    try {
      if (searchBill?.idAccount == 1) {
        fromThatBai("Khách lẻ không bán giao hàng");
        return;
      }
      if (idBill == 0 || searchBill?.id === undefined) {
        fromThatBai("Vui lòng chọn hóa đơn");
        return;
      }
      if (product.length === 0) {
        fromThatBai("Vui lòng thêm sản phẩm ");
        return;
      }
      setIsBanGiaoHang((prev) => !prev);
    } catch (error) {
      console.error("Lỗi khi bán giao hàng:", error);
    }
  };

  const chuyenPhiShip = async () => {
    try {
      const newPhiShip = isBanGiaoHang ? 30000 : 0;
      setPhiShip(newPhiShip);

      // Tính tổng tiền khách cần trả
      const newTotal = (searchBill?.totalDue ?? 0) + newPhiShip;
      setTongTienKhachTra(newTotal);
      console.log("Tổng tiền khách trả:", newTotal);
      console.log("Phí ship:", newPhiShip);
      console.log("Bán giao hàng:", isBanGiaoHang);

    } catch (error) {
      console.error("Lỗi khi bán giao hàng:", error);
    }
  }
  // Thanh toán hóa đơn
  const handleThanhToan = async (status: string, billType: number) => {
    try {
      if (idBill == 0 || searchBill?.id === undefined) {
        fromThatBai("Vui lòng chọn hóa đơn trước khi thanh toán");
        return;
      } else if (product.length === 0) {
        fromThatBai("Vui lòng thêm sản phẩm trước khi thanh toán");
        return;
      } else if (searchBill?.idAccount == null) {
        fromThatBai("Vui lòng chọn khách hàng");
        return;
      } else if (paymentMethod == null) {
        fromThatBai("Vui lòng chọn phương thức thanh toán");
        return;
      } else if (tienThua < 0) {
        fromThatBai("Số tiền thanh toán không đủ");
        return;
      } else {

        await thanhToan({
          id: searchBill?.id,
          nameBill: searchBill?.nameBill,
          idAccount: searchBill?.idAccount ?? null,
          idNhanVien: searchBill?.idNhanVien ?? null,
          idVoucher: searchBill?.idVoucher ?? null,
          totalPrice: searchBill?.totalPrice ?? 0,
          customerPayment: customerPayment,  // Giá trị cập nhật
          amountChange: tienThua,
          deliveryFee: searchBill?.deliveryFee ?? 0,
          totalDue: searchBill?.totalDue ?? 0,
          customerRefund: searchBill?.customerRefund ?? 0,
          discountedTotal: searchBill?.discountedTotal ?? 0,
          deliveryDate: searchBill?.deliveryDate ?? null,
          customerPreferred_date: searchBill?.customerPreferred_date ?? null,
          customerAppointment_date: searchBill?.customerAppointment_date ?? null,
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
          idDelivery: searchBill?.idDelivery ?? null,
          itemCount: searchBill?.itemCount ?? 0
        });

        console.log("Thanh toán thành công:", paymentMethod);
        console.log("Thanh toán thành công:");
        setSearchBill(undefined);
        hienThiKhachHang(undefined);
        await loadBill();
        await loadProductDet();
        setProduct([]);
        setCustomerPayment(0);
        setPaymentMethod(null);
        await loadBillChoThanhToan();
        fromThanhCong("Thanh toán thành công");
      }
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
    }
  }



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
        <TasksProvider>
          <Header>
            <Search />
            <div className="ml-auto flex items-center space-x-4">
              <ThemeSwitch />
              <ProfileDropdown />
            </div>
          </Header>
        </TasksProvider>
      </div><br />
      <div className="p-2 bg-white rounded-lg shadow-md border border-gray-300 mr-1.5"
        style={{ paddingTop: '18px', margin: '0 13px' }}>

        {/* Thêm hóa đơn chờ tại quầy */}
        <HoaDonCho
          listBill={listBill}
          billChoThanhToan={billChoThanhToan}
          huyHoaDonTheoId={huyHoaDonTheoId}
          getById={getById}
          handleAddBill={handleAddBill}
          idBill={idBill} />
        <hr />

        <Main>
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
        </Main>
      </div>
      <br />
      <div className='p-2 bg-white
           rounded-lg shadow-md border border-gray-300 mr-1.5'
        style={{
          margin: '0 13px',
          padding: '22px 23px'
        }}>
        <div className="mb-2 flex items-center justify-between ">
          <h1 className=" font-bold tracking-tight">Khách hàng </h1>
          <div className="flex space-x-2">
            <Dialog open={isKhachHang} onOpenChange={setIsKhachHang}>
              <DialogTrigger asChild>
                <Button variant="outline"
                  className="bg-blue-600 text-white hover:bg-gray-300 hover:text-blue-600">
                  Chọn khách hàng
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[980px]">
                <div className="grid grid-cols-10 gap-4">
                  <div className='col-span-7'>
                    <Input
                      placeholder="Tìm mã, họ và tên"
                      className="max-w-sm"
                    />
                  </div>
                  {/* <div className="grid grid-cols-2 gap-4"> */}
                  <div className='col-span-1'>
                    <Button variant="outline" className="bg-white-500 border
                     border-black rounded-sm border-opacity-50
                      text-black hover:bg-gray-300"  onClick={() => handleAddKhachHang(1)}>
                      Khách lẻ
                    </Button> </div>
                  <div className='col-span-2'>
                    <Button variant="outline"
                      className="bg-blue-600 text-white hover:bg-gray-400 text-white">
                      Thêm khách hàng
                    </Button>
                  </div>
                </div>
                {/* </div> */}

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Stt</TableCell>
                        <TableCell>Mã</TableCell>
                        <TableCell>Họ và tên</TableCell>
                        <TableCell>Số điện thoại</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Địa chỉ</TableCell>
                        <TableCell>Thao Tác</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {listAccount.map((ac, index) => (
                        <TableRow key={ac.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{ac.code}</TableCell>
                          <TableCell>{ac.fullName}</TableCell>
                          <TableCell>{ac.phone}</TableCell>
                          <TableCell>{ac.email}</TableCell>
                          <TableCell>{ac.address}</TableCell>
                          <TableCell>
                            <Button className='bg-blue-600 text-white hover:bg-gray-300 hover:text-blue-600
                            ' color="primary"
                              onClick={() => handleAddKhachHang(ac.id)}>
                              Chọn
                            </Button>

                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </DialogContent>
            </Dialog>
            <ToastContainer />
          </div>
        </div>
        <hr className="border-t-1.5 border-gray-600" />
        {/* Thông tin khách hàng */}
        <div className="p-4 max-w-3xl" >
          <div className="flex justify-between pb-2 mb-2 gap-4 pt-5">
            <div className="flex items-center gap-2">
              <span className='whitespace-nowrap pr-5'>Tên khách hàng </span> <Input type="email"
                placeholder=" Tên khách hàng" disabled className='text-blue-600 text-base font-bold'
                value={listKhachHang?.fullName == null ? "" : listKhachHang?.fullName} />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-16 whitespace-nowrap">Email</span>
              <Input type="email" disabled placeholder="Email"
                className='h-[35px] text-blue-600 text-base font-bold' value={listKhachHang?.email == null ? "" : listKhachHang?.email} />
            </div>
          </div>
          <div className="flex justify-between  pb-2 mb-2">
            <div className="flex items-center gap-2">
              <span className='whitespace-nowrap pr-10'>Số điện thoại</span>
              <Input type="email" placeholder="Số điện thoại"
                className='text-blue-600 text-base font-bold'
                value={listKhachHang?.phone == null ? "" : listKhachHang?.phone} disabled />
            </div>
          </div>

        </div>

      </div> <br />
      <div className='p-2 bg-white
           rounded-lg shadow-md border border-gray-300 mr-1.5'
        style={{
          margin: '0 13px',
          padding: '22px 23px'
        }}>
        <div className="mb-2 flex items-center justify-between ">
          <h1 className=" font-bold tracking-tight">Thông tin đơn hàng </h1>
          <div className="flex space-x-2 mr-[40px]">
            <Button variant="outline"
              className="border border-blue-500 text-blue-600 rounded-lg hover:border-orange-600
                 hover:text-orange-600 px-3 text-2xs">
              <Checkbox id="ban-giao-hang" className='text-blue-600'
                checked={isBanGiaoHang}
                onCheckedChange={handleBanGiaoHangChange} />
              Bán giao hàng
            </Button>
          </div>
        </div>
        <hr className=" border-gray-600" /><br />

        <div className="grid grid-cols-2 gap-4">
          {/* --------- cot 1 ----------- */}
          <DiaChiGiaoHang isBanGiaoHang={isBanGiaoHang} khachHang={listKhachHang} />




          {/* Cột 2 */}
          <div className="w-[460px] min-w-[400px]  bg-white  p-4 rounded-lg">
            <div className="ml-auto mr-5 w-fit text-lg">
              <div className="mb-4 flex items-center gap-2">
                <p className="font-bold text-base">Mã Giảm Giá</p>
                <div className="flex items-center border rounded-md px-2 py-1 bg-gray-100">
                  <span className="text-gray-700  text-sm">{searchBill?.idVoucher == null ? 'No voucher' : setVoucherDangDung?.code}</span>
                  <button className="ml-2 text-sm text-gray-500 hover:text-gray-700">✖</button>
                </div>
                <Dialog open={isVoucher} onOpenChange={setIsVoucher}>
                  <DialogTrigger asChild>
                    <Button variant="outline"
                      className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded-md hover:bg-yellow-500">
                      Chọn Mã Giảm Giá
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[980px]">
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Stt</TableCell>
                            <TableCell>Mã</TableCell>
                            <TableCell>Giá min</TableCell>
                            <TableCell>Giá max</TableCell>
                            <TableCell>Giá trị giảm</TableCell>
                            <TableCell>Kiểu</TableCell>
                            <TableCell>Số lượng </TableCell>
                            <TableCell>Số lượng </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {ListVoucherTheoAccount.map((ac, index) => (
                            <TableRow key={ac.id}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{ac.code}</TableCell>
                              <TableCell>{ac.conditionPriceMin.toLocaleString('vi-VN')}</TableCell>
                              <TableCell>{ac.conditionPriceMax.toLocaleString('vi-VN')}</TableCell>
                              <TableCell>{ac.discountValue.toLocaleString('vi-VN')}</TableCell>
                              <TableCell>{ac.voucherType == true ? " % " : " VNĐ "}</TableCell>
                              <TableCell>{ac.quantity}</TableCell>
                              <TableCell>
                                <Button color="primary" onClick={() => updateVoucherKhiChon(ac.id)}>
                                  Chọn
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-1" >
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="space-y-4">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-700 text-base">Tổng tiền hàng: </span>
                      <p className="font-semibold">{searchBill?.totalPrice == null ? 0.00 : searchBill?.totalPrice.toLocaleString('vi-VN')} đ</p>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <p className="text-gray-700 text-base">Giảm giá:</p>
                      <p className="font-semibold">{searchBill?.discountedTotal == null ? 0 : searchBill?.discountedTotal.toLocaleString('vi-VN')} đ</p>
                    </div>
                    {isBanGiaoHang == true && (
                      <div className="flex justify-between border-b pb-2">
                        <p className="text-gray-700 text-base">Phí ship:</p>
                        <p className="font-semibold">{phiShip.toLocaleString('vi-VN')} đ</p>
                      </div>
                    )}
                    <div className="flex justify-between border-b pb-2">
                      <p className="text-gray-700 text-base">Khách cần trả:</p>
                      <p className="font-semibold text-green-600">{searchBill?.totalDue == null ? 0 : (searchBill?.totalDue+phiShip).toLocaleString('vi-VN')} đ</p>
                    </div>

                    <div className="flex gap-x-2 justify-between border-b pb-2 pl-[45px] pr-[40px]">
                      <Button
                        variant="outline"
                        className={`border border-emerald-500 text-emerald-600 rounded-lg hover:border-orange-700 hover:text-orange-700 px-3 text-2xs
                           ${paymentMethod === 1 ? 'border-yellow-700 text-yellow-700 bg-slate-300' : 'border-emerald-500 text-emerald-600'}`}
                        onClick={() => setPaymentMethod(1)} >
                        Tiền mặt
                      </Button>
                      {/* Mã qr để chuyển khoản */}
                      <Dialog open={isPTThanhToan} onOpenChange={setIsPTThanhToan}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className={`border rounded-lg px-3 hover:border-orange-700 hover:text-orange-700 text-2xs 
                              ${paymentMethod === 2 ? 'border-red-600 text-red-600 bg-slate-300' : 'border-blue-500 text-blue-600'}`}
                          >
                            Chuyển khoản
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <h2 className='font-semibold '>Mã QR chuyển khoản</h2>
                          <div className="flex justify-left pb-2">
                            <p className="text-gray-700 text-base">Mã đơn hàng: </p>
                            <p className="font-semibold text-stone-600 ml-[20px]">
                              {searchBill?.nameBill == null ? "" : searchBill?.nameBill}</p>
                          </div>
                          <div className="flex justify-left pb-2">
                            <p className="text-gray-700 text-base">Tổng tiền khách cần trả:</p>
                            <p className="font-semibold text-green-600 ml-[20px]">
                              {tongTienKhachTra.toLocaleString('vi-VN')} đ</p>
                          </div>
                          <div >
                            <img src="/images/MaQR.jpg" alt="Mã QR" className='w-[300px] h-[340px] ml-[95px] bg-white p-1 rounded-lg shadow' />
                          </div>
                          <Button variant="outline"
                            className='bg-blue-600 text-white w-[100px] h-[40px] ml-[340px] hover:bg-sky-600 hover:text-white '
                            onClick={() => {
                              handlePTThanhToan();
                            }}
                          >Xác nhận</Button>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <p className="text-gray-700 text-base"> Khách thanh toán:</p>
                      <p className="font-semibold text-green-600">
                        <Input
                          type="number"
                          className="customer-payment w-[150px]"
                          placeholder="Nhập số tiền"
                          value={paymentMethod === 2 && customerPayment === 0 ? searchBill?.totalDue ?? 0 : customerPayment}
                          onChange={(e) => setCustomerPayment(Number(e.target.value))}
                        />
                      </p>

                    </div>


                    {/* Tổng tiền */}
                    <div className="mt-4 flex justify-between border-b  pb-2 items-center font-bold text-lg text-red-600">
                      <p className='text-base'>Tiền thừa trả khách:</p>
                      <p>{tienThua.toLocaleString('vi-VN')} đ</p>

                    </div>

                    <div className="flex items-center  space-x-2 ">
                      <Switch id="airplane-mode" />
                      <Label htmlFor="airplane-mode">Thanh toán khi nhận hàng </Label>
                    </div>
                  </div>
                </div>
                {isBanGiaoHang == false ? (
                  <Button className="w-[270px] h-[50px] bg-blue-500 text-white hover:bg-blue-600 ml-[60px] "
                    onClick={() => handleThanhToan("DA_THANH_TOAN", 0)}>
                    Xác nhận thanh toán</Button>
                ) : (
                  <Button className="w-[270px] h-[50px] bg-red-500 text-white hover:bg-blue-600 ml-[60px] "
                    onClick={() => handleThanhToan("CHO_XAC_NHAN", 1)}>
                    Xác nhận thanh toán</Button>
                )}

              </div>
            </div>
          </div>
        </div>
      </div > <br />
    </>
  );
}
export default BanHangTaiQuay;