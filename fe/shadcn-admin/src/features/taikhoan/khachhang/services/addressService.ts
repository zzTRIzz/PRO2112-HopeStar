import axios from "axios"

interface Province {
  code: string
  name: string
}

interface District {
  code: string
  name: string
  province_code: string
}

interface Ward {
  code: string
  name: string
  district_code: string
}

const API_URL = 'https://provinces.open-api.vn/api'

export const addressService = {
  getProvinces: async (): Promise<Province[]> => {
    const response = await axios.get(`${API_URL}/p`)
    return response.data
  },

  getDistricts: async (provinceCode: string): Promise<District[]> => {
    const response = await axios.get(`${API_URL}/p/${provinceCode}?depth=2`)
    return response.data.districts
  },

  getWards: async (districtCode: string): Promise<Ward[]> => {
    const response = await axios.get(`${API_URL}/d/${districtCode}?depth=2`)
    return response.data.wards
  },

  formatFullAddress: (
    street: string,
    ward: string,
    district: string,
    province: string
  ): string => {
    return `${street}, ${ward}, ${district}, ${province}`.replace(/^,\s+/, '').replace(/,\s+,/g, ',')
  }
}

export type { Province, District, Ward }
