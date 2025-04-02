package com.example.be.core.client.cart.service.impl;



import com.example.be.core.client.cart.dto.request.OrderRequest;
import com.example.be.core.client.cart.service.OrderService;
import com.example.be.entity.*;
import com.example.be.entity.status.ProductDetailStatus;
import com.example.be.entity.status.StatusBill;
import com.example.be.entity.status.StatusCartDetail;
import com.example.be.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


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

    @Override
    public Object order(OrderRequest orderRequest, Account account) throws Exception {

        OrderRequest.CustomerInfo customerInfo = orderRequest.getCustomerInfo();
        OrderRequest.Location location = orderRequest.getLocation();
        List<OrderRequest.Products> productsList = orderRequest.getProducts();

        //mua lan 1 chua day du thong tin
        if (account.getPhone() == null || account.getAddress() == null){
            account.setPhone(customerInfo.getPhone());
            account.setAddress(location.getFullAddress());
            accountRepository.save(account);
        }

        //tao bill
        Bill bill = new Bill();
        bill.setIdAccount(account);
        bill.setNameBill("HD00" + billRepository.getNewCode());
        bill.setEmail(customerInfo.getEmail());
        bill.setAddress(location.getFullAddress());
        bill.setPhone(customerInfo.getPhone());
        bill.setPaymentDate(LocalDateTime.now());
        bill.setBillType((byte) 1);

        //phuong thuc thanh toan ...

        bill.setStatus(StatusBill.CHO_XAC_NHAN);
        Bill creteBill = billRepository.save(bill);
        //tao bill-detail
        for (OrderRequest.Products products: productsList) {
            cartDetailRepository.findById(products.getId()).orElseThrow(() ->
                    new Exception("Lỗi giỏ hàng!"));

        }

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

        BigDecimal totalPriceBill = BigDecimal.ZERO;
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
            //productDetail.setInventoryQuantity(productDetail.getInventoryQuantity()-products.getQuantity());
            //productDetailRepository.save(productDetail);
            cartDetail.setStatus(StatusCartDetail.purchased);
            cartDetailRepository.save(cartDetail);
            totalPriceBill = totalPriceBill.add(totalPrice);
        }

        creteBill.setTotalPrice(totalPriceBill);
        creteBill.setTotalDue(totalPriceBill);
        billRepository.save(creteBill);

        return "Đặt hàng thành công";
    }
}
