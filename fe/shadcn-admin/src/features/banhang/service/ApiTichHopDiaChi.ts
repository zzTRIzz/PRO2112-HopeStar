import { useEffect, useState } from "react";

interface Location {
  name: string;
  code: string;
}

export default function useVietnamAddress() {
  const [provinces, setProvinces] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [wards, setWards] = useState<Location[]>([]);

  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/?depth=1")
      .then((res) => res.json())
      .then((data) => setProvinces(data.map((item: any) => ({ name: item.name, code: item.code }))));
  }, []);

  const fetchDistricts = (provinceCode: string) => {
    setDistricts([]);
    setWards([]);
    fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
      .then((res) => res.json())
      .then((data) => setDistricts(data.districts.map((item: any) => ({ name: item.name, code: item.code }))));
  };

  const fetchWards = (districtCode: string) => {
    setWards([]);
    fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
      .then((res) => res.json())
      .then((data) => setWards(data.wards.map((item: any) => ({ name: item.name, code: item.code }))));
  };

  return { provinces, districts, wards, fetchDistricts, fetchWards };
}
