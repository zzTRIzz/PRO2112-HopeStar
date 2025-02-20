package com.example.be.core.admin.banhang.service.impl;

import com.example.be.core.admin.banhang.dto.CartDetailDto;
import com.example.be.core.admin.banhang.mapper.CartDetailMapper;
import com.example.be.core.admin.banhang.service.CartDetailService;
import com.example.be.entity.CartDetail;
import com.example.be.repository.CartDetailRepository;
import com.example.be.repository.ProductDetailRepository;
import com.example.be.repository.ShoppingCartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartDetailServiceImpl implements CartDetailService {

    @Autowired
    ShoppingCartRepository shoppingCartRepository;

    @Autowired
    ProductDetailRepository productDetailRepository;

    @Autowired
    CartDetailMapper cartDetailMapper;

    @Autowired
    CartDetailRepository cartDetailRepository;

    @Override
    public List<CartDetail> getAll() {
        return cartDetailRepository.findAll();
    }

    @Override
    public List<CartDetailDto> getAllGHCT() {
        List<CartDetail> cartDetail = cartDetailRepository.findAll();
        return cartDetail.stream().map(cartDetailMapper::mapperCartDetailDto)
                .collect(Collectors.toList());
    }


    @Override
    public List<CartDetailDto> getByIdGH(Integer idGH) {
        List<CartDetail> cartDetail = cartDetailRepository.findByIdGH(idGH);
        return cartDetail.stream().map(cartDetailMapper::mapperCartDetailDto)
                .collect(Collectors.toList());
    }

    @Override
    public CartDetailDto createGHCT(CartDetailDto cartDetailDto) {
        CartDetail cartDetail = cartDetailMapper.entityCartDetail(cartDetailDto);
        CartDetail saveCartDetail = cartDetailRepository.save(cartDetail);
        return cartDetailMapper.mapperCartDetailDto(saveCartDetail);
    }


    @Override
    public CartDetailDto updateGHCT(CartDetailDto cartDetailDto) {
        CartDetail cartDetail = cartDetailMapper.entityCartDetail(cartDetailDto);
        CartDetail saveCartDetail = cartDetailRepository.save(cartDetail);
        return cartDetailMapper.mapperCartDetailDto(saveCartDetail);    }


}
