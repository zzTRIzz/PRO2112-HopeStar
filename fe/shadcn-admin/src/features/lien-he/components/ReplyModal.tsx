import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { Textarea } from '@/components/ui/textarea'
import { Contact, ContactType } from '../types'
import { getContactTypeStyle } from '../utils/contact-styles'
import { cn } from '@/lib/utils'
import { Icon } from '@iconify/react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface ReplyModalProps {
  isOpen: boolean
  onClose: () => void
  selectedContacts: Contact[]
  onSubmit: (reply: string) => Promise<void>
}

export default function ReplyModal({ isOpen, onClose, selectedContacts, onSubmit }: ReplyModalProps) {
  const [reply, setReply] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)

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
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Gửi phản hồi ({selectedContacts.length})</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Danh sách người nhận:</h4>
              <CollapsibleTrigger className="p-2 hover:bg-gray-100 rounded-md">
                <Icon 
                  icon={isExpanded ? "lucide:chevron-up" : "lucide:chevron-down"} 
                  className={`h-4 w-4 transition-transform duration-200 ${!isExpanded ? 'rotate-180' : ''}`}
                />
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <ScrollArea className={`mt-2 transition-all duration-200 ${isExpanded ? 'h-[200px]' : 'h-0'}`}>
                <div className="space-y-2 pr-4">
                  {Object.entries(
                    selectedContacts.reduce((acc, contact) => {
                      const type = contact.type;
                      if (!acc[type]) acc[type] = [];
                      acc[type].push(contact);
                      return acc;
                    }, {} as Record<ContactType, Contact[]>)
                  ).map(([type, contacts]) => (
                    <div key={type} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "inline-flex px-2 py-1 rounded text-sm font-medium",
                          getContactTypeStyle(type as ContactType).className
                        )}>
                          <span>{getContactTypeStyle(type as ContactType).text}</span>
                          <span className="ml-2">({contacts.length})</span>
                        </div>
                      </div>
                      {contacts.map((contact) => (
                        <div
                          key={contact.id}
                          className="flex items-center justify-between rounded-md border px-3 py-1.5 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="font-medium text-sm leading-snug">{contact.name}</div>
                              <div className="text-xs text-gray-500 leading-snug">
                                {contact.email}
                              </div>
                            </div>
                          </div>
                          {contact.reply && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Icon
                                    icon="lucide:check-circle"
                                    className="h-4 w-4 text-green-500"
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Đã từng phản hồi</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CollapsibleContent>
          </Collapsible>
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
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Icon 
                  icon="lucide:loader-2" 
                  className="h-4 w-4 animate-spin" 
                />
                Đang gửi...
              </span>
            ) : 'Gửi phản hồi'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
