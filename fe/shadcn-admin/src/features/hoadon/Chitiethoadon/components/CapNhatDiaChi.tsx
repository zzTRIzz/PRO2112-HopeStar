import React, { useEffect, useState } from 'react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from '@/components/ui/input';
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
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from "zod"
import useVietnamAddress from '../../../banhang/service/ApiTichHopDiaChi';

interface AccountKhachHang {
    id: number,
    code: string,
    fullName: string,
    email: string,
    phone: string,
    address: string,
    googleId: string
}

const formSchema = z.object({
    id: z.number().optional(),
    code: z.string().min(1, "Mã khách hàng là bắt buộc"),
    fullName: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
    phone: z.string().min(10, "Số điện thoại không hợp lệ"),
    province: z.string().min(1, "Vui lòng chọn tỉnh/thành phố"),
    district: z.string().min(1, "Vui lòng chọn quận/huyện"),
    ward: z.string().min(1, "Vui lòng chọn phường/xã"),
    address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
    note: z.string().optional()
});

interface Province {
    khachHang: AccountKhachHang | undefined;
    onClose: () => void; // Thêm prop mới

}

const parseAddress = (fullAddress: string) => {
    if (!fullAddress) return { provinceName: "", districtName: "", wardName: "", detailAddress: "" };

    const addressParts = fullAddress.split(",").map(part => part.trim());

    return {
        detailAddress: addressParts[0] || "",
        wardName: addressParts[1] || "",
        districtName: addressParts[2] || "",
        provinceName: addressParts[3] || ""
    };
};
const DiaChiGiaoHang: React.FC<Province> =
    ({
        khachHang,
        onClose
    }) => {
        const [openProvince, setOpenProvince] = useState(false);
        const { provinces, districts, wards, fetchDistricts, fetchWards } = useVietnamAddress();

        const diaChi = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
        });
        const onSubmit = (data: z.infer<typeof formSchema>) => {
            console.log("Data updated:", data);
            onClose();
        };
        useEffect(() => {
            if (khachHang != null) {
                const { provinceName } = parseAddress(khachHang.address || "");
                console.log(khachHang)
                console.log(provinceName)
                // Tìm mã tỉnh
                const provinceCode = provinces.find(p => p.name === provinceName)?.code || "";
                if (!provinceCode) return;
                diaChi.setValue("province", provinceCode);
                // Gọi API tải huyện
                fetchDistricts(provinceCode);

            }
            else {
                diaChi.setValue("province", "");
                diaChi.setValue("district", "");
                diaChi.setValue("ward", "");
                diaChi.setValue("address", "");
                diaChi.setValue("fullName", "");
                diaChi.setValue("phone", "");
            }
        }, [khachHang, provinces]);

        // Khi danh sách huyện có dữ liệu, tìm mã huyện và tải xã
        useEffect(() => {
            const districtName = parseAddress(khachHang?.address || "").districtName;
            if (districts.length > 0 && districtName) {
                const districtCode = districts.find(d => d.name === districtName)?.code || "";
                if (!districtCode) return;

                diaChi.setValue("district", districtCode);
                //  Gọi API tải xã
                fetchWards(districtCode);
            }
        }, [districts]);

        // Khi danh sách xã có dữ liệu, cập nhật vào form
        useEffect(() => {
            const wardName = parseAddress(khachHang?.address || "").wardName;
            if (wards.length > 0 && wardName) {
                const wardCode = wards.find(w => w.name === wardName)?.code || "";
                if (!wardCode) return;
                diaChi.setValue("ward", wardCode);
                diaChi.setValue("address", parseAddress(khachHang?.address || "").detailAddress);
                diaChi.setValue("fullName", khachHang?.fullName || "");
                diaChi.setValue("phone", khachHang?.phone || "");
                diaChi.setValue("id", khachHang?.id);
                console.log(khachHang)

            }
        }, [wards]);

        return (
            <>
                <div className={`transition-all duration-300  "w-full opacity-100 visible" 
                    `}
                    style={{ minWidth: "400px" }}
                >
                    <Form {...diaChi}>
                        <form onSubmit={diaChi.handleSubmit(onSubmit)}
                            className="space-y-8 max-w-2xl mx-auto py-10">
                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-6">
                                    <FormField
                                        control={diaChi.control}
                                        name="fullName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Họ và tên</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Họ và tên "
                                                        type=""
                                                        {...field} className="w-[250px]" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="col-span-6">

                                    <FormField
                                        control={diaChi.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Số điện thoại</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Số điện thoại"
                                                        type=""
                                                        {...field} className="w-[250px]" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                            </div>

                            <div className="grid grid-cols-10 gap-4">

                                <div className="col-span-5">
                                    <FormField
                                        control={diaChi.control}
                                        name="province"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Thành phố/tỉnh</FormLabel>
                                                {/* <Popover open={openProvince} onOpenChange={setOpenProvince}>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                className="w-[250px] justify-between font-normal"
                                                                onClick={() => setOpenProvince(!openProvince)}
                                                                >
                                                                {field.value ? provinces.find((p) => p.code === field.value)?.name : "Chọn tỉnh/thành phố"}
                                                                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[250px] p-0">
                                                        <Command>
                                                            <CommandInput placeholder="Search" />
                                                            <CommandList>
                                                                <CommandEmpty>No language found.</CommandEmpty>
                                                                <CommandGroup>
                                                                    {provinces.map((p) => (
                                                                        <CommandItem
                                                                            key={p.code}
                                                                            onSelect={() => {
                                                                                diaChi.setValue("province", p.code);
                                                                                fetchDistricts(p.code);
                                                                            }}>
                                                                            <Check className={p.code === field.value ? "opacity-100" : "opacity-0"} />
                                                                            {p.name}
                                                                        </CommandItem>
                                                                    ))}
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover> */}
                                                <Popover open={openProvince} onOpenChange={setOpenProvince}>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                className="w-[250px] justify-between font-normal"
                                                            >
                                                                {field.value
                                                                    ? provinces.find((p) => p.code === field.value)?.name
                                                                    : "Chọn tỉnh/thành phố"}
                                                                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent
                                                        className="w-[250px] p-0"
                                                        onBlur={() => setOpenProvince(false)} // Đóng danh sách khi mất focus
                                                    >
                                                        <Command>
                                                            <CommandInput placeholder="Search" />
                                                            <CommandList>
                                                                <CommandEmpty>No language found.</CommandEmpty>
                                                                <CommandGroup>
                                                                    {provinces.map((p) => (
                                                                        <CommandItem
                                                                            key={p.code}
                                                                            onSelect={() => {
                                                                                diaChi.setValue("province", p.code);
                                                                                fetchDistricts(p.code);
                                                                            }}
                                                                        >
                                                                            <Check
                                                                                className={
                                                                                    p.code === field.value ? "opacity-100" : "opacity-0"
                                                                                }
                                                                            />
                                                                            {p.name}
                                                                        </CommandItem>
                                                                    ))}
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="col-span-5">
                                    <FormField
                                        control={diaChi.control}
                                        name="district"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Quận/huyện</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button variant="outline" role="combobox" className="w-[250px] justify-between font-normal">
                                                                {field.value ? districts.find((d) => d.code === field.value)?.name : "Chọn quận/huyện"}
                                                                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[250px] p-0">
                                                        <Command>
                                                            <CommandInput placeholder="Search " />
                                                            <CommandList>
                                                                <CommandEmpty>No language found.</CommandEmpty>
                                                                <CommandGroup>
                                                                    {districts.map((d) => (
                                                                        <CommandItem key={d.code} onSelect={() => {
                                                                            diaChi.setValue("district", d.code);
                                                                            fetchWards(d.code);
                                                                        }}>
                                                                            <Check className={d.code === field.value ? "opacity-100" : "opacity-0"} />
                                                                            {d.name}
                                                                        </CommandItem>
                                                                    ))}
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>


                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-6 pt-3">
                                    <FormField
                                        control={diaChi.control}
                                        name="ward"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Phường/xã</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button variant="outline" role="combobox" className="w-[250px] justify-between font-normal">
                                                                {field.value ? wards.find((w) => w.code === field.value)?.name : "Chọn phường/xã"}
                                                                <ChevronsUpDown className="ml-2 h-4 w-4" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[230px] p-0">
                                                        <Command>
                                                            <CommandInput placeholder="Search" />
                                                            <CommandList>
                                                                <CommandEmpty>No language found.</CommandEmpty>
                                                                <CommandGroup>
                                                                    {wards.map((w) => (
                                                                        <CommandItem key={w.code} onSelect={() => diaChi.setValue("ward", w.code)}>
                                                                            <Check className={w.code === field.value ? "opacity-100" : "opacity-0"} />
                                                                            {w.name}
                                                                        </CommandItem>
                                                                    ))}
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="col-span-6">
                                    <FormField
                                        control={diaChi.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Địa chỉ cụ thể</FormLabel>
                                                <FormControl>
                                                    <Input className="w-[250px]"
                                                        placeholder="Địa chỉ người nhận"

                                                        type=""
                                                        {...field} />
                                                </FormControl>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </form>
                    </Form>

                    <div className="flex justify-end gap-4 pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}>
                            Hủy
                        </Button>

                        <Button type="submit">
                            Lưu thay đổi
                        </Button>
                    </div>
                </div>

            </>
        );
    };

export default DiaChiGiaoHang;