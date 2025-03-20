package com.example.be.core.admin.products_management.service.impl;

import com.example.be.core.admin.products_management.mapper.ProductDetailMapper;
import com.example.be.core.admin.products_management.dto.request.SearchProductDetailRequest;
import com.example.be.core.admin.products_management.dto.response.ProductDetailResponse;
import com.example.be.core.admin.products_management.service.ProductDetailService;
import com.example.be.entity.Imei;
import com.example.be.entity.ProductDetail;
import com.example.be.entity.Voucher;
import com.example.be.entity.status.ProductDetailStatus;
import com.example.be.entity.status.StatusImei;
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
    public void updateStatus(Integer id) throws Exception {
        ProductDetail productDetail = productDetailRepository.findById(id).orElseThrow(()->
                new Exception("product-detail not found with id: "+id));
        if (productDetail != null){
            if (productDetail.getStatus().equals(ProductDetailStatus.ACTIVE)){
                productDetail.setStatus(ProductDetailStatus.IN_ACTIVE);
                for (Imei imei: productDetail.getImeis()) {
                    if (imei.getStatus().equals(StatusImei.NOT_SOLD)){
                        imei.setStatus(StatusImei.IN_ACTIVE);
                    }
                }
            }else if (productDetail.getStatus().equals(ProductDetailStatus.IN_ACTIVE)){
                productDetail.setStatus(ProductDetailStatus.ACTIVE);
                for (Imei imei: productDetail.getImeis()) {
                    if (imei.getStatus().equals(StatusImei.IN_ACTIVE)){
                        imei.setStatus(StatusImei.NOT_SOLD);
                    }
                }
            }
        }
        productDetailRepository.save(productDetail);
    }

    @Override
    public List<ProductDetailResponse> searchProductDetails(SearchProductDetailRequest searchProductDetailRequest, Integer id) {
        List<ProductDetail> allMatchingProductDetails = productDetailRepository.findAllMatching(searchProductDetailRequest,id);

        List<ProductDetailResponse> detailResponseList = allMatchingProductDetails .stream()
                .map(productDetail -> productDetailMapper.dtoToResponse(productDetailMapper.entityToDTO(productDetail)))
                .collect(Collectors.toList());
        return detailResponseList;
    }

    @Override
    public void updateSoLuongProductDetail(Integer idProductDetail, Integer quantity){
       ProductDetail productDetail = productDetailRepository.findById(idProductDetail)
               .orElseThrow(()->new RuntimeException("Khong tim thay product detail"));
        Integer soLuongConLai = productDetail.getInventoryQuantity() - quantity;
        productDetail.setInventoryQuantity(soLuongConLai);
        productDetailRepository.save(productDetail);
    }

    @Override
    public void updateStatusProduct(Integer idProductDetail){
        ProductDetail productDetail = productDetailRepository.findById(idProductDetail)
                .orElseThrow(()->new RuntimeException("Khong tim thay product detail"));
        if (productDetail.getInventoryQuantity() <= 0){
            productDetail.setStatus(ProductDetailStatus.DESIST);
            productDetailRepository.save(productDetail);
        }else {
            productDetail.setStatus(ProductDetailStatus.ACTIVE);
            productDetailRepository.save(productDetail);
        }
    }

    @Override
    public void updateSoLuongSanPham(Integer idProductDetail, Integer quantity){
        ProductDetail productDetail = productDetailRepository.findById(idProductDetail)
                .orElseThrow(()->new RuntimeException("Khong tim thay product detail"));
        productDetail.setInventoryQuantity(productDetail.getInventoryQuantity()+quantity);
        productDetailRepository.save(productDetail);
    }

}
