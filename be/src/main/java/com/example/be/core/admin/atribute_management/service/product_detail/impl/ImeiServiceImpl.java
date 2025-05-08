package com.example.be.core.admin.atribute_management.service.product_detail.impl;

import com.example.be.core.admin.atribute_management.dto.request.ImeiRequest;
import com.example.be.core.admin.atribute_management.dto.response.ImeiResponse;
import com.example.be.core.admin.banhang.dto.ImeiDto;
import com.example.be.core.admin.products_management.dto.response.ProductDetailResponse;
import com.example.be.core.admin.products_management.mapper.ImeiMapper;
import com.example.be.core.admin.products_management.dto.response.ProductImeiResponse;
import com.example.be.entity.Imei;
import com.example.be.core.admin.atribute_management.service.product_detail.ImeiService;
import com.example.be.entity.Product;
import com.example.be.entity.ProductDetail;
import com.example.be.entity.status.StatusImei;
import com.example.be.repository.ImeiRepository;
import com.example.be.repository.ProductDetailRepository;
import com.example.be.repository.ProductRepository;
import com.example.be.utils.BarcodeGenerator;
import com.google.zxing.BarcodeFormat;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ImeiServiceImpl implements ImeiService {

    private final ImeiRepository imeiRepository;
    private final ImeiMapper imeiMapper;
    private final ProductRepository productRepository;
    private final ProductDetailRepository productDetailRepository;
    private final BarcodeGenerator barcodeGenerator;

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
    public List<ImeiResponse> getAllImei() {
        List<Imei> imeiList = imeiRepository.findAll().stream()
                .sorted((i1,i2)->Long.compare(i2.getId(), i1.getId()))
                .collect(Collectors.toList());

        List<ImeiResponse> imeiResponseList = new ArrayList<>();
        for (Imei imei: imeiList) {

            ImeiResponse imeiResponse = new ImeiResponse();
            imeiResponse.setId(imei.getId());
            imeiResponse.setImeiCode(imei.getImeiCode());
            imeiResponse.setBarCode(imei.getBarCode());
            imeiResponse.setStatus(imei.getStatus());
            ProductDetail productDetail = productDetailRepository.findById(imei.getProductDetail().getId()).get();
            if (productDetail != null){
                Product product = productRepository.findByProductDetails(productDetail);
                if (product !=null){
                    imeiResponse.setProductName(product.getName());
                }
            }
            imeiResponseList.add(imeiResponse);

        }
        return imeiResponseList;
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

    @Override
    public Object updateImei(Integer id, ImeiRequest imeiRequest) throws Exception {
        Imei imei = imeiRepository.findById(id).orElseThrow(()->
                new Exception("Imei không tồn tại"));
        if (!imei.getImeiCode().equals(imeiRequest.getImeiCode())){
           Imei imeiExit = imeiRepository.findImeiByImeiCode(imeiRequest.getImeiCode());
           if (imeiExit !=null){
               throw new Exception("Imei đã tồn tại");
           }
        }
        imei.setImeiCode(imeiRequest.getImeiCode());
        imei.setBarCode(barcodeGenerator.generateBarcodeImageBase64Url(imeiRequest.getImeiCode(), BarcodeFormat.CODE_128));
        imei.setStatus(imeiRequest.getStatus());
        imeiRepository.save(imei);
        return "Cập nhật thành công!";
    }

}
