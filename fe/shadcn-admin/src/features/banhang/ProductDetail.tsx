// import React, { useEffect, useState } from 'react';
// import { Header } from '@/components/layout/header';
// import { ProfileDropdown } from '@/components/profile-dropdown';
// import { Search } from '@/components/search';
// import { ThemeSwitch } from '@/components/theme-switch';
// import TasksProvider from '../tasks/context/tasks-context';
// import { FaShoppingCart, FaTimes, FaPlus, FaTrash, FaEdit } from "react-icons/fa";
// import { CgAdd } from "react-icons/cg";
// import { Main } from '@/components/layout/main';
// import { Button } from '@/components/ui/button';
// import { getData, addHoaDon, createImeiSold, deleteProduct, getImei, getAccountKhachHang, getProductDetail, addHDCT, getByIdBillDetail } from './service/BanHangTaiQuayService';
// import { ImCart } from "react-icons/im";
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
// import { Checkbox } from "@/components/ui/checkbox"
// import {
//   Dialog,
//   DialogContent,
//   DialogTrigger,
// } from "@/components/ui/dialog"

// interface Bill {
//   id: number;
//   nameBill: string;
//   idAccount?: number | null;
//   idNhanVien?: number | null;
//   idVoucher?: number | null;
//   totalPrice: number | null;
//   customerPayment: number | null;
//   amountChange: number | null;
//   deliveryFee: number | null;
//   totalDue: number | null;
//   customerRefund: number | null;
//   discountedTotal: number | null;
//   deliveryDate?: string | null;
//   customerPreferred_date?: string | null;
//   customerAppointment_date?: string | null;
//   receiptDate?: string | null;
//   paymentDate?: string | null;
//   address?: string | null;
//   email?: string | null;
//   note?: string | null;
//   phone?: string | null;
//   name: string;
//   paymentId?: number | null;
//   deliveryId?: number | null;
//   itemCount: number;
// }

// interface SearchBillDetail {
//   id: number
//   price: number,
//   quantity: number,
//   totalPrice: number,
//   idProductDetail: number,
//   nameProduct: string,
//   ram: number,
//   rom: number,
//   mauSac: string,
//   imageUrl: string,
//   idBill: number
// }

// interface ProductDetail {
//   id: number,
//   code: string,
//   priceSell: number,
//   inventoryQuantity: number,
//   idProduct: number,
//   name: string,
//   ram: number,
//   rom: number,
//   color: string,
//   imageUrl: string,
// }

// interface AccountKhachHang {
//   id: number,
//   code: string,
//   fullName: string,
//   email: string,
//   phone: string,
//   address: string,
//   googleId: string
// }

// interface imei {
//   id: number,
//   imeiCode: string,
//   barCode: string,
//   status: string
// }

// function BanHangTaiQuay() {
//   const [listBill, setListBill] = useState<Bill[]>([]);
//   const [listProduct, setListProductDetail] = useState<ProductDetail[]>([]);
//   const [listAccount, setListAccount] = useState<AccountKhachHang[]>([]);
//   const [listImei, setListImei] = useState<imei[]>([]);
//   const [idBill, setIdBill] = useState<number>(0);
//   const [idProductDetail, setIdProductDetail] = useState<number>(0);
//   const [selectedImei, setSelectedImei] = useState<number[]>([]);
//   const [idBillDetail, setIdBillDetail] = useState<number>(0);
//   const [product, setProduct] = useState<SearchBillDetail[]>([]);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [dialogContent, setDialogContent] = useState<'product' | 'imei'>('product');

//   useEffect(() => {
//     loadBill();
//     loadProductDet();
//     loadAccountKH();
//   }, []);

//   const loadBill = async () => {
//     try {
//       const data = await getData();
//       setListBill(data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const loadProductDet = async () => {
//     try {
//       const data = await getProductDetail();
//       setListProductDetail(data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const loadAccountKH = async () => {
//     try {
//       const data = await getAccountKhachHang();
//       setListAccount(data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const loadImei = async (idProductDetail: number) => {
//     try {
//       console.log("ID product detail:", idProductDetail);
//       const data = await getImei(idProductDetail);
//       setListImei(data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const getById = async (id: number) => {
//     if (!id || isNaN(id)) {
//       console.error("ID không hợp lệ!");
//       return;
//     }

//     try {
//       const data = await getByIdBillDetail(id);
//       console.log(data);
//       setProduct(data); // Cập nhật state
//       setIdBill(id);
//       console.log("ID hóa đơn:", id);
//     } catch (error) {
//       setProduct([]); // Xóa danh sách cũ
//       setIdBill(0);
//       console.error("Error fetching data:", error);
//     }
//   };

//   const deleteBillDetail = async (idBillDetail: number) => {
//     try {
//       const data = await deleteProduct(idBillDetail);
//       console.log("Xoa san pham:", data);
//       await getById(idBill);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   }

//   const handleAddBill = async () => {
//     try {
//       const newBill = await addHoaDon({ idNhanVien: Number(9) }); // Truyền trực tiếp idNhanVien
//       console.log("Hóa đơn mới:", newBill);
//       setListBill([...listBill, newBill]); // Cập nhật danh sách
//     } catch (error) {
//       console.error("Lỗi API:", error);
//     }
//   };

//   const handleAddProduct = async (product: ProductDetail) => {
//     try {
//       const newProduct = await addHDCT({
//         idBill: idBill,
//         idProductDetail: product.id
//       });
//       console.log("Sản phẩm chọn:", product.id);
//       console.log("Sản phẩm mới:", newProduct);
//       setIdBillDetail(newProduct.id);
//       setIdProductDetail(product.id);
//       await loadImei(product.id);
//       setDialogContent('imei'); // Chuyển nội dung dialog sang IMEI
//     } catch (error) {
//       console.error("Lỗi API:", error);
//     }
//   };

//   const handleCheckboxChange = (id: number) => {
//     console.log("ID imei:", id);
//     setSelectedImei((prev) =>
//       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
//     );
//   };

//   const handleAddImei = async () => {
//     try {
//       const newImei = await createImeiSold({
//         id_Imei: selectedImei,
//         idBillDetail: idBillDetail
//       });
//       console.log("Imei mới:", newImei);
//       setIsDialogOpen(false); // Đóng dialog
//       await getById(idBill);
//     } catch (error) {
//       console.error("Lỗi API:", error);
//     }
//   };

//   return (
//     <>
//       <div>
//         <TasksProvider>
//           <Header>
//             <Search />
//             <div className="ml-auto flex items-center space-x-4">
//               <ThemeSwitch />
//               <ProfileDropdown />
//             </div>
//           </Header>
//         </TasksProvider>
//       </div><br />
//       <div className="p-2 bg-white rounded-lg shadow-md border border-gray-300 mr-1.5" style={{ paddingTop: '18px', margin: '0 13px' }}>
//         <div className="flex space-x-1" style={{ paddingLeft: '13px', paddingRight: '10px' }}>
//           {listBill.map((b) => (
//             <div
//               key={b.id}
//               className="flex items-center space-x-1 p-2 border-b-2 border-transparent text-sm hover:border-blue-600 hover:bg-gray-200 focus:border-blue-600 focus:bg-gray-200"
//             >
//               <button onClick={() => getById(b.id)}> {b.nameBill}</button>
//               <div className="relative">
//                 <ImCart size={20} />
//                 {b.itemCount > 0 && (
//                   <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-1 text-xs">
//                     {b.itemCount}
//                   </span>
//                 )}
//               </div>
//               <button className="text-red-500">
//                 <FaTimes size={14} />
//               </button>
//             </div>
//           ))}
//           <button onClick={handleAddBill} ><CgAdd size={26} /></button>
//         </div>  <hr />

//         <Main>
//           <div className="mb-2 flex items-center justify-between">
//             <h1 className="font-bold tracking-tight">Giỏ hàng</h1>
//             <div className="flex space-x-2">
//               <Button className="bg-white-500 border border-black rounded-sm border-opacity-50 text-black hover:bg-gray-300">
//                 Quét Barcode
//               </Button>

//               <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//                 <DialogTrigger asChild>
//                   <Button variant="outline" className="bg-black text-white hover:bg-gray-400" onClick={() => setDialogContent('product')}>
//                     Thêm sản phẩm
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent className="sm:max-w-[980px]">
//                   {dialogContent === 'product' ? (
//                     <TableContainer>
//                       <Table>
//                         <TableHead>
//                           <TableRow>
//                             <TableCell>Stt</TableCell>
//                             <TableCell>Mã code</TableCell>
//                             <TableCell>Tên sản phẩm</TableCell>
//                             <TableCell>Giá tiền </TableCell>
//                             <TableCell>Số lượng tồn kho</TableCell>
//                             <TableCell>Thao Tác</TableCell>
//                           </TableRow>
//                         </TableHead>
//                         <TableBody>
//                           {listProduct.map((product, index) => (
//                             <TableRow key={product.id}>
//                               <TableCell>{index + 1}</TableCell>
//                               <TableCell>{product.code}</TableCell>
//                               <TableCell>{product.name + " " + product.ram + "/" + product.rom + "GB (" + product.color + ")"}</TableCell>
//                               <TableCell>{product.priceSell}</TableCell>
//                               <TableCell align="center">{product.inventoryQuantity}</TableCell>
//                               <TableCell>
//                                 <Button color="primary" onClick={() => handleAddProduct(product)}>
//                                   Chọn
//                                 </Button>
//                               </TableCell>
//                             </TableRow>
//                           ))}
//                         </TableBody>
//                       </Table>
//                     </TableContainer>
//                   ) : (
//                     <TableContainer>
//                       <Table>
//                         <TableHead>
//                           <TableRow>
//                             <TableCell></TableCell>
//                             <TableCell>Stt</TableCell>
//                             <TableCell>Imei code</TableCell>
//                           </TableRow>
//                         </TableHead>
//                         <TableBody>
//                           {listImei.map((im, index) => (
//                             <TableRow key={im.id}>
//                               <TableCell>
//                                 <div className="flex items-center space-x-2">
//                                   <Checkbox
//                                     checked={selectedImei.includes(im.id)}
//                                     onCheckedChange={() => handleCheckboxChange(im.id)}
//                                   />
//                                 </div>
//                               </TableCell>
//                               <TableCell>{index + 1}</TableCell>
//                               <TableCell>{im.imeiCode}</TableCell>
//                             </TableRow>
//                           ))}
//                         </TableBody>
//                       </Table>
//                       <Button className="bg-black text-white hover:bg-gray-600" onClick={handleAddImei}>
//                         Chọn
//                       </Button>
//                     </TableContainer>
//                   )}
//                 </DialogContent>
//               </Dialog>
//             </div>
//           </div>  <hr className="border-t-1.5 border-gray-600" />

//           <TableContainer component={Paper}>
//             <Table sx={{ minWidth: 650 }} aria-label="simple table">
//               <TableHead>
//                 <TableRow>
//                   <TableCell align="right">Stt</TableCell>
//                   <TableCell align="center">Sản phẩm</TableCell>
//                   <TableCell align="right">Đơn giá</TableCell>
//                   <TableCell align="right">Số lượng</TableCell>
//                   <TableCell align="right">Thành tiền</TableCell>
//                   <TableCell align="center">Action</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {product.map((pr, index) => (
//                   <TableRow key={pr.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
//                     <TableCell align="right">{index + 1}</TableCell>
//                     <TableCell component="th" scope="row" align="center">
//                       {pr.nameProduct} {pr.ram + '/'}{pr.rom + 'GB'}({pr.mauSac})
//                     </TableCell>
//                     <TableCell align="right">{pr.price}</TableCell>
//                     <TableCell align="right">{pr.quantity}</TableCell>
//                     <TableCell align="right">{pr.totalPrice}</TableCell>
//                     <TableCell align="center" style={{}}>
//                       <div className="right space-x-2">
//                         <Button className="bg-white-500 border border-black rounded-sm border-opacity-50 text-black hover:bg-gray-300">
//                           Cập nhật
//                         </Button>
//                         <Button className="bg-black text-white hover:bg-gray-600" onClick={() => deleteBillDetail(pr.id)}>
//                           Xóa
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Main>
//       </div>
//       <br />
//       <div className='p-2 bg-white rounded-lg shadow-md border border-gray-300 mr-1.5' style={{ margin: '0 13px', padding: '22px 23px' }}>
//         <div className="mb-2 flex items-center justify-between ">
//           <h1 className=" font-bold tracking-tight">Khách hàng </h1>
//           <div className="flex space-x-2">
//             <Dialog>
//               <DialogTrigger asChild>
//                 <Button variant="outline" className="bg-black text-white hover:bg-gray-400">
//                   Chọn khách hàng
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="sm:max-w-[980px]">
//                 <TableContainer>
//                   <Table>
//                     <TableHead>
//                       <TableRow>
//                         <TableCell>Stt</TableCell>
//                         <TableCell>Mã</TableCell>
//                         <TableCell>Họ và tên</TableCell>
//                         <TableCell>Số điện thoại</TableCell>
//                         <TableCell>Email</TableCell>
//                         <TableCell>Địa chỉ</TableCell>
//                         <TableCell>Thao Tác</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {listAccount.map((ac, index) => (
//                         <TableRow key={ac.id}>
//                           <TableCell>{index + 1}</TableCell>
//                           <TableCell>{ac.code}</TableCell>
//                           <TableCell>{ac.fullName}</TableCell>
//                           <TableCell>{ac.phone}</TableCell>
//                           <TableCell>{ac.email}</TableCell>
//                           <TableCell>{ac.address}</TableCell>
//                           <TableCell>
//                             <Button color="primary">
//                               Chọn
//                             </Button>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               </DialogContent>
//             </Dialog>
//           </div>
//         </div>
//         <hr className="border-t-1.5 border-gray-600" />
//       </div>
//     </>
//   );
// }

// export default BanHangTaiQuay;
