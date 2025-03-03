package com.example.be.core.admin.banhang.service.impl;


import com.example.be.core.admin.banhang.dto.BillDetailDto;
import com.example.be.core.admin.banhang.mapper.BillDetailMapper;
import com.example.be.core.admin.banhang.service.BillDetailService;
import com.example.be.entity.Bill;
import com.example.be.entity.BillDetail;
import com.example.be.entity.ProductDetail;

import com.example.be.repository.BillDetailRepository;
import com.example.be.repository.BillRepository;
import com.example.be.repository.ProductDetailRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
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
    public List<BillDetail> getALlThuong(){


        return billDetailRepository.findAll();
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
    public void thayDoiSoLuongKhiCungSPVaHD(Integer idBill, Integer idProductDetail, Integer SoLuong){
        for (int i = 0; i < billDetailRepository.findAll().size(); i++) {
            if (billDetailRepository.findAll().get(i).getIdBill().equals(idBill) &&
            billDetailRepository.findAll().get(i).getIdProductDetail().equals(idProductDetail)){
                BillDetail billDetail = billDetailRepository.findAll().get(i);
                Integer tongSoLuong =SoLuong +billDetail.getQuantity();
                billDetail.setQuantity(tongSoLuong);
                billDetailRepository.save(billDetail);
                return;
            }
        }
    }


    @Override
    public List<BillDetailDto> getByIdBill(Integer idBill) {
        List<BillDetail> billDetails = billDetailRepository.findByIdBill(idBill);

        if (billDetails.isEmpty()) {
            throw new RuntimeException("Không tìm thấy chi tiết hóa đơn nào cho hóa đơn ID: " + idBill);
        }
        return billDetails.stream()
                .map(billDetailMapper::dtoBillDetailMapper)
                .collect(Collectors.toList());
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
