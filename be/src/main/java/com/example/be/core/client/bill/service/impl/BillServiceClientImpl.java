package com.example.be.core.client.bill.service.impl;

import com.example.be.core.admin.banhang.dto.SearchBill;
import com.example.be.core.client.bill.respones.BillDetailRespones;
import com.example.be.core.client.bill.respones.BillRespones;
import com.example.be.core.client.bill.respones.ProductDetailRespones;
import com.example.be.core.client.bill.service.BillServiceClient;
import com.example.be.entity.Bill;
import com.example.be.entity.BillDetail;
import com.example.be.repository.BillDetailRepository;
import com.example.be.repository.BillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class BillServiceClientImpl implements BillServiceClient {
    @Autowired
    BillRepository billRepository;
    @Autowired
    BillDetailRepository billDetailRepository;


    @Override
    public List<BillRespones> getBillsByAccount(Integer idAccount) {
        // Lấy tất cả Bill của Account
        List<Bill> bills = billRepository.findAllByAccount(idAccount);
        // Chuyển danh sách Bill thành BillRespones
        List<BillRespones> billResponesList = bills.stream().map(bill -> {
            BillRespones billRespones = new BillRespones();
            billRespones.setId(bill.getId());
            billRespones.setCode(bill.getCode());
            billRespones.setMaBill(bill.getMaBill());
            billRespones.setFullNameKh((bill.getIdAccount() != null) ? bill.getIdAccount().getFullName() : null);
            billRespones.setFullNameNV((bill.getIdNhanVien() != null) ? bill.getIdNhanVien().getFullName() : null);
            billRespones.setCodeVoucher((bill.getIdVoucher() != null) ? bill.getIdVoucher().getCode() : null);
            billRespones.setTotalPrice(bill.getTotalPrice());
            billRespones.setCustomerPayment(bill.getCustomerPayment());
            billRespones.setAmountChange(bill.getAmountChange());
            billRespones.setDeliveryFee(bill.getDeliveryFee());
            billRespones.setTotalDue(bill.getTotalDue());
            billRespones.setCustomerRefund(bill.getCustomerRefund());
            billRespones.setDiscountedTotal(bill.getDiscountedTotal());
            billRespones.setPayInsurance(bill.getPayInsurance());
            billRespones.setPaymentDate(bill.getPaymentDate());
            billRespones.setBillType(bill.getBillType());
            billRespones.setStatus(bill.getStatus());
            billRespones.setAddress(bill.getAddress());
            billRespones.setEmail(bill.getEmail());
            billRespones.setPhone(bill.getPhone());
            billRespones.setNote(bill.getNote());
            billRespones.setName(bill.getName());
            billRespones.setPayment((bill.getPayment() != null) ? bill.getPayment().getId() : null);
            billRespones.setDelivery((bill.getDelivery() != null) ? bill.getDelivery().getId() : null);

            // Tìm BillDetail đầu tiên của Bill
            List<BillDetail> billDetailList = billDetailRepository.findFirstBillDetailByBill(bill.getId());

            if (billDetailList != null && !billDetailList.isEmpty()) {
                BillDetail billDetail = billDetailList.get(0);
                BillDetailRespones billDetailRespones = new BillDetailRespones();
                billDetailRespones.setId(billDetail.getId());
                billDetailRespones.setPrice(billDetail.getPrice());
                billDetailRespones.setQuantity(billDetail.getQuantity());
                billDetailRespones.setTotalPrice(billDetail.getTotalPrice());
                billDetailRespones.setCreatedBy(billDetail.getCreatedBy());
                billDetailRespones.setUpdatedBy(billDetail.getUpdatedBy());

                // Nếu có ProductDetail, set vào
                if (billDetail.getIdProductDetail() != null) {
                    ProductDetailRespones productDetailRespones = new ProductDetailRespones();
                    productDetailRespones.setId(billDetail.getIdProductDetail().getId());
                    productDetailRespones.setProductName(billDetail.getIdProductDetail().getProduct().getName());
                    productDetailRespones.setRam(billDetail.getIdProductDetail().getRam().getCapacity());
                    productDetailRespones.setRom(billDetail.getIdProductDetail().getRom().getCapacity());
                    productDetailRespones.setDescriptionRom(billDetail.getIdProductDetail().getRom().getDescription());
                    productDetailRespones.setColor(billDetail.getIdProductDetail().getColor().getName());
                    productDetailRespones.setImage(billDetail.getIdProductDetail().getImageUrl());
                    productDetailRespones.setPrice(billDetail.getIdProductDetail().getPrice());
                    productDetailRespones.setPriceSell(billDetail.getIdProductDetail().getPriceSell());

                    billDetailRespones.setProductDetail(productDetailRespones);
                }
                billRespones.setDetailCount(billDetailList.size());
                // Chỉ set BillDetail đầu tiên
                billRespones.setBillDetailResponesList(List.of(billDetailRespones));
            } else {
                billRespones.setBillDetailResponesList(List.of()); // Không có BillDetail nào
            }
            return billRespones;
        }).collect(Collectors.toList());

        return billResponesList.stream().sorted(Comparator.comparing(BillRespones::getPaymentDate).reversed())
                .collect(Collectors.toList());
    }



    @Override
    public BillRespones getAllBillByAccount(Integer idBill) {
        Optional<Bill> optionalBill = billRepository.traCuuDonHang(idBill);

        if (optionalBill.isEmpty()) {
            return null;
        }

        Bill bill = optionalBill.get();
        BillRespones billRespones = new BillRespones();

        billRespones.setId(bill.getId());
        billRespones.setCode(bill.getCode());
        billRespones.setMaBill(bill.getMaBill());
        billRespones.setFullNameKh((bill.getIdAccount() != null) ? bill.getIdAccount().getFullName() : null);
        billRespones.setFullNameNV((bill.getIdNhanVien() != null) ? bill.getIdNhanVien().getFullName() : null);
        billRespones.setCodeVoucher((bill.getIdVoucher() != null) ? bill.getIdVoucher().getCode() : null);
        billRespones.setTotalPrice(bill.getTotalPrice());
        billRespones.setCustomerPayment(bill.getCustomerPayment());
        billRespones.setAmountChange(bill.getAmountChange());
        billRespones.setDeliveryFee(bill.getDeliveryFee());
        billRespones.setTotalDue(bill.getTotalDue());
        billRespones.setCustomerRefund(bill.getCustomerRefund());
        billRespones.setDiscountedTotal(bill.getDiscountedTotal());
        billRespones.setPayInsurance(bill.getPayInsurance());
        billRespones.setPaymentDate(bill.getPaymentDate());
        billRespones.setBillType(bill.getBillType());
        billRespones.setStatus(bill.getStatus());
        billRespones.setAddress(bill.getAddress());
        billRespones.setEmail(bill.getEmail());
        billRespones.setPhone(bill.getPhone());
        billRespones.setNote(bill.getNote());
        billRespones.setName(bill.getName());
        billRespones.setPayment((bill.getPayment() != null) ? bill.getPayment().getId() : null);
        billRespones.setDelivery((bill.getDelivery() != null) ? bill.getDelivery().getId() : null);

        // Lấy danh sách BillDetail
        List<BillDetail> billDetailList = billDetailRepository.findByIdBill(bill.getId());

        if (billDetailList != null && !billDetailList.isEmpty()) {
            List<BillDetailRespones> billDetailResponesList = billDetailList.stream().map(billDetail -> {
                BillDetailRespones billDetailRespones = new BillDetailRespones();
                billDetailRespones.setId(billDetail.getId());
                billDetailRespones.setPrice(billDetail.getPrice());
                billDetailRespones.setQuantity(billDetail.getQuantity());
                billDetailRespones.setTotalPrice(billDetail.getTotalPrice());
                billDetailRespones.setCreatedBy(billDetail.getCreatedBy());
                billDetailRespones.setUpdatedBy(billDetail.getUpdatedBy());

                // Nếu có ProductDetail
                if (billDetail.getIdProductDetail() != null) {
                    ProductDetailRespones productDetailRespones = new ProductDetailRespones();
                    productDetailRespones.setId(billDetail.getIdProductDetail().getId());
                    productDetailRespones.setProductName(billDetail.getIdProductDetail().getProduct().getName());
                    productDetailRespones.setRam(billDetail.getIdProductDetail().getRam().getCapacity());
                    productDetailRespones.setRom(billDetail.getIdProductDetail().getRom().getCapacity());
                    productDetailRespones.setDescriptionRom(billDetail.getIdProductDetail().getRom().getDescription());
                    productDetailRespones.setColor(billDetail.getIdProductDetail().getColor().getName());
                    productDetailRespones.setImage(billDetail.getIdProductDetail().getImageUrl());
                    productDetailRespones.setPrice(billDetail.getIdProductDetail().getPrice());
                    productDetailRespones.setPriceSell(billDetail.getIdProductDetail().getPriceSell());

                    billDetailRespones.setProductDetail(productDetailRespones);
                }

                return billDetailRespones;
            }).collect(Collectors.toList());

            billRespones.setBillDetailResponesList(billDetailResponesList);
            billRespones.setDetailCount(billDetailList.size());
        } else {
            billRespones.setBillDetailResponesList(List.of());
            billRespones.setDetailCount(0);
        }

        return billRespones;
    }





}
