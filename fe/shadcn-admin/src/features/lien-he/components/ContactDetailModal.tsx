import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Contact, ContactType } from '../types'
import { getContactTypeStyle, getContactStatusStyle } from '../utils/contact-styles'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

interface ContactDetailModalProps {
  contact?: Contact
  isOpen: boolean
  onClose: () => void
}

export default function ContactDetailModal({
  contact,
  isOpen,
  onClose,
}: ContactDetailModalProps) {
  if (!contact) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Chi tiết liên hệ</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 overflow-auto pr-4">
          <div className="space-y-6 py-2">
            <div className="space-y-2">
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-lg">{contact.name}</div>
                    <div className="text-sm text-gray-500">{contact.email}</div>
                    <div className="text-sm text-gray-500">{contact.phone}</div>
                  </div>
                  <div className={cn(
                    "inline-flex px-2 py-1 rounded text-sm font-medium",
                    getContactTypeStyle(contact.type).className
                  )}>
                    {getContactTypeStyle(contact.type).text}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Gửi lúc: {format(new Date(contact.createdAt), 'HH:mm dd/MM/yyyy')}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Nội dung</h3>
              <div className="rounded-lg border p-4">
                <p className="whitespace-pre-wrap break-words">{contact.content}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Trạng thái</h3>
              <div className={cn(
                "inline-flex px-2 py-1 rounded text-sm font-medium",
                getContactStatusStyle(!!contact.reply).className
              )}>
                {getContactStatusStyle(!!contact.reply).text}
              </div>
            </div>
            
            {contact.reply && (
              <div className="space-y-2">
                <h3 className="font-semibold">Phản hồi</h3>
                <div className="rounded-lg border p-4 bg-gray-50">
                  <div className="text-sm text-gray-500 mb-2">
                    Phản hồi lúc: {format(new Date(contact.updatedAt), 'HH:mm dd/MM/yyyy')}
                  </div>
                  <p className="text-justify whitespace-pre-wrap break-words">{contact.reply}</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
