import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/header';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import TasksProvider from '../tasks/context/tasks-context';
import { FaShoppingCart, FaTimes, FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { CgAdd } from "react-icons/cg";
import { Main } from '@/components/layout/main';
import { Button } from '@/components/ui/button';
import { getData, addHoaDon, addHDCT, getByIdBillDetail } from './service/BanHangTaiQuayService';
import { useNavigate } from '@tanstack/react-router';
import { toast } from '@/hooks/use-toast';
import { ImCart } from "react-icons/im";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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

interface ProductDetail {
  id:number
  price: number, 
   quantity: number,
  totalPrice: number,
  idProductDetail: string,
  nameProduct: string,
  ram: number,
  rom: number,
  mauSac: string,
  imageUrl: string,
  idBill: number
}

function BanHangTaiQuay() {
  const [listBill, setListBill] = useState<Bill[]>([]);
  const navigate = useNavigate();
  const [billDetail, setBillDetail] = useState<Bill | null>(null);
  const [idNhanVien, setIdNhanVien] = useState<string>("");
  const [id, setId] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [product, setProduct] = useState<ProductDetail[]>([]);
  const [open, setOpen] = useState(false);
  const [selectProduct, setSelectProduct] = useState<ProductDetail | null>(null);
  // Lấy danh sách hóa đơn
  useEffect(() => {
    const loadBill = async () => {
      try {
        const data = await getData();
        setListBill(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    loadBill();
  }, []);

  // Lấy hóa đơn theo ID 
  const getById = async (id: number) => {
    if (!id || isNaN(id)) {
      console.error("ID không hợp lệ!");
      return;
    }

    try {
      const data = await getByIdBillDetail(id);
      console.log(data);
      setProduct(data); // Cập nhật state
      setId(id);
    } catch (error) {
      setProduct([]); // Xóa danh sách cũ
      setId(0);
      // setError(error.message);
      console.error("Error fetching data:", error);
    }
  };

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

// 

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
            <div
              key={b.id}
              className="flex items-center space-x-1 p-2 border-b-2 border-transparent text-sm hover:border-blue-600 hover:bg-gray-200 focus:border-blue-600 focus:bg-gray-200"
            >
              <button onClick={() => getById(b.id)}> {b.nameBill}</button>
              <div className="relative">
                <ImCart size={20} />
                {b.itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-1 text-xs">
                    {b.itemCount}
                  </span>
                )}
              </div>
              <button
                className="text-red-500">
                <FaTimes size={14} />
              </button>
            </div>
          ))}
          <button onClick={handleAddBill} ><CgAdd size={26} /></button>
        </div>  <hr />

        <Main>
          <div className="mb-2 flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Giỏ hàng</h1>
            <div className="flex space-x-2">
              <Button className="bg-white-500 border border-black rounded-sm border-opacity-50 text-black hover:bg-gray-300">
                Quét Barcode
              </Button>
              <Button className="bg-black text-white hover:bg-blue-800">
                Thêm sản phẩm
              </Button>
            </div>
          </div>  <hr className="border-t-1.5 border-gray-600" />

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Sản phẩm</TableCell>
                  <TableCell align="right">Đơn giá</TableCell>
                  <TableCell align="right">Số lượng</TableCell>
                  <TableCell align="right">Thành tiền</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {product.map((pr) => (
                  <TableRow
                    key={pr.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {pr.nameProduct} {pr.ram+'/'}{pr.rom+'GB'}({pr.mauSac})
                    </TableCell>
                    <TableCell align="right">{pr.quantity}</TableCell>
                    <TableCell align="right">{pr.price}</TableCell>
                    <TableCell align="right">{pr.totalPrice}</TableCell>
                    <TableCell align="center" style={{}}>
                      <div className="right space-x-2">
                        <Button className="bg-white-500 border border-black rounded-sm border-opacity-50 text-black hover:bg-gray-300">
                          Cập nhật
                        </Button>
                        <Button className="bg-black text-white hover:bg-lime-800">
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
    </>
  );
}
export default BanHangTaiQuay;