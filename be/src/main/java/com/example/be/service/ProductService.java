package com.example.be.service;


import com.example.be.response.ProductResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {
    List<ProductResponse> getAll();
}
