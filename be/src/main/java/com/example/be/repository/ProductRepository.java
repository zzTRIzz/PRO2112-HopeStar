package com.example.be.repository;

import com.example.be.core.admin.products_management.dto.request.SearchProductRequest;
import com.example.be.core.client.home.dto.request.PhoneFilterRequest;
import com.example.be.entity.Product;
import com.example.be.entity.ProductDetail;
import com.example.be.entity.status.StatusCommon;
import com.example.be.repository.base.BaseRepository;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends BaseRepository<Product, Integer> {

    @Query("SELECT p FROM Product p " +
            "LEFT JOIN p.brand b " +
            "LEFT JOIN p.screen s " +
            "LEFT JOIN p.card c " +
            "LEFT JOIN p.os o " +
            "LEFT JOIN p.wifi w " +
            "LEFT JOIN p.bluetooth bt " +
            "LEFT JOIN p.battery ba " +
            "LEFT JOIN ProductCategory pc ON p.id = pc.product.id " +
            "LEFT JOIN pc.category cat " +
            "WHERE (:#{#searchRequest.key} IS NULL OR " +
            "REPLACE(LOWER(TRIM(p.code)), ' ', '') LIKE REPLACE(LOWER(CONCAT('%', TRIM(:#{#searchRequest.key}), '%')), ' ', '') OR " +
            "REPLACE(LOWER(TRIM(p.name)), ' ', '') LIKE REPLACE(LOWER(CONCAT('%', TRIM(:#{#searchRequest.key}), '%')), ' ', '')) " +
            "AND (:#{#searchRequest.idChip} IS NULL OR p.chip.id = :#{#searchRequest.idChip}) " +
            "AND (:#{#searchRequest.idBrand} IS NULL OR b.id = :#{#searchRequest.idBrand}) " +
            "AND (:#{#searchRequest.idScreen} IS NULL OR s.id = :#{#searchRequest.idScreen}) " +
            "AND (:#{#searchRequest.idCard} IS NULL OR c.id = :#{#searchRequest.idCard}) " +
            "AND (:#{#searchRequest.idOs} IS NULL OR o.id = :#{#searchRequest.idOs}) " +
            "AND (:#{#searchRequest.idWifi} IS NULL OR w.id = :#{#searchRequest.idWifi}) " +
            "AND (:#{#searchRequest.idBluetooth} IS NULL OR bt.id = :#{#searchRequest.idBluetooth}) " +
            "AND (:#{#searchRequest.idBattery} IS NULL OR ba.id = :#{#searchRequest.idBattery}) " +
            "AND (:#{#searchRequest.idCategory} IS NULL OR cat.id = :#{#searchRequest.idCategory}) " +
            "AND (:#{#searchRequest.status} IS NULL OR p.status = :#{#searchRequest.getStatusCommon()})")
    List<Product> findAllMatching(@Param("searchRequest") SearchProductRequest searchRequest);

    List<Product> findByStatusOrderByCreatedAtDesc(StatusCommon status);

    @Query("SELECT p FROM Product p " +
            "JOIN p.productDetails pd " +
            "JOIN BillDetail bd ON bd.idProductDetail = pd " +
            "WHERE p.status = :status " +
            "GROUP BY p " +
            "ORDER BY SUM(bd.quantity) DESC " +
            "LIMIT 20")
    List<Product> findTop20SellingProducts(@Param("status") StatusCommon status);

    Product findByProductDetails(ProductDetail productDetail);

    @Query("SELECT p FROM Product p " +
            "LEFT JOIN p.brand b " +
            "LEFT JOIN p.os o " +
            "LEFT JOIN p.chip c " +
            "LEFT JOIN p.screen s " +
            "LEFT JOIN p.productDetails pd " +
            "LEFT JOIN pd.ram r " +
            "LEFT JOIN pd.rom rom " +
            "LEFT JOIN ProductCategory pc ON p.id = pc.product.id " +
            "LEFT JOIN pc.category cat " +
            "WHERE (:#{#filter.priceStart} IS NULL OR pd.priceSell >= :#{#filter.priceStart}) " +
            "AND (:#{#filter.priceEnd} IS NULL OR pd.priceSell <= :#{#filter.priceEnd}) " +
            "AND (:#{#filter.key} IS NULL OR " +
            "REPLACE(LOWER(TRIM(p.name)), ' ', '') LIKE REPLACE(LOWER(CONCAT('%', TRIM(:#{#filter.key}), '%')), ' ', '')) " +
            "AND (:#{#filter.nfc} IS NULL OR p.nfc = :#{#filter.nfc}) " +
            "AND (:#{#filter.category} IS NULL OR cat.id = :#{#filter.category}) " +
            "AND (:#{#filter.os} IS NULL OR o.id = :#{#filter.os}) " +
            "AND (:#{#filter.brand} IS NULL OR b.id = :#{#filter.brand}) " +
            "AND (:#{#filter.chip} IS NULL OR c.id = :#{#filter.chip}) " +
            "AND (:#{#filter.ram} IS NULL OR r.id = :#{#filter.ram}) " +
            "AND (:#{#filter.rom} IS NULL OR rom.id = :#{#filter.rom}) " +
            "AND (:#{#filter.typeScreen} IS NULL OR s.type = :#{#filter.typeScreen}) " +
            "AND (:#{#filter.sizeScreen} IS NULL OR s.displaySize = :#{#filter.sizeScreen}) " +
            "AND p.status = 'ACTIVE'")
    List<Product> filterProducts(@Param("filter") PhoneFilterRequest filter);


    boolean existsProductsByNameEquals(String name);

    List<Product> findByNameContainingIgnoreCase(@Size(max = 255) @NotNull String name);
}