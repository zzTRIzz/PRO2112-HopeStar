package com.example.be.core.admin.products_management.service;

import com.example.be.core.admin.products_management.dto.request.ProductDetailRequest;
import com.example.be.core.admin.products_management.dto.request.ProductImeiRequest;
import com.example.be.core.admin.products_management.dto.request.SearchProductDetailRequest;
import com.example.be.core.admin.products_management.dto.response.ProductDetailResponse;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ProductDetailService {
    void updateStatus(Integer id) throws Exception;
    List<ProductDetailResponse> searchProductDetails(SearchProductDetailRequest searchProductDetailRequest, Integer id);

    void updateProductDetail(Integer idProductDetail, ProductDetailRequest productDetailRequest) throws Exception;

    void addQuantityProductDetail(Integer idProductDetail, List<ProductImeiRequest> listImeiRequest) throws Exception;

//    void updateSoLuongProductDetail(Integer idProductDetail, Integer quantity);

//    void updateStatusProduct(Integer idProductDetail);

    //    @Override
//    public void updateSoLuongProductDetail(Integer idProductDetail, Integer quantity){
//       ProductDetail productDetail = productDetailRepository.findById(idProductDetail)
//               .orElseThrow(()->new RuntimeException("Khong tim thay product detail"));
//        Integer soLuongConLai = productDetail.getInventoryQuantity() - quantity;
//        productDetail.setInventoryQuantity(soLuongConLai);
//        productDetailRepository.save(productDetail);
//    }
//
//    @Override
//    public void updateStatusProduct(Integer idProductDetail){
//            ProductDetail productDetail = productDetailRepository.findById(idProductDetail)
//                    .orElseThrow(()->new RuntimeException("Khong tim thay product detail"));
//            if (productDetail.getInventoryQuantity() <= 0){
//                productDetail.setStatus(ProductDetailStatus.DESIST);
//                productDetailRepository.save(productDetail);
//            }else {
//                productDetail.setStatus(ProductDetailStatus.ACTIVE);
//                productDetailRepository.save(productDetail);
//            }
//    }
    void capNhatSoLuongVaTrangThaiProductDetail(Integer idProductDetail, Integer quantityDaBan);

    void updateSoLuongSanPham(Integer idProductDetail, Integer quantity);

    void importFileExcelProductDetail(Integer idProduct, MultipartFile file) throws Exception;

}
