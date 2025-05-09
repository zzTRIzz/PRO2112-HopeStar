package com.example.be.core.admin.banhang.mapper;

import com.example.be.core.admin.banhang.dto.BillDetailDto;
import com.example.be.core.admin.banhang.dto.SearchBillDetailDto;
import com.example.be.entity.Bill;
import com.example.be.entity.BillDetail;
import com.example.be.entity.ProductDetail;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@AllArgsConstructor
public class SearchBillDetailMapper {


    public SearchBillDetailDto dtoBillDetailMapper(BillDetail billDetail){
        return new SearchBillDetailDto(
                billDetail.getId(),
                billDetail.getPrice(),
                billDetail.getQuantity(),
                billDetail.getTotalPrice(),
                billDetail.getIdProductDetail().getId(),
                billDetail.getIdProductDetail().getProduct().getName(),
                billDetail.getIdProductDetail().getRam().getCapacity(),
                billDetail.getIdProductDetail().getRom().getCapacity(),
                billDetail.getIdProductDetail().getRom().getDescription(),
                billDetail.getIdProductDetail().getColor().getName(),
                billDetail.getIdProductDetail().getImageUrl(),
                billDetail.getIdBill().getId()
        );
    }

}
