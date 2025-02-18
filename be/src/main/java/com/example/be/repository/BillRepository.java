package com.example.be.repository;

import com.example.be.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BillRepository extends JpaRepository<Bill, Integer> {
  // Lấy danh sách Bill với trạng thái đã thanh toán
  List<Bill> findByStatus(String status);

  long countByStatus(String status);
}
