import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPaidBills } from '../api/statisticsApi';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
} from "@/components/ui/pagination";

export const PaidBillsTable = () => {
  const [search, setSearch] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  const { data: bills = [] } = useQuery({
    queryKey: ['paid-bills'],
    queryFn: getPaidBills
  });

  const filteredBills = React.useMemo(() => {
    return bills.filter(bill => 
      bill?.name?.toLowerCase().includes(search.toLowerCase()) ||
      bill?.email?.toLowerCase().includes(search.toLowerCase()) ||
      bill?.phone?.includes(search)
    );
  }, [bills, search]);

  const paginatedBills = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredBills.slice(start, end);
  }, [filteredBills, currentPage]);

  const totalPages = Math.ceil(filteredBills.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách hóa đơn đã thanh toán</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>STT</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead className="text-right">Tổng tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBills.map((bill, index) => (
                  <TableRow key={bill.idBill}>
                    <TableCell>{startIndex + index + 1}</TableCell>
                    <TableCell>{bill.name}</TableCell>
                    <TableCell>{bill.email}</TableCell>
                    <TableCell>{bill.phone}</TableCell>
                    <TableCell className="text-right">
                      {bill.totalPrice.toLocaleString('vi-VN')}đ
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && setCurrentPage(p => p - 1)}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              
              {/* Add page number buttons */}
              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index + 1}>
                  <PaginationLink
                    onClick={() => setCurrentPage(index + 1)}
                    isActive={currentPage === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => currentPage < totalPages && setCurrentPage(p => p + 1)}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
};
