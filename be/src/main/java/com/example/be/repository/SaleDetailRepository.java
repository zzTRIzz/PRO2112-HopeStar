package com.example.be.repository;

import com.example.be.entity.SaleDetail;
import com.example.be.entity.status.StatusSale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface SaleDetailRepository extends JpaRepository<SaleDetail, Integer> {
  // Lấy danh sách sản phẩm trong sale
  @Query("SELECT sd FROM SaleDetail sd WHERE sd.sale.id = :saleId")
  List<SaleDetail> findBySaleId(@Param("saleId") Integer saleId);
  @Query("SELECT sd FROM SaleDetail sd JOIN FETCH sd.sale WHERE sd.productDetail.id = :productDetailId")
  List<SaleDetail> findByProductDetailIdWithSale(@Param("productDetailId") Integer productDetailId);
  void deleteAllByIdIn(List<Integer> ids);
  @Query("SELECT sd FROM SaleDetail sd WHERE sd.productDetail.id = :productDetailId AND sd.sale.status = :status")
  List<SaleDetail> findByProductDetailIdAndSaleStatus(
          @Param("productDetailId") Integer productDetailId,
          @Param("status") StatusSale status
  );
  // Kiểm tra sản phẩm đã tồn tại trong sale
  boolean existsBySaleIdAndProductDetailId(Integer saleId, Integer productDetailId);
}