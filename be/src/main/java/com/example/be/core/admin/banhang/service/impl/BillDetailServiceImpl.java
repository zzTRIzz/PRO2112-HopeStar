package com.example.be.core.admin.banhang.service.impl;


import com.example.be.core.admin.banhang.dto.BillDetailDto;
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

//    @Autowired
//    BillDetailMapper billDetailMapper;

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


//    @Override
//    public List<BillDetailDto> getAllBillDetail() {
//        List<BillDetail> billDetails = billDetailRepository.findAll();
//        return billDetails.stream().map(billDetailMapper::dtoBillDetailMapper)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    public List<BillDetail> getALlThuong() {
//        return billDetailRepository.findAll();
//    }


//    @Override
//    public SearchBillDetailDto createBillDetail(BillDetailDto billDetailDto) {
//        try {
//            ProductDetail productDetail = productDetailRepository.findById(billDetailDto.getIdProductDetail())
//                    .orElseThrow(() -> new RuntimeException("Khong tim thay chi tiết sản phẩm " + billDetailDto.getIdProductDetail()));
//            if (productDetail.getInventoryQuantity() <= 0) {
//                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Sản phẩm chi tiết đã hết hàng !");
//            }
//            int quantity = billDetailDto.getId_Imei().size();
//
//            int soLuongConLai = productDetail.getInventoryQuantity() - quantity;
//
//            if (soLuongConLai < 0) {
//                throw new RuntimeException("Số lượng tồn kho không đủ để bán");
//            }
//            Bill bill = billRepository.findById(billDetailDto.getIdBill())
//                    .orElseThrow(() -> new RuntimeException("Khong tim thay hóa đơn " + billDetailDto.getIdBill()));
//
//            Optional<BillDetail> existingBillDetail = billDetailRepository.findFirstByIdBillAndIdProductDetail(
//                    billDetailDto.getIdBill(), billDetailDto.getIdProductDetail());
//            BillDetail billDetail = new BillDetail();
//            SearchBillDetailDto savebillDetailDto;
////        cộng số lượng nếu có sp và hóa đon giống nhau
//            if (existingBillDetail.isPresent()) {
//                savebillDetailDto = thayDoiSoLuongKhiCungSPVaHD(
//                        billDetailDto.getIdBill(), billDetailDto.getIdProductDetail(), billDetailDto.getId_Imei().size());
//                List<Imei> imeis = imeiRepository.findByIdIn(billDetailDto.getId_Imei());
//                List<Imei> imeisDaBan = imeiRepository.findImeiSoldInOtherBillDetails(billDetailDto.getId_Imei(), billDetail.getId());
//
//                List<String> imeiBiBan = imeisDaBan.stream()
//                        .filter(imei -> imei.getStatus() != StatusImei.NOT_SOLD)
//                        .map(Imei::getImeiCode)
//                        .toList();
//
//                if (!imeiBiBan.isEmpty()) {
//                    String message = "Imei đã bán: " + String.join(", ", imeiBiBan);
//                    throw new RuntimeException(message);
//                }
//
//                List<ImeiSold> imeiSoldList = new ArrayList<>();
//
//                for (Imei imei : imeis) {
//                    ImeiSold imeiSold = new ImeiSold();
//                    imeiSold.setId_Imei(imei);
//                    imeiSold.setIdBillDetail(existingBillDetail.get().getId());
//                    imeiSoldList.add(imeiSold);
//                    imei.setStatus(StatusImei.SOLD);
//                }
//                imeiSoldRepository.saveAll(imeiSoldList);
//                imeiRepository.saveAll(imeis);
//
//
//                productDetail.setInventoryQuantity(soLuongConLai);
//
//            } else {
//                billDetail.setIdBill(bill);
//                billDetail.setIdProductDetail(productDetail);
//                billDetail.setPrice(productDetail.getPriceSell());
//                billDetail.setQuantity(quantity);
//
//                BigDecimal tongTien = productDetail.getPriceSell().multiply(BigDecimal.valueOf(quantity));
//                billDetail.setTotalPrice(tongTien);
//
//                BillDetail saveBillDetail = billDetailRepository.save(billDetail);
//                savebillDetailDto = searchBillDetailMapper.dtoBillDetailMapper(saveBillDetail);
//                List<Imei> imeis = imeiRepository.findByIdIn(billDetailDto.getId_Imei());
//                List<Imei> imeisDaBan = imeiRepository.findImeiSoldInOtherBillDetails(billDetailDto.getId_Imei(), billDetail.getId());
//
//                List<String> imeiBiBan = imeisDaBan.stream()
//                        .filter(imei -> imei.getStatus() != StatusImei.NOT_SOLD)
//                        .map(Imei::getImeiCode)
//                        .toList();
//
//                if (!imeiBiBan.isEmpty()) {
//                    String message = "Imei đã bán: " + String.join(", ", imeiBiBan);
//                    throw new RuntimeException(message);
//                }
//
//                List<ImeiSold> imeiSoldList = new ArrayList<>();
//
//                for (Imei imei : imeis) {
//                    ImeiSold imeiSold = new ImeiSold();
//                    imeiSold.setId_Imei(imei);
//                    imeiSold.setIdBillDetail(billDetail);
//                    imeiSoldList.add(imeiSold);
//                    imei.setStatus(StatusImei.SOLD);
//                }
//                imeiSoldRepository.saveAll(imeiSoldList);
//                imeiRepository.saveAll(imeis);
//
//
//                productDetail.setInventoryQuantity(soLuongConLai);
//
//            }
//            if (soLuongConLai <= 0) {
//                productDetail.setStatus(ProductDetailStatus.DESIST);
//            } else {
//                productDetail.setStatus(ProductDetailStatus.ACTIVE);
//            }
//            return savebillDetailDto;
//        } catch (Exception e) {
//            e.printStackTrace();
//            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi tạo chi tiết hóa đơn");
//        }
//    }

    @Override
    public SearchBillDetailDto createBillDetail(BillDetailDto billDetailDto) {
        try {
            // Lấy thông tin chi tiết sản phẩm
            ProductDetail productDetail = productDetailRepository.findById(billDetailDto.getIdProductDetail())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy chi tiết sản phẩm " + billDetailDto.getIdProductDetail()));

            // Lấy số lượng cần bán
            int quantity = billDetailDto.getId_Imei().size();

            // Kiểm tra số lượng tồn kho
            int soLuongConLai = productDetail.getInventoryQuantity() - quantity;
            if (productDetail.getInventoryQuantity() <= 0 || soLuongConLai < 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Số lượng tồn kho không đủ để bán");
            }

            // Lấy thông tin hóa đơn
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

                // Nếu đã tồn tại BillDetail -> cập nhật số lượng và tổng tiền

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
                // Tạo mới BillDetail
                billDetail = new BillDetail();
                billDetail.setIdBill(bill);
                billDetail.setIdProductDetail(productDetail);
                billDetail.setPrice(productDetail.getPriceSell());
                billDetail.setQuantity(quantity);
                billDetail.setTotalPrice(productDetail.getPriceSell().multiply(BigDecimal.valueOf(quantity)));
            }

            // Lưu BillDetail
            BillDetail savedBillDetail = billDetailRepository.save(billDetail);

            // Lưu IMEI Sold
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

            // Cập nhật số lượng tồn và trạng thái sản phẩm
            productDetail.setInventoryQuantity(soLuongConLai);
            productDetail.setStatus(soLuongConLai <= 0 ? ProductDetailStatus.DESIST : ProductDetailStatus.ACTIVE);
            productDetailRepository.save(productDetail);

            // Trả về kết quả
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
