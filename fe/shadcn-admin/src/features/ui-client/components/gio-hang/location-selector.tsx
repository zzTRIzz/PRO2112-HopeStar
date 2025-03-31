import React from "react";
import {
  Card,
  Select,
  SelectItem,
  Button,
  RadioGroup,
  Radio,
  Input,
} from "@heroui/react";

interface Location {
  code: string;
  name: string;
}

interface LocationSelectorProps {
  onSubmit: (data: {
    deliveryType: string;
    province?: string;
    district?: string;
    commune?: string;
    streetAddress?: string;
    fullAddress?: string;
  }) => void;
}

export function LocationSelector({ onSubmit }: LocationSelectorProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [deliveryType, setDeliveryType] = React.useState("delivery");
  const [provinces, setProvinces] = React.useState<Location[]>([]);
  const [districts, setDistricts] = React.useState<Location[]>([]);
  const [communes, setCommunes] = React.useState<Location[]>([]);
  const [streetAddress, setStreetAddress] = React.useState("");
  const [confirmedAddress, setConfirmedAddress] = React.useState("");

  const [selectedProvince, setSelectedProvince] = React.useState("");
  const [selectedDistrict, setSelectedDistrict] = React.useState("");
  const [selectedCommune, setSelectedCommune] = React.useState("");

  const [selectedLocationNames, setSelectedLocationNames] = React.useState({
    province: "",
    district: "",
    commune: "",
  });

  // Fetch provinces on component mount
  React.useEffect(() => {
    const fetchProvinces = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("https://provinces.open-api.vn/api/p/");
        const data = await response.json();
        setProvinces(data.map((p: any) => ({ code: p.code, name: p.name })));
      } catch (error) {
        console.error("Error fetching provinces:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  // Fetch districts when province changes
  React.useEffect(() => {
    const fetchDistricts = async () => {
      if (!selectedProvince) {
        setDistricts([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`
        );
        const data = await response.json();
        setDistricts(
          data.districts.map((d: any) => ({ code: d.code, name: d.name }))
        );
        setSelectedLocationNames((prev) => ({
          ...prev,
          province: data.name,
        }));
      } catch (error) {
        console.error("Error fetching districts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDistricts();
  }, [selectedProvince]);

  // Sửa lại phần fetch communes
  React.useEffect(() => {
    const fetchCommunes = async () => {
      if (!selectedDistrict) {
        setCommunes([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`
        );
        const data = await response.json();

        // Thêm ép kiểu chuỗi cho code
        const formattedCommunes = data.wards.map((w: any) => ({
          code: String(w.code), // Chuyển sang string
          name: w.name,
        }));

        setCommunes(formattedCommunes);

        // Cập nhật tên quận/huyện
        setSelectedLocationNames((prev) => ({
          ...prev,
          district: data.name,
        }));
      } catch (error) {
        console.error("Error fetching communes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunes();
  }, [selectedDistrict]);

  // Sửa useEffect cập nhật tên xã
  React.useEffect(() => {
    if (selectedCommune && communes.length > 0) {
      const commune = communes.find((c) => c.code === selectedCommune);

      console.log("Debug commune:", {
        // Thêm log debug
        selectedCommune,
        communes,
        foundCommune: commune,
      });

      if (commune) {
        setSelectedLocationNames((prev) => ({
          ...prev,
          commune: commune.name,
        }));
      }
    }
  }, [selectedCommune, communes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullAddress =
      deliveryType === "delivery"
        ? `${streetAddress}, ${selectedLocationNames.commune}, ${selectedLocationNames.district}, ${selectedLocationNames.province}`
        : "Nhận tại cửa hàng";

    setConfirmedAddress(fullAddress);

    onSubmit({
      deliveryType,
      province: selectedProvince,
      district: selectedDistrict,
      commune: selectedCommune,
      streetAddress,
      fullAddress,
    });

    console.log("Delivery form submitted:", {
      deliveryType,
      fullAddress,
      locationDetails: {
        province: selectedLocationNames.province,
        district: selectedLocationNames.district,
        commune: selectedLocationNames.commune,
        streetAddress,
      },
    });
  };

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-4">Địa chỉ nhận hàng</h2>
          <RadioGroup
            value={deliveryType}
            onValueChange={(value) => {
              setDeliveryType(value);
              setConfirmedAddress("");
            }}
            className="gap-4"
          >
            <Radio value="delivery">Giao hàng tận nơi</Radio>
            {/* <Radio value="pickup">Nhận tại cửa hàng</Radio> */}
          </RadioGroup>
        </div>

        {deliveryType === "delivery" && (
          <div className="space-y-4">
            <Select
              label="Tỉnh/Thành phố"
              placeholder="Chọn Tỉnh/Thành phố"
              value={selectedProvince}
              onChange={(e) => {
                setSelectedProvince(e.target.value);
                setSelectedDistrict("");
                setSelectedCommune("");
                setConfirmedAddress("");
              }}
              isDisabled={isLoading}
            >
              {provinces.map((province) => (
                <SelectItem key={province.code} value={province.code}>
                  {province.name}
                </SelectItem>
              ))}
            </Select>

            <Select
              label="Quận/Huyện"
              placeholder="Chọn Quận/Huyện"
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setSelectedCommune("");
                setConfirmedAddress("");
              }}
              isDisabled={!selectedProvince || isLoading}
            >
              {districts.map((district) => (
                <SelectItem key={district.code} value={district.code}>
                  {district.name}
                </SelectItem>
              ))}
            </Select>

            <Select
              label="Phường/Xã"
              placeholder="Chọn Phường/Xã"
              value={selectedCommune}
              onChange={(e) => {
                setSelectedCommune(e.target.value);
                setConfirmedAddress("");
              }}
              isDisabled={!selectedDistrict || isLoading}
            >
              {communes.map((commune) => (
                <SelectItem key={commune.code} value={commune.code}>
                  {commune.name}
                </SelectItem>
              ))}
            </Select>

            <Input
              label="Số nhà, tên đường"
              placeholder="Nhập số nhà, tên đường"
              value={streetAddress}
              onChange={(e) => {
                setStreetAddress(e.target.value);
                setConfirmedAddress("");
              }}
              isDisabled={!selectedCommune}
            />
          </div>
        )}

        {confirmedAddress && (
          <Input
            label="Địa chỉ đã xác nhận"
            value={confirmedAddress}
            isReadOnly
            variant="bordered"
          />
        )}

        <Button
          type="submit"
          color="primary"
          className="w-full"
          isDisabled={
            deliveryType === "delivery" &&
            (!selectedProvince ||
              !selectedDistrict ||
              !selectedCommune ||
              !streetAddress)
          }
          isLoading={isLoading}
        >
          Xác nhận địa chỉ
        </Button>
      </form>
    </Card>
  );
}
