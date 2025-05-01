import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Contact, ContactType, contactTypeLabels } from '../types'
import { Badge } from '@heroui/react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { format } from 'date-fns'
import { Icon } from '@iconify/react'

interface ContactTableProps {
  contacts: Contact[]
  selectedIds: number[]
  onSelectIds: (ids: number[]) => void
  onReply: (contacts: Contact[]) => void
}

export default function ContactTable({
  contacts,
  selectedIds,
  onSelectIds,
  onReply,
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
            <TableHead
              className="w-[100px] cursor-pointer"
              onClick={() => toggleSort('id')}
            >
              ID
              {sortConfig.key === 'id' && (
                <Icon
                  icon={
                    sortConfig.direction === 'asc'
                      ? 'lucide:chevron-up'
                      : 'lucide:chevron-down'
                  }
                  className="ml-1 inline h-4 w-4"
                />
              )}
            </TableHead>
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
          {sortedContacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell>
                <Checkbox
                  checked={selectedIds.includes(contact.id)}
                  onCheckedChange={() => handleSelectOne(contact.id)}
                />
              </TableCell>
              <TableCell>{contact.id}</TableCell>
              <TableCell>{contact.name}</TableCell>
              <TableCell>{contact.email}</TableCell>
              <TableCell>{contact.phone}</TableCell>
              <TableCell className="max-w-[200px] truncate">
                {contact.content}
              </TableCell>
              <TableCell>
                <Badge color="primary">
                  {contactTypeLabels[contact.type as ContactType]}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge color={getStatusColor(contact)}>
                  {contact.reply ? 'Đã phản hồi' : 'Chưa phản hồi'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReply([contact])}
                >
                  <Icon icon="lucide:mail" className="mr-2 h-4 w-4" />
                  Phản hồi
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
