'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Province, District, Ward } from '../schema/types'

interface AddressSelectProps {
  onAddressChange: (address: string) => void
}

export function AddressSelect({ onAddressChange }: AddressSelectProps) {
  const [provinces, setProvinces] = useState<Province[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null)
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null)
  const [street, setStreet] = useState<string>('')
  const [loading, setLoading] = useState({
    provinces: true,
    districts: false,
    wards: false,
  })

  // Fetch provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get('https://provinces.open-api.vn/api/p/')
        setProvinces(response.data)
      } catch (error) {
        toast.error('Không thể tải danh sách tỉnh thành')
        console.error('Error fetching provinces:', error)
      } finally {
        setLoading((prev) => ({ ...prev, provinces: false }))
      }
    }
    fetchProvinces()
  }, [])

  // Fetch districts when province changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!selectedProvince) {
        setDistricts([])
        return
      }
      setLoading((prev) => ({ ...prev, districts: true }))
      try {
        const response = await axios.get(
          `https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`
        )
        setDistricts(response.data.districts || [])
      } catch (error) {
        toast.error('Không thể tải danh sách quận huyện')
        console.error('Error fetching districts:', error)
        setDistricts([])
      } finally {
        setLoading((prev) => ({ ...prev, districts: false }))
      }
    }
    fetchDistricts()
  }, [selectedProvince])

  // Fetch wards when district changes
  useEffect(() => {
    const fetchWards = async () => {
      if (!selectedDistrict) {
        setWards([])
        return
      }
      setLoading((prev) => ({ ...prev, wards: true }))
      try {
        const response = await axios.get(
          `https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`
        )
        setWards(response.data.wards || [])
      } catch (error) {
        toast.error('Không thể tải danh sách phường xã')
        console.error('Error fetching wards:', error)
        setWards([])
      } finally {
        setLoading((prev) => ({ ...prev, wards: false }))
      }
    }
    fetchWards()
  }, [selectedDistrict])

  // Tạo chuỗi địa chỉ đầy đủ khi các trường thay đổi
  useEffect(() => {
    if (street && selectedWard && selectedDistrict && selectedProvince) {
      const fullAddress = `${street}, ${selectedWard.name}, ${selectedDistrict.name}, ${selectedProvince.name}`
      onAddressChange(fullAddress)
    } else {
      onAddressChange('')
    }
  }, [street, selectedWard, selectedDistrict, selectedProvince, onAddressChange])

  const handleProvinceChange = (value: string) => {
    const province = provinces.find((p) => p.code === value)
    if (province) {
      setSelectedProvince(province)
      setSelectedDistrict(null)
      setSelectedWard(null)
    }
  }

  const handleDistrictChange = (value: string) => {
    const district = districts.find((d) => d.code === value)
    if (district) {
      setSelectedDistrict(district)
      setSelectedWard(null)
    }
  }

  const handleWardChange = (value: string) => {
    const ward = wards.find((w) => w.code === value)
    if (ward) {
      setSelectedWard(ward)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Chọn Địa Chỉ</CardTitle>
        <CardDescription>
          Chọn tỉnh/thành phố, quận/huyện, phường/xã và nhập địa chỉ cụ thể
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="province">Tỉnh/Thành phố</Label>
          <Select
            value={selectedProvince?.code || ''}
            onValueChange={handleProvinceChange}
            disabled={loading.provinces}
          >
            <SelectTrigger id="province">
              <SelectValue
                placeholder={loading.provinces ? 'Đang tải...' : 'Chọn tỉnh/thành phố'}
              />
            </SelectTrigger>
            <SelectContent>
              {provinces.map((province) => (
                <SelectItem key={province.code} value={province.code}>
                  {province.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="district">Quận/Huyện</Label>
          <Select
            value={selectedDistrict?.code || ''}
            onValueChange={handleDistrictChange}
            disabled={!selectedProvince || loading.districts}
          >
            <SelectTrigger id="district" className={loading.districts ? 'opacity-50' : ''}>
              <SelectValue
                placeholder={loading.districts ? 'Đang tải...' : 'Chọn quận/huyện'}
              />
            </SelectTrigger>
            <SelectContent>
              {districts.map((district) => (
                <SelectItem key={district.code} value={district.code}>
                  {district.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ward">Phường/Xã</Label>
          <Select
            value={selectedWard?.code || ''}
            onValueChange={handleWardChange}
            disabled={!selectedDistrict || loading.wards}
          >
            <SelectTrigger id="ward" className={loading.wards ? 'opacity-50' : ''}>
              <SelectValue
                placeholder={loading.wards ? 'Đang tải...' : 'Chọn phường/xã'}
              />
            </SelectTrigger>
            <SelectContent>
              {wards.map((ward) => (
                <SelectItem key={ward.code} value={ward.code}>
                  {ward.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="street">Địa chỉ cụ thể</Label>
          <Input
            id="street"
            placeholder="VD: Đường 123"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  )
}