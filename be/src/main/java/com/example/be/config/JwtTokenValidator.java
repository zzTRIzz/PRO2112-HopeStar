package com.example.be.config;

import lombok.extern.slf4j.Slf4j;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.List;
@Slf4j
public class JwtTokenValidator extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String jwt = request.getHeader(JWT_CONSTANT.JWT_HEADER);

        // Nếu không có JWT, bỏ qua filter này
        if (jwt == null || !jwt.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = jwt.substring(7);
        try {
            SecretKey key = Keys.hmacShaKeyFor(JWT_CONSTANT.SECRET_KEY.getBytes()); //dùng để giải mã token
            Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(jwt).getBody();
            String email = String.valueOf(claims.get("email"));
            String authorities = String.valueOf(claims.get("authorities"));

            List<GrantedAuthority> auths = AuthorityUtils
                    .commaSeparatedStringToAuthorityList(authorities);
            Authentication authentication = new UsernamePasswordAuthenticationToken(email, null, auths);

            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (Exception e) {
            log.error("JWT validation failed: {}", e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid JWT token");
            return;
        }

        filterChain.doFilter(request, response);
    }

}
