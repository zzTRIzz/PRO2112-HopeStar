package com.example.be.core.client.cart.service.impl;

import com.example.be.core.client.cart.dto.request.ProductReviewsRequest;
import com.example.be.core.client.cart.dto.response.DanhGiaResponse.ProductReviewsListResponse;
import com.example.be.core.client.cart.dto.response.DanhGiaResponse.ProductReviewsResponse;
import com.example.be.core.client.cart.dto.response.DanhGiaResponse.RatingSummaryResponse;
import com.example.be.core.client.cart.service.ProductReviewsService;
import com.example.be.entity.Account;
import com.example.be.entity.Product;
import com.example.be.entity.ProductReviews;
import com.example.be.entity.ReviewImage;
import com.example.be.entity.status.StatusBill;
import com.example.be.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ProductReviewsServiceImpl implements ProductReviewsService {
    private final ProductReviewsRepository productReviewRepository;
    private final ReviewImageRepository reviewImageRepository;
    private final AccountRepository accountRepository;
    private final ProductRepository productRepository;
    private final BillRepository billRepository;


    @Override
    public ProductReviewsListResponse findByIdProduct(Integer idProduct, Account account) {
        List<ProductReviews> productReviews = productReviewRepository.findByProduct(idProduct);
        List<ProductReviewsResponse> productReviewsResponseList = productReviews.stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        ProductReviewsListResponse reviews = new ProductReviewsListResponse();
        reviews.setReviews(productReviewsResponseList);
        reviews.setRatingSummaryResponse(calculateSummary(productReviews));

        if (account != null) {
            boolean hasPurchased = billRepository.existsByCustomerIdAndProductId(
                    account.getId(), idProduct, StatusBill.HOAN_THANH);
            reviews.setHasPurchased(hasPurchased);
        } else {
            reviews.setHasPurchased(false);
        }

        return reviews;
    }



    @Override
    public ProductReviewsResponse submitReview(ProductReviewsRequest request, Account account) {

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ProductReviews review = new ProductReviews();
        review.setProduct(product);
        review.setGeneralRating(request.getGeneralRating());
        review.setComment(request.getComment());
        review.setDateAssessment(LocalDateTime.now());
        review.setAccount(account);

        List<ReviewImage> imageEntities = request.getImageUrls().stream()
                .map(url -> {
                    ReviewImage img = new ReviewImage();
                    img.setImageUrl(url);
                    img.setProductReviews(review);
                    return img;
                })
                .collect(Collectors.toList());

        review.setImages(imageEntities);

        ProductReviews productReviews = productReviewRepository.save(review);
        return toDto(productReviews);
    }


    public ProductReviewsResponse toDto(ProductReviews entity) {
        if (entity == null) {
            return null;
        }
        List<ProductReviews> productReviewsList = productReviewRepository.findByProduct(entity.getProduct().getId());

        ProductReviewsResponse dto = new ProductReviewsResponse();
        dto.setId(entity.getId());
        dto.setGeneralRating(entity.getGeneralRating());
        dto.setComment(entity.getComment());
        dto.setDateAssessment(entity.getDateAssessment());

        if (entity.getImages() != null) {
            List<String> imageUrls = entity.getImages()
                    .stream()
                    .map(ReviewImage::getImageUrl)
                    .collect(Collectors.toList());
            dto.setImageUrls(imageUrls);
        }

        if (entity.getProduct() != null) {
            ProductReviewsResponse.Products productDto = new ProductReviewsResponse.Products();
            productDto.setProductName(entity.getProduct().getName());
            dto.setProduct(productDto);
        }

        if (entity.getAccount() != null) {
            ProductReviewsResponse.Account accountDto = new ProductReviewsResponse.Account();
            accountDto.setFullName(entity.getAccount().getFullName());
            accountDto.setAvatar(entity.getAccount().getImageAvatar());
            dto.setAccount(accountDto);
        }
        return dto;
    }

    public RatingSummaryResponse calculateSummary(List<ProductReviews> reviews) {
        RatingSummaryResponse summary = new RatingSummaryResponse();
        for (ProductReviews review : reviews) {
            summary.addRating(review.getGeneralRating());
        }
        return summary;
    }

}
