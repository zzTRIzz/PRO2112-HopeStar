package com.example.be.repository;

import com.example.be.entity.Bill;
import com.example.be.entity.status.StatusBill;
import jakarta.persistence.Tuple;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StatisticRepository extends JpaRepository<Bill, Integer> {

    List<Bill> findByStatus(StatusBill status);

    @Query(value = """
        SELECT DATE(receipt_date) AS receiptDate, 
               SUM(total_price) AS totalRevenue
        FROM bill
        WHERE status = 'HOAN_THANH'
        GROUP BY DATE(receipt_date)
        ORDER BY receiptDate DESC
        """, nativeQuery = true)
    List<Object[]> getRevenueByDate();

    @Query(value = "SELECT YEAR(receipt_date) AS year, SUM(total_price) AS totalRevenue " +
            "FROM bill " +
            "WHERE status = 'HOAN_THANH' " +
            "GROUP BY YEAR(receipt_date) " +
            "ORDER BY year DESC", nativeQuery = true)
    List<Object[]> getRevenueByYear();

    @Query(value = "SELECT YEAR(receipt_date) AS year, MONTH(receipt_date) AS month, SUM(total_price) AS totalRevenue " +
            "FROM bill " +
            "WHERE status = 'HOAN_THANH' " +
            "GROUP BY YEAR(receipt_date), MONTH(receipt_date) " +
            "ORDER BY year DESC, month DESC", nativeQuery = true)
    List<Object[]> getRevenueByMonth();

    //Doanh thu theo sản phẩm
    @Query(value = "SELECT " +
            "p.id AS product_id, " +
            "p.code, " +
            "p.name, " +
            "p.description, " +
            "bd.total_revenue " +
            "FROM ( " +
            "    SELECT " +
            "        id_product_detail, " +
            "        SUM(bd_sub.total_price) AS total_revenue " +
            "    FROM " +
            "        bill_detail bd_sub " +
            "    JOIN bill b_sub ON bd_sub.id_bill = b_sub.id " +
            "    WHERE " +
            "        b_sub.status = 'HOAN_THANH' " +
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
    @Query(value = "SELECT DATE(receipt_date) AS order_date, COUNT(*) AS total_orders " +
            "FROM bill " +
            "WHERE status = 'HOAN_THANH' " +
            "GROUP BY order_date " +
            "ORDER BY order_date", nativeQuery = true)
    List<Object[]> getOrderCountByDate();

    // Số lượng hóa đơn theo tháng
    @Query(value = "SELECT YEAR(receipt_date) AS order_year, MONTH(receipt_date) AS order_month, COUNT(*) AS total_orders " +
            "FROM bill " +
            "WHERE status = 'HOAN_THANH' " +
            "GROUP BY order_year, order_month " +
            "ORDER BY order_year, order_month", nativeQuery = true)
    List<Object[]> getOrderCountByMonth();

    // Số lượng hóa đơn theo năm
    @Query(value = "SELECT YEAR(receipt_date) AS order_year, COUNT(*) AS total_orders " +
            "FROM bill " +
            "WHERE status = 'HOAN_THANH' " +
            "GROUP BY order_year " +
            "ORDER BY order_year", nativeQuery = true)
    List<Object[]> getOrderCountByYear();

    // Tổng số lượng hóa đơn đã thanh toán
    @Query(value = "SELECT COUNT(*) AS total_paid_orders " +
            "FROM bill " +
            "WHERE status = 'HOAN_THANH'", nativeQuery = true)
    Long getTotalPaidOrders();

    @Query(value = "SELECT " +
            "p.id AS product_id, " +
            "p.code, " +
            "p.name, " +
            "p.description, " +
            "bd.total_quantity " +
            "FROM ( " +
            "    SELECT " +
            "        bd_sub.id_product_detail, " +
            "        SUM(bd_sub.quantity) AS total_quantity " +
            "    FROM " +
            "        bill_detail bd_sub " +
            "    JOIN bill b ON bd_sub.id_bill = b.id " +
            "    WHERE " +
            "        b.status = 'HOAN_THANH' " +
            "    GROUP BY " +
            "        bd_sub.id_product_detail " +
            ") bd " +
            "JOIN product_detail pd ON bd.id_product_detail = pd.id " +
            "JOIN product p ON pd.product_id = p.id " +
            "ORDER BY " +
            "    bd.total_quantity DESC " +
            "LIMIT 1000", nativeQuery = true)
    List<Object[]> getBestSellingProducts();

    //Doanh thu hôm nay
    @Query("SELECT COALESCE(SUM(b.totalPrice), 0) FROM Bill b " +
            "WHERE b.status = 'HOAN_THANH' " +
            "AND DATE(b.receiptDate) = CURRENT_DATE")
    BigDecimal calculateTodayRevenue();

    //Doanh thu tháng
    @Query("SELECT COALESCE(SUM(b.totalPrice), 0) FROM Bill b " +
            "WHERE b.status = 'HOAN_THANH' " +
            "AND MONTH(b.receiptDate) = MONTH(CURRENT_DATE) " +
            "AND YEAR(b.receiptDate) = YEAR(CURRENT_DATE)")
    BigDecimal calculateMonthlyRevenue();

    //số lượng hóa đơn
    @Query("SELECT SUM(b.totalPrice) as revenue, COUNT(b) as count " +
            "FROM Bill b " +
            "WHERE b.receiptDate BETWEEN :start AND :end " +
            "AND b.status = 'HOAN_THANH'")
    Tuple getRevenueAndCount(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    @Query(value = """
    SELECT 
        DATE(b.receipt_date) AS sale_date,  
        SUM(bd.quantity) AS daily_quantity_sold
    FROM 
        bill_detail bd
    JOIN 
        bill b ON bd.id_bill = b.id  
    WHERE 
        b.status = 'HOAN_THANH'  
        AND MONTH(b.receipt_date) = MONTH(CURRENT_DATE)
        AND YEAR(b.receipt_date) = YEAR(CURRENT_DATE)
    GROUP BY 
        DATE(b.receipt_date)
    """, nativeQuery = true)
    List<Object[]> getMonthlyProductSales();

    @Query(nativeQuery = true, value =
            "SELECT pd.code AS product_detail_code, " +
                    "p.name AS product_name, " +
                    "c.name AS color_name, " +
                    "pd.inventory_quantity, " +
                    "pd.status, " +
                    "pd.image_url " +
                    "FROM product_detail pd " +
                    "JOIN product p ON pd.product_id = p.id " +
                    "LEFT JOIN color c ON pd.color_id = c.id " +
                    "WHERE pd.inventory_quantity <= 5 " +
                    "AND pd.status = 'ACTIVE' " +
                    "ORDER BY pd.inventory_quantity ASC")
    List<Object[]> findLowStockProducts();

    // Doanh thu 3 ngày gần nhất
    @Query(value = """
    SELECT DATE(receipt_date) AS receiptDate, 
           SUM(total_price) AS totalRevenue
    FROM bill
    WHERE status = 'HOAN_THANH'
    AND DATE(receipt_date) >= DATE_SUB(CURRENT_DATE, INTERVAL 3 DAY)
    GROUP BY DATE(receipt_date)
    ORDER BY receiptDate DESC
    """, nativeQuery = true)
    List<Object[]> getRevenueLast3Days();

    // Doanh thu 7 ngày gần nhất
    @Query(value = """
    SELECT DATE(receipt_date) AS receiptDate, 
           SUM(total_price) AS totalRevenue
    FROM bill
    WHERE status = 'HOAN_THANH'
    AND DATE(receipt_date) >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)
    GROUP BY DATE(receipt_date)
    ORDER BY receiptDate DESC
    """, nativeQuery = true)
    List<Object[]> getRevenueLast7Days();

    @Query(value = """
    SELECT DATE(receipt_date) AS order_date, 
           COUNT(*) AS total_orders
    FROM bill
    WHERE status = 'HOAN_THANH'
    AND DATE(receipt_date) >= DATE_SUB(CURRENT_DATE, INTERVAL 3 DAY)
    GROUP BY DATE(receipt_date)
    ORDER BY order_date DESC
    """, nativeQuery = true)
    List<Object[]> getOrderCountLast3Days();

    @Query(value = """
    SELECT DATE(receipt_date) AS order_date, 
           COUNT(*) AS total_orders
    FROM bill
    WHERE status = 'HOAN_THANH'
    AND DATE(receipt_date) >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)
    GROUP BY DATE(receipt_date)
    ORDER BY order_date DESC
    """, nativeQuery = true)
    List<Object[]> getOrderCountLast7Days();

    @Query(value = """
    SELECT 
        DATE(b.receipt_date) as receipt_date,
        SUM(b.total_price) as daily_revenue,
        COUNT(b.id) as daily_order_count
    FROM bill b
    WHERE b.status = 'HOAN_THANH'
    AND DATE(b.receipt_date) BETWEEN :startDate AND :endDate
    GROUP BY DATE(b.receipt_date)
    ORDER BY receipt_date
    """, nativeQuery = true)
    List<Object[]> getDailyStatisticByDateRange(@Param("startDate") LocalDate startDate,
                                                @Param("endDate") LocalDate endDate);

    @Query(nativeQuery = true, value = """
    SELECT DISTINCT 
        a.id AS customer_id,
        a.full_name AS customer_name,
        a.email,
        a.phone,
        a.address,
        b.code AS bill_code,
        b.status AS bill_status
    FROM account a
    JOIN bill b ON a.id = b.id_account
    WHERE b.status = 'DA_HUY' AND a.id != 1
    ORDER BY a.id
    """)
    List<Object[]> findCustomersWithCanceledOrders();

    @Query(nativeQuery = true, value = """
    SELECT 
        a.id AS customer_id,
        a.full_name AS customer_name,
        a.email,
        a.phone,
        SUM(b.total_price) AS total_price_sum
    FROM account a
    JOIN bill b ON a.id = b.id_account
    WHERE b.status = 'HOAN_THANH' AND a.id != 1
    GROUP BY a.id
    ORDER BY total_price_sum DESC
    LIMIT 10
    """)
    List<Object[]> findTop10RevenueCustomers();
}