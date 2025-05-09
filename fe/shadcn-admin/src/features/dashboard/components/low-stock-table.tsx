import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLowStockProducts } from '../api/statisticsApi';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
} from "@/components/ui/pagination";

export const LowStockTable = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  const { data: products = [] } = useQuery({
    queryKey: ['low-stock-products'],
    queryFn: getLowStockProducts
  });

  // Remove duplicates based on maSP
  const uniqueProducts = Array.from(
    new Map(products.map(item => [item.maSP, item])).values()
  );

  // Pagination logic
  const totalPages = Math.ceil(uniqueProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = uniqueProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Sản phẩm sắp hết hàng</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>STT</TableHead>
                  <TableHead>Mã sản phẩm</TableHead>
                  <TableHead>Tên sản phẩm</TableHead>
                  <TableHead>Màu sắc</TableHead>
                  <TableHead>Ảnh</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.map((product, index) => (
                  <TableRow key={product.maSP}>
                    <TableCell>{startIndex + index + 1}</TableCell>
                    <TableCell>{product.maSP}</TableCell>
                    <TableCell>{product.tenSP}</TableCell>
                    <TableCell>{product.mauSac}</TableCell>
                    <TableCell>
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl}
                          alt={product.tenSP}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.soLuong <= 3 ? "destructive" : "default"}>
                        {product.soLuong}
                      </Badge>
                    </TableCell>
                    <TableCell>{product.trangThai}</TableCell>
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
};
