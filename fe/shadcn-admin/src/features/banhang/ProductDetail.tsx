// import * as React from 'react';
// import Avatar from '@mui/material/Avatar';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemAvatar from '@mui/material/ListItemAvatar';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemText from '@mui/material/ListItemText';
// import DialogTitle from '@mui/material/DialogTitle';
// import Dialog from '@mui/material/Dialog';
// import PersonIcon from '@mui/icons-material/Person';
// import AddIcon from '@mui/icons-material/Add';
// import { blue } from '@mui/material/colors';
// import { IoIosPhonePortrait } from "react-icons/io";
// import { TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
// import { Table } from 'lucide-react';
// import { Button } from 'react-day-picker';
// export const emails = ['username@gmail.com', 'user02@gmail.com'];
// interface ProductDetail {
//     id: number,
//     price: number,
//     soLuongTonKho: number,
//     idProduct: number,
//     nameProduct: string,
//     ram: number,
//     rom: number,
//     mauSac: string,
//     imageUrl: string,
//   }
// export interface SimpleDialogProps {
//   open: boolean;
//   selectedValue: ProductDetail | null;
//   onClose: (product: ProductDetail | null) => void;
// }

// const products: ProductDetail[] = [
//     {
//       id: 1,
//       price: 31000000,
//       soLuongTonKho: 15,
//       idProduct: 101,
//       nameProduct: "Xiaomi Redmi 13",
//       ram: 6,
//       rom: 128,
//       mauSac: "Trắng",
//       imageUrl: "https://example.com/xiaomi-redmi-13.jpg",
//     },
//     {
//       id: 2,
//       price: 29000000,
//       soLuongTonKho: 10,
//       idProduct: 102,
//       nameProduct: "Oppo A77s",
//       ram: 6,
//       rom: 128,
//       mauSac: "Đen",
//       imageUrl: "https://example.com/oppo-a77s.jpg",
//     },
//     {
//       id: 3,
//       price: 32000000,
//       soLuongTonKho: 5,
//       idProduct: 103,
//       nameProduct: "iPhone 13 Pro Max",
//       ram: 8,
//       rom: 256,
//       mauSac: "Xanh",
//       imageUrl: "https://example.com/iphone-13-pro-max.jpg",
//     },
//   ];
  
// export function SimpleDialog(props: SimpleDialogProps) {
//   const { onClose, selectedValue, open } = props;

//   const handleClose = () => {
//     onClose(selectedValue);
//   };

//   const handleListItemClick = (product: ProductDetail) => {
//     onClose(product);
//   };

//   return (
//     <Dialog onClose={handleClose} open={open}>
//       <DialogTitle>Chọn sản phẩm </DialogTitle>
//       {/* <List sx={{ pt: 0 }}>
//         {emails.map((email) => (
//           <ListItem disablePadding key={email}>
//             <ListItemButton onClick={() => handleListItemClick(email)}>
//               <ListItemAvatar>
//                 <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
//                   <PersonIcon />
//                 </Avatar>
//               </ListItemAvatar>
//               <ListItemText primary={email} />
//             </ListItemButton>
//           </ListItem>
//         ))}
//       </List> */}
//       <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>STT</TableCell>
//                 <TableCell>Ảnh</TableCell>
//                 <TableCell>Mã Sản Phẩm</TableCell>
//                 <TableCell>Tên Sản Phẩm</TableCell>
//                 <TableCell>Đơn Giá</TableCell>
//                 <TableCell>Số Lượng Tồn</TableCell>
//                 <TableCell>Thao Tác</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//             {products.map((product, index) => (
//               <TableRow key={product.id}>
//                 <TableCell>{index + 1}</TableCell>
//                 <TableCell><img src={product.imageUrl} alt={product.nameProduct+" "+product.ram+"/"+product.rom+"("+product.mauSac+")"} width={50} height={50} /></TableCell>
//                 <TableCell>{product.price}</TableCell>
//                 <TableCell>{product.soLuongTonKho}</TableCell>
//                 <TableCell><Typography color="error">{product.price.toLocaleString()} đ</Typography></TableCell>
//                 {/* <TableCell>{product.stock}</TableCell> */}
//                 <TableCell>
//                   <Button  color="primary" onClick={() => handleListItemClick(product)}>
//                     Chọn
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//           </Table>
//         </TableContainer>
//     </Dialog>
//   );
// }