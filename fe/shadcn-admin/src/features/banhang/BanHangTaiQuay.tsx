import React, { useEffect, useState } from 'react';
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
// import "./custom-toast.css"; // Thêm CSS tùy chỉnh
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import useVietnamAddress from './service/ApiTichHopDiaChi';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

import { toast, ToastContainer } from 'react-toastify';
import {
  useForm
} from "react-hook-form"
import {
  zodResolver
} from "@hookform/resolvers/zod"
import * as z from "zod"


import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Check,
  ChevronsUpDown
} from "lucide-react"
import {
  Textarea
} from "@/components/ui/textarea"
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import HoaDonCho from './components/HoaDonCho';
import ThemSanPham from './components/ThemSanPham';
import TableHoaDonChiTiet from './components/TableHoaDonChiTiet';

interface Bill {
  id: number;
  nameBill: string;
  idAccount?: number | null;
  idNhanVien?: number | null;
  idVoucher?: number | null;
  totalPrice: number | null;
  customerPayment: number | null;
  amountChange: number | null;
  deliveryFee: number | null;
  totalDue: number | null;
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
  deliveryId?: number | null;
  itemCount: number;
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


function BanHangTaiQuay() {
  const [listBill, setListBill] = useState<Bill[]>([]);
  const [billChoThanhToan, setBillChoThanhToan] = useState<Bill[]>([]);
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
  const [isKhachHang, setIsKhachHang] = useState(false);
  const [isVoucher, setIsVoucher] = useState(false);
  const [isCapNhatImei, setIsCapNhatImei] = useState(false);
  const [setVoucherDangDung, setDuLieuVoucherDangDung] = useState<Voucher>();
  const [ListVoucherTheoAccount, setListVoucherTheoAccount] = useState<Voucher[]>([]);
  const [isBanGiaoHang, setIsBanGiaoHang] = useState(false);
  const handleBanGiaoHangChange = () => {
    setIsBanGiaoHang((prev) => !prev);
  };
  const [paymentMethod, setPaymentMethod] = useState<number | null>(null); // 1 = Tiền mặt, 2 = Chuyển khoản
  const [customerPayment, setCustomerPayment] = useState<number>(0);
  const tienThua = Math.max(customerPayment - (searchBill?.totalDue ?? 0));
  const [isPTThanhToan, setIsPTThanhToan] = useState(false);

  // Lấy danh sách hóa đơn, sản phẩm chi tiết, khách hàng, imei
  useEffect(() => {
    loadBill();
    loadProductDet();
    loadAccountKH();
    loadBillChoThanhToan();
  }, []);
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

  // Tìm kiêm bill theo id
  const findBillById = async (id: number) => {
    try {
      const data = await findBill(id);
      console.log(data);
      console.log("ID hóa đơn:", id);
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
      // hienThiKhachHang();
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
      // Hiển thị thông báo
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
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
    }
  }


  // const handleThanhToan = async () => {
  //   try {
  //     if (idBill == 0 || idBill == null) {
  //       fromThatBai("Vui lòng chọn hóa đơn trước khi thanh toán");
  //       return;
  //     }
  //     if (tienThua < 0 || tienThua == null) {
  //       fromThatBai("Số tiền thanh toán không đủ");
  //       return;
  //     }
  //     const data = await thanhToan({
  //       id: idBill,
  //       paymentMethod: paymentMethod,
  //       customerPayment: customerPayment
  //     });
  //     console.log("Thanh toán thành công:", data);
  //     await loadBill();
  //     await loadProductDet();
  //     setProduct([]);
  //     await loadBillChoThanhToan();
  //     setIdBill(0);
  //     fromThanhCong("Thanh toán thành công");
  //   } catch (error) {
  //     console.error("Lỗi khi thanh toán:", error);
  //   }
  // }

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



  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  const { provinces, districts, wards, fetchDistricts, fetchWards } = useVietnamAddress();


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
                            <Button className='bg-blue-600 text-white hover:bg-gray-300 hover:text-blue-600' color="primary" onClick={() => handleAddKhachHang(ac.id)}>
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
          <div
            className={`transition-all duration-300 ${isBanGiaoHang ? "w-full opacity-100 visible" : "w-0 opacity-0 invisible"
              }`}
            style={{ minWidth: isBanGiaoHang ? "400px" : "0px" }}
          >            {isBanGiaoHang && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-6">

                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Họ và tên</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Họ và tên "

                              type=""
                              {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-6">

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số điện thoại</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Số điện thoại"

                              type=""
                              {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                </div>

                <div className="grid grid-cols-10 gap-4">

                  <div className="col-span-5">
                    <FormField
                      control={form.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Thành phố/tỉnh</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant="outline" role="combobox" className="w-[220px] justify-between font-normal">
                                  {field.value ? provinces.find((p) => p.code === field.value)?.name : "Chọn tỉnh/thành phố"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[230px] p-0">
                              <Command>
                                <CommandInput placeholder="Search" />
                                <CommandList>
                                  <CommandEmpty>No language found.</CommandEmpty>
                                  <CommandGroup>
                                    {provinces.map((p) => (
                                      <CommandItem key={p.code} onSelect={() => {
                                        form.setValue("province", p.code);
                                        fetchDistricts(p.code);
                                      }}>
                                        <Check className={p.code === field.value ? "opacity-100" : "opacity-0"} />
                                        {p.name}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-5">
                    <FormField
                      control={form.control}
                      name="district"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Quận/huyện</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant="outline" role="combobox" className="w-[220px] justify-between font-normal">
                                  {field.value ? districts.find((d) => d.code === field.value)?.name : "Chọn quận/huyện"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[230px] p-0">
                              <Command>
                                <CommandInput placeholder="Search " />
                                <CommandList>
                                  <CommandEmpty>No language found.</CommandEmpty>
                                  <CommandGroup>
                                    {districts.map((d) => (
                                      <CommandItem key={d.code} onSelect={() => {
                                        form.setValue("district", d.code);
                                        fetchWards(d.code);
                                      }}>
                                        <Check className={d.code === field.value ? "opacity-100" : "opacity-0"} />
                                        {d.name}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>


                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-6 pt-3">
                    <FormField
                      control={form.control}
                      name="ward"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Phường/xã</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant="outline" role="combobox" className="w-[220px] justify-between font-normal">
                                  {field.value ? wards.find((w) => w.code === field.value)?.name : "Chọn phường/xã"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[230px] p-0">
                              <Command>
                                <CommandInput placeholder="Search" />
                                <CommandList>
                                  <CommandEmpty>No language found.</CommandEmpty>
                                  <CommandGroup>
                                    {wards.map((w) => (
                                      <CommandItem key={w.code} onSelect={() => form.setValue("ward", w.code)}>
                                        <Check className={w.code === field.value ? "opacity-100" : "opacity-0"} />
                                        {w.name}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-6">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Địa chỉ cụ thể</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Địa chỉ người nhận"

                              type=""
                              {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ghi chú</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ghi chú"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          )}
          </div>


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
                    <div className="flex justify-between border-b pb-2">
                      <p className="text-gray-700 text-base">Khách cần trả:</p>
                      <p className="font-semibold text-green-600">{searchBill?.totalDue == null ? 0.00 : searchBill?.totalDue.toLocaleString('vi-VN')} đ</p>
                    </div>
                    <div className="flex gap-x-2 justify-between border-b pb-2 pl-[45px] pr-[40px]">

                      <Button
                        variant="outline"
                        className={`border border-emerald-500 text-emerald-600 rounded-lg hover:border-orange-700 hover:text-orange-700 px-3 text-2xs
                           ${paymentMethod === 1 ? 'border-yellow-700 text-yellow-700 bg-slate-300' : 'border-emerald-500 text-emerald-600'}`}
                        onClick={() => setPaymentMethod(1)}
                      >
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
                              {searchBill?.totalDue == null ? 0.00 : searchBill?.totalDue.toLocaleString('vi-VN')} đ</p>
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
                        <Input type="number" className='w-[150px]' value={paymentMethod == 2 ? customerPayment : ""} placeholder="Nhập số tiền"
                          onChange={(e) => setCustomerPayment(Number(e.target.value))} /></p>
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
                <Button className="w-[270px] h-[50px] bg-blue-500 text-white hover:bg-blue-600 ml-[60px] ">
                  Xác nhận thanh toán</Button>
              </div>
            </div>
          </div>
        </div>
      </div > <br />
    </>
  );
}
export default BanHangTaiQuay;