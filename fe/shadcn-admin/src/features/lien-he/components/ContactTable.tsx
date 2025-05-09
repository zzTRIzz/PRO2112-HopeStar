import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Contact, ContactType } from '../types'
import { getContactTypeStyle, getContactStatusStyle } from '../utils/contact-styles'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { format } from 'date-fns'
import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'
import { IconEye } from '@tabler/icons-react'

interface ContactTableProps {
  contacts: Contact[]
  selectedIds: number[]
  onSelectIds: (ids: number[]) => void
  onReply: (contacts: Contact[]) => void
  onViewDetail: (contact: Contact) => void
}

export default function ContactTable({
  contacts,
  selectedIds,
  onSelectIds,
  onReply,
  onViewDetail,
}: ContactTableProps) {
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc',
  })

  const toggleSort = (key: string) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const sortedContacts = [...contacts].sort((a: any, b: any) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1
    }
    return 0
  })

  const handleSelectAll = () => {
    if (selectedIds.length === contacts.length) {
      onSelectIds([])
    } else {
      onSelectIds(contacts.map((c) => c.id))
    }
  }

  const handleSelectOne = (id: number) => {
    if (selectedIds.includes(id)) {
      onSelectIds(selectedIds.filter((i) => i !== id))
    } else {
      onSelectIds([...selectedIds, id])
    }
  }

  const getStatusColor = (contact: Contact) => {
    return contact.reply ? 'success' : 'warning'
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedIds.length === contacts.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="w-[80px] text-center">STT</TableHead>
            <TableHead>Tên</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>SĐT</TableHead>
            <TableHead>Nội dung</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedContacts.map((contact, index) => (
            <TableRow key={contact.id}>
              <TableCell>
                <Checkbox
                  checked={selectedIds.includes(contact.id)}
                  onCheckedChange={() => handleSelectOne(contact.id)}
                />
              </TableCell>
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell>{contact.name}</TableCell>
              <TableCell>{contact.email}</TableCell>
              <TableCell>{contact.phone}</TableCell>
              <TableCell className="max-w-[200px] truncate">
                {contact.content}
              </TableCell>
              <TableCell>
                <div className={cn(
                  "inline-flex px-2 py-1 rounded-full text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis",
                  getContactTypeStyle(contact.type).className
                )}>
                  {getContactTypeStyle(contact.type).text}
                </div>
              </TableCell>
              <TableCell>
                <div className={cn(
                  "inline-flex px-2 py-1 rounded-full text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis",
                  getContactStatusStyle(!!contact.reply).className
                )}>
                  {getContactStatusStyle(!!contact.reply).text}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetail(contact)}
                    className='h-8 w-8 bg-blue-600 p-0 hover:bg-gray-500'
                  >
                    <IconEye color='white' />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onReply([contact])}
                  >
                    <Icon icon="lucide:mail" className="mr-2 h-4 w-4" />
                    Phản hồi
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
