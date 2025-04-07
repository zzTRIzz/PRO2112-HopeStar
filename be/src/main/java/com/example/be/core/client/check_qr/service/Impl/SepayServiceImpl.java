package com.example.be.core.client.check_qr.service.Impl;

import com.example.be.core.client.check_qr.service.SepayService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;

@Service
@Data
public class SepayServiceImpl implements SepayService {
    private static final String BASE_URL = "https://my.sepay.vn/userapi/transactions/list";
//    private static final String TOKEN = "Bearer YYKQOCXAALKUWH1DD0BYZIBTI7HUSXRGEQEPMXPJS6ZT5ZF3OFSV68IE81RNJ2UQ"; // bảo mật ở đây
    @Value("${sepay.api.token}")
    private String token;
    public String getAuthorizationHeader() {
        return "Bearer " + token;
    }
    @Override
    public boolean fetchTransactions(String description, String transactionDateMin) throws IOException {
        String url = BASE_URL + "?transaction_date_min=" + URLEncoder.encode(transactionDateMin, StandardCharsets.UTF_8);
//        System.out.println(getAuthorizationHeader());
        HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();
        connection.setRequestMethod("GET");
        connection.setRequestProperty("Authorization", getAuthorizationHeader());
        connection.setRequestProperty("Content-Type", "application/json");

        int status = connection.getResponseCode();
        InputStream is = (status == 200) ? connection.getInputStream() : connection.getErrorStream();

//        try (BufferedReader reader = new BufferedReader(new InputStreamReader(is))) {
//            return reader.lines().collect(Collectors.joining());
//        } finally {
//            connection.disconnect();
//        }
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(is))) {
            String json = reader.lines().collect(Collectors.joining());
            System.out.println("API response: " + json);
            System.out.println("Note cline gửi: "+description);
            // Parse JSON manually hoặc dùng Jackson
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(json);

//            for (JsonNode transaction : root) {
//                String content = transaction.path("transaction_content").asText();
//                System.out.println("Api sepay gửi  transaction_content"+content);
//                if (content.toLowerCase().contains(description.toLowerCase())) {
//                    return true; // Đã tìm thấy giao dịch khớp với nội dung
//                }
//            }
            // Kiểm tra nếu transactions có trong response
            if (root.has("transactions")) {
                JsonNode transactions = root.get("transactions");

                for (JsonNode transaction : transactions) {
                    String content = transaction.path("transaction_content").asText();
                    System.out.println("API sepay gửi transaction_content: " + content);

                    // So sánh nội dung transaction_content với description
                    if (content.toLowerCase().contains(description.toLowerCase())) {
                        return true; // Đã tìm thấy giao dịch khớp với nội dung
                    }
                }
            }
        } finally {
            connection.disconnect();
        }
        return false;
    }
}
