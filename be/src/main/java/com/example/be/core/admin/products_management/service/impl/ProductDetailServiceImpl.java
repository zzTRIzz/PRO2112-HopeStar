package com.example.be.core.admin.products_management.service.impl;

import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.read.listener.PageReadListener;
import com.example.be.core.admin.products_management.dto.model.ProductDetailExcelDTO;
import com.example.be.core.admin.products_management.dto.model.ProductImeiDTO;
import com.example.be.core.admin.products_management.dto.request.ProductDetailRequest;
import com.example.be.core.admin.products_management.dto.request.ProductImeiRequest;
import com.example.be.core.admin.products_management.mapper.ProductDetailMapper;
import com.example.be.core.admin.products_management.dto.request.SearchProductDetailRequest;
import com.example.be.core.admin.products_management.dto.response.ProductDetailResponse;
import com.example.be.core.admin.products_management.service.ProductDetailService;
import com.example.be.entity.*;
import com.example.be.entity.status.ProductDetailStatus;
import com.example.be.entity.status.StatusImei;
import com.example.be.repository.*;
import com.example.be.utils.BarcodeGenerator;
import com.google.zxing.BarcodeFormat;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class ProductDetailServiceImpl implements ProductDetailService {
    private final ProductDetailRepository productDetailRepository;
    private final ProductDetailMapper productDetailMapper;
    private final ImeiRepository imeiRepository;
    private final BarcodeGenerator barcodeGenerator;
    private final ProductRepository productRepository;
    private final RamRepository ramRepository;
    private final RomRepository romRepository;
    private final ColorRepository colorRepository;

    @Override
    public void updateStatus(Integer id) throws Exception {
        ProductDetail productDetail = productDetailRepository.findById(id).orElseThrow(() ->
                new Exception("product-detail not found with id: " + id));
        if (productDetail.getStatus().equals(ProductDetailStatus.DESIST)) {
            new Exception("Sản phẩm hiện tại đã hết hàng không thể cập nhật trạng thái");
        }
        if (productDetail != null) {
            if (productDetail.getStatus().equals(ProductDetailStatus.ACTIVE)) {
                productDetail.setStatus(ProductDetailStatus.IN_ACTIVE);
                for (Imei imei : productDetail.getImeis()) {
                    if (imei.getStatus().equals(StatusImei.NOT_SOLD)) {
                        imei.setStatus(StatusImei.IN_ACTIVE);
                    }
                }
            } else if (productDetail.getStatus().equals(ProductDetailStatus.IN_ACTIVE)) {
                productDetail.setStatus(ProductDetailStatus.ACTIVE);
                for (Imei imei : productDetail.getImeis()) {
                    if (imei.getStatus().equals(StatusImei.IN_ACTIVE)) {
                        imei.setStatus(StatusImei.NOT_SOLD);
                    }
                }
            }
        }
        productDetailRepository.save(productDetail);
    }

    @Override
    public List<ProductDetailResponse> searchProductDetails(SearchProductDetailRequest searchProductDetailRequest, Integer id) {
        List<ProductDetail> allMatchingProductDetails = productDetailRepository.findAllMatching(searchProductDetailRequest, id);

        List<ProductDetailResponse> detailResponseList = allMatchingProductDetails.stream()
                .map(productDetail -> productDetailMapper.dtoToResponse(productDetailMapper.entityToDTO(productDetail)))
                .collect(Collectors.toList());
        return detailResponseList;
    }

    @Override
    public void updateProductDetail(Integer idProductDetail, ProductDetailRequest productDetailRequest) throws Exception {
        ProductDetail productDetail = productDetailRepository.findById(idProductDetail).orElseThrow(() ->
                new Exception("Product detail not found" + idProductDetail)
        );
        System.out.println(productDetailRequest.getPriceSell());
        if (productDetail.getPrice().compareTo(productDetail.getPriceSell()) > 0) {
            throw new Exception("Sản phẩm này hiện đang có chương trình khuyến mãi, không thể cập nhật giá");
        }
        productDetail.setPrice(productDetailRequest.getPriceSell());
        productDetail.setPriceSell(productDetailRequest.getPriceSell());
        productDetail.setImageUrl(productDetailRequest.getImageUrl());

        productDetailRepository.save(productDetail);
    }

    @Override
    public void addQuantityProductDetail(Integer idProductDetail, List<ProductImeiRequest> listImeiRequest) throws Exception {
        ProductDetail productDetail = productDetailRepository.findById(idProductDetail).orElseThrow(() ->
                new Exception("product detail not found" + idProductDetail));
        for (ProductImeiRequest imeiRequest : listImeiRequest) {
            Imei imei = imeiRepository.findImeiByImeiCode(imeiRequest.getImeiCode());
            if (imei != null) {
                throw new Exception("Imei đã tồn tại:" + imeiRequest.getImeiCode());
            }
        }
        Integer count = 0;
        for (ProductImeiRequest imeiRequest : listImeiRequest) {
            Imei imei = new Imei();
            imei.setImeiCode(imeiRequest.getImeiCode());
            imei.setBarCode(barcodeGenerator.generateBarcodeImageBase64Url(imeiRequest.getImeiCode(), BarcodeFormat.CODE_128));
            imei.setStatus(StatusImei.NOT_SOLD);
            imei.setProductDetail(productDetail);
            imeiRepository.save(imei);
            count++;
        }
        productDetail.setStatus(ProductDetailStatus.ACTIVE);
        productDetail.setInventoryQuantity(productDetail.getInventoryQuantity() + count);
        productDetailRepository.save(productDetail);


    }

    //    @Override
//    public void updateSoLuongProductDetail(Integer idProductDetail, Integer quantity){
//       ProductDetail productDetail = productDetailRepository.findById(idProductDetail)
//               .orElseThrow(()->new RuntimeException("Khong tim thay product detail"));
//        Integer soLuongConLai = productDetail.getInventoryQuantity() - quantity;
//        productDetail.setInventoryQuantity(soLuongConLai);
//        productDetailRepository.save(productDetail);
//    }
//
//    @Override
//    public void updateStatusProduct(Integer idProductDetail){
//            ProductDetail productDetail = productDetailRepository.findById(idProductDetail)
//                    .orElseThrow(()->new RuntimeException("Khong tim thay product detail"));
//            if (productDetail.getInventoryQuantity() <= 0){
//                productDetail.setStatus(ProductDetailStatus.DESIST);
//                productDetailRepository.save(productDetail);
//            }else {
//                productDetail.setStatus(ProductDetailStatus.ACTIVE);
//                productDetailRepository.save(productDetail);
//            }
//    }
    @Override
    public void capNhatSoLuongVaTrangThaiProductDetail(Integer idProductDetail, Integer quantityDaBan) {
        ProductDetail productDetail = productDetailRepository.findById(idProductDetail)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Product Detail"));

        Integer soLuongConLai = productDetail.getInventoryQuantity() - quantityDaBan;

        if (soLuongConLai < 0) {
            throw new RuntimeException("Số lượng tồn kho không đủ để bán");
        }

        productDetail.setInventoryQuantity(soLuongConLai);

        if (soLuongConLai <= 0) {
            productDetail.setStatus(ProductDetailStatus.DESIST);
        } else {
            productDetail.setStatus(ProductDetailStatus.ACTIVE);
        }

        productDetailRepository.save(productDetail);
    }

    @Override
    public void updateSoLuongSanPham(Integer idProductDetail, Integer quantity) {
        ProductDetail productDetail = productDetailRepository.findById(idProductDetail)
                .orElseThrow(() -> new RuntimeException("Khong tim thay product detail"));

        Integer soLuongConLai = productDetail.getInventoryQuantity() + quantity;

        productDetail.setInventoryQuantity(soLuongConLai);

        if (soLuongConLai <= 0) {
            productDetail.setStatus(ProductDetailStatus.DESIST);
        } else {
            productDetail.setStatus(ProductDetailStatus.ACTIVE);
        }
        productDetailRepository.save(productDetail);
    }

    @Override
    public void importFileExcelProductDetail(Integer idProduct, MultipartFile file) throws Exception {
        Product product = productRepository.findById(idProduct).orElseThrow(()->
                new Exception("Sản phẩm không tồn tại")
        );

        EasyExcel.read(file.getInputStream(), ProductDetailExcelDTO.class,
                new PageReadListener<ProductDetailExcelDTO>(dataList -> {
                    dataList.forEach(dto -> {
                        Ram ram = ramRepository.findById(dto.getRam()).get();
                        Rom rom = romRepository.findById(dto.getRom()).get();
                        Color color = colorRepository.findById(dto.getColor()).get();
                        try {
                            productDetailRepository.findOneByProductIdAndRamIdAndRomIdAndColorId(idProduct,dto.getRam(),dto.getRom(),dto.getColor()).orElse(null);
                        }catch (Exception e){
                            e.getMessage();
                        }
                        ProductDetail entity = new ProductDetail();
                        entity.setCode("PRDE_"+productDetailRepository.getNewCode());
                        entity.setProduct(product);
                        entity.setPrice(dto.getPrice());
                        entity.setPriceSell(dto.getPrice());
                        entity.setInventoryQuantity(0);
                        entity.setColor(color);
                        entity.setRam(ram);
                        entity.setRom(rom);
                        entity.setImageUrl(dto.getImageUrl());
                        entity.setStatus(ProductDetailStatus.IN_ACTIVE);
                        productDetailRepository.save(entity);
                    });
                })).sheet().doRead();
    }

}
