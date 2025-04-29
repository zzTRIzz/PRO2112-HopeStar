package com.example.be.repository;

import com.example.be.entity.CartDetail;
import com.example.be.entity.ProductDetail;
import com.example.be.entity.ShoppingCart;
import com.example.be.entity.status.StatusCartDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CartDetailRepository extends JpaRepository<CartDetail, Integer> {

    List<CartDetail> findCartDetailByIdShoppingCartAndStatus(ShoppingCart shoppingCart,StatusCartDetail statusCartDetail);

    CartDetail findCartDetailByIdShoppingCartAndStatusAndAndIdProductDetail(ShoppingCart shoppingCart, StatusCartDetail statusCartDetail, ProductDetail productDetail);

    void deleteCartDetailByIdShoppingCart(ShoppingCart shoppingCart);

}
