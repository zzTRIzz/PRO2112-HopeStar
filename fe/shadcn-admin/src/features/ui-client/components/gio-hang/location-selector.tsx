import React from 'react'
import {
  Button,
  Card,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
} from '@heroui/react'

interface Location {
  code: string
  name: string
}

interface LocationSelectorProps {
  onSubmit: (data: {
    deliveryType: string
    province?: string
    district?: string
    commune?: string
    streetAddress?: string
    fullAddress?: string
  }) => void
}

export function LocationSelector({ onSubmit }: LocationSelectorProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [deliveryType, setDeliveryType] = React.useState('delivery')
  const [provinces, setProvinces] = React.useState<Location[]>([])
  const [districts, setDistricts] = React.useState<Location[]>([])
  const [communes, setCommunes] = React.useState<Location[]>([])
  const [streetAddress, setStreetAddress] = React.useState('')
  const [confirmedAddress, setConfirmedAddress] = React.useState('')

  const [selectedProvince, setSelectedProvince] = React.useState('')
  const [selectedDistrict, setSelectedDistrict] = React.useState('')
  const [selectedCommune, setSelectedCommune] = React.useState('')

  const [selectedLocationNames, setSelectedLocationNames] = React.useState({
    province: '',
    district: '',
    commune: '',
  })

  const signupData = JSON.parse(localStorage.getItem('profile') || '{}')
  const { address } = signupData

  const [errors, setErrors] = React.useState({
    province: '',
    district: '',
    commune: '',
    streetAddress: '',
  })

  // Add state to track if using saved address
  const [useSavedAddress, setUseSavedAddress] = React.useState(!!address)

  // Add state to track if form was submitted
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  const validateFields = () => {
    const newErrors = {
      province: '',
      district: '',
      commune: '',
      streetAddress: '',
    }

    // Only validate if changing address and form was submitted
    if (isChangingAddress) {
      if (!selectedProvince) {
        newErrors.province = 'Vui lòng chọn Tỉnh/Thành phố'
      }
      if (!selectedDistrict) {
        newErrors.district = 'Vui lòng chọn Quận/Huyện'
      }
      if (!selectedCommune) {
        newErrors.commune = 'Vui lòng chọn Phường/Xã'
      }
      if (!streetAddress.trim()) {
        newErrors.streetAddress = 'Vui lòng nhập địa chỉ cụ thể'
      }
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error !== '')
  }

  // Fetch provinces on component mount
  React.useEffect(() => {
    const fetchProvinces = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('https://provinces.open-api.vn/api/p/')
        const data = await response.json()
        setProvinces(data.map((p: any) => ({ code: p.code, name: p.name })))
      } catch (error) {
        console.error('Error fetching provinces:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProvinces()
  }, [])

  // Fetch districts when province changes
  React.useEffect(() => {
    const fetchDistricts = async () => {
      if (!selectedProvince) {
        setDistricts([])
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(
          `https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`
        )
        const data = await response.json()
        setDistricts(
          data.districts.map((d: any) => ({ code: d.code, name: d.name }))
        )
        setSelectedLocationNames((prev) => ({
          ...prev,
          province: data.name,
        }))
      } catch (error) {
        console.error('Error fetching districts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDistricts()
  }, [selectedProvince])

  // Sửa lại phần fetch communes
  React.useEffect(() => {
    const fetchCommunes = async () => {
      if (!selectedDistrict) {
        setCommunes([])
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(
          `https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`
        )
        const data = await response.json()

        // Thêm ép kiểu chuỗi cho code
        const formattedCommunes = data.wards.map((w: any) => ({
          code: String(w.code), // Chuyển sang string
          name: w.name,
        }))

        setCommunes(formattedCommunes)

        // Cập nhật tên quận/huyện
        setSelectedLocationNames((prev) => ({
          ...prev,
          district: data.name,
        }))
      } catch (error) {
        console.error('Error fetching communes:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCommunes()
  }, [selectedDistrict])

  // Sửa useEffect cập nhật tên xã
  React.useEffect(() => {
    if (selectedCommune && communes.length > 0) {
      const commune = communes.find((c) => c.code === selectedCommune)

      console.log('Debug commune:', {
        // Thêm log debug
        selectedCommune,
        communes,
        foundCommune: commune,
      })

      if (commune) {
        setSelectedLocationNames((prev) => ({
          ...prev,
          commune: commune.name,
        }))
      }
    }
  }, [selectedCommune, communes])

  // Effect to set confirmed address if using saved address
  React.useEffect(() => {
    if (useSavedAddress && address) {
      setConfirmedAddress(address)
      onSubmit({
        deliveryType: 'delivery',
        fullAddress: address,
      })
    }
  }, [useSavedAddress, address])

  const [showChangeAddressConfirm, setShowChangeAddressConfirm] =
    React.useState(false)
  const [isChangingAddress, setIsChangingAddress] = React.useState(false)

  const handleChangeAddress = () => {
    setShowChangeAddressConfirm(true)
  }

  const confirmChangeAddress = () => {
    setShowChangeAddressConfirm(false)
    setIsChangingAddress(true)
    setUseSavedAddress(false)
    setIsSubmitted(false)
    // Store changing address state
    localStorage.setItem('isChangingAddress', 'true')
    // Reset all form values
    setSelectedProvince('')
    setSelectedDistrict('')
    setSelectedCommune('')
    setStreetAddress('')
    setConfirmedAddress('')
    setErrors({
      province: '',
      district: '',
      commune: '',
      streetAddress: '',
    })
  }

  const cancelChangeAddress = () => {
    setShowChangeAddressConfirm(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)

    if (useSavedAddress && address) {
      localStorage.removeItem('isChangingAddress')
      onSubmit({
        deliveryType: 'delivery',
        fullAddress: address,
      })
      return
    }

    // Validate fields when changing address
    if (isChangingAddress && !validateFields()) {
      return
    }

    const fullAddress =
      deliveryType === 'delivery'
        ? `${streetAddress}, ${selectedLocationNames.commune}, ${selectedLocationNames.district}, ${selectedLocationNames.province}`
        : 'Nhận tại cửa hàng'

    // Set confirmed address regardless of changing status
    setConfirmedAddress(fullAddress)

    onSubmit({
      deliveryType,
      province: selectedProvince,
      district: selectedDistrict,
      commune: selectedCommune,
      streetAddress,
      fullAddress,
    })
  }

  // Add effect to validate on field changes if form was submitted
  React.useEffect(() => {
    if (isSubmitted && isChangingAddress) {
      validateFields()
    }
  }, [
    selectedProvince,
    selectedDistrict,
    selectedCommune,
    streetAddress,
    isSubmitted,
    isChangingAddress,
  ])

  // Add cleanup in useEffect
  React.useEffect(() => {
    return () => {
      localStorage.removeItem('isChangingAddress')
    }
  }, [])

  return (
    <Card className='w-full'>
      <form onSubmit={handleSubmit} className='space-y-6 p-6'>
        <div>
          <h2 className='mb-4 text-xl font-bold'>Địa chỉ nhận hàng</h2>
          {address && !isChangingAddress ? (
            <div className='space-y-4'>
              <Input
                label='Địa chỉ đã lưu'
                value={address}
                variant='bordered'
                isReadOnly
              />
              {!showChangeAddressConfirm ? (
                <div className='flex items-center gap-2'>
                  <Button
                    type='button'
                    variant='bordered'
                    onClick={handleChangeAddress}
                  >
                    Thay đổi địa chỉ
                  </Button>
                </div>
              ) : (
                <div className='flex items-center gap-2'>
                  <Button
                    type='button'
                    color='danger'
                    variant='flat'
                    onClick={confirmChangeAddress}
                  >
                    Xác nhận thay đổi
                  </Button>
                  <Button
                    type='button'
                    variant='bordered'
                    onClick={cancelChangeAddress}
                  >
                    Hủy
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <>
              <RadioGroup
                value={deliveryType}
                onValueChange={(value) => {
                  setDeliveryType(value)
                  setConfirmedAddress('')
                }}
                className='gap-4'
              >
                <Radio value='delivery'>Giao hàng tận nơi</Radio>
              </RadioGroup>

              {deliveryType === 'delivery' && (
                <div className='mt-4 space-y-4'>
                  <div>
                    <Select
                      label='Tỉnh/Thành phố'
                      placeholder='Chọn Tỉnh/Thành phố'
                      value={selectedProvince}
                      onChange={(e) => {
                        setSelectedProvince(e.target.value)
                        setSelectedDistrict('')
                        setSelectedCommune('')
                        setConfirmedAddress('')
                        setErrors((prev) => ({ ...prev, province: '' }))
                      }}
                      isDisabled={isLoading}
                      errorMessage={errors.province}
                      isInvalid={!!errors.province}
                    >
                      {provinces.map((province) => (
                        <SelectItem key={province.code} value={province.code}>
                          {province.name}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <Select
                      label='Quận/Huyện'
                      placeholder='Chọn Quận/Huyện'
                      value={selectedDistrict}
                      onChange={(e) => {
                        setSelectedDistrict(e.target.value)
                        setSelectedCommune('')
                        setConfirmedAddress('')
                        setErrors((prev) => ({ ...prev, district: '' }))
                      }}
                      isDisabled={!selectedProvince || isLoading}
                      errorMessage={errors.district}
                      isInvalid={!!errors.district}
                    >
                      {districts.map((district) => (
                        <SelectItem key={district.code} value={district.code}>
                          {district.name}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <Select
                      label='Phường/Xã'
                      placeholder='Chọn Phường/Xã'
                      value={selectedCommune}
                      onChange={(e) => {
                        setSelectedCommune(e.target.value)
                        setConfirmedAddress('')
                        setErrors((prev) => ({ ...prev, commune: '' }))
                      }}
                      isDisabled={!selectedDistrict || isLoading}
                      errorMessage={errors.commune}
                      isInvalid={!!errors.commune}
                    >
                      {communes.map((commune) => (
                        <SelectItem key={commune.code} value={commune.code}>
                          {commune.name}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <Input
                      label='Số nhà, tên đường'
                      placeholder='Nhập số nhà, tên đường'
                      value={streetAddress}
                      onChange={(e) => {
                        setStreetAddress(e.target.value)
                        setConfirmedAddress('')
                        setErrors((prev) => ({ ...prev, streetAddress: '' }))
                      }}
                      isDisabled={!selectedCommune}
                      errorMessage={errors.streetAddress}
                      isInvalid={!!errors.streetAddress}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Show confirmed address whenever it exists */}
        {confirmedAddress && (
          <Input
            label='Địa chỉ đã xác nhận'
            value={confirmedAddress}
            isReadOnly
            variant='bordered'
          />
        )}

        {/* Updated condition for showing the confirm button */}
        {(isChangingAddress || !address) && (
          <Button
            type='submit'
            color='primary'
            className='w-full'
            isDisabled={
              deliveryType === 'delivery' &&
              (!selectedProvince ||
                !selectedDistrict ||
                !selectedCommune ||
                !streetAddress)
            }
            isLoading={isLoading}
          >
            Xác nhận địa chỉ
          </Button>
        )}
      </form>
    </Card>
  )
}
