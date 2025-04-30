import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { IconSend2 } from '@tabler/icons-react'
import { Client } from '@stomp/stompjs'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import SockJS from 'sockjs-client'
import { getProfile } from '../data/api-service'

const CustomerChat = ({ isOpen, toggleChat }) => {
  const [messages, setMessages] = useState([])
  const [messageInput, setMessageInput] = useState('')
  const [stompClient, setStompClient] = useState(null)
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false)
  const messagesEndRef = useRef(null)
  const [senderId, setSenderId] = useState(null)
  const receiverId = 2 // ID admin
  const jwt = Cookies.get('jwt')

  const fetchChatHistory = async (userId:number) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/chat/history?senderId=${userId}&receiverId=${receiverId}`,
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      )
      setMessages(response.data)
    } catch (error) {
      toast.error('Lỗi khi lấy lịch sử chat: ' + error.message)
      console.error('Lỗi:', error)
    }
  }

  useEffect(() => {
    if (jwt) {
      const initializeChat = async () => {
        try {
          const data = await getProfile()
          setSenderId(data.id)
        } catch (error) {
          console.error('Error loading profile:', error)
          toast.error('Lỗi khi tải thông tin người dùng')
        }
      }
      initializeChat()
    }
  }, [jwt])

  useEffect(() => {
    if (!jwt || !senderId) return

    const socket = new SockJS('http://localhost:8080/chat')
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: { Authorization: `Bearer ${jwt}` },
      debug: (str) => console.log(str),
    })

    client.onConnect = () => {
      console.log('WebSocket connected successfully')
      setIsWebSocketConnected(true)
      const conversationId =
        senderId < receiverId
          ? `${senderId}_${receiverId}`
          : `${receiverId}_${senderId}`
      console.log(`Subscribing to /topic/messages/${conversationId}`)
      client.subscribe(`/topic/messages/${conversationId}`, (message) => {
        const newMessage = JSON.parse(message.body)
        console.log('Received message:', newMessage)
        setMessages((prev) => {
          const updatedMessages = prev.map((msg) =>
            msg.id === newMessage.id
              ? { ...msg, status: newMessage.status }
              : msg
          )
          if (!updatedMessages.some((msg) => msg.id === newMessage.id)) {
            updatedMessages.push(newMessage)
          }
          return updatedMessages
        })
      })
      fetchChatHistory(senderId)
    }

    client.onStompError = (frame) => {
      setIsWebSocketConnected(false)
      if (frame.headers['message'].includes('Unauthorized')) {
        toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!')
        window.location.href = '/sign-in'
      } else {
        toast.error('Lỗi kết nối WebSocket: ' + frame.headers['message'])
      }
      console.error('Lỗi WebSocket:', frame)
    }

    client.activate()
    setStompClient(client)

    return () => client.deactivate()
  }, [jwt, senderId])

  useEffect(() => {
    // Scroll to bottom immediately without animation
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView(false) // false means align to bottom
    }
  }, [messages, isOpen])

  const sendMessage = () => {
    if (!jwt) {
      toast.error('Vui lòng đăng nhập để sử dụng chat!', {
        onClick: () => {
          window.location.href = '/sign-in'
        },
      })
      return
    }

    if (!messageInput.trim()) {
      toast.warn('Vui lòng nhập tin nhắn!')
      return
    }

    if (!isWebSocketConnected) {
      toast.error('Đang kết nối đến server. Vui lòng thử lại!')
      return
    }

    const message = {
      senderId,
      receiverId,
      message: messageInput.trim(),
      status: 'SENT', // Trạng thái ban đầu
      timestamp: new Date().toISOString(), // Thời gian tạm
    }

    try {
      // Gửi tin nhắn qua WebSocket
      stompClient.publish({
        destination: '/app/chat/send',
        body: JSON.stringify({
          senderId,
          receiverId,
          message: messageInput.trim(),
        }),
      })

      setMessageInput('')
    } catch (error) {
      toast.error('Lỗi khi gửi tin nhắn: ' + error.message)
      console.error('Lỗi gửi tin nhắn:', error)
    }
  }

  const updateMessageStatus = (messageId, status, retries = 3) => {
    if (jwt) {
      try {
        if (!stompClient || !stompClient.connected) {
          if (retries > 0) {
            setTimeout(() => {
              updateMessageStatus(messageId, status, retries - 1)
            }, 1000)
          } else {
            toast.error(
              'Không thể cập nhật trạng thái tin nhắn. Vui lòng thử lại sau!'
            )
          }
          return
        }

        const statusUpdate = {
          messageId,
          status,
        }
        stompClient.publish({
          destination: '/app/chat/status',
          body: JSON.stringify(statusUpdate),
        })
        console.log(
          `Sent status update: messageId=${messageId}, status=${status}`
        )
      } catch (error) {
        toast.error('Lỗi khi cập nhật trạng thái: ' + error.message)
        console.error('Lỗi cập nhật trạng thái:', error)
      }
    }
  }

  const handleMessageSeen = () => {
    if (jwt) {
      if (!isWebSocketConnected) {
        toast.warn('Đang kết nối đến server. Vui lòng thử lại!')
        return
      }

      const messagesToUpdate = messages.filter(
        (msg) => msg.senderId !== senderId && msg.status === 'SENT'
      )

      if (messagesToUpdate.length === 0) {
        console.log('No messages to mark as SEEN')
        return
      }

      messagesToUpdate.forEach((msg) => {
        updateMessageStatus(msg.id, 'SEEN')
      })
    }
  }

  // Add formatMessageDate helper function
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

  return (
    <div className='fixed bottom-16 right-4 z-50 pb-2'>
      {!isOpen && (
      <button
        onClick={toggleChat}
        className='rounded-full bg-blue-600 p-4 text-white shadow-lg hover:bg-blue-700 focus:outline-none'
      >
        <svg
          className='h-5 w-5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z'
          />
        </svg>
      </button>
      )}

      {isOpen && (
        <div
          className='flex h-96 w-80 flex-col rounded-lg bg-white shadow-xl'
          onMouseDown={handleMessageSeen}
        >
          <div className='flex items-center justify-between rounded-t-lg bg-blue-600 p-4 text-white'>
            <div>
              <h3 className='text-lg font-semibold'>Hỗ trợ khách hàng</h3>
              <p className='text-sm'>Liên hệ với Admin!</p>
            </div>
            <button
              onClick={toggleChat}
              className='text-white hover:text-gray-200'
            >
              <svg
                className='h-5 w-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>

          <div className='flex-1 overflow-y-auto p-4'>
            {messages.length === 0 ? (
              <div className='flex flex-col gap-3'>
                <div className='text-left'>
                  <div className='inline-block rounded-lg bg-blue-100 p-2 text-sm text-black'>
                    👋 Xin chào! Tôi có thể giúp gì cho bạn?
                  </div>
                </div>
                <div className='text-left'>
                  <div className='inline-block rounded-lg bg-blue-100 p-2 text-sm text-black'>
                    Bạn có thể hỏi về:
                    <ul className='ml-4 mt-1 list-disc'>
                      <li>Thông tin sản phẩm</li>
                      <li>Tình trạng đơn hàng</li>
                      <li>Chính sách bảo hành</li>
                      <li>Khuyến mãi hiện có</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className='space-y-4'>
                {messages.map((msg, index) => {
                  // Check if we need to show date separator
                  const showDate =
                    index === 0 ||
                    formatMessageDate(messages[index - 1].timestamp) !==
                      formatMessageDate(msg.timestamp)

                  return (
                    <div key={msg.id} className='space-y-2'>
                      {showDate && (
                        <div className='flex justify-center'>
                          <span className='rounded-full bg-muted px-3 py-1 text-xs text-gray-500'>
                            {formatMessageDate(msg.timestamp)}
                          </span>
                        </div>
                      )}
                      <div
                        className={`mb-4 ${msg.senderId === senderId ? 'text-right' : 'text-left'}`}
                      >
                        <p className='text-xs text-gray-600'>
                          {msg.senderId === senderId ? 'Bạn' : 'Admin'} •{' '}
                          {new Date(msg.timestamp).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        <div
                          className={`inline-block rounded-lg p-2 text-sm ${
                            msg.senderId === senderId
                              ? 'bg-gray-200 text-black'
                              : 'bg-blue-100 text-black'
                          }`}
                        >
                          {msg.message}
                        </div>
                        <p className='text-xs text-gray-500'>
                          {msg.status === 'SENT' ? 'Đã gửi' : 'Đã xem'}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            <div
              ref={messagesEndRef}
              style={{ float: 'left', clear: 'both' }}
            />
          </div>

          <div className='border-t p-4'>
            <div className='flex space-x-2'>
              <input
                type='text'
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder='Nhập tin nhắn...'
                className='flex-1 rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <button
                onClick={sendMessage}
                className='rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700'
              >
                <IconSend2 stroke={2} />
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position='top-right' autoClose={3000} />
    </div>
  )
}

export default CustomerChat
