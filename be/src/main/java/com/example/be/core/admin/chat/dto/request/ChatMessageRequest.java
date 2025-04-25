package com.example.be.core.admin.chat.dto.request;

import lombok.Data;

@Data
public class ChatMessageRequest {

    private Integer senderId;
    private Integer receiverId;
    private String message;

}
