import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/header';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import TasksProvider from '../tasks/context/tasks-context';
import { FaShoppingCart, FaTimes, FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { CgAdd } from "react-icons/cg";
import { Main } from '@/components/layout/main';
import { Button } from '@/components/ui/button';
import {
  getData, findImeiByIdProductDaBan, findBill,
  findKhachHang, addKhachHang, addHoaDon, findImeiById,
  createImeiSold, deleteProduct, getImei, getAccountKhachHang,
  getProductDetail, addHDCT, getByIdBillDetail, getVoucherDangSuDung
  , findVoucherByAccount, huyHoaDon
}
  from './service/BanHangTaiQuayService';
import "./custom-toast.css"; // Thêm CSS tùy chỉnh
import { ImCart } from "react-icons/im";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

import {
  Dialog,
  DialogContent,
  // DialogDescription,
  // DialogFooter,
  // DialogHeader,
  // DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast, ToastContainer } from 'react-toastify';
import { SourceTextModule } from 'vm';


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

function BanHangTaiQuay() {
  const [listBill, setListBill] = useState<Bill[]>([]);
  const [searchBill, setSearchBill] = useState<Bill>();
  const [listProduct, setListProductDetail] = useState<ProductDetail[]>([]);
  const [listAccount, setListAccount] = useState<AccountKhachHang[]>([]);
  const [listKhachHang, hienThiKhachHang] = useState<AccountKhachHang>();
  const [listImei, setListImei] = useState<imei[]>([]);
  const [listImeiDaBan, setListImeiDaBan] = useState<imei[]>([]);
  const [idBill, setIdBill] = useState<number>(0);
  const [idProductDetail, setIdProductDetail] = useState<number>(0);
  const [selectedImei, setSelectedImei] = useState<number[]>([]);
  const [idBillDetail, setIdBillDetail] = useState<number>(0);
  const [product, setProduct] = useState<SearchBillDetail[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<'product' | 'imei'>('product');
  const [hoveredBillId, setHoveredBillId] = useState<number | null>(null);
  const [isKhachHang, setIsKhachHang] = useState(false);
  const [isVoucher, setIsVoucher] = useState(false);
  const [isCapNhatImei, setIsCapNhatImei] = useState(false);
  const [setVoucherDangDung, setDuLieuVoucherDangDung] = useState<Voucher>();
  const [ListVoucherTheoAccount, setListVoucherTheoAccount] = useState<Voucher[]>([]);

  // Lấy danh sách hóa đơn, sản phẩm chi tiết, khách hàng, imei
  useEffect(() => {
    loadBill();
    loadProductDet();
    loadAccountKH();
  }, []);
  // Lấy danh sách hóa đơn
  const loadBill = async () => {
    try {
      const data = await getData();
      setListBill(data);
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
      // console.log(data);
      // console.log("ID hóa đơn:", id);
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
  const findImeiByIdProductDetail = async (idProductDetail: number) => {
    try {
      const data = await findImeiById(idProductDetail);
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
      const data = await deleteProduct(idBillDetail, idBill);
      // console.log("Xoa san pham:", data);
      await loadProductDet();
      await loadImei(idProductDetail);
      await getById(idBill);
      showToast("Xóa sản phẩm chi tiết thành công");
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
      showToast("Thêm hóa đơn thành công");
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
        showToast("Vui lòng chọn hóa đơn");
        setIsDialogOpen(false);
        return;
      }
      const newProduct = await addHDCT({
        idBill: idBill,
        idProductDetail: product.id
      });

      // console.log("Sản phẩm chọn:", product.id);
      // console.log("Sản phẩm mới:", newProduct);
      setIdBillDetail(newProduct.id);
      setIdProductDetail(product.id);
      setSelectedImei([]);
      loadImei(product.id);
      getById(idBill);
      setDialogContent('imei'); // Chuyển nội dung dialog sang IMEI
      showToast("Thêm sản phẩm vào hóa đơn thành công");
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
  const handleAddImei = async () => {
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
      showToast("Thêm IMEI thành công");
    } catch (error) {
      console.error("Lỗi API:", error);
    }
  };

  const handleUpdateProduct = async (idPD: number, billDetail: number) => {
    console.log("ID product detail:", idPD);
    setSelectedImei([]);  // Reset trước khi cập nhật

    try {
      const data = await findImeiByIdProductDaBan(idPD, billDetail);
      if (!Array.isArray(data)) {
        console.error("Dữ liệu trả về không phải là một mảng:", data);
        return;
      }
      const ids: number[] = data.map((imei) => imei.id);
      setSelectedImei(ids);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách IMEI đã bán:", error);
    }
    // Gọi API khác (nếu cần)
    await findImeiByIdProductDetail(idPD);
  };


  const showToast = (message: string) => {
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

  // Thêm khách hàng vào hóa đơn
  const handleAddKhachHang = async (idAccount: number) => {
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
      showToast("Thêm khách hàng thành công");
    } catch (error) {
      console.error("Lỗi khi thêm khách hàng:", error);
    }
  }
  const CartEmpty = () => {
    return (
      <>
        <div className="flex flex-col items-center justify-center mt-4" style={{ height: "224px" }}>
          <img
            src="https://res.cloudinary.com/dqwfbbd9g/image/upload/v1701448962/yy04ozpcgnsz3lv4r2h2.png"
            style={{ width: "190px" }}
          />
          <p className="text-dark font-semibold text-center text-lg">
            Chưa có sản phẩm nào trong giỏ hàng!
          </p>
        </div>

      </>
    );
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
      <div className="p-2 bg-white rounded-lg shadow-md border border-gray-300 mr-1.5" style={{ paddingTop: '18px', margin: '0 13px' }}>
        <div className="flex space-x-1" style={{ paddingLeft: '13px', paddingRight: '10px' }}>
          {listBill.map((b) => (
            <div key={b.id}
              className={`flex items-center space-x-1 p-2 border-b-2 text-sm rounded-[5%] shadow-sm
              ${idBill === b.id ? 'border-blue-600 bg-gray-300' : 'border-transparent'}
              ${hoveredBillId === b.id ? 'bg-gray-200' : ''}`}
              onClick={() => getById(b.id)}
              onMouseEnter={() => setHoveredBillId(b.id)}
              onMouseLeave={() => setHoveredBillId(null)}
            >
              <button className="flex items-center space-x-1">
                {b.nameBill}
                <div className="relative">
                  <ImCart size={20} />
                  {b.itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-1 text-xs">
                      {b.itemCount}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => void huyHoaDonTheoId(b.id)}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                <FaTimes size={16} />
              </button>

            </div>
          ))}
          <button onClick={handleAddBill} ><CgAdd size={26} /></button>
        </div>  <hr />

        <Main>
          <div className="mb-2 flex items-center justify-between">
            <h1 className="font-bold tracking-tight">Giỏ hàng</h1>
            <div className="flex space-x-2">
              <Button className="bg-white-500 border border-black rounded-sm border-opacity-50 text-black hover:bg-gray-300">
                Quét Barcode
              </Button>

              {/* // Hiển thi nút thêm sản phẩm và trang của sản phẩm   */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="bg-black text-white hover:bg-gray-400" onClick={() => setDialogContent('product')}>
                    Thêm sản phẩm
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[980px]">
                  {dialogContent === 'product' ? (
                    <TableContainer>
                      {/* <h2>Sản phẩm </h2>   */}
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Stt</TableCell>
                            <TableCell>Mã code</TableCell>
                            <TableCell>Tên sản phẩm</TableCell>
                            <TableCell>Giá tiền </TableCell>
                            <TableCell>Số lượng tồn kho</TableCell>
                            <TableCell>Thao Tác</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {listProduct.map((product, index) => (
                            <TableRow key={product.id}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{product.code}</TableCell>
                              <TableCell>{product.name + " " + product.ram + "/" + product.rom + "GB (" + product.color + ")"}</TableCell>
                              <TableCell>{product.priceSell}</TableCell>
                              <TableCell align="center">{product.inventoryQuantity}</TableCell>
                              <TableCell>
                                <Button color="primary" onClick={() => handleAddProduct(product)}>
                                  Chọn
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Stt</TableCell>
                            <TableCell>Imei code</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {listImei.map((im, index) => (
                            <TableRow key={im.id}>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    checked={selectedImei.includes(im.id)}
                                    onCheckedChange={() => handleCheckboxChange(im.id)}
                                  />
                                </div>
                              </TableCell>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{im.imeiCode}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <Button className="bg-black text-white hover:bg-gray-600" onClick={handleAddImei}>
                        Chọn
                      </Button>
                    </TableContainer>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>  <hr className="border-t-1.5 border-gray-600" />

          {/* Bảng hóa đơn chi tiết tìm kiếm theo id hóa đơn  */}

          {product.length === 0 ? (
            <CartEmpty />


          ) : (


            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="right">Stt</TableCell>
                    <TableCell align="center">Sản phẩm</TableCell>
                    <TableCell align="right">Đơn giá</TableCell>
                    <TableCell align="right">Số lượng</TableCell>
                    <TableCell align="right">Thành tiền</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {product.map((pr, index) => (
                    <TableRow
                      key={pr.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell align="right">{index + 1}</TableCell>
                      <TableCell component="th" scope="row" align="center">
                        {pr.nameProduct} {pr.ram + '/'}{pr.rom + 'GB'}({pr.mauSac})
                      </TableCell>
                      <TableCell align="right">{pr.price} VND</TableCell>
                      <TableCell align="right">{pr.quantity}</TableCell>
                      <TableCell align="right">{pr.totalPrice} VND</TableCell>
                      <TableCell align="center" style={{}}>
                        <div className="right space-x-2">
                          <Dialog open={isCapNhatImei} onOpenChange={setIsCapNhatImei}>
                            <DialogTrigger asChild>
                              <Button className="bg-white-500 border border-black rounded-sm border-opacity-50
                           text-black hover:bg-gray-300" onClick={() => handleUpdateProduct(pr.idProductDetail, pr.id)}>
                                Cập nhật
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                              <TableContainer>
                                <Table>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell></TableCell>
                                      <TableCell>Stt</TableCell>
                                      <TableCell>Imei code</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {listImei.map((im, index) => (
                                      <TableRow key={im.id}>
                                        <TableCell>
                                          <div className="flex items-center space-x-2">
                                            <Checkbox
                                              checked={selectedImei.includes(im.id)}
                                              onCheckedChange={() => handleCheckboxChange(im.id)}
                                            />
                                          </div>
                                        </TableCell>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{im.imeiCode}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                              <Button className="bg-black text-white hover:bg-gray-600" onClick={handleAddImei}>
                                Chọn
                              </Button>
                            </DialogContent>
                          </Dialog>

                          <Button className="bg-black text-white hover:bg-gray-600" onClick={() => deleteBillDetail(pr.id)}>
                            Xóa
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
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
                  className="bg-black text-white hover:bg-gray-400">
                  Chọn khách hàng
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[980px]">
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
                            <Button color="primary" onClick={() => handleAddKhachHang(ac.id)}>
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
              <span className='whitespace-nowrap pr-5'>Tên khách hàng </span> <Input type="email" placeholder="Tên khách hàng"
               value={listKhachHang?.fullName == null ? "" : listKhachHang?.fullName} />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-16 whitespace-nowrap">Email</span>
               <Input type="email" placeholder="Email" className='h-[35px]' value={listKhachHang?.email == null ? "" : listKhachHang?.email} />
            </div>
          </div>
          <div className="flex justify-between  pb-2 mb-2">
            <div className="flex items-center gap-2">
              <span className='whitespace-nowrap pr-10'>Số điện thoại</span>
               <Input type="email" placeholder="Số điện thoại" value={listKhachHang?.phone == null ? "" : listKhachHang?.phone}/>
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
          <div className="flex space-x-2">
            <Button variant="outline"
              className="border border-gray-500 rounded-lg
             hover:border-orange-600 hover:text-orange-600 px-3 text-2xs">

              <Dialog >
                <DialogTrigger asChild>
                  <Checkbox id="terms" />
                </DialogTrigger>
                <DialogContent className="sm:max-w-[980px]">
                  <div className="p-6 bg-white rounded-lg shadow-lg">
                    <h3 className=" font-semibold mb-4">Địa chỉ giao hàng</h3>
                    <div className="grid gap-4">
                      {/* Tỉnh / Thành phố */}
                      <div className="flexflex-wrap">
                        <label className="text-gray-700">
                          Tỉnh / Thành phố
                        </label>
                        <Select>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn Tỉnh / Thành phố" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Danh sách</SelectLabel>
                              <SelectItem value="hcm">Hồ Chí Minh</SelectItem>
                              <SelectItem value="hanoi">Hà Nội</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Quận / Huyện */}
                      <div className="flex flex-wrap">
                        <label className="text-gray-700 font-medium mb-1">
                          Quận / Huyện
                        </label>
                        <Select>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn Quận / Huyện" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Danh sách</SelectLabel>
                              <SelectItem value="q1">Quận 1</SelectItem>
                              <SelectItem value="q3">Quận 3</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Phường / Xã */}
                      <div className="flex flex-wrap">
                        <label className="text-gray-700 font-medium mb-1">Phường / Xã</label>
                        <Select>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn Phường / Xã" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Danh sách</SelectLabel>
                              <SelectItem value="pbennghe">Phường Bến Nghé</SelectItem>
                              <SelectItem value="ptandinh">Phường Tân Định</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Số nhà, tên đường */}
                      <div className="flex flex-wrap">
                        <label className="text-gray-700 font-medium mb-1">
                          Số nhà, tên đường
                        </label>
                        <Input type="email" placeholder="Nhập số nhà, tên đường" />
                      </div>

                      {/* Ghi chú */}
                      <div className="flex flex-wrap">
                        <label className="text-gray-700 font-medium mb-1">Ghi chú</label>
                        <Input type="email" placeholder="Nhập ghi chú (nếu có)" />
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              Bán giao hàng
            </Button>
            <Button variant="outline"
              className="text-blue-600 border border-blue-500 
             rounded-lg px-3  text-2xs
             hover:text-red-700 hover:border-red-700 ">
              Thanh toán
            </Button>

          </div>
        </div>
        <hr className=" border-gray-600" /><br />

        <div className="grid grid-cols-2  ">
          {/* Cột 1 */}
          .
          {/* Cột 2 */}
          <div className="ml-auto mr-5 w-fit text-lg">
            <div className="mb-4 flex items-center gap-2">
              <p className="font-bold text-base">Mã Giảm Giá</p>
              <div className="flex items-center border rounded-md px-2 py-1 bg-gray-100">
                <span className="text-gray-700  text-sm">{searchBill?.idVoucher == null ? 'No voucher' : setVoucherDangDung?.code}</span>
                <button className="ml-2 text-sm text-gray-500 hover:text-gray-700">✖</button>
              </div>
              <Dialog open={isVoucher} onOpenChange={setIsVoucher}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="text-dark"
                    style={{
                      marginBottom: "3px",
                      fontSize: "13.5px",
                      fontWeight: "500",
                    }}>
                    {/* // className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded-md hover:bg-yellow-500"> */}
                    {/* Chọn Mã Giảm Giá */}
                    {/* <span */}

                    {/* > */}
                    Chọn Mã Giảm Giá
                    {/* </span> */}
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
                            <TableCell>{ac.conditionPriceMin}</TableCell>
                            <TableCell>{ac.conditionPriceMax}</TableCell>
                            <TableCell>{ac.discountValue}</TableCell>
                            <TableCell>{ac.voucherType == true ? " % " : " VNĐ "}</TableCell>
                            <TableCell>{ac.quantity}</TableCell>
                            <TableCell>
                              <Button color="primary" onClick={() => handleAddKhachHang(ac.id)}>
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
                    <span className="text-gray-700">Tổng tiền hàng: </span>
                    <p className="font-semibold">{searchBill?.totalPrice == null ? 0.00 : searchBill?.totalPrice} đ</p>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <p className="text-gray-700">Giảm giá:</p>
                    <p className="font-semibold">{searchBill?.discountedTotal == null ? 0 : searchBill?.discountedTotal} đ</p>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <p className="text-gray-700">Khách cần trả:</p>
                    <p className="font-semibold text-green-600">{searchBill?.totalDue == null ? 0.00 : searchBill?.totalDue} đ</p>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <p className="text-gray-700"> Khách thanh toán:</p>
                    <p className="font-semibold text-green-600">{searchBill?.customerPayment == null ? 0.00 : searchBill?.customerPayment} đ</p>
                  </div>
                </div>

                {/* Tổng tiền */}
                <div className="mt-4 flex justify-between items-center font-bold text-lg text-red-600">
                  <p>Tiền thừa trả khách:</p>
                  <p>{searchBill?.amountChange == null ? 0.00 : searchBill?.amountChange} đ</p>
                </div>
              </div>
              <Button variant="outline" >Xác nhận thanh toán</Button>

            </div>
          </div>
        </div>
      </div><br /><br />
    </>
  );
}
export default BanHangTaiQuay;