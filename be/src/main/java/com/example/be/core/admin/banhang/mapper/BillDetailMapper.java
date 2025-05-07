//package com.example.be.core.admin.banhang.mapper;
//
//
//import com.example.be.core.admin.banhang.dto.BillDetailDto;
//import com.example.be.entity.Bill;
//import com.example.be.entity.BillDetail;
//import com.example.be.entity.ProductDetail;
//import lombok.AllArgsConstructor;
//import org.springframework.stereotype.Repository;
//
//@Repository
//@AllArgsConstructor
//public class BillDetailMapper {
//
//
//    public BillDetailDto dtoBillDetailMapper(BillDetail billDetail){
//        return new BillDetailDto(
//                billDetail.getId(),
//                billDetail.getPrice(),
//                billDetail.getQuantity(),
//                billDetail.getTotalPrice(),
//                billDetail.getIdProductDetail().getId(),
//                billDetail.getIdBill().getId(),
//                billDetail.getCreatedBy(),
//                billDetail.getUpdatedBy()
//        );
//    }
//
//    public BillDetail entityBillDetailMapper(BillDetailDto billDetailDto, ProductDetail productDetail, Bill bill){
//        return new BillDetail(
//                billDetailDto.getId(),
//                billDetailDto.getPrice(),
//                billDetailDto.getQuantity(),
//                billDetailDto.getTotalPrice(),
//                productDetail,
//                bill,
//                billDetailDto.getCreatedBy(),
//                billDetailDto.getUpdatedBy()
//        );
//    }
//
//}
