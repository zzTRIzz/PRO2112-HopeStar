package com.example.be.repository;

import com.example.be.entity.Bill;
import com.example.be.entity.status.StatusBill;
import jakarta.persistence.Tuple;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StatisticRepository extends JpaRepository<Bill, Integer> {
    List<Bill> findByStatus(StatusBill status);
    @Query(value = """
        SELECT DATE(payment_date) AS paymentDate, 
               SUM(total_price) AS totalRevenue
        FROM bill
        WHERE status = 'DA_THANH_TOAN'
        GROUP BY DATE(payment_date)
        ORDER BY paymentDate DESC
        """, nativeQuery = true)
    List<Object[]> getRevenueByDate();

    @Query(value = "SELECT YEAR(payment_date) AS year, SUM(total_price) AS totalRevenue " +
            "FROM bill " +
            "WHERE status = 'DA_THANH_TOAN' " +
            "GROUP BY YEAR(payment_date) " +
            "ORDER BY year DESC", nativeQuery = true)
    List<Object[]> getRevenueByYear();

    @Query(value = "SELECT YEAR(payment_date) AS year, MONTH(payment_date) AS month, SUM(total_price) AS totalRevenue " +
            "FROM bill " +
            "WHERE status = 'DA_THANH_TOAN' " +
            "GROUP BY YEAR(payment_date), MONTH(payment_date) " +
            "ORDER BY year DESC, month DESC", nativeQuery = true)
    List<Object[]> getRevenueByMonth();

    @Query(value = "SELECT " +
            "p.id AS product_id, " +
            "p.code, " +
            "p.name, " +
            "p.description, " +
            "bd.total_revenue " +
            "FROM ( " +
            "    SELECT " +
            "        id_product_detail, " +
            "        SUM(total_price) AS total_revenue " +
            "    FROM " +
            "        bill_detail " +
            "    GROUP BY " +
            "        id_product_detail " +
            ") bd " +
            "JOIN product_detail pd ON bd.id_product_detail = pd.id " +
            "JOIN product p ON pd.product_id = p.id " +
            "ORDER BY " +
            "    bd.total_revenue DESC " +
            "LIMIT 1000", nativeQuery = true)
    List<Object[]> getRevenueByProduct();

    // Số lượng hóa đơn theo ngày
    @Query(value = "SELECT DATE(created_at) AS order_date, COUNT(*) AS total_orders " +
            "FROM bill " +
            "WHERE status = 'DA_THANH_TOAN' " +
            "GROUP BY order_date " +
            "ORDER BY order_date", nativeQuery = true)
    List<Object[]> getOrderCountByDate();

    // Số lượng hóa đơn theo tháng
    @Query(value = "SELECT YEAR(created_at) AS order_year, MONTH(created_at) AS order_month, COUNT(*) AS total_orders " +
            "FROM bill " +
            "WHERE status = 'DA_THANH_TOAN' " +
            "GROUP BY order_year, order_month " +
            "ORDER BY order_year, order_month", nativeQuery = true)
    List<Object[]> getOrderCountByMonth();

    // Số lượng hóa đơn theo năm
    @Query(value = "SELECT YEAR(created_at) AS order_year, COUNT(*) AS total_orders " +
            "FROM bill " +
            "WHERE status = 'DA_THANH_TOAN' " +
            "GROUP BY order_year " +
            "ORDER BY order_year", nativeQuery = true)
    List<Object[]> getOrderCountByYear();

    // Tổng số lượng hóa đơn đã thanh toán
    @Query(value = "SELECT COUNT(*) AS total_paid_orders " +
            "FROM bill " +
            "WHERE status = 'DA_THANH_TOAN'", nativeQuery = true)
    Long getTotalPaidOrders();

    @Query(value = "SELECT " +
            "p.id AS product_id, " +
            "p.code, " +
            "p.name, " +
            "p.description, " +
            "bd.total_quantity " +
            "FROM ( " +
            "    SELECT " +
            "        id_product_detail, " +
            "        SUM(quantity) AS total_quantity " +
            "    FROM " +
            "        hopestar_store_dev.bill_detail " +
            "    GROUP BY " +
            "        id_product_detail " +
            ") bd " +
            "JOIN hopestar_store_dev.product_detail pd ON bd.id_product_detail = pd.id " +
            "JOIN hopestar_store_dev.product p ON pd.product_id = p.id " +
            "ORDER BY " +
            "    bd.total_quantity DESC " +
            "LIMIT 1000", nativeQuery = true)
    List<Object[]> getBestSellingProducts();

    @Query("SELECT COALESCE(SUM(b.totalPrice), 0) FROM Bill b " +
            "WHERE b.status = 'DA_THANH_TOAN' " +
            "AND DATE(b.paymentDate) = CURRENT_DATE")
    BigDecimal calculateTodayRevenue();

    @Query("SELECT COALESCE(SUM(b.totalPrice), 0) FROM Bill b " +
            "WHERE b.status = 'DA_THANH_TOAN' " +
            "AND MONTH(b.paymentDate) = MONTH(CURRENT_DATE) " +
            "AND YEAR(b.paymentDate) = YEAR(CURRENT_DATE)")
    BigDecimal calculateMonthlyRevenue();

    @Query(value = """
    SELECT DATE(created_at) AS sale_date, 
           SUM(quantity) AS daily_quantity_sold
    FROM bill_detail
    WHERE MONTH(created_at) = MONTH(CURRENT_DATE)
      AND YEAR(created_at) = YEAR(CURRENT_DATE)
    GROUP BY DATE(created_at)
    """, nativeQuery = true)
    List<Object[]> getMonthlyProductSales();

    @Query("SELECT SUM(b.totalPrice) as revenue, COUNT(b) as count " +
            "FROM Bill b " +
            "WHERE b.paymentDate BETWEEN :start AND :end " +
            "AND b.status = 'DA_THANH_TOAN'")
    Tuple getRevenueAndCount(
            @Param("start") Instant start,
            @Param("end") Instant end
    );

    @Query(nativeQuery = true, value =
            "SELECT pd.code AS product_detail_code, " +
                    "p.name AS product_name, " +
                    "c.name AS color_name, " +
                    "pd.inventory_quantity, " +
                    "pd.status " +
                    "FROM product_detail pd " +
                    "JOIN product p ON pd.product_id = p.id " +
                    "LEFT JOIN color c ON pd.color_id = c.id " +
                    "WHERE pd.inventory_quantity <= 5 " +
                    "AND pd.status = 'ACTIVE' " +
                    "ORDER BY pd.inventory_quantity ASC")
    List<Object[]> findLowStockProducts();
}
