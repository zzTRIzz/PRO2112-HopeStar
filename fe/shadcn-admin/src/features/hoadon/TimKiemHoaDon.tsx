import { Input } from '@/components/ui/input';
import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
const TimKiemHoaDon: React.FC = () => {
    const [dateBatDau, setDateBatDau] = React.useState<Date>()
    const [dateKetThuc, setDateKetThuc] = React.useState<Date>()
    return (
        <>
            <div className="rounded-lg shadow-md border border-gray-300 p-4 ">
                {/* Hàng 1 */}
                <div className="flex items-center gap-4 flex-wrap  mt-[20px]">
                    <div className="w-[400px]">
                        <Input type="text" placeholder="Tìm theo mã đơn hàng, tên và số điện thoại khách hàng" />
                    </div>
                    <div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-[200px] flex items-center justify-start">
                                    <CalendarIcon />
                                    {dateBatDau ? format(dateBatDau, "PPP") : <span>Ngày bắt đầu</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={dateBatDau} onSelect={setDateBatDau} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-[200px] flex items-center justify-start">
                                    <CalendarIcon />
                                    {dateKetThuc ? format(dateKetThuc, "PPP") : <span>Ngày kết thúc</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={dateKetThuc} onSelect={setDateKetThuc} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <Button variant="outline" className="bg-blue-600 text-white hover:bg-green-700">
                        Làm mới
                    </Button>
                </div>

                {/* Hàng 2 */}
                <div className="flex justify-between mt-4 gap-4 w-[750px] ml-[120px] mt-[30px] mb-[18x]">
                    <div>
                        <span className='font-bold'>Loại hóa đơn: </span>
                        <select className="min-w-min w-auto px-2 py-1 font-bold text-orange-700 border border-gray-300 rounded-md text-sm">
                            <option>Tất cả</option>
                            <option>Tại quầy</option>
                            <option>Giao hàng</option>
                        </select>
                    </div>
                    <div>
                        <span className='font-bold'>Trạng thái: </span>
                        <select className="min-w-min w-auto px-2 py-1 font-bold text-orange-700 border border-gray-300 rounded-md text-sm">
                            <option>Tất cả</option>
                            <option>Chờ thanh toán</option>
                            <option>Chờ xác nhận</option>
                            <option>Đã thanh toán</option>
                            <option>Đã hủy</option>
                            <option>Đang giao hàng</option>
                            <option>Hoàn thành</option>
                            <option>Đang chuẩn bị hàng</option>
                        </select>
                    </div>
                    <div>
                        <span className='font-bold'>Sắp xếp: </span>
                        <select className="min-w-min w-auto px-2 py-1 font-bold text-orange-700 border border-gray-300 rounded-md text-sm">
                            <option>Tất cả</option>
                            <option>Giảm dần</option>
                            <option>Tăng dần</option>
                        </select>
                    </div>
                </div>
            </div>

        </>
    );
};

export default TimKiemHoaDon;