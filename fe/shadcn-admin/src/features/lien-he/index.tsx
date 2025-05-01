import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { Contact, ContactType, FilterType } from './types'
import { getContacts, replyToContacts } from './services/contact-service'
import ContactTable from './components/ContactTable'
import FilterBar from './components/FilterBar'
import ReplyModal from './components/ReplyModal'
import { Icon } from '@iconify/react'

export default function ContactManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<FilterType>(null)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false)
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([])

  const queryClient = useQueryClient()

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: getContacts
  })

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      searchTerm === '' ||
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = selectedType === null || contact.type === selectedType

    return matchesSearch && matchesType
  })

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

  // Reset selected ids when filter changes
  useEffect(() => {
    setSelectedIds([])
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
          <Button onClick={() => handleReply(contacts.filter(c => selectedIds.includes(c.id)))}>
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

      <ContactTable
        contacts={filteredContacts}
        selectedIds={selectedIds}
        onSelectIds={setSelectedIds}
        onReply={handleReply}
      />

      <ReplyModal
        isOpen={isReplyModalOpen}
        onClose={() => setIsReplyModalOpen(false)}
        selectedContacts={selectedContacts}
        onSubmit={handleSubmitReply}
      />
    </div>
  )
}
