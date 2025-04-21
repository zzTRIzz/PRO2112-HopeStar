package com.example.be.core.admin.chat.service;


import com.example.be.entity.Account;
import com.example.be.entity.ChatMessage;
import com.example.be.entity.status.MessageStatus;
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
        // Validate input
        if (senderId == null || receiverId == null) {
            throw new IllegalArgumentException("Sender ID or Receiver ID cannot be null");
        }
        if (message == null || message.trim().isEmpty()) {
            throw new IllegalArgumentException("Message cannot be null or empty");
        }

        // Check sender and receiver
        Account sender = accountRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("Sender not found with ID: " + senderId));
        Account receiver = accountRepository.findById(receiverId)
                .orElseThrow(() -> new IllegalArgumentException("Receiver not found with ID: " + receiverId));

        // Generate conversationId
        String conversationId = senderId < receiverId
                ? senderId + "_" + receiverId
                : receiverId + "_" + senderId;

        // Create and populate ChatMessage
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setConversationId(conversationId);
        chatMessage.setSenderId(senderId);
        chatMessage.setReceiverId(receiverId);
        chatMessage.setMessage(message.trim());
        chatMessage.setTimestamp(LocalDateTime.now());
        chatMessage.setStatus(MessageStatus.SENT);

        // Save to MongoDB
        return chatMessageRepository.save(chatMessage);
    }

    public ChatMessage updateMessageStatus(String messageId, MessageStatus newStatus) {
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new IllegalArgumentException("Message not found with ID: " + messageId));

        // Validate status transition
        if (message.getStatus() == MessageStatus.SEEN) {
            throw new IllegalStateException("Message is already SEEN");
        }
        if (message.getStatus() == MessageStatus.DELIVERED && newStatus != MessageStatus.SEEN) {
            throw new IllegalStateException("Invalid status transition from DELIVERED to " + newStatus);
        }
        if (message.getStatus() == MessageStatus.SENT && newStatus == MessageStatus.SEEN) {
            message.setStatus(MessageStatus.DELIVERED);
            chatMessageRepository.save(message);
        }

        message.setStatus(newStatus);
        return chatMessageRepository.save(message);
    }

    public List<ChatMessage> getChatHistory(Integer senderId, Integer receiverId) {
        String conversationId = senderId < receiverId ? senderId + "_" + receiverId : receiverId + "_" + senderId;
        return chatMessageRepository.findByConversationIdOrderByTimestampAsc(conversationId);
    }
}