package com.example.be.core.client.cart.service.impl;

import com.example.be.core.client.cart.dto.request.CartDetailRequest;
import com.example.be.core.client.cart.service.CartDetailService;
import com.example.be.entity.CartDetail;
import com.example.be.repository.CartDetailRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CartDetailService2Impl implements CartDetailService {

    private final CartDetailRepository cartDetailRepository;

    @Override
    public Object deleteCartDetail(Integer idCartDetail) throws Exception {

        cartDetailRepository.findById(idCartDetail).orElseThrow(()->
                new Exception("cart detail not found"));
        cartDetailRepository.deleteById(idCartDetail);

        return "delete cart detail successfully";
    }

    @Override
    public Object updateQuantityCartDetail(Integer idCartDetail, CartDetailRequest cartDetailRequest ) throws Exception {
        CartDetail cartDetail = cartDetailRepository.findById(idCartDetail).orElseThrow(()->
                new Exception("cart detail not found"));
        cartDetail.setQuantity(cartDetailRequest.getQuantity());
        cartDetailRepository.save(cartDetail);
        return "update cart detail successfully";
    }
}
