package com.example.be.core.client.cart.service.impl;



import com.example.be.core.client.cart.dto.request.OrderRequest;
import com.example.be.core.client.cart.service.OrderService;
import com.example.be.entity.*;
import com.example.be.entity.status.*;
import com.example.be.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@Service
public class OrderServiceImpl implements OrderService {

    private final AccountRepository accountRepository;
    private final CartDetailRepository cartDetailRepository;
    private final BillRepository billRepository;
    private final BillDetailRepository billDetailRepository;
    private final ProductDetailRepository productDetailRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final DeliveryMethodRepository deliveryMethodRepository;
    private final VoucherRepository voucherRepository;
    private final VoucherAccountRepository voucherAccountRepository;

    @Override
//    @Transactional
    public Object order(OrderRequest orderRequest, Account account) throws Exception {

        OrderRequest.CustomerInfo customerInfo = orderRequest.getCustomerInfo();
        OrderRequest.Location location = orderRequest.getLocation();
        List<OrderRequest.Products> productsList = orderRequest.getProducts();

        //mua lan 1 chua day du thong tin
        if (account !=null) {
            if (account.getPhone() == null || account.getAddress() == null){
                account.setPhone(customerInfo.getPhone());
                account.setAddress(location.getFullAddress());
                accountRepository.save(account);
            }

        }
        if (orderRequest.getIdVoucher() != null) {
            Voucher voucher = voucherRepository.findByIdAndStatus(orderRequest.getIdVoucher(), StatusVoucher.ACTIVE);
            if (voucher == null) {
                throw new Exception("Voucher:" + voucher.getCode() + " hiện đã hết thời gian khuyến mãi");
            }
            // xu ly voucher
            if (account != null){
                boolean checkVoucherAccount = voucherAccountRepository.existsByIdVoucherIdAndIdAccountId(voucher.getId(),account.getId());
                if (checkVoucherAccount) {
                    VoucherAccount voucherAccount = voucherAccountRepository.findByIdVoucherAndIdAccount(voucher.getId(), account.getId()).get();
                    voucherAccount.setStatus(VoucherAccountStatus.USED);
                    voucherAccountRepository.save(voucherAccount);
                }
            }else {
                voucher.setQuantity(voucher.getQuantity()-1);
                voucherRepository.save(voucher);
            }
        }

        //tao bill
        Bill bill = new Bill();
        bill.setIdAccount(account);
        bill.setNameBill("HD00" + billRepository.getNewCode());
        bill.setName(customerInfo.getName());
        bill.setEmail(customerInfo.getEmail());
        bill.setAddress(location.getFullAddress());
        bill.setPhone(customerInfo.getPhone());
        bill.setPaymentDate(LocalDateTime.now());
        bill.setBillType((byte) 1);
        bill.setAmountChange(BigDecimal.ZERO);
        //phuong thuc thanh toan ...

        bill.setStatus(StatusBill.CHO_XAC_NHAN);
        Bill creteBill = billRepository.save(bill);

        // check loi
        for (OrderRequest.Products products: productsList) {
            CartDetail cartDetail = cartDetailRepository.findById(products.getId()).orElseThrow(() ->
                    new Exception("Lỗi giỏ hàng!"));
            ProductDetail productDetail = productDetailRepository.findById(cartDetail.getIdProductDetail().getId()).orElseThrow(()->
                    new Exception("Lỗi sản phẩm!"));
            ProductDetail productDetailCheck = productDetailRepository.findByIdAndStatus(productDetail.getId(), ProductDetailStatus.ACTIVE);
            if (productDetailCheck == null){
                throw new Exception("Sản phẩm "+productDetail.getProduct().getName()+" " + productDetail.getColor().getName()+" "+ productDetail.getRam().getCapacity()
                        +"/"+productDetail.getRom().getCapacity()+" đang dừng bán" );
            }else {
                if (products.getQuantity()>productDetailCheck.getInventoryQuantity()){
                    throw new Exception("Sản phẩm "+productDetail.getProduct().getName()+" " + productDetail.getColor().getName()+" "+ productDetail.getRam().getCapacity()
                            +"/"+productDetail.getRom().getCapacity()+" hiện tại còn:"+ productDetailCheck.getInventoryQuantity());
                }
            }

        }


        //products: la cart-detail
        for (OrderRequest.Products products: productsList) {
            CartDetail cartDetail = cartDetailRepository.findById(products.getId()).get();
            ProductDetail productDetail = productDetailRepository.findById(cartDetail.getIdProductDetail().getId()).get();
            BillDetail billDetail = new BillDetail();
            billDetail.setIdBill(bill);
            billDetail.setIdProductDetail(productDetail);
            billDetail.setPrice(products.getPriceSell());
            billDetail.setQuantity(products.getQuantity());
            BigDecimal totalPrice = products.getPriceSell().multiply(BigDecimal.valueOf(products.getQuantity()));
            billDetail.setTotalPrice(totalPrice);
            billDetailRepository.save(billDetail);
            productDetail.setInventoryQuantity(productDetail.getInventoryQuantity()-products.getQuantity());
            productDetailRepository.save(productDetail);
            cartDetail.setStatus(StatusCartDetail.purchased);
            cartDetailRepository.save(cartDetail);

        }

        creteBill.setTotalPrice(orderRequest.getTotalPrice());

        // tien khach da tra
        PaymentMethod paymentMethod = paymentMethodRepository.findById(orderRequest.getPaymentMethod()).orElseThrow(()->
                new Exception("error paymentMethod"));
        if (orderRequest.getPaymentMethod() ==4){
            creteBill.setPayment(paymentMethod);
            creteBill.setCustomerPayment(BigDecimal.ZERO);
        }else if(orderRequest.getPaymentMethod() ==3){
            creteBill.setPayment(paymentMethod);
            creteBill.setCustomerPayment(orderRequest.getTotalDue());
        }
        //tien giam voucher
        creteBill.setDiscountedTotal(orderRequest.getDiscountedTotal());
        // tien ship
        creteBill.setDeliveryFee(orderRequest.getDeliveryFee());
        // hinh thuc ship
        DeliveryMethod deliveryMethod = deliveryMethodRepository.findById(2).orElseThrow(()->
                new Exception("error deliveryMethod"));
        creteBill.setDelivery(deliveryMethod);

        creteBill.setTotalDue(orderRequest.getTotalDue());
        billRepository.save(creteBill);
        return "Đặt hàng thành công";
    }
}
