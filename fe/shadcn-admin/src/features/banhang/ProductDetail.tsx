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
import { getData, findImeiByIdProductDaBan, findBill, findKhachHang, addKhachHang, addHoaDon, findImeiById, createImeiSold, deleteProduct, getImei, getAccountKhachHang, getProductDetail, addHDCT, getByIdBillDetail } from './service/BanHangTaiQuayService';
import { ImCart } from "react-icons/im";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Checkbox } from "@/components/ui/checkbox"
// import { BillDetailSchema } from './service/BillDetailSchema';
// import { ImeiSoldSchema } from './service/ImeiSoldSchema';
import {
  Dialog,
  DialogContent,
  // DialogDescription,
  // DialogFooter,
  // DialogHeader,
  // DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { fi } from '@faker-js/faker';


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
function BanHangTaiQuay() {
  const [listBill, setListBill] = useState<Bill[]>([]);
  const [searchBill, setSearchBill] = useState<Bill>();
  const [listProduct, setListProductDetail] = useState<ProductDetail[]>([]);
  const [listAccount, setListAccount] = useState<AccountKhachHang[]>([]);
  const [listKhachHang, hienThiKhachHang] = useState<AccountKhachHang[]>([]);
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

  // Lấy hóa đơn chi tiet theo ID bill 
  const getById = async (id: number) => {
    try {
      const data = await getByIdBillDetail(id);
      console.log(data);
      console.log("ID hóa đơn:", id);
      setProduct(data); // Cập nhật state
      setIdBill(id);
      const khachHang = await findKhachHang(id);
      hienThiKhachHang(khachHang);
      findBillById(id);
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
      console.log("ID product detail da ban:", idProductDetail);
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
      console.log("Xoa san pham:", data);
      await loadProductDet();
      await loadImei(idProductDetail);
      await getById(idBill);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


  // Thêm hóa đơn mới
  const handleAddBill = async () => {
    try {
      const newBill = await addHoaDon({ idNhanVien: Number(9) }); // Truyền trực tiếp idNhanVien
      // toast.success("Thêm hóa đơn thành công!");
      console.log("Hóa đơn mới:", newBill);
      setListBill([...listBill, newBill]); // Cập nhật danh sách
    } catch (error) {
      // toast.error("Lỗi khi thêm hóa đơn!");
      console.error("Lỗi API:", error);
    }
  };

  // Thêm sản phẩm chi tiết vào hóa đơn chi tiết 
  const handleAddProduct = async (product: ProductDetail) => {

    try {
      const newProduct = await addHDCT({
        idBill: idBill,
        idProductDetail: product.id
      });
      console.log("Sản phẩm chọn:", product.id);
      console.log("Sản phẩm mới:", newProduct);
      setIdBillDetail(newProduct.id);
      setIdProductDetail(product.id);
      await loadImei(product.id);
      await getById(idBill);
      setDialogContent('imei'); // Chuyển nội dung dialog sang IMEI
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
    } catch (error) {
      console.error("Lỗi API:", error);
    }
  };

  const handleUpdateProduct = async (idPD: number) => {
    console.log("ID product detail:", idPD);
    setSelectedImei([]);  // Reset trước khi cập nhật

    try {
      // Lấy danh sách IMEI đã bán
      const data = await findImeiByIdProductDaBan(idPD);

      // Kiểm tra nếu `data` là một mảng hợp lệ
      if (!Array.isArray(data)) {
        console.error("Dữ liệu trả về không phải là một mảng:", data);
        return;
      }

      // Trích xuất danh sách ID từ `data`
      const ids: number[] = data.map((imei) => imei.id);

      // Cập nhật state với danh sách IMEI đã bán
      setSelectedImei(ids);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách IMEI đã bán:", error);
    }

    // Gọi API khác (nếu cần)
    await findImeiByIdProductDetail(idPD);
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
    } catch (error) {
      console.error("Lỗi khi thêm khách hàng:", error);
    }
  }

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
              <button className="text-red-500">
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
                    <TableCell align="right">{pr.price}</TableCell>
                    <TableCell align="right">{pr.quantity}</TableCell>
                    <TableCell align="right">{pr.totalPrice}</TableCell>
                    <TableCell align="center" style={{}}>
                      <div className="right space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="bg-white-500 border border-black rounded-sm border-opacity-50
                           text-black hover:bg-gray-300" onClick={() => handleUpdateProduct(pr.idProductDetail)}>
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
          </div>
        </div>
        <hr className="border-t-1.5 border-gray-600" />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã</TableCell>
                <TableCell>Họ và tên</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Địa chỉ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listKhachHang.map((ac) => (
                <TableRow key={ac.id}>
                  <TableCell>{ac.code}</TableCell>
                  <TableCell>{ac.fullName}</TableCell>
                  <TableCell>{ac.phone}</TableCell>
                  <TableCell>{ac.address}</TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
              Bán giao hàng
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
              <Button variant="outline"
              className="text-blue-600 border border-blue-500 
             rounded-lg px-3  text-2xs
             hover:text-red-700 hover:border-red-700 ">
              Thanh toán
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
          </div>
        </div>
        <hr className="border-t-1.5 border-gray-600" /><br />
        <div className="ml-auto mr-5 w-fit text-lg">
          <div className="mb-4 flex items-center gap-2">
            <p className="font-bold text-base">Mã Giảm Giá</p>
            <div className="flex items-center border rounded-md px-2 py-1 bg-gray-100">
              <span className="text-gray-700 font-semibold text-sm">Voucher122</span>
              <button className="ml-2 text-sm text-gray-500 hover:text-gray-700">✖</button>
            </div>
            {/* <button className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded-md hover:bg-yellow-500">
          Chọn Mã Giảm Giá
        </button> */}

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
          </div>
          <div className="space-y-2" >
            <p className="flex text-base justify-between">
              Tổng tiền hàng: <span className="font-semibold">{searchBill?.totalPrice == null ? 0.00 : searchBill?.totalPrice} đ</span>
            </p>
            <p className="flex justify-between text-base">
              Giảm giá: <span className="font-semibold ">{searchBill?.discountedTotal == null ? 0 : searchBill?.discountedTotal}đ</span>
            </p>
            <p className="flex justify-between text-base">
              Khách cần trả: <span className=" font-semibold">{searchBill?.totalDue == null ? 0.00 : searchBill?.totalDue} đ</span>
            </p>
            <p className="flex justify-between text-base font-bold text-red-700">
              Khách thanh toán: <span className=" font-semibold" style={{ paddingLeft: '100px' }}>{searchBill?.customerPayment == null ? 0.00 : searchBill?.customerPayment} đ</span>
            </p>
            <p className="flex justify-between text-base font-bold text-red-700">
              Tiền thừa trả khách: <span className=" font-semibold">{searchBill?.amountChange == null ? 0.00 : searchBill?.amountChange} đ</span>
            </p>
          </div>
        </div><br /><br />
      </div>
      <br /> <br />


    </>
  );
}
export default BanHangTaiQuay;