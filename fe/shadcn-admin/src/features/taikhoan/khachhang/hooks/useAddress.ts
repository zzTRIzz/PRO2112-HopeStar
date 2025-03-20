import { useEffect, useState } from "react"
import { addressService, Province, District, Ward } from "../services/addressService"

export function useAddress() {
  const [provinces, setProvinces] = useState<Province[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [selectedProvince, setSelectedProvince] = useState<string>("")
  const [selectedDistrict, setSelectedDistrict] = useState<string>("")
  const [selectedWard, setSelectedWard] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProvinces()
  }, [])

  useEffect(() => {
    if (selectedProvince) {
      loadDistricts(selectedProvince)
      setSelectedDistrict("")
      setSelectedWard("")
      setWards([])
    }
  }, [selectedProvince])

  useEffect(() => {
    if (selectedDistrict) {
      loadWards(selectedDistrict)
      setSelectedWard("")
    }
  }, [selectedDistrict])

  const loadProvinces = async () => {
    try {
      const data = await addressService.getProvinces()
      setProvinces(data)
    } catch (error) {
      console.error("Failed to load provinces:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadDistricts = async (provinceCode: string) => {
    try {
      const data = await addressService.getDistricts(provinceCode)
      setDistricts(data)
    } catch (error) {
      console.error("Failed to load districts:", error)
      setDistricts([])
    }
  }

  const loadWards = async (districtCode: string) => {
    try {
      const data = await addressService.getWards(districtCode)
      setWards(data)
    } catch (error) {
      console.error("Failed to load wards:", error)
      setWards([])
    }
  }

  const getFullAddress = (street: string) => {
    const provinceText = provinces.find(p => p.code === selectedProvince)?.name || ""
    const districtText = districts.find(d => d.code === selectedDistrict)?.name || ""
    const wardText = wards.find(w => w.code === selectedWard)?.name || ""

    return addressService.formatFullAddress(street, wardText, districtText, provinceText)
  }

  return {
    provinces,
    districts,
    wards,
    selectedProvince,
    selectedDistrict,
    selectedWard,
    setSelectedProvince,
    setSelectedDistrict,
    setSelectedWard,
    loading,
    getFullAddress
  }
}
