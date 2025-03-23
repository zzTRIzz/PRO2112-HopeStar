package com.example.be.core.client.home.service;

import com.example.be.core.client.home.dto.response.ProductDetailViewResponse;
import com.example.be.core.client.home.dto.response.ProductViewResponse;

import java.util.List;

public interface HomeService {

    List<ProductViewResponse> getProductView();

    ProductDetailViewResponse getProductDetailView(Integer idProduct) throws Exception;

}
