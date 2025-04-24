package com.example.be.core.client.cart.service.impl;

import com.example.be.core.client.cart.dto.request.ProductReviewsRequest;
import com.example.be.core.client.cart.service.ProductReviewsService;
import com.example.be.entity.ProductReviews;
import com.example.be.entity.ReviewImage;
import com.example.be.repository.AccountRepository;
import com.example.be.repository.ProductRepository;
import com.example.be.repository.ProductReviewsRepository;
import com.example.be.repository.ReviewImageRepository;
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

    @Override
    public void submitReview(ProductReviewsRequest request) {
        var account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        var product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ProductReviews review = new ProductReviews();
        review.setAccount(account);
        review.setProduct(product);
        review.setGeneralRating(request.getGeneralRating());
        review.setComment(request.getComment());
        review.setDateAssessment(LocalDateTime.now());

        List<ReviewImage> imageEntities = request.getImageUrls().stream()
                .map(url -> {
                    ReviewImage img = new ReviewImage();
                    img.setImageUrl(url);
                    img.setProductReviews(review); // set back-reference
                    return img;
                })
                .collect(Collectors.toList());

        review.setImages(imageEntities);

        productReviewRepository.save(review); // cascade sẽ lưu cả reviewImage
    }
}
