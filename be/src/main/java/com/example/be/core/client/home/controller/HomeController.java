package com.example.be.core.client.home.controller;

import com.example.be.core.client.home.dto.response.ProductDetailViewResponse;
import com.example.be.core.client.home.dto.response.ProductViewResponse;
import com.example.be.core.client.home.service.HomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
public class HomeController {

    private final HomeService homeService;

    @GetMapping("/")
    public List<ProductViewResponse> getProductView(){
        return homeService.getProductView();
    }

    @GetMapping("/{id}")
    public ProductDetailViewResponse getProductDetailView(@PathVariable Integer id) throws Exception {

        return homeService.getProductDetailView(id);

    }
}
