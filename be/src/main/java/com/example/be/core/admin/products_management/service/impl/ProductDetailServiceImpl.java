package com.example.be.core.admin.products_management.service.impl;

import com.example.be.core.admin.products_management.mapper.ProductDetailMapper;
import com.example.be.core.admin.products_management.model.request.SearchProductDetailRequest;
import com.example.be.core.admin.products_management.model.response.ProductDetailResponse;
import com.example.be.core.admin.products_management.service.ProductDetailService;
import com.example.be.entity.ProductDetail;
import com.example.be.repository.ProductDetailRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class ProductDetailServiceImpl implements ProductDetailService {
    private final ProductDetailRepository productDetailRepository;
    private final ProductDetailMapper productDetailMapper;

    @Override
    public Page<ProductDetailResponse> searchProductDetails(SearchProductDetailRequest searchProductDetailRequest, int page, int size,Integer id) {
        List<ProductDetail> allMatchingProductDetails = productDetailRepository.findAllMatching(searchProductDetailRequest,id);

        if (allMatchingProductDetails.isEmpty()){
            return Page.empty();
        }

        int total = allMatchingProductDetails.size();
        int totalPages = (int) Math.ceil((double) total/size);

        // Nếu trang hiện tại không có dữ liệu, chuyển đến trang cuối cùng có dữ liệu
        if (page * size >= total) {
            page = totalPages - 1;
        }

        int start = Math.min(page * size, total);
        int end = Math.min(start + size, total);
        List<ProductDetail> pagedProductDetails = allMatchingProductDetails.subList(start, end);

        List<ProductDetailResponse> detailResponseList = pagedProductDetails.stream()
                .map(productDetail -> productDetailMapper.dtoToResponse(productDetailMapper.entityToDTO(productDetail)))
                .collect(Collectors.toList());
        return new PageImpl<>(detailResponseList, PageRequest.of(page,size),total);
    }
}
