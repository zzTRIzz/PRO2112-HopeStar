package com.example.be.repository;

import com.example.be.core.admin.products_management.dto.request.SearchProductDetailRequest;
import com.example.be.entity.Product;
import com.example.be.entity.ProductDetail;
import com.example.be.entity.status.ProductDetailStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductDetailRepository extends JpaRepository<ProductDetail, Integer> {
  @Query(value = """
    SELECT COALESCE(MAX(CAST(SUBSTRING(code, 6) AS UNSIGNED)), 0) + 1 
    FROM product_detail
    """, nativeQuery = true)
  String getNewCode();

  @Query("SELECT pd FROM ProductDetail pd " +
          "LEFT JOIN pd.product p " +
          "LEFT JOIN pd.ram r " +
          "LEFT JOIN pd.rom rm " +
          "LEFT JOIN pd.color c " +
          "WHERE (:idProduct IS NULL OR p.id = :idProduct) " +
          "AND (:#{#searchRequest.code} IS NULL OR pd.code LIKE %:#{#searchRequest.code}%) " +
          "AND (:#{#searchRequest.idRam} IS NULL OR r.id = :#{#searchRequest.idRam}) " +
          "AND (:#{#searchRequest.idRom} IS NULL OR rm.id = :#{#searchRequest.idRom}) " +
          "AND (:#{#searchRequest.idColors} IS NULL OR c.id = :#{#searchRequest.idColors})")
  List<ProductDetail> findAllMatching(@Param("searchRequest") SearchProductDetailRequest searchRequest,
                                      @Param("idProduct") Integer idProduct);



  @Query("SELECT pd FROM ProductDetail pd " +
          "where pd.inventoryQuantity > 0 and pd.status =  :status")
  List<ProductDetail> getAllProductDetail( @Param("status") ProductDetailStatus status);


  List<ProductDetail> findAllByProduct(Product product);


  List<ProductDetail> findByProductId(Integer productId);

  ProductDetail findByIdAndStatus(Integer id, ProductDetailStatus status);

  @Query("SELECT pd FROM ProductDetail pd " +
          "WHERE pd.product IN :products " +
          "AND pd.status = :status")
  List<ProductDetail> findByProductInAndStatus(
          @Param("products") List<Product> products,
          @Param("status") ProductDetailStatus status
  );

  @Query("SELECT pd FROM ProductDetail pd " +
          "WHERE pd.product.id = :productId " +
          "AND (:ramId IS NULL OR pd.ram.id = :ramId) " +
          "AND (:romId IS NULL OR pd.rom.id = :romId) " +
          "AND (:colorId IS NULL OR pd.color.id = :colorId)")
  Optional<ProductDetail> findOneByProductIdAndRamIdAndRomIdAndColorId(
          @Param("productId") Integer productId,
          @Param("ramId") Integer ramId,
          @Param("romId") Integer romId,
          @Param("colorId") Integer colorId
  );

  }
