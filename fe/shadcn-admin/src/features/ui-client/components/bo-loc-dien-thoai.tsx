import React from "react";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Chip,
  Slider,
  Selection,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface FilterCategory {
  name: string;
  options: string[];
}

export default function BoLocDienThoai() {
  const [priceRange, setPriceRange] = React.useState([0, 50000000]);
  const [tempPriceRange, setTempPriceRange] = React.useState([0, 50000000]);
  const [isPricePopoverOpen, setIsPricePopoverOpen] = React.useState(false);
  const [selectedSort, setSelectedSort] = React.useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = React.useState<
    Record<string, string[]>
  >({
    "Công nghệ NFC": [],
    "Nhu cầu sử dụng": [],
    "Loại điện thoại": [],
    "Hãng sản xuất": [],
    "Chip xử lý": [],
    "Dung lượng Ram": [],
    "Bộ nhớ trong": [],
    "Kiểu màn hình": [],
    "Tần số quét": [],
    "Kích thước màn hình": [],
  });

  const filterCategories: Record<string, string[]> = {
    "Công nghệ NFC": ["Có", "Không"],
    "Nhu cầu sử dụng": ["Chơi game", "Pin trâu", "Cấu hình cao", "Mỏng nhẹ"],
    "Loại điện thoại": ["iPhone (IOS)", "Android", "Điện thoại phổ thông"],
    "Hãng sản xuất": ["Apple", "Samsung", "Oppo", "Xiaomi", "Vivo", "Realme"],
    "Chip xử lý": ["Snapdragon", "Exynos", "Kirin", "MediaTek", "Apple A"],
    "Dung lượng Ram": ["Dưới 4GB", "4GB-6GB", "8GB-12GB", "16GB trở lên"],
    "Bộ nhớ trong": ["Dưới 32GB", "32GB-64GB", "128GB-256GB", "512GB trở lên"],
    "Kiểu màn hình": [
      "AMOLED",
        "IPS LCD",
        "OLED",
        "TFT",
    ],
    "Tần số quét": ["60Hz", "90Hz", "120Hz", "144Hz"],
    "Kích thước màn hình": ["Dưới 6 inch", "6 inch trở lên"],
  };

  const handleFilterSelect = (category: string, option: string) => {
    setSelectedFilters((prev) => {
      const currentFilters = prev[category] || [];
      const newFilters = currentFilters.includes(option)
        ? currentFilters.filter((f) => f !== option)
        : [...currentFilters, option];

      return {
        ...prev,
        [category]: newFilters,
      };
    });
  };

  const handleRemoveFilter = (category: string, option: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: prev[category].filter((f) => f !== option),
    }));
  };

  const handleClearAll = () => {
    setSelectedFilters({
      "Công nghệ NFC": [],
      "Nhu cầu sử dụng": [],
      "Bộ nhớ trong": [],
      "Kiểu màn hình": [],
    });
    setPriceRange([0, 50000000]);
    setSelectedSort(null);
  };

  const hasActiveFilters = Object.values(selectedFilters).some(
    (filters) => filters.length > 0
  );

  const handlePopoverOpen = () => {
    setTempPriceRange(priceRange);
    setIsPricePopoverOpen(true);
  };

  const handleCancelPriceFilter = () => {
    setIsPricePopoverOpen(false);
  };

  const handleApplyPriceFilter = () => {
    setPriceRange(tempPriceRange);
    setIsPricePopoverOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900 mb-4">
          Chọn theo tiêu chí
        </h1>

        <div className="flex flex-wrap gap-3">
          <Popover
            placement="bottom-start"
            isOpen={isPricePopoverOpen}
            onOpenChange={(open) => setIsPricePopoverOpen(open)}
          >
            <PopoverTrigger>
              <Button
                variant={
                  priceRange[0] !== 0 || priceRange[1] !== 50000000
                    ? "bordered"
                    : "flat"
                }
                color={
                  priceRange[0] !== 0 || priceRange[1] !== 50000000
                    ? "primary"
                    : "default"
                }
                endContent={<Icon icon="lucide:chevron-down" />}
                className={
                  priceRange[0] === 0 && priceRange[1] === 50000000
                    ? "bg-gray-100"
                    : ""
                }
                onPress={handlePopoverOpen}
              >
                Giá
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="p-4">
                <div className="text-small font-bold mb-3">Chọn khoảng giá</div>
                <Slider
                  step={500000}
                  minValue={0}
                  maxValue={50000000}
                  value={tempPriceRange}
                  onChange={(value) => setTempPriceRange(value as number[])}
                  className="max-w-full min-w-[300px]"
                  formatOptions={{
                    style: "currency",
                    currency: "VND",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }}
                />
                <div className="flex justify-between mt-2">
                  <p className="text-default-500 font-medium text-small">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(tempPriceRange[0])}
                  </p>
                  <p className="text-default-500 font-medium text-small">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(tempPriceRange[1])}
                  </p>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="flat"
                    onPress={handleCancelPriceFilter}
                  >
                    Hủy
                  </Button>
                  <Button
                    size="sm"
                    color="primary"
                    onPress={handleApplyPriceFilter}
                  >
                    Áp dụng
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {Object.entries(filterCategories).map(([category, options]) => (
            <Dropdown key={category}>
              <DropdownTrigger>
                <Button
                  variant={
                    selectedFilters[category]?.length > 0 ? "bordered" : "flat"
                  }
                  color={
                    selectedFilters[category]?.length > 0
                      ? "primary"
                      : "default"
                  }
                  endContent={<Icon icon="lucide:chevron-down" />}
                  className={
                    selectedFilters[category]?.length === 0 ? "bg-gray-100" : ""
                  }
                >
                  {category}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label={category}
                selectionMode="multiple"
                selectedKeys={new Set(selectedFilters[category])}
                onSelectionChange={(keys: Selection) => {
                  if (typeof keys === "string") return;
                  const selectedArray = Array.from(keys) as string[];
                  setSelectedFilters((prev) => ({
                    ...prev,
                    [category]: selectedArray,
                  }));
                }}
              >
                {options.map((option) => (
                  <DropdownItem key={option}>{option}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          ))}
        </div>
      </div>

      {(hasActiveFilters ||
        priceRange[0] !== 0 ||
        priceRange[1] !== 50000000 ||
        selectedSort) && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">
              Đang lọc theo
            </h2>
            <Button
              variant="light"
              color="danger"
              onPress={handleClearAll}
              size="sm"
            >
              Bỏ chọn tất cả
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(priceRange[0] !== 0 || priceRange[1] !== 50000000) && (
              <Chip
                key="price-range"
                onClose={() => setPriceRange([0, 50000000])}
                variant="flat"
                color="primary"
                className="bg-red-50"
              >
                {`Giá: ${new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(priceRange[0])} - ${new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(priceRange[1])}`}
              </Chip>
            )}
            {Object.entries(selectedFilters).map(([category, filters]) =>
              filters.map((filter) => (
                <Chip
                  key={`${category}-${filter}`}
                  onClose={() => handleRemoveFilter(category, filter)}
                  variant="flat"
                  color="primary"
                  className="bg-red-50"
                >
                  {`${category}: ${filter}`}
                </Chip>
              ))
            )}
            {selectedSort && (
              <Chip
                key="sort-method"
                onClose={() => setSelectedSort(null)}
                variant="flat"
                color="primary"
                className="bg-red-50"
              >
                {`Sắp xếp: ${
                  selectedSort === "high-low"
                    ? "Giá Cao - Thấp"
                    : selectedSort === "low-high"
                    ? "Giá Thấp - Cao"
                    : selectedSort === "promotion"
                    ? "Khuyến Mãi Hot"
                    : "Xem nhiều"
                }`}
              </Chip>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 mb-8">
        <span className="text-gray-700">Sắp xếp theo:</span>
        <Button
          variant={selectedSort === "high-low" ? "bordered" : "flat"}
          color={selectedSort === "high-low" ? "primary" : "default"}
          startContent={<Icon icon="lucide:arrow-down" />}
          onPress={() => setSelectedSort(selectedSort === "high-low" ? null : "high-low")}
        >
          Giá Cao - Thấp
        </Button>
        <Button
          variant={selectedSort === "low-high" ? "bordered" : "flat"}
          color={selectedSort === "low-high" ? "primary" : "default"}
          startContent={<Icon icon="lucide:arrow-up" />}
          onPress={() => setSelectedSort(selectedSort === "low-high" ? null : "low-high")}
        >
          Giá Thấp - Cao
        </Button>
        <Button
          variant={selectedSort === "promotion" ? "bordered" : "flat"}
          color={selectedSort === "promotion" ? "primary" : "default"}
          startContent={<Icon icon="lucide:percent" />}
          onPress={() => setSelectedSort(selectedSort === "promotion" ? null : "promotion")}
        >
          Khuyến Mãi Hot
        </Button>
        <Button
          variant={selectedSort === "popular" ? "bordered" : "flat"}
          color={selectedSort === "popular" ? "primary" : "default"}
          endContent={<Icon icon="lucide:eye" />}
          onPress={() => setSelectedSort(selectedSort === "popular" ? null : "popular")}
        >
          Xem nhiều
        </Button>
      </div>
    </div>
  );
}