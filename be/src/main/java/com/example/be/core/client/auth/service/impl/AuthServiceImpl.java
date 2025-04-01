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

    @Override
    public void sentLoginOtp(String email) throws Exception {

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
        String subject ="Hope Star login/signup otp";
        String text ="<!DOCTYPE html>\n"
                + "<html lang=\"en\">\n"
                + "<head>\n"
                + "  <meta charset=\"UTF-8\">\n"
                + "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n"
                + "  <title>Document</title>\n"
                + "  <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n"
                + "  <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n"
                + "  <link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap\" rel=\"stylesheet\">\n"
                + "  <style>\n"
                + "    body {\n"
                + "      font-family: 'Inter', sans-serif;\n"
                + "    }\n"
                + "  </style>\n"
                + "</head>\n"
                + "<body>\n"
                + "  <div style=\"min-width: 1000px; overflow: auto; line-height: 2;\">\n"
                + "    <div style=\"margin: 50px auto; width: 70%; padding: 20px 0;\">\n"
                + "      <div style=\"border-bottom: 1px solid #eee;\">\n"
                + "        <a href=\"\" style=\"font-size: 1.2em; color: #2365d0; text-decoration: none; font-weight: bold;\">Quản lý tài khoản\n </a>\n"
                + "      </div>\n"
                + "      <p style=\"font-size: 1em;\">Xin chào, chúng tôi đã nhận được yêu cầu xác .</p>\n"
                + "      <p style=\"font-size: 1em;\">Your login/sigup otp is::</p>\n"
                + "      <h2\n"
                + "        style=\"background: #e1eefb; margin: 0 auto; width: max-content; padding: 0px 10px; color: #161616; border-radius: 5px; box-shadow: 0 0 0 1px #1877f2; font-size: 1.3em; font-weight: bold;\">\n"
                + otp
                + "      </h2>\n"
                + "      <br>\n"
                + "      <hr style=\"border: none; border-top: 1px solid #eee;\">\n"
                + "      <div style=\"float: right; padding: 8px 0; color: #aaa; font-size: 0.9em; line-height: 1; font-weight: 300;\">\n"
                + "        <p>Website ...</p>\n"
                + "      </div>\n"
                + "    </div>\n"
                + "  </div>\n"
                + "</body>\n"
                + "</html>";

        emailService.sendVerificationOtpEmail(email,otp,subject,text);

    }

    @Override
    public String createUser(SignupRequest signupRequest) throws Exception {

        Verification verification = verificationRepository.findByEmail(signupRequest.getEmail());
        if (verification == null || !verification.getOtp().equals(signupRequest.getOtp())){
            throw new Exception("wrong otp ...");
        }
        Account account = accountRepository.findByEmail(signupRequest.getEmail());
        if (account == null){
            Account accountNew = new Account();
            accountNew.setEmail(signupRequest.getEmail());
            accountNew.setFullName(signupRequest.getFullName());
            accountNew.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
            accountNew.setIdRole(roleRepository.findById(4).orElse(null));
            accountNew.setCode("USER_"+ accountRepository.getNewCode());
            accountNew.setStatus(StatusCommon.ACTIVE);
            accountRepository.save(accountNew);

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
            throw new Exception("email and password not null");
        }else {
            Account account = accountRepository.findByEmail(email);
            if (account != null && passwordEncoder.matches(password,account.getPassword())){
                Authentication authentication = authentication(email);
                SecurityContextHolder.getContext().setAuthentication(authentication);

                String token = jwtProvider.generateToken(authentication);
                authResponse.setJwt(token);
                authResponse.setMessage("Login success");
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
        return accountResponse;
    }

    @Override
    public Account findAccountByJwt(String jwt) throws Exception {
        String email = jwtProvider.getEmailFromJwtToken(jwt);
        Account account = accountRepository.findByEmail(email);
        if (account == null){
            throw new Exception("account not found");
        }
        return account;
    }


    private Authentication authentication(String email){
        UserDetails userDetails = customUser.loadUserByUsername(email);
        return new UsernamePasswordAuthenticationToken(userDetails,null,userDetails.getAuthorities());
    }
}
