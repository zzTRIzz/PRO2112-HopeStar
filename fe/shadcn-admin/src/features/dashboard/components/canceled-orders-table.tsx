import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
} from "@/components/ui/pagination";
import { getCanceledOrders } from '../api/statisticsApi';

export function CanceledOrdersTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { data: orders = [] } = useQuery({
    queryKey: ['canceled-orders'],
    queryFn: getCanceledOrders
  });

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = orders.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đơn hàng khách đã hủy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>STT</TableHead>
                  <TableHead>Mã đơn</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  {/* <TableHead>Địa chỉ</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.map((order, index) => (
                  <TableRow key={order.billCode}>
                    <TableCell>{startIndex + index + 1}</TableCell>
                    <TableCell>{order.billCode}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.email}</TableCell>
                    <TableCell>{order.phone}</TableCell>
                    {/* <TableCell>{order.address}</TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => currentPage > 1 && setCurrentPage(p => p - 1)}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
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
          )}
        </div>
      </CardContent>
    </Card>
  );
}
