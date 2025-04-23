package com.example.be.entity;

import com.example.be.entity.status.MessageStatus;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Document(collection = "chat_messages")
public class ChatMessage {
    @Id
    private String id;
    private String conversationId;
    private Integer senderId;
    private Integer receiverId;
    private String message;
    private LocalDateTime timestamp;
    private MessageStatus status;
}
