package com.example.be.core.admin.chat.dto.response;

import lombok.Data;

@Data
public class ChatUserResponse {

    private Integer id;
    private String avatar;
    private String name;
    private String message;
    private Boolean role;

}
