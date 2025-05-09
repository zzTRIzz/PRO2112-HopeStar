import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaTimes } from "react-icons/fa";
import { ImCart } from "react-icons/im";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { CgAdd } from "react-icons/cg";
import { BillSchema } from "../service/Schema";

interface pendingInvoiceList {
    listBill: BillSchema[]; // Danh sách hóa đơn
    billChoThanhToan: BillSchema[]; // Danh sách hóa đơn
    huyHoaDonTheoId: (id: number) => void; // Hàm hủy hóa đơn
    getById: (id: number) => void; // 
    handleAddBill: () => void; // Hàm thêm hóa đơn mới
    idBill: number | null; // Nhận idBill từ file tổng
}

// Component giỏ hàng
const HoaDonCho: React.FC<pendingInvoiceList> =
    ({
        listBill,
        huyHoaDonTheoId,
        getById,
        handleAddBill,
        idBill,
        billChoThanhToan
    }) => {
        const [valueID, setValue] = React.useState("")
        const [hoveredBillId, setHoveredBillId] = useState<number | null>(null);
        const [open, setOpen] = React.useState(false)

        return (
            <div>
                <div className="grid grid-cols-9 gap-4">
                    <div className='col-span-7'>
                        <div className="flex space-x-1" style={{ paddingLeft: '13px', paddingRight: '10px' }}>
                            {listBill.map((b) => (
                                <div key={b.id}
                                    className={`flex items-center space-x-1 p-2 border-b-2 text-sm rounded-[5%] shadow-sm
                          ${idBill === b.id ? 'border-blue-600 bg-gray-300' : 'border-transparent'}
                          ${hoveredBillId === b.id ? 'bg-gray-200' : ''}`}
                                    onClick={() => getById(b.id)}
                                    onMouseEnter={() => setHoveredBillId(b.id)}
                                    onMouseLeave={() => setHoveredBillId(null)}
                                >
                                    <button className="flex items-center space-x-1"
                                        onClick={() => setValue("")} >
                                        {b.nameBill}
                                        <div className="relative">
                                            <ImCart size={20} className="text-blue-600" />
                                            {b.itemCount >= 0 && (
                                                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-1 text-xs">
                                                    {b.itemCount}
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            void huyHoaDonTheoId(b.id)
                                        }}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            padding: 0,
                                            cursor: "pointer",
                                        }}
                                    >
                                        <FaTimes size={16} />
                                    </button>

                                </div>
                            ))}
                            <button onClick={handleAddBill} ><CgAdd size={26} /></button>
                        </div>
                    </div>
                    <div className='col-span-2'>
                        {/* <div className="transform -translate-x-[-145px]"> */}
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-[180px] justify-between"
                                >
                                    {valueID
                                        ? billChoThanhToan.find((bill) => bill.nameBill === valueID)?.nameBill
                                        : "Hóa đơn"}

                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                                <Command>
                                    <CommandInput placeholder="Search bill" className="h-9" />
                                    <CommandList>
                                        <CommandEmpty>No bill</CommandEmpty>
                                        <CommandGroup>
                                            {billChoThanhToan.map((b) => (
                                                <CommandItem
                                                    key={b.id}
                                                    value={b.nameBill}
                                                    onSelect={(currentValue) => {
                                                        setValue(currentValue === valueID ? "" : currentValue)
                                                        setOpen(false),
                                                            getById(b.id);

                                                    }}
                                                >
                                                    {b.nameBill}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            void huyHoaDonTheoId(b.id)
                                                        }}
                                                        style={{
                                                            background: "none",
                                                            border: "none",
                                                            padding: 0,
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        <FaTimes size={16} />
                                                    </button>
                                                    <Check
                                                        className={cn(
                                                            "ml-auto",
                                                            valueID === b.nameBill ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

            </div>
        );
    };

export default HoaDonCho;
