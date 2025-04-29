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

import java.math.BigDecimal;
import java.util.List;

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

    @Override
    public Object checkCartDetail(List<Integer> idCartDetailList) throws Exception {
        BigDecimal total = BigDecimal.ZERO;
        BigDecimal MAX_LONG = new BigDecimal("50000000000");
        for (Integer idCartDetail: idCartDetailList) {
            CartDetail cartDetail = cartDetailRepository.findById(idCartDetail).orElseThrow(()->
                    new Exception("cart detail not found"));
            ProductDetail productDetail = productDetailRepository.findByIdAndStatus(cartDetail.getIdProductDetail().getId(), ProductDetailStatus.ACTIVE);
            if(productDetail == null) {
                throw new Exception("Sản phẩm "+productDetail.getProduct().getName()+" (" + productDetail.getRam().getCapacity()+productDetail.getRam().getDescription()
                        +"/"+productDetail.getRom().getCapacity()+productDetail.getRom().getDescription()+" - "+
                        productDetail.getColor().getName()+" )"+" này hiện tại không hoạt động");
            }
            if (cartDetail.getQuantity()>productDetail.getInventoryQuantity()){
                throw new Exception("Sản phẩm "+productDetail.getProduct().getName()+" (" + productDetail.getRam().getCapacity()+productDetail.getRam().getDescription()
                        +"/"+productDetail.getRom().getCapacity()+productDetail.getRom().getDescription()+" - "+
                        productDetail.getColor().getName()+" )"+" chỉ còn: "+productDetail.getInventoryQuantity());
            }

            BigDecimal quantity = new BigDecimal(cartDetail.getQuantity());
            BigDecimal price = productDetail.getPriceSell();
            BigDecimal itemTotal = quantity.multiply(price);
            total = total.add(itemTotal);
        }
        BigDecimal vnpAmount = total.multiply(BigDecimal.valueOf(100));

        if (vnpAmount.compareTo(MAX_LONG) > 0) {
            throw new IllegalArgumentException("Tổng giá trị đơn hàng vượt quá giới hạn cho phép ");
        }
        return "Kiểm tra thành công";
    }
}
