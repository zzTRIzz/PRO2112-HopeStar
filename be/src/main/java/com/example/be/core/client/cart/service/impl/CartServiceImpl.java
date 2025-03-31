package com.example.be.core.client.cart.service.impl;

import com.example.be.core.client.cart.dto.response.CartDetailResponse;
import com.example.be.core.client.cart.dto.response.CartResponse;
import com.example.be.core.client.cart.service.CartService;
import com.example.be.entity.Account;
import com.example.be.entity.CartDetail;
import com.example.be.entity.ShoppingCart;
import com.example.be.entity.status.StatusCartDetail;
import com.example.be.repository.CardRepository;
import com.example.be.repository.CartDetailRepository;
import com.example.be.repository.ShoppingCartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class CartServiceImpl implements CartService {

    private final ShoppingCartRepository shoppingCartRepository;
    private final CartDetailRepository cartDetailRepository;

    @Override
    public CartResponse getCart(Account account) {
        ShoppingCart cart = shoppingCartRepository.findShoppingCartByIdAccount(account);
        List<CartDetail> cartDetailList = cartDetailRepository.findCartDetailByIdShoppingCartAndStatus(cart, StatusCartDetail.pending);

        CartResponse cartResponse = new CartResponse();
        List<CartDetailResponse> cartDetailResponseList = new ArrayList<>();
        int quantityCartDetail = 0;
        for (CartDetail cartDetail: cartDetailList) {
            quantityCartDetail ++;
            CartDetailResponse cartDetailResponse = new CartDetailResponse();
            cartDetailResponse.setId(cartDetail.getId());
            cartDetailResponse.setQuantity(cartDetail.getQuantity());
            cartDetailResponse.setProductName(cartDetail.getIdProductDetail().getProduct().getName());
            cartDetailResponse.setColor(cartDetail.getIdProductDetail().getColor().getName());
            cartDetailResponse.setRam(cartDetail.getIdProductDetail().getRam().getCapacity()+cartDetail.getIdProductDetail().getRam().getDescription());
            cartDetailResponse.setRom(cartDetail.getIdProductDetail().getRom().getCapacity()+cartDetail.getIdProductDetail().getRom().getDescription());
            cartDetailResponse.setPrice(cartDetail.getIdProductDetail().getPrice());
            cartDetailResponse.setPriceSell(cartDetail.getIdProductDetail().getPriceSell());
            cartDetailResponse.setImage(cartDetail.getIdProductDetail().getImageUrl());
            cartDetailResponseList.add(cartDetailResponse);
        }
        cartResponse.setQuantityCartDetail(quantityCartDetail);
        cartResponse.setCartDetailResponseList(cartDetailResponseList);
        return cartResponse;
    }
}
