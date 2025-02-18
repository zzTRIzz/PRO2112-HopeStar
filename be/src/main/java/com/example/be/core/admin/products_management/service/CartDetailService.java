package com.example.be.service;

import com.example.be.entity.CartDetail;

import java.util.List;

public interface CartDetailService {
    List<CartDetail> getAllGHCT();

    List<CartDetail> getByIdGH(Integer idGH);

    CartDetail createGHCT(CartDetail cartDetail);

    CartDetail updateGHCT(CartDetail cartDetail);
}
