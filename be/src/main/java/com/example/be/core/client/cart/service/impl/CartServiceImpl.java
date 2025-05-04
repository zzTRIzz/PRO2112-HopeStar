package com.example.be.core.client.cart.service.impl;

import com.example.be.core.client.cart.dto.request.AddToCartRequest;
import com.example.be.core.client.cart.dto.response.CartDetailResponse;
import com.example.be.core.client.cart.dto.response.CartResponse;
import com.example.be.core.client.cart.service.CartService;
import com.example.be.entity.Account;
import com.example.be.entity.CartDetail;
import com.example.be.entity.ProductDetail;
import com.example.be.entity.ShoppingCart;
import com.example.be.entity.status.ProductDetailStatus;
import com.example.be.entity.status.StatusCartDetail;
import com.example.be.entity.status.StatusCommon;
import com.example.be.repository.CartDetailRepository;
import com.example.be.repository.ProductDetailRepository;
import com.example.be.repository.ShoppingCartRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class CartServiceImpl implements CartService {

    private final ShoppingCartRepository shoppingCartRepository;
    private final CartDetailRepository cartDetailRepository;
    private final ProductDetailRepository productDetailRepository;

    public CartResponse cartMapCartResponse(List<CartDetail> cartDetailList){
        CartResponse cartResponse = new CartResponse();
        List<CartDetailResponse> cartDetailResponseList = new ArrayList<>();
        int quantityCartDetail = 0;
        for (CartDetail cartDetail: cartDetailList) {
            quantityCartDetail ++;
            CartDetailResponse cartDetailResponse = new CartDetailResponse();
            cartDetailResponse.setId(cartDetail.getId());
            cartDetailResponse.setQuantity(cartDetail.getQuantity());
            cartDetailResponse.setIdProduct(cartDetail.getIdProductDetail().getProduct().getId());
            cartDetailResponse.setProductName(cartDetail.getIdProductDetail().getProduct().getName());
            cartDetailResponse.setColor(cartDetail.getIdProductDetail().getColor().getName());
            cartDetailResponse.setRam(cartDetail.getIdProductDetail().getRam().getCapacity()+cartDetail.getIdProductDetail().getRam().getDescription());
            cartDetailResponse.setRom(cartDetail.getIdProductDetail().getRom().getCapacity()+cartDetail.getIdProductDetail().getRom().getDescription());
            cartDetailResponse.setPrice(cartDetail.getIdProductDetail().getPrice());
            cartDetailResponse.setPriceSell(cartDetail.getIdProductDetail().getPriceSell());
            cartDetailResponse.setImage(cartDetail.getIdProductDetail().getImageUrl());
            cartDetailResponseList.add(cartDetailResponse);
        }
        cartResponse.setQuantityCartDetail(quantityCartDetail);
        cartResponse.setCartDetailResponseList(cartDetailResponseList);
        return cartResponse;
    }

    @Override
    public CartResponse getCart(Account account) {
        ShoppingCart cart = shoppingCartRepository.findShoppingCartByIdAccount(account);
        List<CartDetail> cartDetailList = cartDetailRepository.findCartDetailByIdShoppingCartAndStatus(cart, StatusCartDetail.pending);
        return cartMapCartResponse(cartDetailList);
    }

    @Override
    public CartResponse getOrCreateGuestCart(String guestCartId) {
        ShoppingCart cart = shoppingCartRepository.findShoppingCartByGuestId(guestCartId)
                .orElseGet(() -> {
                    // Nếu không tìm thấy, tạo mới giỏ hàng
                    ShoppingCart newCart = new ShoppingCart();
                    newCart.setGuestId(guestCartId);
                    return shoppingCartRepository.save(newCart);
                });
        List<CartDetail> cartDetailList = cartDetailRepository.findCartDetailByIdShoppingCartAndStatus(cart, StatusCartDetail.pending);
        return cartMapCartResponse(cartDetailList);
    }

    @Override
    public Object addToCart(AddToCartRequest request, Account account,String guestCartId) throws Exception {

        ShoppingCart cart = new ShoppingCart();
        if (account != null){
            if(account.getStatus().equals(StatusCommon.IN_ACTIVE)){
                throw new Exception("Tài khoản đã bạn bị vô hiệu");
            }
            cart = shoppingCartRepository.findShoppingCartByIdAccount(account);
        }else {
            cart = shoppingCartRepository.findShoppingCartByGuestId(guestCartId).get();
        }
        ProductDetail productDetail = productDetailRepository.findByIdAndStatus(request.getIdProductDetail(), ProductDetailStatus.ACTIVE);
        if(productDetail == null) {
            throw new Exception("Không tìm thấy sản phẩm này");
        }

        // Check if product already exists in cart
        CartDetail existingDetail = cartDetailRepository
                .findCartDetailByIdShoppingCartAndStatusAndAndIdProductDetail(cart, StatusCartDetail.pending, productDetail);
        if (request.getQuantity()>productDetail.getInventoryQuantity()){
            throw new Exception("Sản phẩm bạn thêm chỉ còn: "+productDetail.getInventoryQuantity());
        }
        CartResponse cartResponse = new CartResponse();
        if (existingDetail != null) {

            if ((request.getQuantity()+existingDetail.getQuantity())>productDetail.getInventoryQuantity()){
                throw new Exception("Sản phẩm bạn thêm chỉ còn: "+productDetail.getInventoryQuantity()+" Giỏ hàng đã có: "+existingDetail.getQuantity());
            }

            Integer sum = request.getQuantity() + existingDetail.getQuantity();
            if (sum > 5){
                throw new Exception("Sản phẩm thêm tối đa là 5. Giỏ hàng đã có: "+existingDetail.getQuantity()+" .Bạn muốn mua số lượng hãy liên hệ với chúng tôi.");
            }

            existingDetail.setQuantity(existingDetail.getQuantity() + request.getQuantity());
            CartDetail test = cartDetailRepository.save(existingDetail);
            List<CartDetail> list = new ArrayList<>();
            list.add(test);
            cartResponse = cartMapCartResponse(list);
        } else {
            CartDetail cartDetail = new CartDetail();
            cartDetail.setIdShoppingCart(cart);
            cartDetail.setIdProductDetail(productDetail);
            cartDetail.setQuantity(request.getQuantity());
            cartDetail.setStatus(StatusCartDetail.pending);
            CartDetail test = cartDetailRepository.save(cartDetail);
            List<CartDetail> list = new ArrayList<>();
            list.add(test);
            cartResponse = cartMapCartResponse(list);
        }

        return cartResponse;
    }

    @Override
    @Transactional
    public void mergeGuestCartToAccount(String guestCartId, Account account) {
        ShoppingCart guestCart = shoppingCartRepository.findShoppingCartByGuestId(guestCartId).get();
        ShoppingCart userCart = shoppingCartRepository.findShoppingCartByIdAccount(account);
        List<CartDetail> cartDetailGuest = cartDetailRepository.findCartDetailByIdShoppingCartAndStatus(guestCart, StatusCartDetail.pending);
        List<CartDetail> cartDetailUser = cartDetailRepository.findCartDetailByIdShoppingCartAndStatus(userCart, StatusCartDetail.pending);
        //hop nhat
        for (CartDetail guestDetail : cartDetailGuest) {

            // Kiểm tra nếu sản phẩm đã có trong giỏ hàng thì cộng dồn số lượng
            Optional<CartDetail> existingDetail = cartDetailUser.stream()
                    .filter(item -> item.getIdProductDetail().getId().equals(guestDetail.getIdProductDetail().getId()))
                    .findFirst();

            if (existingDetail.isPresent()) {
                existingDetail.get().setQuantity(existingDetail.get().getQuantity() + guestDetail.getQuantity());
            } else {
                CartDetail newDetail = new CartDetail();
                newDetail.setIdShoppingCart(userCart);
                newDetail.setIdProductDetail(guestDetail.getIdProductDetail());
                newDetail.setQuantity(guestDetail.getQuantity());
                newDetail.setStatus(StatusCartDetail.pending);
                cartDetailRepository.save(newDetail);
            }
        }
        cartDetailRepository.deleteCartDetailByIdShoppingCart(guestCart);

        shoppingCartRepository.delete(guestCart);

    }

    @Scheduled(cron = "0 0 3 * * ?") // 3h sáng hàng ngày
    @Transactional
    public void cleanupOldGuestCarts() {
        // 1. Tìm tất cả guest cart cũ (30 ngày)
        List<ShoppingCart> oldCarts = shoppingCartRepository.findByGuestIdIsNotNullAndCreatedAtBefore(
                LocalDateTime.now().minusDays(30)
        );

        // 2. Xóa cart-detail trước
        for (ShoppingCart cart : oldCarts) {
            cartDetailRepository.deleteCartDetailByIdShoppingCart(cart);
        }

        // 3. Sau đó xóa cart
        shoppingCartRepository.deleteAll(oldCarts);

    }

}
