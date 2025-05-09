import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { ToastContainer } from 'react-toastify';
import { AccountKhachHang } from '../service/Schema';
import { Link } from '@heroui/react';
import { IconQuestionMark } from '@tabler/icons-react';

interface Props {
  listKhachHang: AccountKhachHang | undefined;
  listAccount: AccountKhachHang[];
  handleAddKhachHang: (id: number) => void;
  setIsKhachHang: (data: boolean) => void;
  isKhachHang: boolean;
}

const TableKhachHang: React.FC<Props> =
  ({
    listKhachHang,
    listAccount,
    handleAddKhachHang,
    setIsKhachHang,
    isKhachHang
  }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const trimmedKeyword = searchTerm.trim(); 

    const filteredAccounts = listAccount.filter((account) => {
      const phone = account?.phone || "";
      const email = account?.email || "";
      const fullName = account?.fullName || "";

      return (
        phone.toLowerCase().includes(trimmedKeyword.toLowerCase()) ||
        email.toLowerCase().includes(trimmedKeyword.toLowerCase()) ||
        fullName.toLowerCase().includes(trimmedKeyword.toLowerCase())
      );
    });

    const CartEmpty = () => {
      return (
        <>
          <div className="flex flex-col items-center justify-center mt-4" style={{ height: "260px" }}>
            <div className="flex items-center justify-center mb-4">
              <IconQuestionMark className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-dark font-semibold text-center text-lg">
              Hiện tại không có khách hàng nào!
            </p>
          </div>

        </>
      );
    };
    return (
      <>
        <div className='p-2 bg-white
           rounded-lg shadow-md border border-gray-300 mr-1.5 '
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
                <DialogContent className="sm:max-w-[980px] flex flex-col">
                  <div className="grid grid-cols-10 gap-4">
                    <div className='col-span-7'>
                      <Input
                        placeholder="Tìm họ tên, số điện thoại hoặc email"
                        className="max-w-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className='col-span-1'>
                      <Button variant="outline" className="bg-white-500 border
                     border-black rounded-sm border-opacity-50
                      text-black hover:bg-gray-300"  onClick={() => handleAddKhachHang(1)}>
                        Khách lẻ
                      </Button> </div>
                    <div className='col-span-2'>
                      <Link
                        href="/taikhoan/khachhang"
                        className="bg-blue-600 hover:bg-gray-400 
                        text-white h-[36px] w-[150px] rounded-sm 
                        flex items-center justify-center font-medium text-sm"
                      >
                        Thêm khách hàng
                      </Link>

                    </div>
                  </div>
                  {filteredAccounts.length === 0 ? (
                    <CartEmpty />
                  ) : (

                    <TableContainer className="overflow-auto max-h-[520px] mt-4">
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Stt</TableCell>
                            <TableCell>Họ và tên</TableCell>
                            <TableCell>Số điện thoại</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Địa chỉ</TableCell>
                            <TableCell>Thao tác</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredAccounts.map((ac, index) => (
                            <TableRow key={ac.id}>
                              <TableCell>{index + 1}</TableCell>
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
                  )}
                </DialogContent>
              </Dialog>
              <ToastContainer />
            </div>
          </div>
          <hr className="border-t-1.5 border-gray-600" />
          {/* Thông tin khách hàng */}
          <div className="p-4 max-w-full" >
            <div className="flex justify-between pb-2 mb-2 gap-4 pt-5">
              <div className="flex items-center gap-2">
                <span className='whitespace-nowrap pr-5'>Tên khách hàng </span> <Input type="email"
                  placeholder=" Tên khách hàng" disabled className='text-blue-600 text-base font-bold'
                  value={listKhachHang?.fullName == null ? "" : listKhachHang?.fullName} />
              </div>
              <div className="flex items-center gap-2 pr-[172px]">
                <span className="w-16">Email</span>
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
              <div className="flex items-center gap-2">
                <span className="w-16 whitespace-nowrap">Địa chỉ</span>
                <Input type="email" disabled placeholder="Địa chỉ"
                  className='h-[35px] w-[400px] text-blue-600 text-base font-bold' value={listKhachHang?.address == null ? "" : listKhachHang?.address} />
              </div>
            </div>

          </div>

        </div>
      </>
    );
  };

export default TableKhachHang;