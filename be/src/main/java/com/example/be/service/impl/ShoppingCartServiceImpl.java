package com.example.be.service.impl;

import com.example.be.entity.Account;
import com.example.be.entity.ShoppingCart;
import com.example.be.repository.AccountRepository;
import com.example.be.repository.ShoppingCartRepository;
import com.example.be.service.ShoppingCartService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShoppingCartServiceImpl implements ShoppingCartService {

    @Autowired
    AccountRepository accountRepository;

    @Autowired
    ShoppingCartRepository shoppingCartRepository;


    @Override
    public List<ShoppingCart> getAllGioHang(){
        return shoppingCartRepository.findAll();
    }
    @Override
    public List<ShoppingCart> getByIDShoppingCart(Integer idAccount){
        return shoppingCartRepository.findByIdShoppingCart(idAccount);
    }

     @Override
    public ShoppingCart CreateGioHang(ShoppingCart shoppingCart){
         Account account = accountRepository.findById(shoppingCart.getIdAccount().getId())
                 .orElseThrow(()-> new RuntimeException("Khong tim thay account"));

        shoppingCart.setCode("GH0" +shoppingCartRepository.getNewCode());
        shoppingCart.setIdAccount(account);
        shoppingCart.setStatus("CHO_THANH_TOAN");
        ShoppingCart shoppingCart1 = shoppingCartRepository.save(shoppingCart);
    return shoppingCart1;
    }




}
