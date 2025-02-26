//package com.example.be.core.admin.banhang.mapper;
//
//import com.example.be.core.admin.banhang.dto.ImeiSoldDto;
//import com.example.be.entity.BillDetail;
//import com.example.be.entity.Imei;
//import com.example.be.entity.ImeiSold;
//import com.example.be.repository.BillDetailRepository;
//import com.example.be.repository.ImeiRepository;
//import lombok.AllArgsConstructor;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Repository;
//
//@Repository
//@AllArgsConstructor
//public class ImeiSoldMapper {
//
//    @Autowired
//    ImeiRepository imeiRepository;
//
//    @Autowired
//    BillDetailRepository billDetailRepository;
//
//    public ImeiSoldDto mapperImeiSoldDto(ImeiSold imeiSold) {
//        return new ImeiSoldDto(
//                imeiSold.getId_Imei().getId(),
//                imeiSold.getIdBillDetail().getId()
//        );
//    }
//
//    public ImeiSold entityImeiSold(ImeiSoldDto imeiSoldDto) {
//        Imei imei = imeiRepository.findById(imeiSoldDto.getId_Imei()).
//                orElseThrow(()->new RuntimeException("Khong tim thay imei"));
//        BillDetail billDetail = billDetailRepository.findById(imeiSoldDto.getIdBillDetail()).
//                orElseThrow(()->new RuntimeException("Khong tim thay imei"));
//        return new ImeiSold(
//                imei,
//                billDetail
//        );
//    }
//
//}
