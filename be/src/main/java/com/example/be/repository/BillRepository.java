package com.example.be.repository;

import com.example.be.entity.Bill;
import com.example.be.entity.status.StatusBill;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BillRepository extends JpaRepository<Bill, Integer> {
    // Lấy danh sách Bill với trạng thái đã thanh toán
    @Query("SELECT b FROM Bill b " +
            "where b.status = :status ")
    List<Bill> findBillByStatus(@Param("status") StatusBill statusBill);

    @Query(value = """
            SELECT COALESCE(MAX(CAST(SUBSTRING(code, 4) AS UNSIGNED)), 0) + 1
            FROM bill
            """, nativeQuery = true)
    String getNewCode();


    @Query("SELECT b FROM Bill b " +
            "where b.status = :status " +
            "order by b.paymentDate desc")
    List<Bill> findTop6BillsPendingPayment(Pageable pageable,
                                           @Param("status") StatusBill statusBill);


    @Query("SELECT b FROM Bill b WHERE b.idAccount.id = :idAccount " +
            "and b.delivery.id = 2")
    List<Bill> findAllByAccount(@Param("idAccount") Integer idAccount);


    @Query("SELECT b FROM Bill b WHERE b.id = :idBill " +
            "and b.delivery.id = 2")
    Optional<Bill> traCuuDonHang(@Param("idBill") Integer idBill);


    @Query("SELECT b.id FROM Bill b WHERE b.maBill = :maBill " +
            "and b.delivery.id = 2")
    Integer findBillByMaBill(@Param("maBill") String maBill);


    //    @Query("SELECT CASE WHEN COUNT(bd) > 0 THEN true ELSE false END " +
//            "FROM BillDetail bd JOIN bd.idBill b " +
//            "WHERE b.idAccount.id = :customerId " +
//            "AND bd.idProductDetail.id = :productDetailId " +
//            "AND b.status = :status")
//    boolean existsByCustomerIdAndProductId(@Param("customerId") Integer customerId,
//                                           @Param("productDetailId") Integer productDetailId,
//                                           @Param("status") StatusBill statusBill);

    @Query("SELECT SUM(bd.quantity) " +
            "FROM BillDetail bd JOIN bd.idBill b " +
            "WHERE b.idAccount.id = :customerId " +
            "AND bd.idProductDetail.id = :productDetailId " +
            "AND b.status = :status")
    Integer getTotalQuantityByCustomerIdAndProductId(@Param("customerId") Integer customerId,
                                                     @Param("productDetailId") Integer productDetailId,
                                                     @Param("status") StatusBill statusBill);

    @Query("SELECT SUM(bd.quantity) " +
            "FROM BillDetail bd JOIN bd.idBill b " +
            "WHERE bd.idProductDetail.id = :productDetailId " +
            "AND b.status = :status")
    Integer getTotalQuantity(@Param("productDetailId") Integer productDetailId,
                             @Param("status") StatusBill statusBill);

    //    @Query("SELECT " +
//            "CASE WHEN b.status = :status THEN TRUE ELSE FALSE END " +
//            "FROM ImeiSold is " +
//            "JOIN is.id_Imei i " +
//            "JOIN is.idBillDetail bd " +
//            "JOIN bd.idBill b " +
//            "WHERE i.imeiCode = :imeiCode ")
//    Boolean checkImeiWithBillStatus(@Param("imeiCode") String imeiCode,
//                                    @Param("status") StatusBill status);
    @Query(value = "SELECT COALESCE((" +
            "SELECT CASE WHEN b.status = 'GIAO_THAT_BAI' THEN TRUE ELSE FALSE END " +
            "FROM imei_sold isold " +
            "JOIN imei i ON isold.id_imei = i.id " +
            "JOIN bill_detail bd ON isold.id_bill_detail = bd.id " +
            "JOIN bill b ON bd.id_bill = b.id " +
            "WHERE i.imei_code = :imeiCode " +
            "LIMIT 1), FALSE)", nativeQuery = true)
    int checkImeiWithBillStatus(@Param("imeiCode") String imeiCode);

}
