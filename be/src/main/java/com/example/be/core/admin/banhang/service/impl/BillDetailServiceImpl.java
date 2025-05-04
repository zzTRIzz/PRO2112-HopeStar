package com.example.be.core.admin.banhang.service.impl;


import com.example.be.core.admin.banhang.dto.BillDetailDto;
import com.example.be.core.admin.banhang.dto.ProductDetailDto;
import com.example.be.core.admin.banhang.dto.SearchBillDetailDto;
import com.example.be.core.admin.banhang.mapper.BillDetailMapper;
import com.example.be.core.admin.banhang.mapper.SearchBillDetailMapper;
import com.example.be.core.admin.banhang.service.BillDetailService;
import com.example.be.core.admin.products_management.dto.request.SearchProductRequest;
import com.example.be.core.admin.products_management.dto.response.ProductDetailResponse;
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
    BillDetailMapper billDetailMapper;

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


    @Override
    public List<BillDetailDto> getAllBillDetail() {
        List<BillDetail> billDetails = billDetailRepository.findAll();
        return billDetails.stream().map(billDetailMapper::dtoBillDetailMapper)
                .collect(Collectors.toList());
    }

    @Override
    public List<BillDetail> getALlThuong() {
        return billDetailRepository.findAll();
    }

    @Override
    public BillDetailDto createBillDetail(BillDetailDto billDetailDto) {
        try {
            ProductDetail productDetail = productDetailRepository.findById(billDetailDto.getIdProductDetail())
                    .orElseThrow(() -> new RuntimeException("Khong tim thay chi tiết sản phẩm " + billDetailDto.getIdProductDetail()));
            Bill bill = billRepository.findById(billDetailDto.getIdBill())
                    .orElseThrow(() -> new RuntimeException("Khong tim thay hóa đơn " + billDetailDto.getIdBill()));
            BillDetail billDetail = billDetailMapper.entityBillDetailMapper(billDetailDto, productDetail, bill);
            BillDetail saveBillDetail = billDetailRepository.save(billDetail);
            return billDetailMapper.dtoBillDetailMapper(saveBillDetail);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e);
        }
        return new BillDetailDto();
    }


    @Override
    public BillDetailDto thayDoiSoLuongKhiCungSPVaHD(Integer idBill, Integer idProductDetail, Integer SoLuong) {
        Optional<BillDetail> optionalBillDetail = billDetailRepository.
                findFirstByIdBillAndIdProductDetail(idBill, idProductDetail);

        if (optionalBillDetail.isPresent()) {
            BillDetail billDetail = optionalBillDetail.get();
            Integer soLuongTong = billDetail.getQuantity() + SoLuong;
            BigDecimal tongTien = billDetail.getPrice()
                    .multiply(BigDecimal.valueOf(soLuongTong));
            billDetail.setQuantity(soLuongTong);
            billDetail.setTotalPrice(tongTien);
            BillDetail saveBillDetail = billDetailRepository.save(billDetail);
            return billDetailMapper.dtoBillDetailMapper(saveBillDetail);
        }
        return new BillDetailDto();
    }

    @Override
    public BillDetailDto capNhatImeiCHoOnline(Integer idBill, Integer idProductDetail, Integer SoLuong) {
        Optional<BillDetail> optionalBillDetail = billDetailRepository.
                findFirstByIdBillAndIdProductDetail(idBill, idProductDetail);

        if (optionalBillDetail.isPresent()) {
            BillDetail billDetail = optionalBillDetail.get();
            BigDecimal tongTien = billDetail.getPrice()
                    .multiply(BigDecimal.valueOf(SoLuong));
            billDetail.setQuantity(SoLuong);
            billDetail.setTotalPrice(tongTien);
            BillDetail saveBillDetail = billDetailRepository.save(billDetail);
            return billDetailMapper.dtoBillDetailMapper(saveBillDetail);
        }
        return new BillDetailDto();
    }

    @Override
    public List<SearchBillDetailDto> getByIdBill(Integer idBill) {
        List<BillDetail> billDetails = billDetailRepository.findByIdBill(idBill);

        return billDetails.stream()
                .map(searchBillDetailMapper::dtoBillDetailMapper)
                .collect(Collectors.toList());
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
        // Tìm IMEI chưa bán
        Imei imei = imeiRepository.findImeiByImeiCode(barCode, StatusImei.NOT_SOLD);

        // Xử lý trường hợp không tìm thấy
        if (imei == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Không tìm thấy sản phẩm hoặc IMEI đã được sử dụng"
            );
        }
        // Kiểm tra ràng buộc dữ liệu
        if (imei.getProductDetail() == null) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Thông tin sản phẩm không tồn tại cho IMEI: " + barCode
            );
        }
        // Map sang DTO và trả về
        ProductDetailDto dto = productDetailDto(imei.getProductDetail());
        dto.setIdImei(imei.getId());

        return dto;
    }
}
