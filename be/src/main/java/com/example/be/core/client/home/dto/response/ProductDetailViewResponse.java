package com.example.be.core.client.home.dto.response;

import lombok.Data;



import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
public class ProductDetailViewResponse {
    private Integer id;
    private String productName;
    private String productDescription;

    private ProductDetailInfo defaultProductDetail;

    // Danh sách các cặp RAM-ROM
    private List<String> imageUrls;

    // Danh sách các cặp RAM-ROM
    private List<RamRomOption> ramRomOptions;


    // Danh sách các tùy chọn màu sắc
    private List<ColorOption> colorOptions;

    // Map để lưu trữ thông tin chi tiết sản phẩm tương ứng với từng cặp RAM-ROM-Color
    private Map<String, ProductDetailInfo> productDetails;

    @Data
    public static class RamRomOption {
        private Integer ramId;
        private String ramSize;
        private Integer romId;
        private String romSize;
    }

    @Data
    public static class ColorOption {
        private Integer id;
        private String colorName;
        private String colorCode;
    }

    @Data
    public static class ProductDetailInfo {
        private Integer productDetailId;
        private BigDecimal price;
        private BigDecimal priceSell;
        private Integer inventoryQuantity;
        private String imageUrl;
        private RamRomOption ramRomOption;
        private ColorOption colorOption;
    }
}