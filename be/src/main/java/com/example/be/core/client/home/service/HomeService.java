package com.example.be.core.client.home.service;

import com.example.be.core.client.home.dto.response.ProductDetailViewResponse;
import com.example.be.core.client.home.dto.response.ProductViewResponseAll;


public interface HomeService {

    ProductViewResponseAll getProductView();

    ProductDetailViewResponse getProductDetailView(Integer idProduct) throws Exception;

}
