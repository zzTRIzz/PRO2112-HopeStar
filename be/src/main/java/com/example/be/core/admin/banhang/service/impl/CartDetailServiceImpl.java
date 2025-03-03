package com.example.be.core.admin.banhang.service.impl;

import com.example.be.core.admin.banhang.service.CartDetailService;
import com.example.be.entity.CartDetail;
import com.example.be.repository.CartDetailRepository;
import com.example.be.repository.ProductDetailRepository;
import com.example.be.repository.ShoppingCartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartDetailServiceImpl implements CartDetailService {

        @Autowired
        ShoppingCartRepository shoppingCartRepository;

        @Autowired
        ProductDetailRepository productDetailRepository;

        @Autowired
        CartDetailRepository cartDetailRepository;

        @Override
        public List<CartDetail> getAllGHCT(){
            return cartDetailRepository.findAll();
        }

        @Override
        public List<CartDetail> getByIdGH(Integer idGH){
                return cartDetailRepository.findByIdGH(idGH);
        }

        @Override
        public CartDetail createGHCT(CartDetail cartDetail){
            return cartDetailRepository.save(cartDetail);
        }
        @Override
        public CartDetail updateGHCT(CartDetail cartDetail){
            return cartDetailRepository.save(cartDetail);
        }









}
