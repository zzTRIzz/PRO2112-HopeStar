package com.example.be.core.client.contact.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class ContactReplyRequest {
    private List<Integer> contactIds;
    private String reply;
}
