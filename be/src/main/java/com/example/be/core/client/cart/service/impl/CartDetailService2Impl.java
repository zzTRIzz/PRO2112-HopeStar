package com.example.be.core.client.cart.service.impl;

import com.example.be.core.client.cart.dto.request.CartDetailRequest;
import com.example.be.core.client.cart.service.CartDetailService;
import com.example.be.entity.CartDetail;
import com.example.be.entity.ProductDetail;
import com.example.be.entity.status.ProductDetailStatus;
import com.example.be.repository.CartDetailRepository;
import com.example.be.repository.ProductDetailRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CartDetailService2Impl implements CartDetailService {

    private final CartDetailRepository cartDetailRepository;
    private final ProductDetailRepository productDetailRepository;

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
        ProductDetail productDetail = productDetailRepository.findByIdAndStatus(cartDetail.getIdProductDetail().getId(), ProductDetailStatus.ACTIVE);
        if(productDetail == null) {
            throw new Exception("Sản phẩm này hiện tại không hoạt động");
        }
        if (cartDetailRequest.getQuantity()>productDetail.getInventoryQuantity()){
            throw new Exception("Sản phẩm bạn thêm chỉ còn: "+productDetail.getInventoryQuantity());
        }
        if (cartDetailRequest.getQuantity()>5){
            throw new Exception("Sản phẩm bạn mua tối đa là 5. Nếu bạn mua số lượng lớn hãy liên hệ với chúng tôi!");
        }
        cartDetail.setQuantity(cartDetailRequest.getQuantity());
        cartDetailRepository.save(cartDetail);
        return "update cart detail successfully";
    }
}
