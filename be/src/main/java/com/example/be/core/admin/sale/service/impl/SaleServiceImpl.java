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
import java.time.temporal.ChronoUnit;
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

    @Scheduled(fixedRate = 6000)
    @Transactional
    public void updateSaleStatuses() {
        LocalDateTime now = LocalDateTime.now();
        List<Sale> sales = saleRepository.findAll();
        for (Sale sale : sales) {
            StatusSale newStatus = calculateStatus(sale.getDateStart(), sale.getDateEnd());
            if (!sale.getStatus().equals(newStatus)) {
                sale.setStatus(newStatus);
                saleRepository.save(sale);
                updateProductDetailsPrice(sale);
            }
        }
    }

    private void updateProductDetailPrice(ProductDetail pd) {
        List<SaleDetail> activeSaleDetails = saleDetailRepository.findByProductDetailIdAndSaleStatus(
                pd.getId(),
                StatusSale.ACTIVE
        );

        BigDecimal maxDiscount = activeSaleDetails.stream()
                .map(sd -> calculateDiscountAmount(
                        pd.getPrice(),
                        sd.getSale().getDiscountValue(),
                        sd.getSale().getDiscountType()
                ))
                .max(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO);

        BigDecimal newPriceSell = pd.getPrice().subtract(maxDiscount);
        pd.setPriceSell(newPriceSell.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : newPriceSell);
        productDetailRepository.save(pd);
    }

    private void updateProductDetailsPrice(Sale sale) {
        List<SaleDetail> saleDetails = saleDetailRepository.findBySaleId(sale.getId());
        for (SaleDetail sd : saleDetails) {
            updateProductDetailPrice(sd.getProductDetail());
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
        // Kiểm tra nếu dateStart là trong quá khứ
        if (request.getDateStart().isBefore(LocalDateTime.now().truncatedTo(ChronoUnit.MINUTES))) {
            throw new RuntimeException("Ngày bắt đầu phải lớn hơn hoặc bằng thời gian hiện tại");
        }

        // Kiểm tra nếu dateEnd là trước dateStart
        if (request.getDateEnd().isBefore(request.getDateStart())) {
            throw new RuntimeException("Ngày kết thúc không được nhỏ hơn ngày bắt đầu");
        }

        // Kiểm tra giá trị giảm
        if (request.getDiscountType() && request.getDiscountValue() > 100) {
            throw new RuntimeException("Giá trị giảm theo % không được lớn hơn 100%");
        }

        Sale sale = saleMapper.toEntity(request);
        sale.setDateStart(roundToMinute(request.getDateStart())); // Làm tròn đến phút
        sale.setDateEnd(roundToMinute(request.getDateEnd())); // Làm tròn đến phút
        sale.setStatus(calculateStatus(sale.getDateStart(), sale.getDateEnd()));

        if (request.getDiscountType() == null) {
            sale.setDiscountType(false);
        }

        sale = saleRepository.save(sale);
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

    private BigDecimal calculateDiscountAmount(BigDecimal originalPrice, Integer discountValue, Boolean discountType) {
        if (discountType) {
            return originalPrice.multiply(BigDecimal.valueOf(discountValue))
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        } else {
            return BigDecimal.valueOf(discountValue);
        }
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
            response.setProductId(sd.getProductDetail().getProduct().getId()); // Thêm dòng này
            response.setProductName(sd.getProductDetail().getProduct().getName());
            response.setProductCode(sd.getProductDetail().getCode());
            response.setPrice(sd.getProductDetail().getPrice());
            return response;
        }).collect(Collectors.toList());
    }

    @Override
    public SaleResponse update(Integer id, SaleRequest request) {
        Sale sale = saleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sale not found"));

        if (!sale.getCode().equals(request.getCode()) && saleRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Mã chương trình đã tồn tại");
        }

        // Kiểm tra nếu dateStart là trong quá khứ
//        if (request.getDateStart().isBefore(LocalDateTime.now().truncatedTo(ChronoUnit.MINUTES))) {
//            throw new RuntimeException("Ngày bắt đầu không được trong quá khứ");
//        }

        // Kiểm tra nếu dateEnd là trước dateStart
        if (request.getDateEnd().isBefore(request.getDateStart())) {
            throw new RuntimeException("Ngày kết thúc không được nhỏ hơn ngày bắt đầu");
        }

        // Kiểm tra giá trị giảm
        if (request.getDiscountType() && request.getDiscountValue() > 100) {
            throw new RuntimeException("Giá trị giảm theo % không được lớn hơn 100%");
        }

        // Cập nhật các trường của sale
        sale.setCode(request.getCode());
        sale.setName(request.getName());
        sale.setDateStart(roundToMinute(request.getDateStart())); // Làm tròn đến phút
        sale.setDateEnd(roundToMinute(request.getDateEnd())); // Làm tròn đến phút
        sale.setDescription(request.getDescription());
        sale.setDiscountValue(request.getDiscountValue());
        sale.setDiscountType(request.getDiscountType() != null ? request.getDiscountType() : false);

        if (request.getStatus() != null) {
            sale.setStatus(request.getStatus());
        }

        // Lưu và làm mới đối tượng sale
        sale = saleRepository.saveAndFlush(sale);

        // Nếu Sale đang active, cập nhật lại price_sell
        if (sale.getStatus() == StatusSale.ACTIVE) {
            updateProductDetailsPrice(sale);
        }

        return saleMapper.toResponse(sale);
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



    private LocalDateTime roundToMinute(LocalDateTime dateTime) {
        return dateTime.truncatedTo(ChronoUnit.MINUTES);
    }
}

