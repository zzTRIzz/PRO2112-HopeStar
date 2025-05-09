package com.example.be.core.client.contact.controller;

import com.example.be.core.client.contact.dto.request.ContactReplyRequest;
import com.example.be.core.client.contact.dto.response.BaseResponse;
import com.example.be.core.client.contact.service.ContactService;
import com.example.be.entity.Contact;
import com.example.be.entity.status.ContactType;
import com.example.be.repository.ContactRepository;
import jakarta.validation.Valid;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/lien-he")
public class ContactClientController {
    private final ChatClient chatClient;

    @Autowired
    private ContactRepository contactRepository;

    private final String SYSTEM_PROMPT = "Xin chào! Tôi là trợ lý ảo của HopeStar. Bạn cần hỗ trợ gì?";

    public ContactClientController(ChatClient.Builder chatClient) {
        System.out.println("ChatClient bên contact đang chạy....✅");
        this.chatClient = chatClient
                .defaultSystem(SYSTEM_PROMPT)
                .build();
    }


    @PostMapping
    public ResponseEntity<?> handleContactRequest(@RequestBody @Valid Contact contact) {
        System.out.println(Arrays.toString(ContactType.values()));
        try {
            Contact aiXuLy = chatClient.prompt(contact.getContent().toString())
                    .user("Phân tích phản hồi để lựa chọn trả về type hợp lý này là gì về thêm type định dạng enum nếu thấy bất kì ký tự nào không có ý nghĩa tiếng việt mặc định trả về SPAM " +
                            Arrays.toString(ContactType.values())
                    )
                    .call()
                    .entity(Contact.class);
            contact.setType(aiXuLy.getType());
        }catch (Exception e) {
            contact.setType(ContactType.HO_TRO);
            System.out.println("Lỗi bên contact: " + e.getMessage());
        }
        return ResponseEntity.ok(contactRepository.save(contact));
    }


}
