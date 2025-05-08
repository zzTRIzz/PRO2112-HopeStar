package com.example.be.core.admin.products_management.mapper;

import com.example.be.core.admin.products_management.dto.model.ProductDetailDTO;
import com.example.be.core.admin.products_management.dto.request.ProductDetailRequest;
import com.example.be.core.admin.products_management.dto.response.ProductDetailResponse;
import com.example.be.entity.ProductDetail;
import com.example.be.entity.status.ProductDetailStatus;
import com.example.be.repository.ColorRepository;
import com.example.be.repository.ImeiRepository;
import com.example.be.repository.RamRepository;
import com.example.be.repository.RomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ProductDetailMapper {

    @Autowired
    private ColorRepository colorRepository;

    @Autowired
    private RamRepository ramRepository;

    @Autowired
    private RomRepository romRepository;

    @Autowired
    private ImeiMapper imeiMapper;

    @Autowired
    private ImeiRepository imeiRepository;

    // Chuyển đổi từ ProductDetailRequest -> ProductDetailDTO
    public ProductDetailDTO requestToDTO(ProductDetailRequest request) {
        if (request == null) {
            return null;
        }

        ProductDetailDTO dto = new ProductDetailDTO();
        dto.setPriceSell(request.getPriceSell());
        dto.setInventoryQuantity(request.getInventoryQuantity());
        dto.setStatus(ProductDetailStatus.ACTIVE);
        dto.setImageUrl(request.getImageUrl());
        dto.setIdColor(request.getIdColor());
        dto.setIdRam(request.getIdRam());
        dto.setIdRom(request.getIdRom());

        // Chuyển đổi danh sách ProductImeiRequest sang ProductImeiDTO
        dto.setProductImeiResponses(imeiMapper.requestListToDTOList(request.getProductImeiRequests()));

        return dto;
    }

    // Chuyển đổi từ ProductDetailDTO -> ProductDetail Entity
    public ProductDetail dtoToEntity(ProductDetailDTO dto) {
        if (dto == null) {
            return null;
        }

        ProductDetail entity = new ProductDetail();
        entity.setId(dto.getId());
        entity.setCode(dto.getCode());
        entity.setPriceSell(dto.getPriceSell());
        entity.setInventoryQuantity(dto.getInventoryQuantity());
        entity.setStatus(dto.getStatus());
        entity.setImageUrl(dto.getImageUrl());
        entity.setColor(dto.getIdColor() != null ? colorRepository.findById(dto.getIdColor()).orElse(null) : null);
        entity.setRam(dto.getIdRam() != null ? ramRepository.findById(dto.getIdRam()).orElse(null) : null);
        entity.setRom(dto.getIdRom() != null ? romRepository.findById(dto.getIdRom()).orElse(null) : null);

        return entity;
    }

    // Chuyển đổi từ ProductDetail Entity -> ProductDetailDTO
    public ProductDetailDTO entityToDTO(ProductDetail entity) {
        if (entity == null) {
            return null;
        }

        ProductDetailDTO dto = new ProductDetailDTO();
        dto.setId(entity.getId());
        dto.setCode(entity.getCode());
        dto.setPriceSell(entity.getPriceSell());
        dto.setInventoryQuantity(entity.getInventoryQuantity());
        dto.setStatus(entity.getStatus());
        dto.setImageUrl(entity.getImageUrl());
        dto.setIdColor(entity.getColor() != null ? entity.getColor().getId() : null);
        dto.setIdRam(entity.getRam() != null ? entity.getRam().getId() : null);
        dto.setIdRom(entity.getRom() != null ? entity.getRom().getId() : null);

        dto.setProductImeiResponses(imeiMapper.entityListToDTOList(imeiRepository.findByProductDetailId(entity.getId())));
        return dto;
    }

    // Chuyển đổi từ ProductDetailDTO -> ProductDetailResponse
    public ProductDetailResponse dtoToResponse(ProductDetailDTO dto) {
        if (dto == null) {
            return null;
        }

        ProductDetailResponse response = new ProductDetailResponse();
        response.setId(dto.getId());
        response.setCode(dto.getCode());
        response.setPriceSell(dto.getPriceSell());
        response.setInventoryQuantity(dto.getInventoryQuantity());
        response.setStatus(dto.getStatus());
        response.setImageUrl(dto.getImageUrl());
        response.setColorName(dto.getIdColor() != null ? colorRepository.findById(dto.getIdColor()).map(c -> c.getName()).orElse(null) : null);
        response.setRamCapacity(dto.getIdRam() != null ? ramRepository.findById(dto.getIdRam()).map(r -> r.getCapacity()+r.getDescription()).orElse(null) : null);
        response.setRomCapacity(dto.getIdRom() != null ? romRepository.findById(dto.getIdRom()).map(r -> r.getCapacity()+r.getDescription()).orElse(null) : null);
        response.setProductImeiResponses(imeiMapper.dtoListToResponseList(dto.getProductImeiResponses()));
        return response;
    }
}
