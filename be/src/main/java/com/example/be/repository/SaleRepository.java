package com.example.be.repository;

import com.example.be.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface SaleRepository extends JpaRepository<Sale, Integer> {
  boolean existsByCode(String code);

  @Query("SELECT s FROM Sale s WHERE " +
          "(COALESCE(:code, '') = '' OR " +  // Bỏ qua nếu code rỗng
          "REPLACE(LOWER(TRIM(s.code)), ' ', '') LIKE REPLACE(LOWER(CONCAT('%', TRIM(:code), '%')), ' ', '') OR " +
          "REPLACE(LOWER(TRIM(s.name)), ' ', '') LIKE REPLACE(LOWER(CONCAT('%', TRIM(:code), '%')), ' ', '')) " +
          "AND (:dateStart IS NULL OR s.dateStart >= :dateStart) " +
          "AND (:dateEnd IS NULL OR s.dateEnd <= :dateEnd)")
  List<Sale> searchSales(
          @Param("code") String code,
          @Param("dateStart") LocalDateTime dateStart,
          @Param("dateEnd") LocalDateTime dateEnd
  );

}