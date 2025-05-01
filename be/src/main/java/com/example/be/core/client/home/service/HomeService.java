package com.example.be.core.client.home.service;

import com.example.be.core.client.home.dto.request.PhoneFilterRequest;
import com.example.be.core.client.home.dto.response.ProductDetailViewResponse;
import com.example.be.core.client.home.dto.response.ProductViewResponse;
import com.example.be.core.client.home.dto.response.ProductViewResponseAll;

import java.util.List;


public interface HomeService {

    ProductViewResponseAll getProductView();

    ProductDetailViewResponse getProductDetailView(Integer idProduct) throws Exception;

    List<ProductViewResponse> phoneFilter(PhoneFilterRequest phoneFilterRequest);

    List<ProductViewResponse> getProductRelated(Integer id) throws Exception;

}
