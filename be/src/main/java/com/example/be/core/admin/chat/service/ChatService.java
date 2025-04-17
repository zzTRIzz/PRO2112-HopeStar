package com.example.be.core.admin.chat.service;


import com.example.be.entity.Account;
import com.example.be.entity.ChatMessage;
import com.example.be.repository.AccountRepository;
import com.example.be.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private AccountRepository accountRepository;

    public ChatMessage sendMessage(Integer senderId, Integer receiverId, String message) {
        // Kiểm tra sender và receiver
        Account sender = accountRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("Sender not found"));
        Account receiver = accountRepository.findById(receiverId)
                .orElseThrow(() -> new IllegalArgumentException("Receiver not found"));

//        // Kiểm tra role
//        if (!sender.getIdRole().getId().equals(2) || !receiver.getIdRole().getId().equals(4)) {
//            throw new IllegalArgumentException("Invalid roles for chat");
//        }

        // Tạo conversationId
        String conversationId = senderId < receiverId ? senderId + "_" + receiverId : receiverId + "_" + senderId;

        // Tạo và lưu tin nhắn
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setConversationId(conversationId);
        chatMessage.setSenderId(senderId);
        chatMessage.setReceiverId(receiverId);
        chatMessage.setMessage(message);
        chatMessage.setTimestamp(LocalDateTime.now());
        chatMessage.setStatus("sent");

        return chatMessageRepository.save(chatMessage);
    }

    public List<ChatMessage> getChatHistory(Integer senderId, Integer receiverId) {
        String conversationId = senderId < receiverId ? senderId + "_" + receiverId : receiverId + "_" + senderId;
        return chatMessageRepository.findByConversationIdOrderByTimestampAsc(conversationId);
    }
}