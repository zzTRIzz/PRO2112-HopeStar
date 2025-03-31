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

interface Props {
    listKhachHang: AccountKhachHang|undefined;
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
    return (
        <>
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

      </div> 
        </>
    );
};

export default TableKhachHang;