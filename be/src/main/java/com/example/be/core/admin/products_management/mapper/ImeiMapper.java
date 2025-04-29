package com.example.be.core.admin.products_management.mapper;


import com.example.be.core.admin.products_management.dto.model.ProductImeiDTO;
import com.example.be.core.admin.products_management.dto.request.ProductImeiRequest;
import com.example.be.core.admin.products_management.dto.response.ProductImeiResponse;
import com.example.be.entity.Imei;
import com.example.be.entity.status.StatusImei;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ImeiMapper {

    // Chuyển đổi từ ProductImeiRequest -> ProductImeiDTO
    public ProductImeiDTO requestToDTO(ProductImeiRequest request) {
        if (request == null) {
            return null;
        }

        ProductImeiDTO dto = new ProductImeiDTO();
        dto.setImeiCode(request.getImeiCode());
        dto.setStatusImei(StatusImei.NOT_SOLD);

        return dto;
    }

    // Chuyển đổi danh sách ProductImeiRequest -> danh sách ProductImeiDTO
    public List<ProductImeiDTO> requestListToDTOList(List<ProductImeiRequest> requests) {
        if (requests == null) {
            return null;
        }

        return requests.stream().map(this::requestToDTO).collect(Collectors.toList());
    }

    // Chuyển đổi từ ProductImeiDTO -> ProductImei Entity
    public Imei dtoToEntity(ProductImeiDTO dto) {
        if (dto == null) {
            return null;
        }

        Imei entity = new Imei();
        entity.setId(dto.getId());
        entity.setImeiCode(dto.getImeiCode());
        entity.setBarCode(dto.getBarCode());
        entity.setStatus(dto.getStatusImei());

        return entity;
    }

    // Chuyển đổi danh sách ProductImei Entity -> danh sách ProductImeiDTO
    public List<ProductImeiDTO> entityListToDTOList(List<Imei> entities) {
        if (entities == null) {
            return null;
        }

        return entities.stream().map(this::entityToDTO).collect(Collectors.toList());
    }

    // Chuyển đổi từ ProductImei Entity -> ProductImeiDTO
    public ProductImeiDTO entityToDTO(Imei entity) {
        if (entity == null) {
            return null;
        }

        ProductImeiDTO dto = new ProductImeiDTO();
        dto.setId(entity.getId());
        dto.setImeiCode(entity.getImeiCode());
        dto.setBarCode(entity.getBarCode());
        dto.setStatusImei(entity.getStatus());

        return dto;
    }

    // Chuyển đổi từ ProductImeiDTO -> ProductImeiResponse
    public ProductImeiResponse dtoToResponse(ProductImeiDTO dto) {
        if (dto == null) {
            return null;
        }

        ProductImeiResponse response = new ProductImeiResponse();
        response.setId(dto.getId());
        response.setCode(dto.getImeiCode());
        response.setBarCode(dto.getBarCode());
        response.setStatusImei(dto.getStatusImei());

        return response;
    }

    // Chuyển đổi danh sách ProductImeiDTO -> danh sách ProductImeiResponse
    public List<ProductImeiResponse> dtoListToResponseList(List<ProductImeiDTO> dtos) {
        if (dtos == null) {
            return null;
        }

        return dtos.stream().map(this::dtoToResponse).collect(Collectors.toList());
    }
}
