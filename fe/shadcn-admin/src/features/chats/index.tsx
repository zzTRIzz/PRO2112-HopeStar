import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { Client } from '@stomp/stompjs'
import { IconMessages, IconSearch, IconSend2 } from '@tabler/icons-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import SockJS from 'sockjs-client'
import { getChatHistory, getUserChats } from './data/api-chat-service'
import { ChatMessage } from './data/types'

// Add helper function to format date
const formatMessageDate = (timestamp: string) => {
  const messageDate = new Date(timestamp)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (messageDate.toDateString() === today.toDateString()) {
    return 'Hôm nay'
  } else if (messageDate.toDateString() === yesterday.toDateString()) {
    return 'Hôm qua'
  } else {
    return messageDate.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }
}

export default function Chats() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [search, setSearch] = useState('')
  const [messageInput, setMessageInput] = useState('')
  const [stompClient, setStompClient] = useState<Client | null>(null)
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const adminId = 2
  const queryClient = useQueryClient()

  // Fetch chat users list
  const { data: users, isLoading } = useQuery({
    queryKey: ['chat-users'],
    queryFn: getUserChats,
  })

  // Cập nhật toast errors
  useEffect(() => {
    if (selectedChat) {
      getChatHistory(adminId, selectedChat)
        .then((data) => {
          setMessages(data)
        })
        .catch((error) => {
          console.error('Lỗi tải tin nhắn:', error)
          toast({
            title: 'Lỗi tải tin nhắn',
            description: error.message,
            variant: 'destructive',
          })
        })
    }
  }, [selectedChat])

  // Add status update function
  const updateMessageStatus = (messageId: string) => {
    if (!stompClient || !isWebSocketConnected) {
      console.error('WebSocket not connected')
      return
    }

    try {
      const statusUpdate = {
        messageId,
        status: 'SEEN',
      }

      stompClient.publish({
        destination: '/app/chat/status',
        body: JSON.stringify(statusUpdate),
      })
    } catch (error) {
      console.error('Error updating message status:', error)
    }
  }

  // Add message seen handler
  const handleMessageSeen = () => {
    if (!messages.length || !selectedChat) return

    const unreadMessages = messages.filter(
      (msg) => msg.senderId === selectedChat && msg.status !== 'SEEN'
    )

    unreadMessages.forEach((msg) => {
      updateMessageStatus(msg.id)
    })
  }

  // Add effect to mark messages as seen when chat is focused
  useEffect(() => {
    if (document.hasFocus() && selectedChat) {
      handleMessageSeen()
    }

    const onFocus = () => {
      if (selectedChat) {
        handleMessageSeen()
      }
    }

    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [selectedChat, messages])

  // WebSocket connection
  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/chat')
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
      debug: (str) => console.log(str),
    })

    client.onConnect = () => {
      console.log('WebSocket connected successfully')
      setIsWebSocketConnected(true)
      setStompClient(client)

      if (selectedChat) {
        // Subscribe to both conversation patterns
        const conversationId1 = `${adminId}_${selectedChat}`
        const conversationId2 = `${selectedChat}_${adminId}`

        const handleNewMessage = (message: any) => {
          const newMessage = JSON.parse(message.body)

          // Update messages state
          setMessages((prev) => {
            const updatedMessages = [...prev]
            const existingIndex = updatedMessages.findIndex(
              (msg) => msg.id === newMessage.id
            )

            if (existingIndex >= 0) {
              updatedMessages[existingIndex] = newMessage
            } else {
              updatedMessages.push(newMessage)
            }
            return updatedMessages
          })

          // Update users cache with new message
          queryClient.setQueryData(['chat-users'], (oldData: any) => {
            if (!oldData) return oldData

            return oldData.map((user: any) => {
              if (
                user.id === newMessage.senderId ||
                user.id === newMessage.receiverId
              ) {
                return {
                  ...user,
                  message: newMessage.message,
                  role: user.id === newMessage.senderId,
                }
              }
              return user
            })
          })
        }

        // Subscribe to both directions
        client.subscribe(`/topic/messages/${conversationId1}`, handleNewMessage)
        client.subscribe(`/topic/messages/${conversationId2}`, handleNewMessage)
      }
    }

    client.activate()

    return () => {
      if (client.active) {
        client.deactivate()
      }
    }
  }, [selectedChat])

  // Add subscription to admin notifications
  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/chat')
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
      debug: (str) => console.log(str),
    })

    client.onConnect = () => {
      setIsWebSocketConnected(true)
      setStompClient(client)

      // Subscribe to admin notifications
      client.subscribe('/topic/admin/notifications', () => {
        // Refetch user chat list when receiving new message
        queryClient.invalidateQueries(['chat-users'])
      })

      // ...existing selected chat subscription code...
    }

    client.activate()

    return () => {
      if (client.active) {
        client.deactivate()
      }
    }
  }, [selectedChat])

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView(false) // false means align to bottom
    }
  }, [messages])

  const sendMessage = () => {
    if (
      !messageInput.trim() ||
      !stompClient ||
      !isWebSocketConnected ||
      !selectedChat
    ) {
      return
    }

    const message = {
      senderId: adminId,
      receiverId: selectedChat,
      message: messageInput.trim(),
    }

    try {
      stompClient.publish({
        destination: '/app/chat/send',
        body: JSON.stringify(message),
      })
      setMessageInput('')
    } catch (error) {
      console.error('Lỗi gửi tin nhắn:', error)
      toast({
        title: 'Lỗi gửi tin nhắn',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  // Filter users based on search
  const filteredUsers = users?.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.message.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Header>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main fixed>
        <section className='flex h-full gap-6'>
          {/* Danh sách chat */}
          <div className='flex w-full flex-col gap-2 sm:w-56 lg:w-72 2xl:w-80'>
            <div className='sticky top-0 z-10 -mx-4 bg-background px-4 pb-3 shadow-md sm:static sm:z-auto sm:mx-0 sm:p-0 sm:shadow-none'>
              <div className='flex items-center justify-between py-2'>
                <div className='flex gap-2'>
                  <h1 className='text-2xl font-bold'>Tin nhắn</h1>
                  <IconMessages size={20} />
                </div>
              </div>

              <label className='flex h-12 w-full items-center space-x-0 rounded-md border border-input pl-2 focus-within:outline-none focus-within:ring-1 focus-within:ring-ring'>
                <IconSearch size={15} className='mr-2 stroke-slate-500' />
                <span className='sr-only'>Tìm kiếm</span>
                <input
                  type='text'
                  className='w-full flex-1 bg-inherit text-sm focus-visible:outline-none'
                  placeholder='Tìm kiếm tin nhắn...'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
            </div>

            <ScrollArea className='-mx-3 h-full p-3'>
              {isLoading ? (
                <div className='flex items-center justify-center p-4'>
                  <span className='h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent' />
                </div>
              ) : (
                <div className='space-y-4'>
                  {filteredUsers?.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => setSelectedChat(chat.id)}
                      className={cn(
                        'w-full rounded-lg p-3 text-left transition-colors hover:bg-accent',
                        selectedChat === chat.id && 'bg-accent'
                      )}
                    >
                      <div className='flex items-center gap-3'>
                        <Avatar className='h-10 w-10'>
                          <AvatarImage src={chat.avatar || ''} />
                          <AvatarFallback>
                            {chat.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className='flex-1 overflow-hidden'>
                          <div className='flex items-center justify-between gap-2'>
                            <p className='truncate font-medium'>{chat.name}</p>
                          </div>
                          <p className='truncate text-sm text-muted-foreground'>
                            {chat.role ? chat.message :`Bạn: ${chat.message}`}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Nội dung chat */}
          <div
            className={cn(
              'flex-1 flex-col justify-between rounded-md border bg-primary-foreground p-0 shadow-sm',
              !selectedChat && 'hidden sm:flex'
            )}
          >
            {selectedChat ? (
              <div className='flex h-full flex-col'>
                {/* Chat Header */}
                <div className='border-b p-4'>
                  <div className='flex items-center gap-3'>
                    <Avatar className='h-10 w-10'>
                      <AvatarImage
                        src={
                          users?.find((u) => u.id === selectedChat)?.avatar ||
                          ''
                        }
                      />
                      <AvatarFallback>
                        {users
                          ?.find((u) => u.id === selectedChat)
                          ?.name.charAt(0)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className='font-semibold'>
                        {users?.find((u) => u.id === selectedChat)?.name}
                      </h2>
                      <p className='text-sm text-muted-foreground'>
                        {isWebSocketConnected
                          ? 'Đang hoạt động'
                          : 'Đang kết nối...'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className='flex-1 p-4'>
                  <div className='space-y-4'>
                    {messages.map((message, index) => {
                      // Check if we need to show date separator
                      const showDate =
                        index === 0 ||
                        formatMessageDate(messages[index - 1].timestamp) !==
                          formatMessageDate(message.timestamp)

                      return (
                        <div key={message.id} className='space-y-2'>
                          {showDate && (
                            <div className='flex justify-center'>
                              <span className='rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground'>
                                {formatMessageDate(message.timestamp)}
                              </span>
                            </div>
                          )}
                          <div
                            className={cn(
                              'flex',
                              message.senderId === adminId
                                ? 'justify-end'
                                : 'justify-start'
                            )}
                          >
                            <div className='flex max-w-[75%] flex-col gap-1'>
                              <div
                                className={cn(
                                  'rounded-2xl px-4 py-2',
                                  message.senderId === adminId
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                )}
                              >
                                {message.message}
                              </div>
                              <div className='flex items-center gap-1 px-1'>
                                <span className='text-xs text-muted-foreground'>
                                  {new Date(
                                    message.timestamp
                                  ).toLocaleTimeString('vi-VN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                                <span className='text-xs text-muted-foreground'>
                                  •
                                </span>
                                <span className='text-xs text-muted-foreground'>
                                  {message.status === 'SENT'
                                    ? 'Đã gửi'
                                    : 'Đã xem'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    <div
                      ref={messagesEndRef}
                      style={{ float: 'left', clear: 'both' }} // Add styling to ensure proper positioning
                    />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className='border-t p-4'>
                  <div className='flex gap-2'>
                    <input
                      type='text'
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder='Nhập tin nhắn...'
                      className='flex-1 rounded-lg border bg-background px-4 py-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!messageInput.trim() || !isWebSocketConnected}
                      className='rounded-lg bg-primary p-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50'
                    >
                      <IconSend2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className='flex h-full flex-col items-center justify-center'>
                <IconMessages className='h-12 w-12 text-muted-foreground' />
                <h3 className='mt-4 text-lg font-medium'>
                  Chọn một cuộc trò chuyện
                </h3>
              </div>
            )}
          </div>
        </section>
      </Main>
    </>
  )
}
