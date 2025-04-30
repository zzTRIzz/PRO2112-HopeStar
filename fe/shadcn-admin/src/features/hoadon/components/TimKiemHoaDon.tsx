import { Input } from '@/components/ui/input';
import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Bill } from '../service/Schema';

interface Props {
  originalList: Bill[]; // Danh sách gốc không thay đổi
  setFilteredList: (data: Bill[]) => void; // Cập nhật danh sách hiển thị
}

const TimKiemHoaDon: React.FC<Props> = ({ originalList, setFilteredList }) => {
  const [keyword, setKeyword] = React.useState('');
  const [dateBatDau, setDateBatDau] = React.useState<Date | undefined>();
  const [dateKetThuc, setDateKetThuc] = React.useState<Date | undefined>();
  const [billType, setBillType] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    applyFilters();
  }, [keyword, dateBatDau, dateKetThuc, billType, status]);
  const trimmedKeyword = keyword.trim(); 
  const applyFilters = () => {
    if (!validateDates()) return;
    const dateTimeKetThuc = dateKetThuc
    ? new Date(dateKetThuc.setHours(23, 59, 59, 999))
    : undefined;

    const filtered = originalList.filter((bill) => {
      const matchesKeyword =
        bill?.maBill?.toLowerCase().includes(trimmedKeyword.toLowerCase()) ||
        bill?.name?.toLowerCase().includes(trimmedKeyword.toLowerCase()) ||
        bill?.phone?.toLowerCase().includes(trimmedKeyword.toLowerCase());

      const billDate = bill?.paymentDate ? new Date(bill?.paymentDate) : null;
      const matchesDate =
        (!dateBatDau || (billDate && billDate >= dateBatDau)) &&
        (!dateTimeKetThuc || (billDate && billDate <= dateTimeKetThuc));

      const matchesBillType = billType === null || bill?.billType === Number(billType);
      const matchesStatus = status === null || bill.status === status;

      return matchesKeyword && matchesDate && matchesBillType && matchesStatus;
    });

    setFilteredList(filtered);
  };

  const validateDates = () => {
    if (dateBatDau && dateKetThuc && dateBatDau > dateKetThuc) {
      setError('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
      return false;
    }
    setError(null);
    return true;
  };

  const handleReset = () => {
    setKeyword('');
    setDateBatDau(undefined);
    setDateKetThuc(undefined);
    setBillType(null);
    setStatus(null);
    setError(null);
    setFilteredList(originalList);
  };

  return (
            <div className="rounded-lg shadow-md border border-gray-300 p-4">
              <div className="flex items-center gap-4 flex-wrap mt-[20px]">
                {/* Input tìm kiếm */}
                <div className="w-[400px] relative">
                  <Input
                    type="text"
                    placeholder="Tìm theo mã đơn hàng, tên và số điện thoại khách hàng"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
        
                {/* Date Pickers */}
                <div className="flex gap-4 flex-wrap">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-[200px] justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateBatDau ? format(dateBatDau, 'dd/MM/yyyy') : 'Ngày bắt đầu'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateBatDau}
                        onSelect={setDateBatDau}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
        
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-[200px] justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateKetThuc ? format(dateKetThuc, 'dd/MM/yyyy') : 'Ngày kết thúc'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateKetThuc}
                        onSelect={setDateKetThuc}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
        
                {/* Nút làm mới */}
                <Button variant="destructive" onClick={handleReset}>
                  Làm mới
                </Button>
              </div>
        
              {/* Filters và thông báo lỗi */}
              <div className="mt-4 space-y-2">
                {error && (
                  <div className="text-red-500 text-sm font-medium px-4 py-2 bg-red-50 rounded-md">
                    {error}
                  </div>
                )}
        
                <div className="flex gap-8 items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Loại hóa đơn:</span>
                    <select
                      className="px-3 py-1 border rounded-md"
                      value={billType || ''}
                      onChange={(e) => setBillType(e.target.value || null)}
                    >
                      <option value="">Tất cả</option>
                      <option value="0">Offline</option>
                      <option value="1">Online</option>
                    </select>
                  </div>
        
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Trạng thái:</span>
                    <select
                      className="px-3 py-1 border rounded-md"
                      value={status || ''}
                      onChange={(e) => setStatus(e.target.value || null)}
                    >
                      <option value="">Tất cả</option>
                      <option value="CHO_THANH_TOAN">Chờ thanh toán</option>
                      <option value="CHO_XAC_NHAN">Chờ xác nhận</option>
                      <option value="DA_XAC_NHAN">Đã xác nhận</option>
                      <option value="DANG_CHUAN_BI_HANG">Đang chuẩn bị hàng</option>
                      <option value="DANG_GIAO_HANG">Đang giao hàng</option>
                      {/* <option value="DA_GIAO_HANG">Đã giao hàng</option> */}
                      <option value="HOAN_THANH">Hoàn thành</option>
                      <option value="DA_HUY">Đã hủy</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          );
};

export default TimKiemHoaDon;