package com.example.be.utils;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    public void sendVerificationOtpEmail(String userEmail, String subject, String text) throws MessagingException {

        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage,"utf-8");
            mimeMessageHelper.setFrom("tringuyenquoc15102004@gmail.com");
            mimeMessageHelper.setTo(userEmail);
            mimeMessageHelper.setSubject(subject);
            mimeMessageHelper.setText(text,true);
            mimeMessageHelper.setTo(userEmail);
            javaMailSender.send(mimeMessage);
        }catch (MailException e){
            throw new MailSendException("failed to send email");
        }

    }

    // Phương thức gửi email HTML với pass
    public void sendPassWordEmail(String toEmail, String pass) {
        try {
            MimeMessage msg = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");

            helper.setFrom("tringuyenquoc15102004@gmail.com");
            helper.setTo(toEmail);
            helper.setSubject(pass + " là mật khẩu tài khoản HopeStar của bạn");

            String htmlContent = "<!DOCTYPE html>\n" +
                    "<html lang=\"vi\">\n" +
                    "<head>\n" +
                    "    <meta charset=\"UTF-8\">\n" +
                    "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                    "    <title>Mật khẩu - HopeStar</title>\n" +
                    "</head>\n" +
                    "<body style=\"margin: 0; padding: 0; background-color: #fff7ed; font-family: Arial, sans-serif; color: #1a1a1a;\">\n" +
                    "    <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
                    "        <tr>\n" +
                    "            <td align=\"center\">\n" +
                    "                <table width=\"640\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"background: #ffffff; border-radius: 16px;\">\n" +
                    "                    <!-- Header -->\n" +
                    "                    <tr>\n" +
                    "                        <td style=\"background: #ff6200; padding: 24px; text-align: center; color: white;\">\n" +
                    "                            <h1 style=\"font-size: 28px; font-weight: bold; margin: 0;\">HopeStar - Mật khẩu cung cấp</h1>\n" +
                    "                        </td>\n" +
                    "                    </tr>\n" +
                    "                    <!-- Content -->\n" +
                    "                    <tr>\n" +
                    "                        <td style=\"padding: 40px;\">\n" +
                    "                            <p style=\"font-size: 16px; margin: 0 0 24px 0;\">Xin chào,</p>\n" +
                    "                            <p style=\"font-size: 16px; margin: 0 0 24px 0;\">Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản HopeStar của bạn. Dùng mật khẩu dưới đây để tiếp tục:</p>\n" +
                    "                            <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
                    "                                <tr>\n" +
                    "                                    <td align=\"center\" style=\"background: #fff7ed; border-radius: 12px; padding: 24px;\">\n" +
                    "                                        <div style=\"font-size: 40px; font-weight: bold; color: #ff6200; letter-spacing: 8px;\">" +
                    pass +
                    "</div>\n" +
                    "                                    </td>\n" +
                    "                                </tr>\n" +
                    "                            </table>\n" +
                    "                            <p style=\"font-size: 14px; color: #4a4a4a; margin: 20px 0 0 0; line-height: 1.6;\">\n" +
                    "                                <strong>Lưu ý:</strong> Mã mật khẩu của tài khoản HopeStar. Không chia sẻ với bất kỳ ai.\n" +
                    "                            </p>\n" +
                    "                            <a href=\"http://localhost:5173/\" style=\"display: inline-block; padding: 12px 28px; background: #ff6200; color: white; text-decoration: none; border-radius: 8px; margin-top: 28px; font-weight: bold;\">Truy cập HopeStar</a>\n" +
                    "                        </td>\n" +
                    "                    </tr>\n" +
                    "                    <!-- Footer -->\n" +
                    "                    <tr>\n" +
                    "                        <td style=\"background: #f9fafb; padding: 16px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb;\">\n" +
                    "                            <p style=\"margin: 0;\">Cửa hàng bán điện thoại HopeStar<br>© 2025 HopeStar. All rights reserved.</p>\n" +
                    "                        </td>\n" +
                    "                    </tr>\n" +
                    "                </table>\n" +
                    "            </td>\n" +
                    "        </tr>\n" +
                    "    </table>\n" +
                    "</body>\n" +
                    "</html>";

            helper.setText(htmlContent, true); // true indicates HTML content
            javaMailSender.send(msg);
            System.out.println(">>>>Send Password email successfully to " + toEmail);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to send Password email", e);
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

    public void sendVerificationAccount(String userEmail, String url, String subject, String text) throws MessagingException {

        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage,"utf-8");
            mimeMessageHelper.setSubject(subject);
            mimeMessageHelper.setText(text,true);
            mimeMessageHelper.setTo(userEmail);
            javaMailSender.send(mimeMessage);
        }catch (MailException e){
            throw new MailSendException("failed to send email");
        }

    }

    // test form email format
    public void sendEmailFormat(String userEmail, String subject, String title, String header, String content, String footer) throws MessagingException {

        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage,"utf-8");
            mimeMessageHelper.setFrom("tringuyenquoc15102004@gmail.com");
            mimeMessageHelper.setTo(userEmail);
            mimeMessageHelper.setSubject(subject);
            String text = "<!DOCTYPE html>\n" +
                    "<html lang=\"vi\">\n" +
                    "<head>\n" +
                    "    <meta charset=\"UTF-8\">\n" +
                    "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                    "    <title>"+title+"</title>\n" +
                    "</head>\n" +
                    "<body style=\"margin: 0; padding: 0; background-color: #fff7ed; font-family: Arial, sans-serif; color: #1a1a1a;\">\n" +
                    "    <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
                    "        <tr>\n" +
                    "            <td align=\"center\">\n" +
                    "                <table width=\"640\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"background: #ffffff; border-radius: 16px;\">\n" +
                    "                    <!-- Header -->\n" +
                    header +
                    "                    <!-- Content -->\n" +
                    content +
                    "                    <!-- Footer -->\n" +
                    footer +
                    "                </table>\n" +
                    "            </td>\n" +
                    "        </tr>\n" +
                    "    </table>\n" +
                    "</body>\n" +
                    "</html>";
            mimeMessageHelper.setText(text,true);
            mimeMessageHelper.setTo(userEmail);
            javaMailSender.send(mimeMessage);
        }catch (MailException e){
            throw new MailSendException("failed to send email");
        }

    }

}
