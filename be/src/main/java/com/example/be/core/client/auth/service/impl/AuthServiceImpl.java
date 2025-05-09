package com.example.be.core.client.auth.service.impl;

import com.example.be.config.JwtProvider;
import com.example.be.core.client.auth.dto.request.LoginRequest;
import com.example.be.core.client.auth.dto.request.SignupRequest;
import com.example.be.core.client.auth.dto.response.AccountResponse;
import com.example.be.core.client.auth.dto.response.AuthResponse;
import com.example.be.core.client.auth.service.AuthService;
import com.example.be.entity.Account;
import com.example.be.entity.ShoppingCart;
import com.example.be.entity.Verification;
import com.example.be.entity.status.StatusCommon;
import com.example.be.repository.AccountRepository;
import com.example.be.repository.RoleRepository;
import com.example.be.repository.ShoppingCartRepository;
import com.example.be.repository.VerificationRepository;
import com.example.be.utils.CustomUser;
import com.example.be.utils.EmailService;
import com.example.be.utils.OtpUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AccountRepository accountRepository;
    private final EmailService emailService;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;
    private final VerificationRepository verificationRepository;
    private final ShoppingCartRepository shoppingCartRepository;
    private final RoleRepository roleRepository;
    private final CustomUser customUser;

    // gui khi dang ki thoi
    @Override
    public Object sentOtp(String email) throws Exception {

        Account account = accountRepository.findByEmail(email);
        if (account != null){
            throw new Exception("Email: "+email+" đã được sự dụng");
        }
        Verification isExit = verificationRepository.findByEmail(email);
        if (isExit != null){
            verificationRepository.delete(isExit);
        }
        String otp = OtpUtil.generateOtp();
        System.out.println("otp"+otp);
        Verification verification = new Verification();
        verification.setOtp(otp);
        verification.setEmail(email);
        verificationRepository.save(verification);
        String subject ="HopeStar xác thực đăng kí tài khoản";
        String text = "<!DOCTYPE html>\n" +
                "<html lang=\"vi\">\n" +
                "<head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                "    <title>HopeStar xác thực đăng kí tài khoản</title>\n" +
                "</head>\n" +
                "<body style=\"margin: 0; padding: 0; background-color: #fff7ed; font-family: Arial, sans-serif; color: #1a1a1a;\">\n" +
                "    <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
                "        <tr>\n" +
                "            <td align=\"center\">\n" +
                "                <table width=\"640\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"background: #ffffff; border-radius: 16px;\">\n" +
                "                    <!-- Header -->\n" +
                "                    <tr>\n" +
                "                        <td style=\"background: #ff6200; padding: 24px; text-align: center; color: white;\">\n" +
                "                            <h1 style=\"font-size: 28px; font-weight: bold; margin: 0;\">HopeStar - Mã xác thực</h1>\n" +
                "                        </td>\n" +
                "                    </tr>\n" +
                "                    <!-- Content -->\n" +
                "                    <tr>\n" +
                "                        <td style=\"padding: 40px;\">\n" +
                "                            <p style=\"font-size: 16px; margin: 0 0 24px 0;\">Xin chào,</p>\n" +
                "                            <p style=\"font-size: 16px; margin: 0 0 24px 0;\">Chúng tôi đã nhận được yêu cầu xác thực cho đăng ký tài khoản HopeStar của bạn. Dùng mã xác thực dưới đây để tiếp tục:</p>\n" +
                "                            <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
                "                                <tr>\n" +
                "                                    <td align=\"center\" style=\"background: #fff7ed; border-radius: 12px; padding: 24px;\">\n" +
                "                                        <div style=\"font-size: 40px; font-weight: bold; color: #ff6200; letter-spacing: 8px;\">" +
                otp +
                "</div>\n" +
                "                                    </td>\n" +
                "                                </tr>\n" +
                "                            </table>\n" +
                "                            <p style=\"font-size: 14px; color: #4a4a4a; margin: 20px 0 0 0; line-height: 1.6;\">\n" +
                "                                <strong>Lưu ý:</strong> Mã xác thực của tài khoản HopeStar. Không chia sẻ với bất kỳ ai.\n" +
                "                            </p>\n" +
                "                        </td>\n" +
                "                    </tr>\n" +
                "                    <!-- Footer -->\n" +
                "                    <tr>\n" +
                "                        <td style=\"background: #f9fafb; padding: 16px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb;\">\n" +
                "                            <p style=\"margin: 0;\">Phần mềm quản lý cửa hàng điện thoại HopeStar<br>© 2025 HopeStar. All rights reserved.</p>\n" +
                "                        </td>\n" +
                "                    </tr>\n" +
                "                </table>\n" +
                "            </td>\n" +
                "        </tr>\n" +
                "    </table>\n" +
                "</body>\n" +
                "</html>";


        emailService.sendVerificationOtpEmail(email,subject,text);
        return "Đã gửi otp thành công";
    }

    @Override
    public String createUser(SignupRequest signupRequest) throws Exception {

        Verification verification = verificationRepository.findByEmail(signupRequest.getEmail());
        if (verification == null || !verification.getOtp().equals(signupRequest.getOtp())){
            throw new Exception("wrong otp ...");
        }
        Account account = accountRepository.findByEmail(signupRequest.getEmail()); //bo di duoc do ko ket hop sign-in
        if (account == null){
            Account accountNew = new Account();
            accountNew.setEmail(signupRequest.getEmail());
            accountNew.setFullName(signupRequest.getFullName());
            accountNew.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
            accountNew.setIdRole(roleRepository.findById(4).orElse(null));
            accountNew.setCode("USER_"+ accountRepository.getNewCode());
            accountNew.setStatus(StatusCommon.ACTIVE);
            accountRepository.save(accountNew);
            verificationRepository.delete(verification);
            ShoppingCart shoppingCart = new ShoppingCart();
            shoppingCart.setIdAccount(accountNew);
            shoppingCartRepository.save(shoppingCart);
            List<GrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new SimpleGrantedAuthority(accountNew.getIdRole().getId().toString()));

            Authentication authentication = new UsernamePasswordAuthenticationToken(signupRequest.getEmail(),null,authorities);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            return jwtProvider.generateToken(authentication);
        }
        return null;
    }

    @Override
    public AuthResponse signing(LoginRequest loginRequest) throws Exception {

        String email = loginRequest.getEmail();
        String password = loginRequest .getPassword();
        AuthResponse authResponse = new AuthResponse();
        if (email == null || email.isEmpty() || password == null || password.isEmpty()){
            throw new Exception("email hoặc mật khẩu không trống");
        }else {
            Account account = accountRepository.findByEmail(email);
            if (account != null && passwordEncoder.matches(password,account.getPassword())){
                if (account.getStatus().equals(StatusCommon.IN_ACTIVE)){
                    throw new Exception("Tài khoản của bạn đã bị vô hiệu");
                }
                Authentication authentication = authentication(email);
                SecurityContextHolder.getContext().setAuthentication(authentication);

                String token = jwtProvider.generateToken(authentication);
                authResponse.setJwt(token);
                authResponse.setMessage("Chào mừng đến với HopeStar");
                Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
                String roleName = authorities.isEmpty()?null:authorities.iterator().next().getAuthority();
                authResponse.setRole(roleName);
            }else {
                throw new Exception("Thông tin tài khoản không chính xác");
            }
        }


        return authResponse;
    }

    @Override
    public AccountResponse getAccountProfile(String jwt) throws Exception {

        String email = jwtProvider.getEmailFromJwtToken(jwt);
        Account account = accountRepository.findByEmail(email);
        if (account == null){
            throw new Exception("account not found");
        }
        AccountResponse accountResponse = new AccountResponse();
        accountResponse.setId(account.getId());
        accountResponse.setName(account.getFullName());
        accountResponse.setEmail(account.getEmail());
        accountResponse.setPhone(account.getPhone());
        accountResponse.setAddress(account.getAddress());
        accountResponse.setAvatar(account.getImageAvatar());
        accountResponse.setIdRole(account.getIdRole().getId());
        accountResponse.setGender(account.getGender());
        accountResponse.setBirthDate(account.getBirthDate());
        return accountResponse;
    }

    @Override
    public Account findAccountByJwt(String jwt) throws Exception {
        String email = jwtProvider.getEmailFromJwtToken(jwt);
        Account account = accountRepository.findByEmail(email);
        if (account == null){
            throw new Exception("Tài khoản không tồn tại");
        }
        if(account.getStatus().equals(StatusCommon.IN_ACTIVE)){
            throw new Exception("Tài khoản của bạn đã bị khóa. Hãy liên hệ với chúng tôi!");
        }
        return account;
    }

    @Override
    public Object forgotPassword(String email) throws Exception {
        Account account = accountRepository.findByEmail(email);
        if (account == null) {
            throw new Exception("Email không tồn tại.");
        }

        Verification isExit = verificationRepository.findByEmail(email);
        if (isExit != null){
            verificationRepository.delete(isExit);
        }
        String otp = OtpUtil.generateOtp();
        // Gửi email
        String resetLink = "http://localhost:5173//reset-password?token=" + otp;
        System.out.println("otp"+otp);
        Verification verification = new Verification();
        verification.setOtp(otp);
        verification.setExpiryDate(LocalDateTime.now().plusMinutes(15));
        verification.setEmail(email);
        verificationRepository.save(verification);
        String subject ="Hope Star xác thực thông tin tài khoản";
        String text = "<!DOCTYPE html>\n" +
                "<html lang=\"vi\">\n" +
                "<head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                "    <title>HopeStar xác thực thông tin tài khoản</title>\n" +
                "</head>\n" +
                "<body style=\"margin: 0; padding: 0; background-color: #fff7ed; font-family: Arial, sans-serif; color: #1a1a1a;\">\n" +
                "    <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
                "        <tr>\n" +
                "            <td align=\"center\">\n" +
                "                <table width=\"640\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"background: #ffffff; border-radius: 16px;\">\n" +
                "                    <!-- Header -->\n" +
                "                    <tr>\n" +
                "                        <td style=\"background: #ff6200; padding: 24px; text-align: center; color: white;\">\n" +
                "                            <h1 style=\"font-size: 28px; font-weight: bold; margin: 0;\">HopeStar - Đường dẫn xác thực</h1>\n" +
                "                        </td>\n" +
                "                    </tr>\n" +
                "                    <!-- Content -->\n" +
                "                    <tr>\n" +
                "                        <td style=\"padding: 40px;\">\n" +
                "                            <p style=\"font-size: 16px; margin: 0 0 24px 0;\">Xin chào,</p>\n" +
                "<p style=\"font-size: 16px; margin: 0 0 24px 0;\">Chúng tôi đã nhận được yêu cầu xác thực tài khoản HopeStar của bạn. Nhấp vào nút dưới đây để tiếp tục:</p>\n" +
                "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
                "    <tr>\n" +
                "        <td align=\"center\">\n" +
                "            <a href=\"" + resetLink + "\" style=\"background: #ff6200; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;\">Đặt lại mật khẩu</a>\n" +
                "        </td>\n" +
                "    </tr>\n" +
                "</table>\n" +
                "                            <p style=\"font-size: 14px; color: #4a4a4a; margin: 20px 0 0 0; line-height: 1.6;\">\n" +
                "                                <strong>Lưu ý:</strong> Đường dẫn xác thực của tài khoản HopeStar. Không chia sẻ với bất kỳ ai.\n" +
                "                            </p>\n" +
                "                        </td>\n" +
                "                    </tr>\n" +
                "                    <!-- Footer -->\n" +
                "                    <tr>\n" +
                "                        <td style=\"background: #f9fafb; padding: 16px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb;\">\n" +
                "                            <p style=\"margin: 0;\">Phần mềm quản lý cửa hàng điện thoại HopeStar<br>© 2025 HopeStar. All rights reserved.</p>\n" +
                "                        </td>\n" +
                "                    </tr>\n" +
                "                </table>\n" +
                "            </td>\n" +
                "        </tr>\n" +
                "    </table>\n" +
                "</body>\n" +
                "</html>";


        emailService.sendVerificationOtpEmail(email,subject,text);
        return "Đã gửi đường dẫn xác thực thành công. Vui lòng kiểm tra email";
    }

    @Override
    public Object resetPassword(String token, String newPassword) throws Exception {
        Verification resetToken = verificationRepository.findByOtp(token);
        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new Exception("Đường dẫn xác thực đã hết hạn");
        }

        Account account = accountRepository.findByEmail(resetToken.getEmail());
        account.setPassword(passwordEncoder.encode(newPassword));
        accountRepository.save(account);

        verificationRepository.delete(resetToken);
        return "Đặt lại mật khẩu thành công";
    }


    private Authentication authentication(String email){
        UserDetails userDetails = customUser.loadUserByUsername(email);
        return new UsernamePasswordAuthenticationToken(userDetails,null,userDetails.getAuthorities());
    }
}
