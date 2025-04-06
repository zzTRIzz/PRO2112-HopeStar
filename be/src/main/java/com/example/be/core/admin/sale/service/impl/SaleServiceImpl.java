package com.example.be.core.admin.sale.service.impl;

import com.example.be.core.admin.sale.dto.request.SaleProductAssignRequest;
import com.example.be.core.admin.sale.dto.request.SaleRequest;
import com.example.be.core.admin.sale.dto.response.SaleDetailResponse;
import com.example.be.core.admin.sale.dto.response.SaleResponse;
import com.example.be.core.admin.sale.mapper.SaleMapper;
import com.example.be.entity.ProductDetail;
import com.example.be.entity.Sale;
import com.example.be.entity.SaleDetail;
import com.example.be.entity.status.StatusSale;
import com.example.be.repository.ProductDetailRepository;
import com.example.be.repository.SaleDetailRepository;
import com.example.be.repository.SaleRepository;
import com.example.be.core.admin.sale.service.SaleService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SaleServiceImpl implements SaleService {
    private final SaleRepository saleRepository;
    private final SaleMapper saleMapper;
    private final SaleDetailRepository saleDetailRepository;
    private final ProductDetailRepository productDetailRepository;

    private StatusSale calculateStatus(LocalDateTime dateStart, LocalDateTime dateEnd) {
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(dateStart)) {
            return StatusSale.UPCOMING;
        } else if (now.isAfter(dateEnd)) {
            return StatusSale.INACTIVE;
        } else {
            return StatusSale.ACTIVE;
        }
    }

    // SaleServiceImpl.java
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void updateSaleStatuses() {
        LocalDateTime now = LocalDateTime.now();
        List<Sale> sales = saleRepository.findAll();
        for (Sale sale : sales) {
            StatusSale newStatus = calculateStatus(sale.getDateStart(), sale.getDateEnd());
            if (!sale.getStatus().equals(newStatus)) {
                // Xử lý khi trạng thái thay đổi
                if (newStatus == StatusSale.ACTIVE) {
                    updateProductDetailsPrice(sale, true);
                } else if (sale.getStatus() == StatusSale.ACTIVE && newStatus == StatusSale.INACTIVE) {
                    updateProductDetailsPrice(sale, false);
                }
                // Cập nhật trạng thái sale
                sale.setStatus(newStatus);
                saleRepository.save(sale);
            }
        }
    }

    private void updateProductDetailsPrice(Sale sale, boolean isActive) {
        List<SaleDetail> saleDetails = saleDetailRepository.findBySaleId(sale.getId());
        for (SaleDetail sd : saleDetails) {
            ProductDetail pd = sd.getProductDetail();
            if (isActive) {
                BigDecimal priceSell = calculatePriceSell(pd.getPrice(), sale.getDiscountValue(), sale.getDiscountType());
                pd.setPriceSell(priceSell);
            } else {
                // Phục hồi giá hoặc kiểm tra Sale khác
                List<SaleDetail> activeSales = saleDetailRepository.findByProductDetailIdAndSaleStatus(pd.getId(), StatusSale.ACTIVE);
                if (activeSales.isEmpty()) {
                    pd.setPriceSell(pd.getPrice());
                } else {
                    Sale activeSale = activeSales.get(0).getSale();
                    BigDecimal priceSell = calculatePriceSell(pd.getPrice(), activeSale.getDiscountValue(), activeSale.getDiscountType());
                    pd.setPriceSell(priceSell);
                }
            }
            productDetailRepository.save(pd);
        }
    }

    @Override
    public List<SaleResponse> getAll() {
        List<Sale> sales = saleRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
        return sales.stream()
                .map(saleMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<SaleResponse> searchSales(String code, LocalDateTime dateStart, LocalDateTime dateEnd) {
        List<Sale> sales = saleRepository.searchSales(code, dateStart, dateEnd);
        return sales.stream().map(saleMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public SaleResponse add(SaleRequest request) {
        if (saleRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Mã chương trình đã tồn tại");
        }
        if (request.getDateEnd().isBefore(request.getDateStart())) {
            throw new RuntimeException("Ngày kết thúc không được nhỏ hơn ngày bắt đầu");
        }
        if (request.getDiscountType() && request.getDiscountValue() > 100) {
            throw new RuntimeException("Giá trị giảm theo % không được lớn hơn 100%");
        }

        Sale sale = saleMapper.toEntity(request);
        sale.setStatus(calculateStatus(sale.getDateStart(), sale.getDateEnd()));
        if (request.getDiscountType() == null) {
            sale.setDiscountType(false);
        }

        sale = saleRepository.save(sale);
        return saleMapper.toResponse(sale);
    }

    @Override
    public SaleResponse update(Integer id, SaleRequest request) {
        Sale sale = saleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sale not found"));

        if (!sale.getCode().equals(request.getCode()) && saleRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Mã chương trình đã tồn tại");
        }
        if (request.getDateEnd().isBefore(request.getDateStart())) {
            throw new RuntimeException("Ngày kết thúc không được nhỏ hơn ngày bắt đầu");
        }
        if (request.getDiscountType() && request.getDiscountValue() > 100) {
            throw new RuntimeException("Giá trị giảm theo % không được lớn hơn 100%");
        }

        sale.setCode(request.getCode());
        sale.setName(request.getName());
        sale.setDateStart(request.getDateStart());
        sale.setDateEnd(request.getDateEnd());
        sale.setDescription(request.getDescription());
        sale.setDiscountValue(request.getDiscountValue());
        sale.setDiscountType(request.getDiscountType() != null ? request.getDiscountType() : false);

        if (request.getStatus() != null) {
            sale.setStatus(request.getStatus());
        }

        sale = saleRepository.saveAndFlush(sale);

        // Nếu Sale đang active, cập nhật lại price_sell
        if (sale.getStatus() == StatusSale.ACTIVE) {
            updateProductDetailsPrice(sale, true);
        }

        return saleMapper.toResponse(sale);
    }


    @Override
    @Transactional
    public Map<String, Object> assignProductsToSale(SaleProductAssignRequest request) {
        Sale sale = saleRepository.findById(request.getSaleId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sale"));

        List<Integer> invalidIds = new ArrayList<>();
        List<Integer> existingIds = new ArrayList<>();
        List<Integer> addedIds = new ArrayList<>();

        // Bước 1: Kiểm tra ID không hợp lệ
        for (Integer productDetailId : request.getProductDetailIds()) {
            if (!productDetailRepository.existsById(productDetailId)) {
                invalidIds.add(productDetailId);
            }
        }

        if (!invalidIds.isEmpty()) {
            throw new RuntimeException("Sản phẩm không tồn tại: " + invalidIds);
        }

        // Bước 2: Tách ID thành 2 nhóm
        for (Integer productDetailId : request.getProductDetailIds()) {
            if (saleDetailRepository.existsBySaleIdAndProductDetailId(request.getSaleId(), productDetailId)) {
                existingIds.add(productDetailId);
            } else {
                addedIds.add(productDetailId);
            }
        }

        // Bước 3: Thêm những ID chưa tồn tại
        for (Integer productDetailId : addedIds) {
            ProductDetail productDetail = productDetailRepository.findById(productDetailId).orElseThrow();
            SaleDetail saleDetail = new SaleDetail();
            saleDetail.setSale(sale);
            saleDetail.setProductDetail(productDetail);
            saleDetailRepository.save(saleDetail);

            // Nếu Sale đang active, cập nhật price_sell
            if (sale.getStatus() == StatusSale.ACTIVE) {
                BigDecimal priceSell = calculatePriceSell(
                        productDetail.getPrice(),
                        sale.getDiscountValue(),
                        sale.getDiscountType()
                );
                productDetail.setPriceSell(priceSell);
                productDetailRepository.save(productDetail);
            }
        }

        // Bước 4: Trả về kết quả kèm thông tin
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("added", addedIds);
        result.put("existing", existingIds);

        return result;
    }

    private BigDecimal calculatePriceSell(BigDecimal price, Integer discountValue, Boolean discountType) {
        BigDecimal discountAmount;
        if (discountType) {
            // Giảm theo %
            discountAmount = price.multiply(BigDecimal.valueOf(discountValue))
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        } else {
            // Giảm theo VND
            discountAmount = BigDecimal.valueOf(discountValue);
        }
        BigDecimal newPriceSell = price.subtract(discountAmount);
        return newPriceSell.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : newPriceSell;
    }

    @Override
    public List<SaleDetailResponse> getProductsInSale(Integer saleId) {
        List<SaleDetail> saleDetails = saleDetailRepository.findBySaleId(saleId);
        return saleDetails.stream().map(sd -> {
            SaleDetailResponse response = new SaleDetailResponse();
            response.setId(sd.getId());
            response.setProductDetailId(sd.getProductDetail().getId());
            response.setProductName(sd.getProductDetail().getProduct().getName());
            response.setProductCode(sd.getProductDetail().getCode());
            response.setPrice(sd.getProductDetail().getPrice());
            return response;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteSaleDetails(List<Integer> ids) {
        List<SaleDetail> saleDetails = saleDetailRepository.findAllById(ids);
        List<ProductDetail> productDetails = saleDetails.stream()
                .map(SaleDetail::getProductDetail)
                .collect(Collectors.toList());

        saleDetailRepository.deleteAllByIdIn(ids);

        for (ProductDetail pd : productDetails) {
            List<SaleDetail> activeSales = saleDetailRepository.findByProductDetailIdAndSaleStatus(pd.getId(), StatusSale.ACTIVE);
            if (activeSales.isEmpty()) {
                pd.setPriceSell(pd.getPrice());
            } else {
                Sale activeSale = activeSales.get(0).getSale();
                BigDecimal priceSell = calculatePriceSell(pd.getPrice(), activeSale.getDiscountValue(), activeSale.getDiscountType());
                pd.setPriceSell(priceSell);
            }
            productDetailRepository.save(pd);
        }
    }

    // Có thể tạo một phương thức trong SaleServiceImpl
//    @Transactional
//    public void recalculateAllPriceSell() {
//        List<Sale> activeSales = saleRepository.findByStatus(StatusSale.ACTIVE);
//        for (Sale sale : activeSales) {
//            updateProductDetailsPrice(sale, true);
//        }
//    }

}

