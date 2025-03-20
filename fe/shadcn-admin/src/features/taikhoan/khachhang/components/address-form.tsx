import { useAddress } from "../hooks/useAddress"
import { FormField } from "@/components/ui/form"
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { CustomerFormValues } from "./customer-form"

interface AddressFormProps {
  form: UseFormReturn<CustomerFormValues>
}

export function AddressForm({ form }: AddressFormProps) {
  const {
    provinces,
    districts,
    wards,
    selectedProvince,
    selectedDistrict,
    selectedWard,
    setSelectedProvince,
    setSelectedDistrict,
    setSelectedWard,
    getFullAddress,
    loading
  } = useAddress()

  const street = form.watch("street") || ""

  // Update the form's address field whenever any address component changes
  const updateAddress = () => {
    const fullAddress = getFullAddress(street)
    if (fullAddress) {
      form.setValue("address", fullAddress, { shouldValidate: true })
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="province"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tỉnh/Thành phố</FormLabel>
              <Select
                disabled={loading}
                onValueChange={(value) => {
                  field.onChange(value)
                  setSelectedProvince(value)
                  updateAddress()
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tỉnh/thành phố" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {provinces.map((province) => (
                    <SelectItem key={province.code} value={province.code}>
                      {province.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="district"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quận/Huyện</FormLabel>
              <Select
                disabled={!selectedProvince}
                onValueChange={(value) => {
                  field.onChange(value)
                  setSelectedDistrict(value)
                  updateAddress()
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn quận/huyện" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {districts.map((district) => (
                    <SelectItem key={district.code} value={district.code}>
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="ward"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phường/Xã</FormLabel>
              <Select
                disabled={!selectedDistrict}
                onValueChange={(value) => {
                  field.onChange(value)
                  setSelectedWard(value)
                  updateAddress()
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phường/xã" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {wards.map((ward) => (
                    <SelectItem key={ward.code} value={ward.code}>
                      {ward.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa chỉ cụ thể</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Số nhà, đường" 
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    updateAddress()
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Địa chỉ đầy đủ</FormLabel>
            <FormControl>
              <Input {...field} disabled />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
