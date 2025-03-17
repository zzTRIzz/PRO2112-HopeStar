package com.example.be.core.admin.atribute_management.service.product_detail.impl;

import com.example.be.core.admin.banhang.dto.ImeiDto;
import com.example.be.core.admin.products_management.mapper.ImeiMapper;
import com.example.be.core.admin.products_management.dto.response.ProductImeiResponse;
import com.example.be.entity.Imei;
import com.example.be.core.admin.atribute_management.service.product_detail.ImeiService;
import com.example.be.entity.status.StatusImei;
import com.example.be.repository.ImeiRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ImeiServiceImpl implements ImeiService {

    private final ImeiRepository imeiRepository;
    private final ImeiMapper imeiMapper;

    @Override
    public List<Imei> getAll() {
        return null;
    }

    @Override
    public Imei create(Imei entity) {
        return null;
    }

    @Override
    public void update(Integer integer, Imei entity) {
    }

    @Override
    public Imei getById(Integer integer) {
        return null;
    }

    @Override
    public List<Imei> getAllActive() {
        return null;
    }

    @Override
    public List<ProductImeiResponse> getImeiByProductDetail(Integer id) {
        List<Imei> imeiList = imeiRepository.findByProductDetailId(id);
        List<ProductImeiResponse> productImeiResponse = imeiList.stream()
                .map(imei -> imeiMapper.dtoToResponse(imeiMapper.entityToDTO(imei)))
                .collect(Collectors.toList());

        return productImeiResponse;
    }


    public ImeiDto imeiDto(Imei imei){
        return new ImeiDto(
                imei.getId(),
                imei.getImeiCode(),
                imei.getBarCode(),
                imei.getStatus(),
                imei.getProductDetail().getId()
        );
    }
    @Override
    public List<ImeiDto> getAllImeiChuaBan(Integer id) {
        List<Imei> imeis= imeiRepository.getAllImeiChuaBan(StatusImei.NOT_SOLD, id);
        return imeis.stream().map(this::imeiDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ImeiDto> findImeiByIdProDaBan(Integer idProduct, Integer idBillDetail) {
        List<Imei> imeis= imeiRepository.getAllImeiDaBan(StatusImei.SOLD, idProduct,idBillDetail);
        return imeis.stream().map(this::imeiDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ImeiDto> findImeiByIdProductDetail(Integer idProduct,Integer idBillDetail) {
        List<Imei> imeis= imeiRepository.findImeiByIdProductDetail( idProduct,idBillDetail);
        return imeis.stream().map(this::imeiDto)
                .collect(Collectors.toList());
    }

}
