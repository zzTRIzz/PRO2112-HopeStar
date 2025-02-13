package com.example.be.service.atribute.product.impl;

import com.example.be.entity.BillDetail;
import com.example.be.repository.BillDetailRepository;
import com.example.be.service.atribute.product.BillDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BillDetailServiceImpl implements BillDetailService {

    @Autowired
    BillDetailRepository billDetailRepository;

    @Override
    public List<BillDetail> getAllBillDetail(){
        return billDetailRepository.findAll();
    }

    @Override
    public void createBillDetail(BillDetail billDetail){
        try {
            billDetailRepository.save(billDetail);
        }catch (Exception e){
            e.printStackTrace();
            System.out.println(e);
        }
    }

}
