package com.example.be.core.chatbot.tool;

import com.example.be.entity.Product;
import com.example.be.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class MyAiTools {

    private final ProductRepository productRepository;

    @Tool(description = "Gợi ý sản phẩm dựa trên từ khóa tìm kiếm")
    public String suggestProducts(String keyword) {
        System.out.println("Đang tìm kiếm sản phẩm với từ khóa: " + keyword);
        List<Product> products = productRepository.findByNameContainingIgnoreCase(keyword);
        if (products.isEmpty()) {
            return "Không tìm thấy sản phẩm phù hợp với từ khóa: " + keyword;
        }
        return formatProductList(products);
    }

    // Định dạng danh sách sản phẩm
    private String formatProductList(List<Product> products) {
        return products.stream()
                .map(p -> String.format("Tên: %s, Giá: %.2f, Danh mục: %s", p.getName()))
                .collect(Collectors.joining("\n"));
    }
}