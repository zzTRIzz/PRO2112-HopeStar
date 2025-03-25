package com.example.be.utils;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender javaMailSender;


    public void sendVerificationOtpEmail(String userEmail, String otp, String subject, String text) throws MessagingException {

        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, "utf-8");
            mimeMessageHelper.setSubject(subject);
            mimeMessageHelper.setText(text, true);
            mimeMessageHelper.setTo(userEmail);
            javaMailSender.send(mimeMessage);
        } catch (MailException e) {
            throw new MailSendException("failed to send email");
        }

    }
    @Value("${spring.mail.username}")  // Import từ application.properties
    private String fromEmail;

    public void sendEmail(String to, String subject, String htmlContent) {
        try {
            log.info("Bắt đầu gửi email đến: {}", to);

            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);  // Sử dụng email từ properties
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            log.info("Đang gửi email...");
            javaMailSender.send(message);
            log.info("✓ Đã gửi email thành công đến: {}", to);

        } catch (Exception e) {
            log.error("❌ Lỗi gửi email đến {}: {}", to, e.getMessage());
            throw new RuntimeException("Không thể gửi email: " + e.getMessage());
        }
    }



}
