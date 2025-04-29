package com.example.be.core.admin.sale.mapper;

import com.example.be.core.admin.sale.dto.response.ProductDetailsResponse;
import com.example.be.entity.ProductDetail;
import com.example.be.entity.Sale;
import com.example.be.entity.SaleDetail;
import com.example.be.entity.status.StatusSale;
import com.example.be.repository.SaleDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class ProductDetailsMapper {
    private final SaleDetailRepository saleDetailRepository;

    @Autowired
    public ProductDetailsMapper(SaleDetailRepository saleDetailRepository) {
        this.saleDetailRepository = saleDetailRepository;
    }

    public ProductDetailsResponse toResponse(ProductDetail productDetail) {
        ProductDetailsResponse response = new ProductDetailsResponse();

        // Map các trường cơ bản
        response.setId(productDetail.getId());
        response.setCode(productDetail.getCode());
        response.setPrice(productDetail.getPrice());
        response.setInventoryQuantity(productDetail.getInventoryQuantity());

        // Map các trường từ quan hệ
        mapRelationships(productDetail, response);

        // Xử lý logic giảm giá
        processSaleInfo(productDetail, response);

        return response;
    }

    private void mapRelationships(ProductDetail productDetail, ProductDetailsResponse response) {
        if (productDetail.getColor() != null) {
            response.setColorName(productDetail.getColor().getName());
        }
        if (productDetail.getRam() != null) {
            response.setRamSize(productDetail.getRam().getCapacity());
        }
        if (productDetail.getRom() != null) {
            response.setRomSize(productDetail.getRom().getCapacity());
        }
        if (productDetail.getProduct() != null) {
            response.setProductName(productDetail.getProduct().getName());
        }
    }

    private void processSaleInfo(ProductDetail productDetail, ProductDetailsResponse response) {
        Sale activeSale = getActiveSaleForProduct(productDetail);

        if (activeSale != null && activeSale.getDiscountValue() != null && activeSale.getDiscountType() != null) {
            // Set thông tin giảm giá
            response.setDiscountValue(activeSale.getDiscountValue());
            response.setDiscountType(activeSale.getDiscountType());

            // Tính toán giá bán
            response.setPriceSell(calculatePriceSell(
                    productDetail.getPrice(),
                    activeSale.getDiscountValue(),
                    activeSale.getDiscountType()
            ));
        } else {
            response.setPriceSell(null);
            response.setDiscountValue(null);
            response.setDiscountType(null);
        }
    }

    private Sale getActiveSaleForProduct(ProductDetail productDetail) {
        List<SaleDetail> saleDetails = saleDetailRepository.findByProductDetailIdWithSale(productDetail.getId());

        Sale bestSale = null;
        BigDecimal maxDiscount = BigDecimal.ZERO;

        for (SaleDetail sd : saleDetails) {
            Sale sale = sd.getSale();

            if (sale.getStatus() == StatusSale.ACTIVE) { // Chỉ xét Sale ACTIVE
                BigDecimal currentDiscount = calculateDiscountAmount(
                        productDetail.getPrice(),
                        sale.getDiscountValue(),
                        sale.getDiscountType()
                );

                if (currentDiscount.compareTo(maxDiscount) > 0) {
                    maxDiscount = currentDiscount;
                    bestSale = sale;
                }
            }
        }
        return bestSale;
    }

    private BigDecimal calculateDiscountAmount(BigDecimal originalPrice,
                                               Integer discountValue,
                                               Boolean discountType) {
        if (discountValue == null || discountType == null) {
            return BigDecimal.ZERO;
        }

        if (discountType) { // Giảm theo %
            return originalPrice.multiply(BigDecimal.valueOf(discountValue))
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        } else { // Giảm cố định
            return BigDecimal.valueOf(discountValue);
        }
    }

    // ProductDetailsMapper.java
    private boolean isSaleActive(Sale sale, LocalDateTime now) {
        return sale.getStatus() == StatusSale.ACTIVE;
    }

    private BigDecimal calculatePriceSell(BigDecimal originalPrice,
                                          Integer discountValue,
                                          Boolean discountType) {
        if (discountValue == null || discountType == null) {
            return originalPrice;
        }

        BigDecimal discountAmount = calculateDiscountAmount(originalPrice, discountValue, discountType);
        return originalPrice.subtract(discountAmount);
    }
}