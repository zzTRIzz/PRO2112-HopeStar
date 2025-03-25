package com.example.be.core.admin.voucher.dto.request;

import lombok.Data;

@Data
public class EmailRequest {
    private String to;
    private String subject;
    private String content;
}
