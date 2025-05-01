import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Contact, contactTypeLabels } from '../types'
import { Badge } from '@heroui/react'

interface ReplyModalProps {
  isOpen: boolean
  onClose: () => void
  selectedContacts: Contact[]
  onSubmit: (reply: string) => Promise<void>
}

export default function ReplyModal({ isOpen, onClose, selectedContacts, onSubmit }: ReplyModalProps) {
  const [reply, setReply] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!reply.trim()) return
    setIsSubmitting(true)
    try {
      await onSubmit(reply)
      setReply('')
      onClose()
    } catch (error) {
      console.error('Error submitting reply:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Phản hồi email</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="mb-2 text-sm font-semibold">Gửi đến:</h4>
            <div className="space-y-2">
              {selectedContacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between rounded-md border p-2">
                  <div>
                    <div className="font-medium">{contact.name}</div>
                    <div className="text-sm text-gray-500">{contact.email}</div>
                  </div>
                  <Badge color="primary">{contactTypeLabels[contact.type]}</Badge>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-semibold">Nội dung phản hồi:</h4>
            <Textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Nhập nội dung phản hồi..."
              className="min-h-[150px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={!reply.trim() || isSubmitting}>
            {isSubmitting ? 'Đang gửi...' : 'Gửi phản hồi'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
