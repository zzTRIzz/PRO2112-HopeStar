package com.example.be.request;

import lombok.Data;

import java.util.List;

@Data
public class ProductDetailRequest {
    private Integer idRam;
    private Integer idRom;
    private List<Integer> idColors;

}
