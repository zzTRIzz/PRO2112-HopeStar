package com.example.be.core.admin.banhang.mapper;

import com.example.be.core.admin.banhang.dto.CartDetailDto;
import com.example.be.entity.CartDetail;
import com.example.be.entity.ProductDetail;
import com.example.be.entity.ShoppingCart;
import com.example.be.repository.ProductDetailRepository;
import com.example.be.repository.ShoppingCartRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
@AllArgsConstructor
public class CartDetailMapper {

    @Autowired
    ShoppingCartRepository shoppingCartRepository;

    @Autowired
    ProductDetailRepository productDetailRepository;

  public CartDetailDto mapperCartDetailDto(CartDetail cartDetail){
      return new CartDetailDto(
        cartDetail.getId(),
        cartDetail.getQuantity(),
        cartDetail.getIdProductDetail().getId(),
        cartDetail.getIdShoppingCart().getId(),
        cartDetail.getStatus()
      );
  };


  public CartDetail entityCartDetail(CartDetailDto cartDetailDto){

      ProductDetail productDetail = productDetailRepository.findById(cartDetailDto.getIdProductDetail())
              .orElseThrow(()->new RuntimeException("Không tìm thấy sản phẩm chi tiết "));
      ShoppingCart shoppingCart = shoppingCartRepository.findById(cartDetailDto.getIdShoppingCart())
              .orElseThrow(()->new RuntimeException("Không tìm thấy giỏ hàng "));


      return new CartDetail(
              cartDetailDto.getId(),
              cartDetailDto.getQuantity(),
              productDetail,
              shoppingCart,
              cartDetailDto.getStatus()
      );
  };



}
