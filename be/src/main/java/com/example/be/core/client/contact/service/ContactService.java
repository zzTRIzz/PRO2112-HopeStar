package com.example.be.core.client.contact.service;

import com.example.be.core.client.contact.dto.request.ContactReplyRequest;
import com.example.be.entity.Contact;
import com.example.be.repository.ContactRepository;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContactService {
    private final ContactRepository contactRepository;
    private final JavaMailSender mailSender;
    private final ExecutorService emailExecutorService = Executors.newFixedThreadPool(10); // Pool 10 luồng

    @Transactional
    public void replyToContacts(ContactReplyRequest request) {
        List<Contact> contacts = contactRepository.findAllByIdIn(request.getContactIds());
        if (contacts.isEmpty()) {
            throw new RuntimeException("Không tìm thấy contacts với IDs đã chọn");
        }

        contactRepository.updateReplyByIds(request.getContactIds(), request.getReply());

        // Gửi email bất đồng bộ
        List<CompletableFuture<Void>> emailFutures = contacts.stream()
                .map(contact -> CompletableFuture.runAsync(() -> {
                    try {
                        long start = System.currentTimeMillis();
                        sendReplyEmail(contact.getEmail(), request.getReply());
                        System.out.println("Thời gian gửi email: " + (System.currentTimeMillis() - start) + "ms");
                    } catch (Exception e) {
                        System.err.println("Lỗi gửi email cho " + contact.getEmail() + ": " + e.getMessage());
                    }
                }, emailExecutorService))
                .collect(Collectors.toList());

        // Đợi tất cả email hoàn thành (tùy chọn)
        CompletableFuture.allOf(emailFutures.toArray(new CompletableFuture[0])).join();
    }

    // Gửi email
    private void sendReplyEmail(String toEmail, String replyContent) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Phản hồi liên hệ từ cửa hàng HopeStar");
        message.setText(replyContent);

        mailSender.send(message);
    }
}

