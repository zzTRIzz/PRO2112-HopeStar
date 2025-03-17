//package com.example.be.entity;
//
//import java.math.BigDecimal;
//import java.time.LocalDateTime;
//import java.time.temporal.ChronoUnit;
//import java.util.ArrayList;
//import java.util.List;
//
//public class BillData {
//
//    // Phương thức trả về danh sách các hóa đơn mẫu
//    public static List<Bill> getPaidBills() {
//        List<Bill> paidBills = new ArrayList<>();
//
//        // Tạo hóa đơn cho năm 2024, mỗi tháng có ít nhất 3 ngày có doanh thu
//        paidBills.add(createBill(1, "PAID", new BigDecimal("100.00"), new BigDecimal("100.00"), new BigDecimal("0.00"), LocalDateTime.of(2024, 1, 5, 10, 0, 0, 0)));
//        paidBills.add(createBill(2, "PAID", new BigDecimal("120.00"), new BigDecimal("120.00"), new BigDecimal("0.00"), LocalDateTime.of(2024, 1, 10, 10, 0, 0, 0)));
//        paidBills.add(createBill(3, "PAID", new BigDecimal("150.00"), new BigDecimal("150.00"), new BigDecimal("0.00"), LocalDateTime.of(2024, 1, 15, 10, 0, 0, 0)));
//
//        paidBills.add(createBill(4, "PAID", new BigDecimal("100.00"), new BigDecimal("100.00"), new BigDecimal("0.00"), LocalDateTime.of(2024, 2, 5, 10, 0, 0, 0)));
//        paidBills.add(createBill(5, "PAID", new BigDecimal("130.00"), new BigDecimal("130.00"), new BigDecimal("0.00"), LocalDateTime.of(2024, 2, 10, 10, 0, 0, 0)));
//        paidBills.add(createBill(6, "PAID", new BigDecimal("140.00"), new BigDecimal("140.00"), new BigDecimal("0.00"), LocalDateTime.of(2024, 2, 15, 10, 0, 0, 0)));
//
//        paidBills.add(createBill(7, "PAID", new BigDecimal("100.00"), new BigDecimal("100.00"), new BigDecimal("0.00"), LocalDateTime.of(2024, 3, 5, 10, 0, 0, 0)));
//        paidBills.add(createBill(8, "PAID", new BigDecimal("110.00"), new BigDecimal("110.00"), new BigDecimal("0.00"), LocalDateTime.of(2024, 3, 10, 10, 0, 0, 0)));
//        paidBills.add(createBill(9, "PAID", new BigDecimal("120.00"), new BigDecimal("120.00"), new BigDecimal("0.00"), LocalDateTime.of(2024, 3, 15, 10, 0, 0, 0)));
//
//        // Thêm các tháng còn lại tương tự
//        // ...
//
//        return paidBills;
//    }
//
//    // Phương thức tạo hóa đơn thủ công với ngày thanh toán
//    private static Bill createBill(int id, String status, BigDecimal totalPrice, BigDecimal customerPayment, BigDecimal amountChange, LocalDateTime paymentDate) {
//        Bill bill = new Bill();
//        bill.setId(id);
//        bill.setStatus(status);
//        bill.setTotalPrice(totalPrice);
//        bill.setCustomerPayment(customerPayment);
//        bill.setAmountChange(amountChange);
//        bill.setPaymentDate(paymentDate);
//        return bill;
//    }
//}
