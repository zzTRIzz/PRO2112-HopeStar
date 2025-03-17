package com.example.be.core.admin.banhang.service.impl;

import com.example.be.core.admin.banhang.dto.ShoppingCartDto;
import com.example.be.core.admin.banhang.mapper.ShoppingCartMapper;
import com.example.be.core.admin.banhang.service.ShoppingCartService;
import com.example.be.entity.ShoppingCart;
import com.example.be.repository.AccountRepository;
import com.example.be.repository.ShoppingCartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShoppingCartServiceImpl implements ShoppingCartService {

    @Autowired
    AccountRepository accountRepository;

    @Autowired
    ShoppingCartRepository shoppingCartRepository;

    @Autowired
    ShoppingCartMapper shoppingCartMapper;


    @Override
    public List<ShoppingCart> getAllGioHang() {
        return shoppingCartRepository.findAll();
    }

    @Override
    public List<ShoppingCartDto> getAllGHShoppingCart() {
        List<ShoppingCart> shoppingCarts= shoppingCartRepository.findAll();
        return shoppingCarts.stream().map(shoppingCartMapper ::mapperShoppingCartDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ShoppingCartDto> getAllGioHangEntity() {
        List<ShoppingCart> shoppingCarts = shoppingCartRepository.findAll();
        return shoppingCarts.stream().map(shoppingCartMapper ::mapperShoppingCartDto)
                .collect(Collectors.toList());

    }

    @Override
    public List<ShoppingCartDto> getByIDShoppingCart(Integer idAccount) {
        List<ShoppingCart> shoppingCarts = shoppingCartRepository.findByIdShoppingCart(idAccount);
        return shoppingCarts.stream().map(shoppingCartMapper ::mapperShoppingCartDto)
                .collect(Collectors.toList());

    }

    @Override
    public ShoppingCartDto CreateGioHang(ShoppingCartDto shoppingCartDto) {
        try {
            System.out.println(shoppingCartDto.getIdAccount());
            ShoppingCart shoppingCart = shoppingCartMapper.entityShoppingCart(shoppingCartDto);
            shoppingCart.setCode("GH0" + shoppingCartRepository.getNewCode());
            shoppingCart.setStatus("CHO_THANH_TOAN");
            ShoppingCart saveShoppingCart = shoppingCartRepository.save(shoppingCart);
            return shoppingCartMapper.mapperShoppingCartDto(saveShoppingCart);
        }catch (Exception e){
            e.printStackTrace();
        }
     return null;
    }




//    --------------------------------không cần dùng tài khoản -------------------------------

    @Override
    public ShoppingCart addGioHangKhongTk() {
        try {
            ShoppingCart shoppingCart = new ShoppingCart();
            shoppingCart.setIdAccount(null);
            shoppingCart.setCode("GH_KTK_0" + shoppingCartRepository.getNewCode());
            shoppingCart.setStatus("CHO_THANH_TOAN");
//            ShoppingCart saveShoppingCart =
            return shoppingCartRepository.save(shoppingCart);
        }catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }
}
