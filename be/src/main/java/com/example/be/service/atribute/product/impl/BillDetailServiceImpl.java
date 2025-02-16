package com.example.be.service.atribute.product.impl;

import com.example.be.dto.BillDetailDto;
import com.example.be.entity.Bill;
import com.example.be.entity.BillDetail;
import com.example.be.entity.ProductDetail;
import com.example.be.mapper.BillDetailMapper;
import com.example.be.repository.BillDetailRepository;
import com.example.be.repository.BillRepository;
import com.example.be.repository.ProductDetailRepository;
import com.example.be.service.atribute.product.BillDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BillDetailServiceImpl implements BillDetailService {

    @Autowired
    BillDetailRepository billDetailRepository;

    @Autowired
    BillDetailMapper billDetailMapper;

    @Autowired
    ProductDetailRepository productDetailRepository;

    @Autowired
    BillRepository billRepository;


    @Override
    public List<BillDetailDto> getAllBillDetail(){

        List<BillDetail> billDetails= billDetailRepository.findAll();
        return billDetails.stream().map(billDetailMapper ::dtoBillDetailMapper)
                .collect(Collectors.toList());
    }

    @Override
    public BillDetailDto createBillDetail(BillDetailDto billDetailDto){
        try {
            ProductDetail productDetail = productDetailRepository.findById(billDetailDto.getIdProductDetail())
                    .orElseThrow(()->new RuntimeException("Khong tim thay chi tiết sản phẩm "+billDetailDto.getIdProductDetail()));
            Bill bill = billRepository.findById(billDetailDto.getIdBill())
                    .orElseThrow(()->new RuntimeException("Khong tim thay hóa đơn "+billDetailDto.getIdBill()));
            BillDetail billDetail = billDetailMapper.entityBillDetailMapper(billDetailDto,productDetail,bill);
           BillDetail saveBillDetail= billDetailRepository.save(billDetail);
           return billDetailMapper.dtoBillDetailMapper(saveBillDetail);
        }catch (Exception e){
            e.printStackTrace();
            System.out.println(e);
        }
        return null;
    }

    @Override
    public List<BillDetailDto> getByIdBill(Integer idBill){
        List<BillDetailDto> newBillDetails = new ArrayList<>();
        for (BillDetail billDetail: billDetailRepository.findAll()) {
            if (billDetail.getIdBill().getId().equals(idBill)){
                BillDetailDto billDetailDto = billDetailMapper.dtoBillDetailMapper(billDetail);
                newBillDetails.add(billDetailDto);
            }
        }
        return newBillDetails;
    }

    @Override
    public BigDecimal tongTienBill(Integer idBill) {
        BigDecimal tongTien = BigDecimal.ZERO; // Khởi tạo đúng cách là zero
        for (BillDetail billDetail : billDetailRepository.findAll()) {
            if (billDetail.getIdBill().getId().equals(idBill)) {
                tongTien = tongTien.add(
                        billDetail.getPrice().multiply(BigDecimal.valueOf(billDetail.getQuantity()))
                );
            }
        }
        return tongTien;
    }

}
