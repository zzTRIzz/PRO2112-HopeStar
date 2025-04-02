// import { Input } from '@/components/ui/input';
// import * as React from "react";
// import { format } from "date-fns";
// import { CalendarIcon } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import {
//     Popover,
//     PopoverContent,
//     PopoverTrigger,
// } from "@/components/ui/popover";
// import { Bill } from '../service/HoaDonSchema';
// import { searchBillList } from '../service/HoaDonService';
// import { debounce } from 'lodash';

// interface Props {
//     setListHoaDon: (data: Bill[]) => void;
// }

// const TimKiemHoaDon: React.FC<Props> =
//     ({
//         setListHoaDon
//     }) => {
//         const [dateBatDau, setDateBatDau] = React.useState<Date | undefined>();
//         const [dateKetThuc, setDateKetThuc] = React.useState<Date | undefined>();
//         const [keyword, setKeyword] = React.useState("");
//         const [billType, setBillType] = React.useState<string | null>(null);
//         const [status, setStatus] = React.useState<string | null>(null);
//         const [loading, setLoading] = React.useState(false);
//         const [error, setError] = React.useState(null);

//         const handleSearch = async () => {
//             if (dateBatDau && dateKetThuc && dateBatDau > dateKetThuc) {
//                 console.log("Ngày bắt đầu phải nhỏ hơn ngày kết thúc");
//                 return;
//             }

//             const searchParams = {
//                 key: keyword,
//                 startDate: dateBatDau ? format(dateBatDau, 'yyyy-MM-dd') : undefined,
//                 endDate: dateKetThuc ? format(dateKetThuc, 'yyyy-MM-dd') : undefined,
//                 loaiHoaDon: billType ? Number(billType) : null,
//                 trangThai: status || null
//             };

//             try {
//                 setLoading(true);
//                 setError(null);
//                 const response = await searchBillList(searchParams);
//                 setListHoaDon(response.data);
//             } catch (error) {
//                 console.error("Lỗi khi tìm kiếm hóa đơn:",);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         const debouncedSearch = debounce(handleSearch, 500);

//         React.useEffect(() => {
//             debouncedSearch();
//             return () => debouncedSearch.cancel();
//         }, [keyword, dateBatDau, dateKetThuc, billType, status]);

//         return (
//             <div className="rounded-lg shadow-md border border-gray-300 p-4">
//                 {loading && <div>Đang tải...</div>}
//                 {error && <div className="text-red-500">{error}</div>}

//                 {/* Hàng 1 */}
//                 <div className="flex items-center gap-4 flex-wrap mt-[20px]">
//                     <div className="w-[400px]">
//                         <Input
//                             type="text"
//                             placeholder="Tìm theo mã đơn hàng, tên và số điện thoại khách hàng"
//                             value={keyword}
//                             onChange={(e) => setKeyword(e.target.value)}
//                         />
//                     </div>
//                     <div>
//                         <Popover>
//                             <PopoverTrigger asChild>
//                                 <Button variant="outline" className="w-[200px] flex items-center justify-start">
//                                     <CalendarIcon />
//                                     {dateBatDau ? format(dateBatDau, "PPP") : <span>Ngày bắt đầu</span>}
//                                 </Button>
//                             </PopoverTrigger>
//                             <PopoverContent className="w-auto p-0" align="start">
//                                 <Calendar
//                                     mode="single"
//                                     selected={dateBatDau}
//                                     onSelect={setDateBatDau}
//                                     initialFocus
//                                 />
//                             </PopoverContent>
//                         </Popover>
//                     </div>
//                     <div>
//                         <Popover>
//                             <PopoverTrigger asChild>
//                                 <Button variant="outline" className="w-[200px] flex items-center justify-start">
//                                     <CalendarIcon />
//                                     {dateKetThuc ? format(dateKetThuc, "PPP") : <span>Ngày kết thúc</span>}
//                                 </Button>
//                             </PopoverTrigger>
//                             <PopoverContent className="w-auto p-0" align="start">
//                                 <Calendar
//                                     mode="single"
//                                     selected={dateKetThuc}
//                                     onSelect={setDateKetThuc}
//                                     initialFocus
//                                 />
//                             </PopoverContent>
//                         </Popover>
//                     </div>
//                     <Button
//                         variant="outline"
//                         className="bg-blue-600 text-white hover:bg-green-700"
//                         onClick={() => {
//                             setKeyword("");
//                             setDateBatDau(undefined);
//                             setDateKetThuc(undefined);
//                             setBillType(null);
//                             setStatus(null);
//                             setError(null);
//                         }}
//                     >
//                         Làm mới
//                     </Button>
//                 </div>

//                 {/* Hàng 2 */}
//                 <div className="flex justify-between mt-4 gap-4 w-[750px] ml-[120px] mt-[30px] mb-[18px]">
//                     <div>
//                         <span className='font-bold'>Loại hóa đơn: </span>
//                         <select
//                             className="min-w-min w-auto px-2 py-1 font-bold text-orange-700 border border-gray-300 rounded-md text-sm"
//                             value={billType || ''}
//                             onChange={(e) => setBillType(e.target.value || null)}
//                         >
//                             <option value="">Tất cả</option>
//                             <option value="0">Tại quầy</option>
//                             <option value="1">Giao hàng</option>
//                         </select>
//                     </div>
//                     <div>
//                         <span className='font-bold'>Trạng thái: </span>
//                         <select
//                             className="min-w-min w-auto px-2 py-1 font-bold text-orange-700 border border-gray-300 rounded-md text-sm"
//                             value={status || ''}
//                             onChange={(e) => setStatus(e.target.value || null)}
//                         >
//                             <option value="">Tất cả</option>
//                             <option value="CHO_THANH_TOAN">Chờ thanh toán</option>
//                             <option value="DA_HUY">Đã hủy</option>
//                             <option value="CHO_XAC_NHAN">Chờ xác nhận</option>
//                             <option value="DA_THANH_TOAN">Đã thanh toán</option>
//                         </select>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

// export default TimKiemHoaDon;
import { Input } from '@/components/ui/input';
import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Bill } from '../service/HoaDonSchema';
import { getAllBill, searchBillList } from '../service/HoaDonService';
import { debounce } from 'lodash-es';

interface Props {
    listHoaDon?: Bill[];
    setListHoaDon: (data: Bill[]) => void;
}

const TimKiemHoaDon: React.FC<Props> =
    ({
        setListHoaDon
    }) => {
        const [dateBatDau, setDateBatDau] = React.useState<Date | undefined>();
        const [dateKetThuc, setDateKetThuc] = React.useState<Date | undefined>();
        const [keyword, setKeyword] = React.useState("");
        const [billType, setBillType] = React.useState<string | null>(null);
        const [status, setStatus] = React.useState<string | null>(null);
        const [loading, setLoading] = React.useState(false);
        const [error, setError] = React.useState<string | null>(null);

        const validateDates = () => {
            if (dateBatDau && dateKetThuc && dateBatDau > dateKetThuc) {
                setError("Ngày bắt đầu phải nhỏ hơn ngày kết thúc");
                return false;
            }
            setError(null);
            return true;
        };

        const handleSearch = async () => {
            if (!validateDates()) return;

            const searchParams = {
                key: keyword,
                startDate: dateBatDau ? format(dateBatDau, 'yyyy-MM-dd') : undefined,
                endDate: dateKetThuc ? format(dateKetThuc, 'yyyy-MM-dd') : undefined,
                loaiHoaDon: billType ? Number(billType) : null,
                trangThai: status || null
            };

            try {
                setLoading(true);
                const results = await searchBillList(searchParams);
                // setListHoaDon(response?.data || []);
                setListHoaDon(Array.isArray(results) ? results : []);
                console.log(searchParams);
            } catch (error) {
                console.error("Lỗi khi tìm kiếm hóa đơn:", error);
                setError("Có lỗi xảy ra khi tìm kiếm");
                setListHoaDon([]);
            } finally {
                setLoading(false);
            }
        };

        const debouncedSearch = debounce(handleSearch, 500);

        const handleReset = async () => {
            const data = await getAllBill();
            setKeyword("");
            setDateBatDau(undefined);
            setDateKetThuc(undefined);
            setBillType(null);
            setStatus(null);
            setError(null);
            setListHoaDon(data);
        };

        React.useEffect(() => {
            if (keyword || dateBatDau || dateKetThuc || billType || status) {
                debouncedSearch();
            }
            return () => debouncedSearch.cancel();
        }, [keyword, dateBatDau, dateKetThuc, billType, status]);

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
                            disabled={loading}
                        />
                        {loading && (
                            <div className="absolute inset-y-0 right-2 flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                            </div>
                        )}
                    </div>

                    {/* Date Pickers */}
                    <div className="flex gap-4 flex-wrap">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-[200px] justify-start"
                                    disabled={loading}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dateBatDau ? format(dateBatDau, "dd/MM/yyyy") : "Ngày bắt đầu"}
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
                                <Button
                                    variant="outline"
                                    className="w-[200px] justify-start"
                                    disabled={loading}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dateKetThuc ? format(dateKetThuc, "dd/MM/yyyy") : "Ngày kết thúc"}
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
                    <Button
                        variant="destructive"
                        onClick={handleReset}
                        disabled={loading}
                    >
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
                                disabled={loading}
                            >
                                <option value="">Tất cả</option>
                                <option value="0">Tại quầy</option>
                                <option value="1">Giao hàng</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="font-medium">Trạng thái:</span>
                            <select
                                className="px-3 py-1 border rounded-md"
                                value={status || ''}
                                onChange={(e) => setStatus(e.target.value || null)}
                                disabled={loading}
                            >
                                <option value="">Tất cả</option>
                                <option value="CHO_THANH_TOAN">Chờ thanh toán</option>
                                <option value="DA_THANH_TOAN">Đã thanh toán</option>
                                <option value="CHO_XAC_NHAN">Chờ xác nhận</option>
                                <option value="DANG_CHUAN_BI_HANG">Đang chuẩn bị hàng</option>
                                <option value="DANG_GIAO_HANG">Đang giao hàng</option>
                                <option value="DA_GIAO_HANG">Đã giao hàng</option>
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