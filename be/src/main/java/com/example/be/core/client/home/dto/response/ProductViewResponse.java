package com.example.be.core.client.home.dto.response;


import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductViewResponse {

    private Integer idProduct;
    private String name;
    private Integer idProductDetail;
    private String image;
    private List<Integer> ram;
    private List<Integer> rom;
    private BigDecimal price;
    private BigDecimal priceSeller;
    private List<String> hex;

}
