import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import { IconSend2 } from '@tabler/icons-react';

const CustomerChat = ({ isOpen, toggleChat }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [stompClient, setStompClient] = useState(null);
  const messagesEndRef = useRef(null);

  // Thông tin khách hàng và token
  const senderId = 15; // ID khách hàng
  const receiverId = 9; // ID admin
  const jwt = Cookies.get('jwt');

  // Kết nối WebSocket và lấy lịch sử chat
  useEffect(() => {
    console.log('Frontend origin:', window.location.origin);
    console.log('JWT Token:', jwt);

    // Lấy lịch sử chat
    axios
      .get(`http://localhost:8080/api/chat/history?senderId=${senderId}&receiverId=${receiverId}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      })
      .then((response) => {
        setMessages(response.data);
        // Mark messages as DELIVERED when loaded
        response.data.forEach((msg) => {
          if (msg.senderId !== senderId && msg.status !== 'SEEN') {
            updateMessageStatus(msg.id, 'DELIVERED');
          }
        });
      })
      .catch((error) => {
        toast.error('Lỗi khi lấy lịch sử chat: ' + error.message);
        console.error('Lỗi:', error);
      });

    // Kết nối WebSocket
    const socket = new SockJS('http://localhost:8080/chat');
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: { Authorization: `Bearer ${jwt}` },
      debug: (str) => console.log(str),
    });

    client.onConnect = () => {
      console.log('WebSocket connected successfully');
      const conversationId = senderId < receiverId ? `${senderId}_${receiverId}` : `${receiverId}_${senderId}`;
      client.subscribe(`/topic/messages/${conversationId}`, (message) => {
        const newMessage = JSON.parse(message.body);
        console.log('Received message:', newMessage);
        setMessages((prev) => {
          // Update existing message if it's a status update
          const updatedMessages = prev.map((msg) =>
            msg.id === newMessage.id ? { ...msg, status: newMessage.status } : msg
          );
          // Add new message if not a status update
          if (!updatedMessages.some((msg) => msg.id === newMessage.id)) {
            updatedMessages.push(newMessage);
          }
          return updatedMessages;
        });
      });
    };

    client.onStompError = (frame) => {
      toast.error('Lỗi kết nối WebSocket: ' + frame.headers['message']);
      console.error('Lỗi WebSocket:', frame);
    };

    client.activate();
    setStompClient(client);

    return () => client.deactivate();
  }, []);

  // Cuộn xuống cuối khung chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Gửi tin nhắn
  const sendMessage = () => {
    if (!messageInput.trim()) {
      toast.warn('Vui lòng nhập tin nhắn!');
      return;
    }
    if (!stompClient || !stompClient.connected) {
      toast.error('Không thể kết nối đến server. Vui lòng thử lại!');
      return;
    }

    const message = {
      senderId,
      receiverId,
      message: messageInput.trim(),
    };

    try {
      stompClient.publish({
        destination: '/app/chat/send',
        body: JSON.stringify(message),
      });
      setMessageInput('');
    } catch (error) {
      toast.error('Lỗi khi gửi tin nhắn: ' + error.message);
      console.error('Lỗi gửi tin nhắn:', error);
    }
  };

  // Cập nhật trạng thái tin nhắn
  const updateMessageStatus = (messageId, status) => {
    if (!stompClient || !stompClient.connected) {
      toast.error('Không thể cập nhật trạng thái. Vui lòng thử lại!');
      return;
    }

    const statusUpdate = {
      messageId,
      status,
    };

    try {
      stompClient.publish({
        destination: '/app/chat/status',
        body: JSON.stringify(statusUpdate),
      });
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái: ' + error.message);
      console.error('Lỗi cập nhật trạng thái:', error);
    }
  };

  // Xử lý sự kiện khi tin nhắn được xem
  const handleMessageSeen = () => {
    messages.forEach((msg) => {
      if (msg.senderId !== senderId && msg.status === 'DELIVERED') {
        updateMessageStatus(msg.id, 'SEEN');
      }
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Nút mở/đóng chat */}
      <button
        onClick={toggleChat}
        className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 focus:outline-none"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </button>

      {/* Khung chat */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col" onClick={handleMessageSeen}>
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Hỗ trợ khách hàng</h3>
              <p className="text-sm">Liên hệ với Admin!</p>
            </div>
            <button onClick={toggleChat} className="text-white hover:text-gray-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Nội dung chat */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-4 ${msg.senderId === senderId ? 'text-right' : 'text-left'}`}
              >
                <p className="text-xs text-gray-600">
                  {msg.senderId === senderId ? 'Bạn' : 'Admin'} •{' '}
                  {new Date(msg.timestamp).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </p>
                <div
                  className={`inline-block p-2 rounded-lg text-sm ${
                    msg.senderId === senderId
                      ? 'bg-gray-200 text-black'
                      : 'bg-blue-100 text-black'
                  }`}
                >
                  {msg.message}
                </div>
                <p className="text-xs text-gray-500">
                  {msg.status === 'SENT' ? 'Đã gửi' : msg.status === 'DELIVERED' ? 'Đã nhận' : 'Đã xem'}
                </p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Form nhập tin nhắn */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Nhập tin nhắn..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
              >
                <IconSend2 stroke={2} />
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default CustomerChat;