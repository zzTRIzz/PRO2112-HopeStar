import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ContactType, FilterType } from '../types'
import { getContactTypeStyle } from '../utils/contact-styles'
import { cn } from '@/lib/utils'
import { Badge } from '@heroui/react'

interface FilterBarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedType: FilterType
  onTypeChange: (value: FilterType) => void
  selectedCount: number
}

export default function FilterBar({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedCount,
}: FilterBarProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Tìm kiếm theo tên, email, số điện thoại..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-[300px]"
        />
        <Select
          value={selectedType ?? 'ALL'}
          onValueChange={(value) => onTypeChange(value === 'ALL' ? null : value as ContactType)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tất cả loại" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">
              <span className="font-medium">Tất cả loại</span>
            </SelectItem>
            {Object.values(ContactType).map((type) => (
              <SelectItem key={type} value={type}>
                <div className={cn(
                  "inline-flex px-2 py-0.5 rounded-full text-sm font-medium",
                  getContactTypeStyle(type).className
                )}>
                  {getContactTypeStyle(type).text}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {selectedCount > 0 && (
        <Badge color="primary">
          Đã chọn {selectedCount} liên hệ
        </Badge>
      )}
    </div>
  )
}