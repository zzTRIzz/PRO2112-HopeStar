package com.example.be.core.client.home.controller;

import com.example.be.core.client.home.dto.request.PhoneFilterRequest;
import com.example.be.core.client.home.dto.response.ProductDetailViewResponse;
import com.example.be.core.client.home.dto.response.ProductViewResponse;
import com.example.be.core.client.home.dto.response.ProductViewResponseAll;
import com.example.be.core.client.home.service.HomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
public class HomeController {

    private final HomeService homeService;

    @GetMapping("/")
    public ProductViewResponseAll getProductView(){
        return homeService.getProductView();
    }

    @GetMapping("/{id}")
    public ProductDetailViewResponse getProductDetailView(@PathVariable Integer id) throws Exception {

        return homeService.getProductDetailView(id);

    }

    @GetMapping("/search")
    public List<ProductViewResponse> filterPhone(@ModelAttribute PhoneFilterRequest filterRequest){
        return homeService.phoneFilter(filterRequest);
    }

    @GetMapping("/related")
    public List<ProductViewResponse> getProductRelated(@RequestParam("id") Integer id) throws Exception {
        return homeService.getProductRelated(id);
    }
}
