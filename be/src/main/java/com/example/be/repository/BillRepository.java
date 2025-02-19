package com.example.be.repository;

import com.example.be.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillRepository extends JpaRepository<Bill, Integer> {
  // Lấy danh sách Bill với trạng thái đã thanh toán
  List<Bill> findByStatus(String status);

  long countByStatus(String status);

  @Query(value = """
    SELECT COALESCE(MAX(CAST(SUBSTRING(code, 6) AS UNSIGNED)), 0) + 1 
    FROM rear_camera
    """, nativeQuery = true)
  String getNewCode();
}
