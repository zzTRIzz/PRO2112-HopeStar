package com.example.be.core.admin.banhang.mapper;

import com.example.be.core.admin.banhang.dto.ShoppingCartDto;
import com.example.be.entity.Account;
import com.example.be.entity.ShoppingCart;
import com.example.be.repository.AccountRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
@AllArgsConstructor
public class CartKhongTKMapper {

    @Autowired
    AccountRepository accountRepository;

    public ShoppingCartDto mapperShoppingCartDto(ShoppingCart shoppingCart) {
        return new ShoppingCartDto(
                shoppingCart.getId(),
                null,
                shoppingCart.getCode(),
                shoppingCart.getStatus()
        );
    }


    public ShoppingCart entityShoppingCart(ShoppingCartDto shoppingCartDto) {
//        System.out.println(shoppingCartDto.getIdAccount());
        Account account = accountRepository.findById(shoppingCartDto.getIdAccount())
                .orElseThrow(()->new RuntimeException("Không tìm thấy khách hàng "));
        return new ShoppingCart(
                shoppingCartDto.getId(),
                null,
                shoppingCartDto.getCode(),
                shoppingCartDto.getStatus()
        );
    }
}
