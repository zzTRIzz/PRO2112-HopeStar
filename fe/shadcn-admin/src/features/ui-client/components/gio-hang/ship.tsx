import { useEffect, useRef, useState } from 'react'
import { Checkbox } from '@heroui/react'

interface ShipProps {
  productValue?: number
  weight?: number
  address?: string
  onShippingFeeChange?: (shippingFee: number, insuranceFee: number) => void // Thêm callback
}

const Ship = ({
  productValue = 0,
  weight = 0,
  address = '',
  onShippingFeeChange,
}: ShipProps) => {
  const [result, setResult] = useState(0)
  const [shippingFeeOnly, setShippingFeeOnly] = useState(0)
  const [insuranceFee, setInsuranceFee] = useState(0)
  const [isInsuranceChecked, setIsInsuranceChecked] = useState(false)
  const [province, setProvince] = useState('')
  const [district, setDistrict] = useState('')
  const GHTK_API_KEY = '1J1IbLcnWarryPP1TRHTUtWTKqaonUrOqyBoUD3'

  // Thêm ref để lưu giá trị trước đó
  const previousShippingValues = useRef({
    shipping: 0,
    insurance: 0,
  })

  // Xử lý địa chỉ khi address prop thay đổi
  useEffect(() => {
    if (address) {
      const parts = address.split(',').map((part) => part.trim())
      if (parts.length >= 4) {
        setProvince(parts[3])
        setDistrict(parts[2])
      }
    }
  }, [address])

  const calculateShippingFee = async () => {
    if (!province || !district || !weight || !productValue) {
      return
    }
    const params = {
      pick_province: 'Hà Nội',
      pick_district: 'Quận Cầu Giấy',
      province: province,
      district: district,
      weight: weight,
      value: productValue,
    }

    const query = new URLSearchParams(params).toString()
    const apiUrl = `/services/shipment/fee?${query}`

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          Token: GHTK_API_KEY,
        },
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()

      if (data.success && data.fee) {
        console.log('Shipping fee:', data.fee)
        setShippingFeeOnly(data.fee.ship_fee_only)
        // Chỉ set insurance fee khi checkbox được check
        if (isInsuranceChecked) {
          setInsuranceFee(data.fee.insurance_fee)
        }
        setResult(data.fee.ship_fee_only + data.fee.insurance_fee)
      } else {
        console.error('Invalid response format:', data)
      }
    } catch (error) {
      console.error('Error calculating shipping fee:', error)
    }
  }

  // Tính phí ship khi các dependencies thay đổi
  useEffect(() => {
    calculateShippingFee()
  }, [province, district, productValue, weight, isInsuranceChecked]) // Thêm isInsuranceChecked vào dependencies

  // Gọi callback khi phí vận chuyển hoặc phí bảo hiểm thay đổi
  useEffect(() => {
    const shippingValues = {
      shipping: shippingFeeOnly,
      insurance: isInsuranceChecked ? insuranceFee : 0,
    }

    // So sánh với giá trị trước đó
    if (
      JSON.stringify(shippingValues) !==
      JSON.stringify(previousShippingValues.current)
    ) {
      previousShippingValues.current = shippingValues
      onShippingFeeChange?.(shippingValues.shipping, shippingValues.insurance)
    }
  }, [shippingFeeOnly, insuranceFee, isInsuranceChecked])

  // Handler cho checkbox
  const handleInsuranceChange = (checked: boolean) => {
    setIsInsuranceChecked(checked)
    if (!checked) {
      setInsuranceFee(0) // Reset insurance fee khi uncheck
    }
  }

  return (
    <>
      <div className='flex justify-between'>
        <div className='flex items-center'>
          <span>Phí vận chuyển</span>
          <div className='ml-2'></div>
          (
          <img
            src='https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-GHTK-H.png'
            alt='GHTK Logo'
            className='h-5 mr-1 w-auto'
          />
          )
        </div>
        <span>+ {new Intl.NumberFormat('vi-VN').format(shippingFeeOnly)}đ</span>
      </div>
      <div className='flex items-center justify-between'>
        <Checkbox
          checked={isInsuranceChecked}
          onChange={(e) => handleInsuranceChange(e.target.checked)}
          className='text-sm'
        >
          Thêm phí bảo hiểm
        </Checkbox>
        {isInsuranceChecked ? (
          <span>+ {new Intl.NumberFormat('vi-VN').format(insuranceFee)}đ</span>
        ) : (
          ''
        )}
      </div>
    </>
  )
}

export default Ship
