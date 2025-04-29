package com.example.be.core.admin.chat.dto.request;

import com.example.be.entity.status.MessageStatus;
import lombok.Data;

@Data
public class StatusUpdateRequest {

    private String messageId;
    private MessageStatus status;

}
