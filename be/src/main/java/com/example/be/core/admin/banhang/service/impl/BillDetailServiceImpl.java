package com.example.be.core.admin.banhang.service.impl;


import com.example.be.core.admin.banhang.dto.BillDetailDto;
import com.example.be.core.admin.banhang.dto.ImeiDto;
import com.example.be.core.admin.banhang.dto.ProductDetailDto;
import com.example.be.core.admin.banhang.dto.SearchBillDetailDto;
import com.example.be.core.admin.banhang.mapper.SearchBillDetailMapper;
import com.example.be.core.admin.banhang.service.BillDetailService;
import com.example.be.core.admin.products_management.dto.request.SearchProductRequest;
import com.example.be.entity.*;

import com.example.be.entity.status.ProductDetailStatus;
import com.example.be.entity.status.StatusImei;
import com.example.be.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BillDetailServiceImpl implements BillDetailService {

    @Autowired
    BillDetailRepository billDetailRepository;

    @Autowired
    SearchBillDetailMapper searchBillDetailMapper;

    @Autowired
    ProductDetailRepository productDetailRepository;

    @Autowired
    BillRepository billRepository;

    @Autowired
    ImeiRepository imeiRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    ImeiSoldRepository imeiSoldRepository;


    @Override
    public List<SearchBillDetailDto> getByIdBill(Integer idBill) {
        List<BillDetail> billDetails = billDetailRepository.findByIdBill(idBill);

        return billDetails.stream().map(billDetail -> {
            List<ImeiSold> imeiSolds = imeiSoldRepository.timkiem(billDetail.getId());

            List<ImeiDto> imeiSoldResList = imeiSolds.stream().map(imeiSold -> {
                Imei imei = imeiSold.getId_Imei();
                if (imei != null) {
                    ImeiDto imeiDto = new ImeiDto();
                    imeiDto.setId(imei.getId());
                    imeiDto.setImeiCode(imei.getImeiCode());
                    imeiDto.setBarCode(imei.getBarCode());
                    imeiDto.setStatus(imei.getStatus());
                    return imeiDto;
                }
                return null;
            }).filter(Objects::nonNull).collect(Collectors.toList());

            SearchBillDetailDto dto = searchBillDetailMapper.dtoBillDetailMapper(billDetail);
            dto.setImeiList(imeiSoldResList);
            return dto;
        }).collect(Collectors.toList());
    }




    @Override
    public SearchBillDetailDto createBillDetail(BillDetailDto billDetailDto) {
        try {
            ProductDetail productDetail = productDetailRepository.findById(billDetailDto.getIdProductDetail())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy chi tiết sản phẩm " + billDetailDto.getIdProductDetail()));

            int quantity = billDetailDto.getId_Imei().size();

            int soLuongConLai = productDetail.getInventoryQuantity() - quantity;
            if (productDetail.getInventoryQuantity() <= 0 || soLuongConLai < 0 || productDetail.getStatus() != ProductDetailStatus.ACTIVE) {
                throw new RuntimeException("Số lượng tồn kho không đủ để bán hoặc sản phẩm đã ngừng hoạt động");
            }

            Bill bill = billRepository.findById(billDetailDto.getIdBill())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn " + billDetailDto.getIdBill()));

            List<Imei> imeis = imeiRepository.findByIdIn(billDetailDto.getId_Imei());


            Optional<BillDetail> existing = billDetailRepository.findFirstByIdBillAndIdProductDetail(
                    bill.getId(), productDetail.getId()
            );

            BillDetail billDetail;
            if (existing.isPresent()) {
                billDetail = existing.get();
                List<Imei> imeisDaBan = imeiRepository.findImeiSoldInOtherBillDetails(
                        billDetailDto.getId_Imei(), billDetail.getId());
                List<String> imeiBiBan = imeisDaBan.stream()
                        .filter(imei -> imei.getStatus() != StatusImei.NOT_SOLD)
                        .map(Imei::getImeiCode)
                        .toList();
                if (!imeiBiBan.isEmpty()) {
                    throw new RuntimeException("IMEI đã bán: " + String.join(", ", imeiBiBan));
                }

                billDetail.setQuantity(billDetail.getQuantity() + quantity);
                billDetail.setTotalPrice(billDetail.getPrice().multiply(BigDecimal.valueOf(billDetail.getQuantity())));
            } else {
                List<Imei> imeisDaBan = imeiRepository.findImeiSoldInOtherBillDetails(
                        billDetailDto.getId_Imei(), null);
                List<String> imeiBiBan = imeisDaBan.stream()
                        .filter(imei -> imei.getStatus() != StatusImei.NOT_SOLD)
                        .map(Imei::getImeiCode)
                        .toList();
                if (!imeiBiBan.isEmpty()) {
                    throw new RuntimeException("IMEI đã bán: " + String.join(", ", imeiBiBan));
                }
                billDetail = new BillDetail();
                billDetail.setIdBill(bill);
                billDetail.setIdProductDetail(productDetail);
                billDetail.setPrice(productDetail.getPriceSell());
                billDetail.setQuantity(quantity);
                billDetail.setTotalPrice(productDetail.getPriceSell().multiply(BigDecimal.valueOf(quantity)));
            }

            BillDetail savedBillDetail = billDetailRepository.save(billDetail);

            List<ImeiSold> imeiSoldList = new ArrayList<>();
            for (Imei imei : imeis) {
                ImeiSold imeiSold = new ImeiSold();
                imeiSold.setId_Imei(imei);
                imeiSold.setIdBillDetail(savedBillDetail);
                imeiSoldList.add(imeiSold);
                imei.setStatus(StatusImei.SOLD);
            }
            imeiSoldRepository.saveAll(imeiSoldList);
            imeiRepository.saveAll(imeis);

            productDetail.setInventoryQuantity(soLuongConLai);
            productDetail.setStatus(soLuongConLai <= 0 ? ProductDetailStatus.DESIST : ProductDetailStatus.ACTIVE);
            productDetailRepository.save(productDetail);

            return searchBillDetailMapper.dtoBillDetailMapper(savedBillDetail);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }


    @Override
    public SearchBillDetailDto thayDoiSoLuongKhiCungSPVaHD(Integer idBill, Integer idProductDetail, Integer SoLuong) {
        Optional<BillDetail> optionalBillDetail = billDetailRepository.
                findFirstByIdBillAndIdProductDetail(idBill, idProductDetail);

        if (optionalBillDetail.isPresent()) {
            BillDetail billDetail = optionalBillDetail.get();
            int soLuongTong = billDetail.getQuantity() + SoLuong;
            BigDecimal tongTien = billDetail.getPrice()
                    .multiply(BigDecimal.valueOf(soLuongTong));
            billDetail.setQuantity(soLuongTong);
            billDetail.setTotalPrice(tongTien);
            BillDetail saveBillDetail = billDetailRepository.save(billDetail);
            return searchBillDetailMapper.dtoBillDetailMapper(saveBillDetail);
        }
        return new SearchBillDetailDto();
    }

    @Override
    public SearchBillDetailDto capNhatImeiCHoOnline(Integer idBill, Integer idProductDetail, Integer SoLuong) {
        Optional<BillDetail> optionalBillDetail = billDetailRepository.
                findFirstByIdBillAndIdProductDetail(idBill, idProductDetail);

        if (optionalBillDetail.isPresent()) {
            BillDetail billDetail = optionalBillDetail.get();
            BigDecimal tongTien = billDetail.getPrice()
                    .multiply(BigDecimal.valueOf(SoLuong));
            billDetail.setQuantity(SoLuong);
            billDetail.setTotalPrice(tongTien);
            BillDetail saveBillDetail = billDetailRepository.save(billDetail);
            return searchBillDetailMapper.dtoBillDetailMapper(saveBillDetail);
        }
        return new SearchBillDetailDto();
    }



    @Override
    public void deleteBillDetail(Integer idBillDetail) {
        if (idBillDetail == null) {
            throw new RuntimeException("Vui long nhap id");
        }
        billDetailRepository.findById(idBillDetail)
                .orElseThrow(() -> new RuntimeException("Khong tim thay bill detail"));
        billDetailRepository.deleteById(idBillDetail);
    }


    //lấy danh sách product ra để hiển thị lên
    public ProductDetailDto productDetailDto(ProductDetail productDetail) {
        return new ProductDetailDto(
                productDetail.getId(),
                productDetail.getCode(),
                productDetail.getProduct().getName(),
                productDetail.getPriceSell(),
                productDetail.getInventoryQuantity(),
                productDetail.getStatus(),
                productDetail.getColor().getName(),
                productDetail.getRam().getCapacity(),
                productDetail.getRom().getCapacity(),
                productDetail.getRom().getDescription(),
                productDetail.getImageUrl(),
                null
        );
    }

    @Override
    public List<ProductDetailDto> getAllProductDetailDto(SearchProductRequest searchRequest) {
        List<Product> allMatchingProducts = productRepository.findAllMatching(searchRequest);
        List<ProductDetail> productDetailTong = productDetailRepository.findByProductInAndStatus(allMatchingProducts, ProductDetailStatus.ACTIVE);


//        List<ProductDetail> productDetails = productDetailRepository.getAllProductDetail(ProductDetailStatus.ACTIVE);
        List<ProductDetailDto> result = productDetailTong.stream()
                .map(this::productDetailDto)
                .collect(Collectors.toList());

        Collections.reverse(result);
        return result;
    }


    @Override
    public ProductDetailDto quetBarCodeCHoProductTheoImei(String barCode) {
        Imei imei = imeiRepository.findImeiByImeiCode(barCode, StatusImei.NOT_SOLD);

        if (imei == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Không tìm thấy sản phẩm hoặc IMEI đã được sử dụng"
            );
        }
        if (imei.getProductDetail() == null) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Thông tin sản phẩm không tồn tại cho IMEI: " + barCode
            );
        }
        ProductDetailDto dto = productDetailDto(imei.getProductDetail());
        dto.setIdImei(imei.getId());

        return dto;
    }
}
