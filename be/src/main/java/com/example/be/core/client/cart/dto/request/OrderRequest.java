package com.example.be.core.client.cart.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class OrderRequest {

    private CustomerInfo customerInfo;
    private Location location;
    private Integer paymentMethod;
    @JsonProperty("eInvoice")
    private Boolean eInvoice;
    private List<Products> products;
    private BigDecimal totalPrice;
    private BigDecimal deliveryFee; //phi ship
    private Integer idVoucher;
    private BigDecimal discountedTotal; // gia giam vc
    private BigDecimal insuranceFee; // phi bao hanh
    private BigDecimal totalDue;

    @Data
    public static class CustomerInfo {
        private String email;
        private String name;
        private String phone;
    }

    @Data
    public static class Location {
        private String fullAddress;
    }

    @Data
    public static class Products {

        private Integer id; //id cart-detail;
        private BigDecimal priceSell;
        private Integer quantity;

    }

}
