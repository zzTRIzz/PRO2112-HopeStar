package com.example.be.core.client.cart.service.impl;


import com.example.be.core.client.cart.dto.request.OrderRequest;
import com.example.be.core.client.cart.service.OrderService;
import com.example.be.entity.*;
import com.example.be.entity.status.*;
import com.example.be.repository.*;
import com.example.be.utils.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
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
    private final BillHistoryRepository billHistoryRepository;
    private final EmailService emailService;

    public String generateBillCode() {
        String timePart = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyMMddHHmm"));
        int randomPart = (int) (Math.random() * 90000) + 10000;
        return timePart + randomPart;
    }

    @Override
//    @Transactional
    public Object order(OrderRequest orderRequest, Account account) throws Exception {
        OrderRequest.CustomerInfo customerInfo = orderRequest.getCustomerInfo();
        OrderRequest.Location location = orderRequest.getLocation();
        List<OrderRequest.Products> productsList = orderRequest.getProducts();

        //mua lan 1 chua day du thong tin
        if (account != null) {
            if (account.getPhone() == null || account.getAddress() == null) {
                account.setPhone(customerInfo.getPhone());
                account.setAddress(location.getFullAddress());
                accountRepository.save(account);
            }

        }
        Voucher voucher = null;
        if (orderRequest.getIdVoucher() != null) {
             voucher = voucherRepository.findByIdAndStatus(orderRequest.getIdVoucher(), StatusVoucher.ACTIVE);
            if (voucher == null) {
                throw new Exception("Voucher hiện đã hết thời gian khuyến mãi");
            }
            // xu ly voucher
            if (account != null) {
                boolean checkVoucherAccount = voucherAccountRepository.existsByIdVoucherIdAndIdAccountId(voucher.getId(), account.getId());
                if (checkVoucherAccount) {
                    VoucherAccount voucherAccount = voucherAccountRepository.findByIdVoucher(voucher.getId(), account.getId()).get();
                    voucherAccount.setStatus(VoucherAccountStatus.USED);
                    voucherAccountRepository.save(voucherAccount);
                }else {
                    voucher.setQuantity(voucher.getQuantity() - 1);
                    voucherRepository.save(voucher);
                }
            } else {
                voucher.setQuantity(voucher.getQuantity() - 1);
                voucherRepository.save(voucher);
            }
        }

        //tao bill
        Bill bill = new Bill();
        bill.setIdAccount(account);
        bill.setCode("HD00" + billRepository.getNewCode());
        bill.setMaBill(generateBillCode());
        bill.setName(customerInfo.getName());
        bill.setEmail(customerInfo.getEmail());
        bill.setAddress(location.getFullAddress());
        bill.setPhone(customerInfo.getPhone());
        bill.setPaymentDate(LocalDateTime.now());
        bill.setBillType((byte) 1);
        bill.setAmountChange(BigDecimal.ZERO);
        bill.setPayInsurance(orderRequest.getInsuranceFee());
        bill.setStatus(StatusBill.CHO_XAC_NHAN);
        bill.setIdVoucher(voucher);
        Bill creteBill = billRepository.save(bill);

        List<BillDetail> list = new ArrayList<>();
        //products: la cart-detail
        for (OrderRequest.Products products : productsList) {
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
//            productDetail.setInventoryQuantity(productDetail.getInventoryQuantity() - products.getQuantity());
            productDetailRepository.save(productDetail);
            cartDetail.setStatus(StatusCartDetail.purchased);
            cartDetailRepository.save(cartDetail);
            list.add(billDetail);
        }

        creteBill.setTotalPrice(orderRequest.getTotalPrice());

        // tien khach da tra
        PaymentMethod paymentMethod = paymentMethodRepository.findById(orderRequest.getPaymentMethod()).orElseThrow(() ->
                new Exception("error paymentMethod"));

        BillHistory billHistory = new BillHistory();
        if (orderRequest.getPaymentMethod() == 4) {
            creteBill.setPayment(paymentMethod);
            creteBill.setCustomerPayment(BigDecimal.ZERO);
            creteBill.setStatus(StatusBill.CHO_XAC_NHAN);
            billHistory.setBill(creteBill);
            billHistory.setActionTime(LocalDateTime.now());
            billHistory.setNote("Đơn hàng đã được đặt thành công ");
            billHistory.setActionType(StartusBillHistory.CHO_XAC_NHAN);
            billHistoryRepository.save(billHistory);
        } else if (orderRequest.getPaymentMethod() == 3) {
            creteBill.setPayment(paymentMethod);
            creteBill.setCustomerPayment(orderRequest.getTotalDue());
            creteBill.setStatus(StatusBill.DA_XAC_NHAN);
            billHistory.setBill(creteBill);
            billHistory.setNote("Đơn hàng đã được đặt và thanh toán thành công");
            billHistory.setActionTime(LocalDateTime.now());
            billHistory.setActionType(StartusBillHistory.DA_XAC_NHAN);
            billHistoryRepository.save(billHistory);
        }
        //tien giam voucher
        creteBill.setDiscountedTotal(orderRequest.getDiscountedTotal());
        // tien ship
        creteBill.setDeliveryFee(orderRequest.getDeliveryFee());
        // hinh thuc ship
        DeliveryMethod deliveryMethod = deliveryMethodRepository.findById(2).orElseThrow(() ->
                new Exception("error deliveryMethod"));
        creteBill.setDelivery(deliveryMethod);

        creteBill.setTotalDue(orderRequest.getTotalDue());
        billRepository.save(creteBill);
        if(orderRequest.getEInvoice() != null){
            if (orderRequest.getEInvoice()){

                String subject = "HopeStar - Gửi hóa đơn điện tử";
                String title = "HopeStar - Gửi hóa đơn điện tử";
                String header = "";

                String content = "<tr>\n" +
                        "    <td style=\"padding: 20px 10px; background: #f4f4f4;\">\n" +
                        "        <div style=\"font-family: Arial, sans-serif; padding: 20px; max-width: 800px; width: 100%; margin: 0 auto; background: white; border-radius: 16px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); box-sizing: border-box;\">\n" +
                        "            <!-- Phần đầu: Logo và thông tin cửa hàng -->\n" +
                        "            <div style=\"display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 20px;\">\n" +
                        "                <div style=\"display: flex; align-items: center; gap: 8px; flex: 1; min-width: 150px;\">\n" +
                        "                    <img src=\"https://res.cloudinary.com/domlvyqqe/image/upload/v1745519662/qetyhp2r31awc338uw5n.jpg\" alt=\"logo\" style=\"width: 40px; height: 40px; max-width: 100%;\" />\n" +
                        "                    <h1 style=\"font-size: 28px; font-weight: bold; color: #ff6200; margin: 0;\">HopeStar</h1>\n" +
                        "                </div>\n" +
                        "                <div style=\"font-size: 14px; text-align: left; color: #666; flex: 1; min-width: 150px; margin-top: 10px;\">\n" +
                        "                    <p style=\"margin: 0 0 5px;\"><strong>Địa chỉ:</strong> Cao đẳng FPT Polytechnic, Hà Nội</p>\n" +
                        "                    <p style=\"margin: 0 0 5px;\"><strong>Điện thoại:</strong> 0705905992</p>\n" +
                        "                    <p style=\"margin: 0;\"><strong>Email:</strong> hopestarshop@gmail.com</p>\n" +
                        "                </div>\n" +
                        "            </div>\n" +
                        "\n" +
                        "            <!-- Phần tiêu đề hóa đơn -->\n" +
                        "            <div style=\"text-align: center; margin-bottom: 30px;\">\n" +
                        "                <h2 style=\"font-size: 24px; font-weight: bold; color: #ff6200; margin: 0 0 10px;\">HÓA ĐƠN BÁN HÀNG</h2>\n" +
                        "                <div style=\"display: inline-block; background: #f8f8f8; padding: 8px 16px; border-radius: 20px; margin-top: 10px;\">\n" +
                        "                    <p style=\"margin: 0; font-size: 14px; color: #666;\"><strong>Mã hóa đơn:</strong> " + creteBill.getMaBill() + "</p>\n" +
                        "                    <p style=\"margin: 0; font-size: 14px; color: #666;\"><strong>Ngày:</strong> " + creteBill.getPaymentDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")) + "</p>\n" +
                        "                </div>\n" +
                        "            </div>\n" +
                        "\n" +
                        "            <!-- Phần thông tin người nhận -->\n" +
                        "            <div style=\"font-size: 14px; margin-bottom: 20px; padding: 15px; background: #f9f9f9; border-radius: 8px;\">\n" +
                        "                <p style=\"margin: 0 0 5px;\"><strong>Người mua:</strong> " + creteBill.getName() + "</p>\n" +
                        "                <p style=\"margin: 0 0 5px;\"><strong>Số điện thoại:</strong> " + creteBill.getPhone() + "</p>\n" +
                        "                <p style=\"margin: 0;\"><strong>Email:</strong> " + creteBill.getEmail() + "</p>\n" +
                        "                <p style=\"margin: 0;\"><strong>Địa chỉ:</strong> " + creteBill.getAddress() + "</p>\n" +
                        "            </div>\n" +
                        "\n" +
                        "            <!-- Bảng sản phẩm -->\n" +
                        "            <table style=\"width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px; table-layout: auto;\">\n" +
                        "                <thead>\n" +
                        "                    <tr style=\"background: #ff6200; color: white;\">\n" +
                        "                        <th style=\"padding: 12px; text-align: center; border-radius: 8px 0 0 0; width: 10%;\">STT</th>\n" +
                        "                        <th style=\"padding: 12px; text-align: left; width: 40%;\">Sản phẩm</th>\n" +
                        "                        <th style=\"padding: 12px; text-align: center; width: 15%;\">Số lượng</th>\n" +
                        "                        <th style=\"padding: 12px; text-align: right; width: 20%;\">Đơn giá</th>\n" +
                        "                        <th style=\"padding: 12px; text-align: right; border-radius: 0 8px 0 0; width: 15%;\">Tổng</th>\n" +
                        "                    </tr>\n" +
                        "                </thead>\n" +
                        "                <tbody>\n" +
                        getItemsHtml(list) +
                        "                </tbody>\n" +
                        "            </table>\n" +
                        "\n" +
                        "            <!-- Phần tổng kết thanh toán -->\n" +
                        "            <div style=\"background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px; font-size: 14px; max-width: 400px; margin-left: auto;\" class=\"payment-summary\">\n" +
                        "                <div style=\"display: flex; justify-content: space-between; margin-bottom: 8px;\">\n" +
                        "                    <span><strong>Tổng tiền hàng:</strong></span>\n" +
                        "                    <span>" + formatCurrency(creteBill.getTotalPrice()) + " đ</span>\n" +
                        "                </div>\n" +
                        (creteBill.getDiscountedTotal().compareTo(BigDecimal.ZERO) > 0 ?
                                "                <div style=\"display: flex; justify-content: space-between; margin-bottom: 8px; color: #ff6200;\">\n" +
                                        "                    <span><strong>Giảm giá:</strong></span>\n" +
                                        "                    <span>-" + formatCurrency(creteBill.getDiscountedTotal()) + " đ</span>\n" +
                                        "                </div>\n" : "") +
                        "                <div style=\"display: flex; justify-content: space-between; margin-bottom: 8px;\">\n" +
                        "                    <span><strong>Phí ship:</strong></span>\n" +
                        "                    <span>" + formatCurrency(creteBill.getDeliveryFee()) + " đ</span>\n" +
                        "                </div>\n" +
                        (creteBill.getPayInsurance().compareTo(BigDecimal.ZERO) > 0 ?
                                "                <div style=\"display: flex; justify-content: space-between; margin-bottom: 8px;\">\n" +
                                        "                    <span><strong>Phí bảo hiểm:</strong></span>\n" +
                                        "                    <span>" + formatCurrency(creteBill.getPayInsurance()) + " đ</span>\n" +
                                        "                </div>\n" : "") +
                        "                <div style=\"display: flex; justify-content: space-between; margin: 20px 0 8px; padding-top: 12px; border-top: 1px dashed #ddd;\">\n" +
                        "                    <span><strong>Thành tiền:</strong></span>\n" +
                        "                    <span>" + formatCurrency(creteBill.getTotalDue()) + " đ</span>\n" +
                        "                </div>\n" +
                        "                <div style=\"display: flex; justify-content: space-between; margin-bottom: 8px;\">\n" +
                        "                    <span><strong>Đã trả:</strong></span>\n" +
                        "                    <span>" + formatCurrency(creteBill.getCustomerPayment()) + " đ</span>\n" +
                        "                </div>\n" +
                        "            </div>\n" +
                        "\n" +
                        "            <!-- Phần chân trang -->\n" +
                        "            <div style=\"text-align: center; margin-top: 20px; color: #666; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px;\">\n" +
                        "                <p style=\"margin: 0 0 10px;\">Cảm ơn quý khách đã tin tưởng HopeStar!</p>\n" +
                        "                <p style=\"margin: 0; font-style: italic;\">Hóa đơn điện tử có giá trị như hóa đơn gốc</p>\n" +
                        "            </div>\n" +
                        "        </div>\n" +
                        "    </td>\n" +
                        "</tr>\n" +
                        "<style>\n" +
                        "    @media only screen and (max-width: 600px) {\n" +
                        "        .container { padding: 10px !important; }\n" +
                        "        h1 { font-size: 20px !important; }\n" +
                        "        h2 { font-size: 18px !important; }\n" +
                        "        table { font-size: 12px !important; }\n" +
                        "        th, td { padding: 8px !important; }\n" +
                        "        img { width: 30px !important; height: 30px !important; }\n" +
                        "        .payment-summary { max-width: 100% !important; margin-left: 0 !important; }\n" +
                        "        .payment-summary div { flex-direction: column; align-items: flex-start; }\n" +
                        "        .payment-summary span:last-child { margin-top: 5px; }\n" +
                        "    }\n" +
                        "</style>";
                String footer ="";

                emailService.sendEmailFormat(customerInfo.getEmail(), subject, title, header, content, footer);

            }
            else {
                if (account == null) {
                    String subject = "HopeStar - Gửi mã hóa đơn";
                    String title = "HopeStar - Gửi mã hóa đơn";
                    String header = "<tr>\n" +
                            "    <td style=\"background: #ff6200; padding: 24px; text-align: center; color: white;\">\n" +
                            "        <h1 style=\"font-size: 28px; font-weight: bold; margin: 0;\">HopeStar - Gửi mã hóa đơn</h1>\n" +
                            "    </td>\n" +
                            "</tr>\n";

                    String content = "<tr>\n" +
                            "    <td style=\"padding: 40px;\">\n" +
                            "        <p style=\"font-size: 16px; margin: 0 0 24px 0;\">Xin chào,</p>\n" +
                            "        <p style=\"font-size: 16px; margin: 0 0 24px 0;\">Cảm ơn bạn đã đặt hàng. Cửa hàng gửi bạn mã hóa đơn để tiện theo dõi đơn hàng của mình!</p>\n" +
                            "        <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
                            "            <tr>\n" +
                            "                <td align=\"center\">\n" +
                            "                    <a style=\"background: #ff6200; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;\">" + creteBill.getMaBill() + "</a>\n" +
                            "                </td>\n" +
                            "            </tr>\n" +
                            "        </table>\n" +
                            "    </td>\n" +
                            "</tr>\n";
                    String footer = "<tr>\n" +
                            "    <td style=\"background: #f9fafb; padding: 16px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb;\">\n" +
                            "        <p style=\"margin: 0;\">Phần mềm quản lý cửa hàng điện thoại HopeStar<br>© 2025 HopeStar. All rights reserved.</p>\n" +
                            "    </td>\n" +
                            "</tr>";

                    emailService.sendEmailFormat(customerInfo.getEmail(), subject, title, header, content, footer);
                }
            }
        }

        return "Đơn hàng: " + creteBill.getMaBill() + " đã được đặt thành công";
    }


    private String getItemsHtml(List<BillDetail> items) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < items.size(); i++) {
            BillDetail item = items.get(i);
            sb.append("                    <tr>\n")
                    .append("                        <td style=\"border: 1px solid #ddd; padding: 10px; text-align: center; font-size: 14px; width: 10%;\">").append(i + 1).append("</td>\n")
                    .append("                        <td style=\"border: 1px solid #ddd; padding: 10px; font-size: 14px; width: 40%; word-wrap: break-word; word-break: break-all;\">").append(item.getIdProductDetail().getProduct().getName()).append(" ("+item.getIdProductDetail().getRam().getCapacity()+"/"+item.getIdProductDetail().getRom().getCapacity()+item.getIdProductDetail().getRom().getDescription()+"/"+item.getIdProductDetail().getColor().getName()+")").append("</td>\n")
                    .append("                        <td style=\"border: 1px solid #ddd; padding: 10px; text-align: center; font-size: 14px; width: 15%;\">").append(item.getQuantity()).append("</td>\n")
                    .append("                        <td style=\"border: 1px solid #ddd; padding: 10px; text-align: right; font-size: 14px; width: 20%;\">")
                    .append(formatCurrency(item.getPrice())).append(" đ</td>\n")
                    .append("                        <td style=\"border: 1px solid #ddd; padding: 10px; text-align: right; font-size: 14px; width: 15%;\">")
                    .append(formatCurrency(item.getPrice().multiply(new BigDecimal(item.getQuantity())))).append(" đ</td>\n")
                    .append("                    </tr>\n");
        }
        return sb.toString();
    }



    private String formatCurrency(BigDecimal amount) {
        // Format number with Vietnamese locale (1,000,000)
        return String.format("%,.0f", amount);
    }
}