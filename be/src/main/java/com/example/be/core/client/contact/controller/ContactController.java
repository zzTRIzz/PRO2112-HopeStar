package com.example.be.core.client.contact.controller;

import com.example.be.core.admin.account.dto.response.ResponseData;
import com.example.be.core.client.auth.service.AuthService;
import com.example.be.core.client.contact.dto.request.ContactReplyRequest;
import com.example.be.core.client.contact.dto.response.BaseResponse;
import com.example.be.core.client.contact.service.ContactService;
import com.example.be.entity.Contact;
import com.example.be.entity.status.ContactType;
import com.example.be.repository.ContactRepository;
import jakarta.validation.Valid;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.InMemoryChatMemory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Array;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/lien-he")
public class ContactController {

//    private final ChatClient chatClient;

    @Autowired
    private AuthService authService;

    @Autowired
    private ContactRepository contactRepository;

//    private final String SYSTEM_PROMPT = "Xin chào! Tôi là trợ lý ảo của HopeStar. Bạn cần hỗ trợ gì?";
    @Autowired
    private ContactService contactService;
//
//    public ContactController(ChatClient.Builder chatClient) {
//        System.out.println("ChatClient bên contact đang chạy....✅");
//        this.chatClient = chatClient
//                .defaultSystem(SYSTEM_PROMPT)
//                .build();
//    }


//    @PostMapping
//    public ResponseEntity<?> handleContactRequest(@RequestHeader(value = "Authorization") String jwt,@RequestBody @Valid Contact contact) throws Exception {
//        authService.findAccountByJwt(jwt);
//        System.out.println(Arrays.toString(ContactType.values()));
//        try {
//            Contact aiXuLy = chatClient.prompt(contact.getContent().toString())
//                    .user("Phân tích phản hồi để lựa chọn trả về type hợp lý này là gì về thêm type định dạng enum nếu thấy bất kì ký tự nào không có ý nghĩa tiếng việt mặc định trả về SPAM " +
//                            Arrays.toString(ContactType.values())
//                    )
//                    .call()
//                    .entity(Contact.class);
//            contact.setType(aiXuLy.getType());
//        }catch (Exception e) {
//            contact.setType(ContactType.HO_TRO);
//            System.out.println("Lỗi bên contact: " + e.getMessage());
//        }
//        return ResponseEntity.ok(contactRepository.save(contact));
//    }

    @GetMapping
    public BaseResponse<?> getAllContact(@RequestHeader(value = "Authorization") String jwt) throws Exception {
        authService.findAccountByJwt(jwt);
        List<?> contacts = contactRepository.findAll().stream()
                .sorted((p1, p2) -> Long.compare(p2.getId(), p1.getId())) // Sắp xếp giảm dần
                .collect(Collectors.toList());
        if (contacts.isEmpty()) {
            return BaseResponse.success(null);
        }else {
            return BaseResponse.success(contacts);
        }
    }

    @DeleteMapping
    public BaseResponse<?> deleteAllContact(@RequestHeader(value = "Authorization") String jwt) throws Exception {
        authService.findAccountByJwt(jwt);
        contactRepository.deleteAll();
        return BaseResponse.success("Xóa thành công tất cả liên hệ");
    }

    @PostMapping("/reply")
    public BaseResponse<?> reply(@RequestBody ContactReplyRequest request,@RequestHeader(value = "Authorization") String jwt) throws Exception {
        authService.findAccountByJwt(jwt);
        contactService.replyToContacts(request);
        return BaseResponse.success("Phản hồi đã được gửi thành công", contactRepository.findAll().stream()
                .sorted((p1, p2) -> Long.compare(p2.getId(), p1.getId())) // Sắp xếp giảm dần
                .collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public BaseResponse<?> getContactById(@PathVariable Integer id,@RequestHeader(value = "Authorization") String jwt) throws Exception {
        authService.findAccountByJwt(jwt);
        Contact contact = contactRepository.findById(id).orElse(null);
        if (contact == null) {
            return BaseResponse.error("Không tìm thấy liên hệ với ID: " + id);
        }
        return BaseResponse.success(contact);
    }
}
