package com.example.be.core.admin.sale.mapper;

import com.example.be.core.admin.sale.dto.model.SaleDTO;
import com.example.be.core.admin.sale.dto.request.SaleRequest;
import com.example.be.core.admin.sale.dto.response.SaleResponse;
import com.example.be.entity.Sale;
import org.springframework.stereotype.Component;

@Component
public class SaleMapper {

    public SaleDTO toDTO(Sale sale) {
        return new SaleDTO(
                sale.getId(),
                sale.getCode(),
                sale.getName(),
                sale.getDateStart(),
                sale.getDateEnd(),
                sale.getDescription(),
                sale.getDiscountValue(),
                sale.getDiscountType()
        );
    }

    public Sale toEntity(SaleRequest request) {
        Sale sale = new Sale();
        sale.setCode(request.getCode());
        sale.setName(request.getName());
        sale.setDateStart(request.getDateStart());
        sale.setDateEnd(request.getDateEnd());
        sale.setDescription(request.getDescription());
        sale.setDiscountValue(request.getDiscountValue());
        sale.setDiscountType(request.getDiscountType());
        return sale;
    }

    public SaleResponse toResponse(Sale sale) {
        SaleResponse response = new SaleResponse();
        response.setId(sale.getId());
        response.setCode(sale.getCode());
        response.setName(sale.getName());
        response.setDateStart(sale.getDateStart());
        response.setDateEnd(sale.getDateEnd());
        response.setStatus(sale.getStatus());
        response.setDescription(sale.getDescription());
        response.setDiscountValue(sale.getDiscountValue());
        response.setDiscountType(sale.getDiscountType());
        return response;
    }
}
