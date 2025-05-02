import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { Contact, ContactType, FilterType, PaginationInfo } from './types'
import { getContacts, replyToContacts } from './services/contact-service'
import ContactTable from './components/ContactTable'
import FilterBar from './components/FilterBar'
import ReplyModal from './components/ReplyModal'
import PaginationControls from './components/PaginationControls'
import { Icon } from '@iconify/react'

export default function ContactManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<FilterType>(null)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false)
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize] = useState(10)

  const queryClient = useQueryClient()

  const { data: allContacts = [], isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: getContacts
  })

  // Filter contacts based on search term and type
  const filteredContacts = allContacts.filter((contact) => {
    const matchesSearch =
      searchTerm === '' ||
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = selectedType === null || contact.type === selectedType

    return matchesSearch && matchesType
  })

  // Calculate pagination
  const totalItems = filteredContacts.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const startIndex = currentPage * pageSize
  const endIndex = startIndex + pageSize
  const currentPageData = filteredContacts.slice(startIndex, endIndex)

  const pagination: PaginationInfo = {
    currentPage,
    totalPages,
    pageSize,
    totalItems
  }

  const handleReply = (contacts: Contact[]) => {
    setSelectedContacts(contacts)
    setIsReplyModalOpen(true)
  }

  const handleSubmitReply = async (reply: string) => {
    try {
      await replyToContacts({
        contactIds: selectedContacts.map((c) => c.id),
        reply
      })
      
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      toast({
        title: 'Thành công',
        description: 'Đã gửi phản hồi thành công'
      })
      setSelectedIds([])
    } catch (error) {
      console.error('Error sending reply:', error) 
      toast({
        title: 'Lỗi',
        description: 'Không thể gửi phản hồi. Vui lòng thử lại',
        variant: 'destructive'
      })
    }
  }

  // Reset selected ids when filter or page changes
  useEffect(() => {
    setSelectedIds([])
    // Reset to first page when filters change
    if (currentPage !== 0) {
      setCurrentPage(0)
    }
  }, [searchTerm, selectedType])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Icon icon="lucide:loader-2" className="h-10 w-10 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý liên hệ</h1>
        {selectedIds.length > 0 && (
          <Button onClick={() => handleReply(filteredContacts.filter(c => selectedIds.includes(c.id)))}>
            <Icon icon="lucide:mail" className="mr-2 h-4 w-4" />
            Gửi phản hồi ({selectedIds.length})
          </Button>
        )}
      </div>

      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedCount={selectedIds.length}
      />

      <div className="space-y-4">
        <ContactTable
          contacts={currentPageData}
          selectedIds={selectedIds}
          onSelectIds={setSelectedIds}
          onReply={handleReply}
        />

        {totalPages > 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <ReplyModal
        isOpen={isReplyModalOpen}
        onClose={() => setIsReplyModalOpen(false)}
        selectedContacts={selectedContacts}
        onSubmit={handleSubmitReply}
      />
    </div>
  )
}
