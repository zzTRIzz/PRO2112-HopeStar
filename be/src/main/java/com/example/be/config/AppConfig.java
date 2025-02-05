//package com.example.be.config;
//
//import jakarta.servlet.http.HttpServletRequest;
//import org.springframework.context.annotation.Bean;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
//import org.springframework.web.client.RestTemplate;
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.CorsConfigurationSource;
//
//import java.util.Collections;
//
//public class AppConfig {
//    @Bean
//    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
//        http.sessionManagement(management->management.sessionCreationPolicy(
//                SessionCreationPolicy.STATELESS
//        )).authorizeHttpRequests(authorize -> authorize
//                .requestMatchers("/api/**").authenticated()  // Các API cần phải xác thực
//                .requestMatchers("/brand/**").permitAll()  // Các endpoint này có thể không cần xác thực, ví dụ /brand/** là public
//                .anyRequest().permitAll()  // Cho phép tất cả các yêu cầu khác không cần xác thực
//        )
//                .addFilterBefore(new JwtTokenValidator(), BasicAuthenticationFilter.class)  // Thêm filter cho JWT token
//                .csrf(csrf -> csrf.disable())  // Tắt bảo vệ CSRF
//                .cors(cors -> cors.configurationSource(corsConfigurationsSource()));  // Cấu hình CORS
//        return http.build();
//    }
//
//    private CorsConfigurationSource corsConfigurationsSource() {
//        return new CorsConfigurationSource() {
//            @Override
//            public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
//                CorsConfiguration config = new CorsConfiguration();
//                config.setAllowedOrigins(Collections.singletonList("*"));
//                config.setAllowedMethods(Collections.singletonList("*"));
//                config.setAllowedHeaders(Collections.singletonList("*"));
//                config.setAllowCredentials(true);
//                config.setExposedHeaders(Collections.singletonList("Authorization"));
//                config.setMaxAge(3600L);
//                return config;
//            }
//        };
//    }
//
//    @Bean
//    PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();  // Mã hóa mật khẩu với BCrypt
//    }
//
//    @Bean
//    public RestTemplate restTemplate() {
//        return new RestTemplate();  // Bean RestTemplate cho các yêu cầu HTTP
//    }
//}
