package com.example.be.core.client.cart.service.impl;

import com.example.be.core.client.cart.dto.request.AddToCartRequest;
import com.example.be.core.client.cart.dto.response.CartDetailResponse;
import com.example.be.core.client.cart.dto.response.CartResponse;
import com.example.be.core.client.cart.service.CartService;
import com.example.be.entity.Account;
import com.example.be.entity.CartDetail;
import com.example.be.entity.ProductDetail;
import com.example.be.entity.ShoppingCart;
import com.example.be.entity.status.StatusCartDetail;
import com.example.be.repository.CartDetailRepository;
import com.example.be.repository.ProductDetailRepository;
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
    private final ProductDetailRepository productDetailRepository;

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

    @Override
    public Object addToCart(AddToCartRequest request, Account account) throws Exception {

        ShoppingCart cart = shoppingCartRepository.findShoppingCartByIdAccount(account);

        ProductDetail productDetail = productDetailRepository.findById(request.getIdProductDetail())
                .orElseThrow(() -> new RuntimeException("Product detail not found"));

        // Check if product already exists in cart
        CartDetail existingItem = cartDetailRepository
                .findCartDetailByIdShoppingCartAndStatusAndAndIdProductDetail(cart, StatusCartDetail.pending, productDetail);

        if (existingItem != null) {

            if ((request.getQuantity()+existingItem.getQuantity())>productDetail.getInventoryQuantity()){
                throw new Exception("Sản phảm bạn thêm chỉ còn: "+productDetail.getInventoryQuantity()+" Giỏ hàng đã có: "+existingItem.getQuantity());
            }

            Integer sum = request.getQuantity() + existingItem.getQuantity();
            if (sum > 5){
                throw new Exception("Sản phảm thêm tối đa là 5. Giỏ hàng đã có: "+existingItem.getQuantity());
            }

            existingItem.setQuantity(existingItem.getQuantity() + 1);
            cartDetailRepository.save(existingItem);
        } else {
            CartDetail cartDetail = new CartDetail();
            cartDetail.setIdShoppingCart(cart);
            cartDetail.setIdProductDetail(productDetail);
            cartDetail.setQuantity(1);
            cartDetail.setStatus(StatusCartDetail.pending);
            cartDetailRepository.save(cartDetail);
        }

        return "Product added to cart successfully";
    }
}
