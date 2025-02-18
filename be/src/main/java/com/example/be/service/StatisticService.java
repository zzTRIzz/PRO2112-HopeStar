package com.example.be.service;

import com.example.be.entity.Bill;
import com.example.be.entity.BillData;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Year;
import java.util.List;

@Service
public class StatisticService {

    // Phương thức tính tổng doanh thu từ các hóa đơn đã thanh toán
    public BigDecimal calculateTotalRevenue() {
        List<Bill> paidBills = BillData.getPaidBills(); // Lấy danh sách hóa đơn đã thanh toán từ BillData
        BigDecimal totalRevenue = BigDecimal.ZERO;

        for (Bill bill : paidBills) {
            if (bill.getTotalPrice() != null) {
                totalRevenue = totalRevenue.add(bill.getTotalPrice());
            }
        }
        return totalRevenue;
    }

    // Phương thức tính doanh thu đã thanh toán theo từng phương thức thanh toán
    public BigDecimal calculateRevenueByPaymentMethod(String paymentMethod) {
        List<Bill> paidBills = BillData.getPaidBills(); // Lấy danh sách hóa đơn đã thanh toán từ BillData
        BigDecimal totalRevenue = BigDecimal.ZERO;

        for (Bill bill : paidBills) {
            if (bill.getPayment() != null && bill.getPayment().equals(paymentMethod)) {
                if (bill.getTotalPrice() != null) {
                    totalRevenue = totalRevenue.add(bill.getTotalPrice());
                }
            }
        }
        return totalRevenue;
    }

    // Phương thức tính doanh thu theo năm
    public BigDecimal calculateRevenueByYear(int year) {
        List<Bill> paidBills = BillData.getPaidBills(); // Lấy danh sách hóa đơn đã thanh toán từ BillData
        BigDecimal totalRevenue = BigDecimal.ZERO;

        for (Bill bill : paidBills) {
            if (bill.getPaymentDate() != null) {
                // Lấy năm của ngày thanh toán
                int billYear = Year.from(bill.getPaymentDate()).getValue();

                // Kiểm tra xem năm của hóa đơn có trùng với năm yêu cầu không
                if (billYear == year && bill.getTotalPrice() != null) {
                    totalRevenue = totalRevenue.add(bill.getTotalPrice());
                }
            }
        }
        return totalRevenue;
    }

    // Phương thức tính doanh thu theo tháng
    public BigDecimal calculateRevenueByMonth(int year, int month) {
        List<Bill> paidBills = BillData.getPaidBills(); // Lấy danh sách hóa đơn đã thanh toán từ BillData
        BigDecimal totalRevenue = BigDecimal.ZERO;

        for (Bill bill : paidBills) {
            if (bill.getPaymentDate() != null) {
                // Lấy tháng và năm của ngày thanh toán
                int billYear = Year.from(bill.getPaymentDate()).getValue();
                int billMonth = bill.getPaymentDate().getMonthValue();

                // Kiểm tra xem năm và tháng của hóa đơn có trùng với yêu cầu không
                if (billYear == year && billMonth == month && bill.getTotalPrice() != null) {
                    totalRevenue = totalRevenue.add(bill.getTotalPrice());
                }
            }
        }
        return totalRevenue;
    }

    // Phương thức tính doanh thu theo ngày
    public BigDecimal calculateRevenueByDay(int year, int month, int day) {
        List<Bill> paidBills = BillData.getPaidBills(); // Lấy danh sách hóa đơn đã thanh toán từ BillData
        BigDecimal totalRevenue = BigDecimal.ZERO;

        for (Bill bill : paidBills) {
            if (bill.getPaymentDate() != null) {
                // Lấy năm, tháng, và ngày của ngày thanh toán
                int billYear = Year.from(bill.getPaymentDate()).getValue();
                int billMonth = bill.getPaymentDate().getMonthValue();
                int billDay = bill.getPaymentDate().getDayOfMonth();

                // Kiểm tra xem năm, tháng và ngày của hóa đơn có trùng với yêu cầu không
                if (billYear == year && billMonth == month && billDay == day && bill.getTotalPrice() != null) {
                    totalRevenue = totalRevenue.add(bill.getTotalPrice());
                }
            }
        }
        return totalRevenue;
    }

    public long calculateTotalBillCount() {
        List<Bill> paidBills = BillData.getPaidBills(); // Lấy danh sách hóa đơn đã thanh toán từ BillData
        return paidBills.size();  // Trả về số lượng hóa đơn trong danh sách
    }
}
