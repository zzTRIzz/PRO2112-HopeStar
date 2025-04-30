package com.example.be.core.admin.chat.controller;

import com.example.be.core.admin.chat.dto.request.ChatMessageRequest;
import com.example.be.core.admin.chat.dto.request.StatusUpdateRequest;
import com.example.be.core.admin.chat.dto.response.ChatUserResponse;
import com.example.be.core.admin.chat.service.ChatService;
import com.example.be.core.client.auth.service.AuthService;
import com.example.be.entity.ChatMessage;
import com.example.be.entity.status.MessageStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private AuthService authService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate; // Dùng để gửi tin nhắn qua WebSocket

    // Gửi tin nhắn qua REST API (giữ nguyên để hỗ trợ các client không dùng WebSocket)
    @PostMapping("/send")
    public ResponseEntity<ChatMessage> sendMessage(
            @RequestBody ChatMessageRequest request) {
        try {
            ChatMessage message = chatService.sendMessage(
                    request.getSenderId(),
                    request.getReceiverId(),
                    request.getMessage()
            );
            // Gửi tin nhắn qua WebSocket đến người nhận
            String destination = "/topic/messages/" + getConversationId(request.getSenderId(), request.getReceiverId());
            messagingTemplate.convertAndSend(destination, message);
            return new ResponseEntity<>(message, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Gửi tin nhắn qua WebSocket
    @MessageMapping("/chat/send")
    public void sendMessageViaWebSocket(@Payload ChatMessageRequest request) {
        try {
            ChatMessage savedMessage = chatService.sendMessage(
                    request.getSenderId(),
                    request.getReceiverId(),
                    request.getMessage()
            );
            String conversationId = savedMessage.getConversationId();
            messagingTemplate.convertAndSend("/topic/messages/" + conversationId, savedMessage);
        } catch (Exception e) {
            messagingTemplate.convertAndSend("/topic/errors", "Error: " + e.getMessage());
        }
    }

    @MessageMapping("/chat/status")
    public void updateMessageStatus(@Payload StatusUpdateRequest request) {
        try {
            ChatMessage updatedMessage = chatService.updateMessageStatus(
                    request.getMessageId(),
                    request.getStatus()
            );
            String conversationId = updatedMessage.getConversationId();
            messagingTemplate.convertAndSend("/topic/messages/" + conversationId, updatedMessage);
        } catch (Exception e) {
            messagingTemplate.convertAndSend("/topic/errors", "Error updating status: " + e.getMessage());
        }
    }

    // Lấy lịch sử chat qua REST API
    @GetMapping("/history")
    public ResponseEntity<List<ChatMessage>> getChatHistory(
            @RequestParam Integer senderId,
            @RequestParam Integer receiverId,
            @RequestHeader("Authorization") String jwt) {
        try {
            authService.findAccountByJwt(jwt);
            List<ChatMessage> messages = chatService.getChatHistory(senderId, receiverId);
            return new ResponseEntity<>(messages, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Tạo conversationId dựa trên senderId và receiverId
    private String getConversationId(Integer senderId, Integer receiverId) {
        return senderId < receiverId ? senderId + "_" + receiverId : receiverId + "_" + senderId;
    }

    //test
    @GetMapping("/latest-messages")
    public List<ChatMessage> getLatestMessagesForAdmin() {
        return chatService.getLatestMessagesForAdmin(2);
    }
    @GetMapping("/user-chat")
    public List<ChatUserResponse> getUserChat(@RequestHeader("Authorization") String jwt) throws Exception {
        authService.findAccountByJwt(jwt);
        return chatService.getListChatUser(2);
    }
}
