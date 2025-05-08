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
import useVietnamAddress from '../../service/ApiTichHopDiaChi';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
    id: z.number().optional(),
    code: z.string().min(1),
    fullName: z.string().min(1),
    phone: z.string().min(1),
    province: z.string().min(1),
    district: z.string().min(1),
    ward: z.string().min(1),
    address: z.string().min(1),
    note: z.string().optional()
});

interface Province {
    isBanGiaoHang: boolean;
    fullName: string
    phone: string
    address: string,
    onAddressChange: (fullAddress: string) => void;
    onDetailChange: (details: { name: string; phone: string; note: string }) => void;

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
        isBanGiaoHang,
        address,
        phone,
        fullName,
        onAddressChange,
        onDetailChange
    }) => {
        const [openProvince, setOpenProvince] = useState(false);
        const { provinces, districts, wards, fetchDistricts, fetchWards } = useVietnamAddress();
        const diaChi = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
        });


        useEffect(() => {
            if (isBanGiaoHang == true && address != null) {
                const { provinceName } = parseAddress(address || "");
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
        }, [isBanGiaoHang, provinces]);

        useEffect(() => {
            const districtName = parseAddress(address || "").districtName;
            if (districts.length > 0 && districtName) {
                const districtCode = districts.find(d => d.name === districtName)?.code || "";
                if (!districtCode) return;
                diaChi.setValue("fullName", fullName || "");
                diaChi.setValue("phone", phone || "");
                diaChi.setValue("district", districtCode);
                //  Gọi API tải xã
                fetchWards(districtCode);
            }
        }, [districts]);

        useEffect(() => {
            const wardName = parseAddress(address || "").wardName;
            if (wards.length > 0 && wardName) {
                const wardCode = wards.find(w => w.name === wardName)?.code || "";
                if (!wardCode) return;
                diaChi.setValue("ward", wardCode);
                diaChi.setValue("address", parseAddress(address || "").detailAddress);
            }
        }, [wards]);


        useEffect(() => {
            const getFullAddress = () => {
                const provinceName = provinces.find((p) => p.code === diaChi.getValues("province"))?.name || "";
                const districtName = districts.find((d) => d.code === diaChi.getValues("district"))?.name || "";
                const wardName = wards.find((w) => w.code === diaChi.getValues("ward"))?.name || "";
                const detailAddress = diaChi.getValues("address") || "";
                return `${detailAddress}, ${wardName}, ${districtName}, ${provinceName}`;
            };
            onAddressChange(getFullAddress());
            onDetailChange({
                name: diaChi.getValues("fullName") || "",
                phone: diaChi.getValues("phone") || "",
                note: diaChi.getValues("note") || ""
            });
        }, [
            diaChi.getValues("fullName"),
            diaChi.getValues("phone"),
            diaChi.watch("province"),
            diaChi.watch("district"),
            diaChi.watch("ward"),
            diaChi.watch("address"),
            diaChi.watch("note"),
            provinces,
            districts,
            wards,
        ]);


        return (
            <>
                <div className={`transition-all duration-300 ${isBanGiaoHang ? "w-full opacity-100 visible" : "w-0 opacity-0 invisible"
                    }`}
                    style={{ minWidth: isBanGiaoHang ? "400px" : "0px" }}
                >            {isBanGiaoHang && (
                    <Form {...diaChi}>
                        <form className="space-y-8 max-w-3xl mx-auto py-10">
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
                                                        {...field} />
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
                                                        {...field} />
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
                                                <Popover open={openProvince} onOpenChange={setOpenProvince}>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                className="w-[220px] justify-between font-normal"
                                                                onClick={() => setOpenProvince(!openProvince)}>
                                                                {field.value ? provinces.find((p) => p.code === field.value)?.name : "Chọn tỉnh/thành phố"}
                                                                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[230px] p-0">
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
                                                            <Button variant="outline" role="combobox" className="w-[220px] justify-between font-normal">
                                                                {field.value ? districts.find((d) => d.code === field.value)?.name : "Chọn quận/huyện"}
                                                                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[230px] p-0">
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
                                                            <Button variant="outline" role="combobox" className="w-[220px] justify-between font-normal">
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
                                                                        <CommandItem
                                                                            key={w.code}
                                                                            onSelect={() => {
                                                                                field.onChange(w.code); // Cập nhật giá trị vào react-hook-form
                                                                                diaChi.setValue("ward", w.code); // Đảm bảo giá trị được lưu
                                                                            }}>
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
                                                    <Input
                                                        placeholder="Địa chỉ người nhận"
                                                        {...field}
                                                        onChange={(e) => {
                                                            field.onChange(e.target.value); // Cập nhật giá trị vào react-hook-form
                                                            diaChi.setValue("address", e.target.value); // Đảm bảo giá trị được lưu
                                                        }}
                                                    />
                                                </FormControl>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <FormField
                                control={diaChi.control}
                                name="note"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ghi chú</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Ghi chú"
                                                className="resize-none"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e.target.value);
                                                    diaChi.setValue("note", e.target.value);
                                                }}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                        <div style={{textAlign:"center", paddingLeft:"100px"}}>
                            <img
                                src="https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-GHTK-H.png"
                                alt="GHTK Logo"
                                className="h-[60px] w-[300px]"
                            />
                        </div>
                    </Form>

                )}
                </div>

            </>
        );
    };

export default DiaChiGiaoHang;