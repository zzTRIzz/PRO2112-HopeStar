import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  setPageSize: (size: number) => void;
  setCurrentPage: (page: number) => void;
}

export function DataTablePagination({ currentPage, totalPages, pageSize, setPageSize, setCurrentPage }: PaginationProps) {
  return (
    <div className="flex items-center justify-between overflow-clip px-2">
      <div className="flex items-center sm:space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="hidden text-sm font-medium sm:block">Số hàng mỗi trang</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => setPageSize(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Trang {currentPage} / {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
