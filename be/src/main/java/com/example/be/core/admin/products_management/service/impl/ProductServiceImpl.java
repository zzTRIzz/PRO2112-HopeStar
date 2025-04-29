package com.example.be.core.admin.products_management.service.impl;


import com.example.be.core.admin.products_management.dto.model.ProductDTO;
import com.example.be.core.admin.products_management.dto.request.ProductRequest;
import com.example.be.core.admin.products_management.dto.request.SearchProductRequest;
import com.example.be.entity.*;
import com.example.be.core.admin.products_management.mapper.ProductMapper;
import com.example.be.entity.status.ProductDetailStatus;
import com.example.be.entity.status.StatusCommon;
import com.example.be.entity.status.StatusImei;
import com.example.be.repository.*;

import com.example.be.core.admin.products_management.dto.response.ProductResponse;
import com.example.be.core.admin.products_management.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductMapper productMapper;
    private final ProductRepository productRepository;


    @Override
    public List<ProductResponse> getAll() {
        List<Product> products = productRepository.findAll();
        List<ProductDTO> dtoList = new ArrayList<>();

        for (Product product:products) {
            int totalVersion = product.getProductDetails().size();
            int totalNumber =0;
            for (ProductDetail productDetail: product.getProductDetails()) {
                totalNumber +=productDetail.getInventoryQuantity();
            }
            ProductDTO productDTO = productMapper.entityToDTO(product);
            productDTO.setTotalVersion(totalVersion);
            productDTO.setTotalNumber(totalNumber);
            dtoList.add(productDTO);
        }

        List<ProductResponse> responseList = new ArrayList<>();

        for (ProductDTO productDTO:dtoList) {
            ProductResponse productResponse = productMapper.dtoToResponse(productDTO);
            responseList.add(productResponse);
        }
        return responseList.stream()
                .sorted((p1, p2) -> Long.compare(p2.getId(), p1.getId())) // Sắp xếp giảm dần
                .collect(Collectors.toList());
    }


    @Override
    public Product getProductById(Integer id) throws Exception {

        Product product = productRepository.findById(id).orElseThrow(()->
                new Exception("product not found with id: "+id));
        return product;
    }

    @Override
    public void update(ProductRequest productRequest, Integer id) throws Exception {
        Product product = getProductById(id);
        if (product !=null){
            ProductDTO productDTO = productMapper.requestToDTO(productRequest);
            productDTO.setId(product.getId());
            productDTO.setStatus(product.getStatus());
            productDTO.setCode(product.getCode());

            Product updatedProduct = productMapper.dtoToEntity(productDTO);
            updatedProduct.setId(product.getId());  // Đảm bảo ID không bị mất

            productRepository.save(updatedProduct);
        }

    }

    @Override
    public void updateStatus(Integer id) throws Exception {
        Product product = getProductById(id);
        if (product != null){
            if (product.getStatus().equals(StatusCommon.ACTIVE)){
                product.setStatus(StatusCommon.IN_ACTIVE);

                for (ProductDetail productDetail:product.getProductDetails()) {
                    if (productDetail.getStatus().equals(ProductDetailStatus.ACTIVE)){
                        productDetail.setStatus(ProductDetailStatus.IN_ACTIVE);
                        for (Imei imei: productDetail.getImeis()) {
                            if (imei.getStatus().equals(StatusImei.NOT_SOLD)){
                                imei.setStatus(StatusImei.IN_ACTIVE);
                            }
                        }
                    }
                }
            }else {
                product.setStatus(StatusCommon.ACTIVE);

                for (ProductDetail productDetail:product.getProductDetails()) {
                    if (productDetail.getStatus().equals(ProductDetailStatus.IN_ACTIVE)){
                        productDetail.setStatus(ProductDetailStatus.ACTIVE);
                        for (Imei imei: productDetail.getImeis()) {
                            if (imei.getStatus().equals(StatusImei.IN_ACTIVE)){
                                imei.setStatus(StatusImei.NOT_SOLD);
                            }
                        }
                    }
                }

            }

            productRepository.save(product);
        }
    }

    @Override
    public List<ProductResponse> searchProducts(SearchProductRequest searchRequest) {
        List<Product> allMatchingProducts = productRepository.findAllMatching(searchRequest);

        List<ProductDTO> dtoList = new ArrayList<>();

        for (Product product:allMatchingProducts) {
            int totalVersion = product.getProductDetails().size();
            int totalNumber =0;
            for (ProductDetail productDetail: product.getProductDetails()) {
                totalNumber +=productDetail.getInventoryQuantity();
            }
            ProductDTO productDTO = productMapper.entityToDTO(product);
            productDTO.setTotalVersion(totalVersion);
            productDTO.setTotalNumber(totalNumber);
            dtoList.add(productDTO);
        }

        List<ProductResponse> responseList = new ArrayList<>();

        for (ProductDTO productDTO:dtoList) {
            ProductResponse productResponse = productMapper.dtoToResponse(productDTO);
            responseList.add(productResponse);
        }

        return responseList.stream()
                .sorted((p1, p2) -> Long.compare(p2.getId(), p1.getId())) // Sắp xếp giảm dần
                .collect(Collectors.toList());
    }


}
