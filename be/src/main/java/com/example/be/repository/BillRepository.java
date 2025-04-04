package com.example.be.repository;

import com.example.be.core.admin.banhang.dto.SearchBill;
import com.example.be.core.admin.banhang.request.SearchBillRequest;
import com.example.be.entity.Account;
import com.example.be.entity.Bill;
import com.example.be.entity.status.StatusBill;
import com.example.be.repository.base.BaseRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillRepository extends JpaRepository<Bill, Integer> {
    // Lấy danh sách Bill với trạng thái đã thanh toán
    List<Bill> findByStatus(String status);

    long countByStatus(String status);

    @Query(value = """
            SELECT COALESCE(MAX(CAST(SUBSTRING(name_bill, 4) AS UNSIGNED)), 0) + 1
            FROM bill
            """, nativeQuery = true)
    String getNewCode();


    @Query("SELECT b FROM Bill b " +
            "where b.status = :status " +
            "order by b.paymentDate desc" )
    List<Bill> findTop6BillsPendingPayment(Pageable pageable,
                                           @Param("status")StatusBill statusBill);


    @Query("SELECT b FROM Bill b " +
            "LEFT JOIN b.idAccount tk " +
            "LEFT JOIN b.idNhanVien nv " +
            "WHERE (:#{#searchRequest.key} IS NULL OR b.nameBill LIKE %:#{#searchRequest.key}% " +
            "   OR tk.phone LIKE %:#{#searchRequest.key}% OR tk.fullName LIKE %:#{#searchRequest.key}%) " +
            "AND (:#{#searchRequest.startDate} IS NULL OR b.paymentDate >= :#{#searchRequest.startDate}) " +
            "AND (:#{#searchRequest.endDate} IS NULL OR b.paymentDate <= :#{#searchRequest.endDate}) " +
            "AND (:#{#searchRequest.loaiHoaDon} IS NULL OR b.billType = :#{#searchRequest.loaiHoaDon}) " +
            "AND (:#{#searchRequest.trangThai} IS NULL OR b.status = :#{#searchRequest.trangThai})" )
            List<Bill> searchBills(@Param("searchRequest") SearchBillRequest searchRequest);

}
