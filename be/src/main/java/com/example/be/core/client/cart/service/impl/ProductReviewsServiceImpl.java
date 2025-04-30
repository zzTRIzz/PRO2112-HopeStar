package com.example.be.core.client.cart.service.impl;

import com.example.be.core.client.cart.dto.request.ProductReviewsRequest;
import com.example.be.core.client.cart.dto.response.DanhGiaResponse.ProductReviewsListResponse;
import com.example.be.core.client.cart.dto.response.DanhGiaResponse.ProductReviewsResponse;
import com.example.be.core.client.cart.dto.response.DanhGiaResponse.RatingSummaryResponse;
import com.example.be.core.client.cart.service.ProductReviewsService;
import com.example.be.entity.*;
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
    private final ProductDetailRepository productDetailRepository;
    private final BillRepository billRepository;


    @Override
    public ProductReviewsListResponse findByIdProduct(Integer idProductDetail, Account account) {
        List<ProductReviews> productReviews = productReviewRepository.findByProduct(idProductDetail);
        List<ProductReviewsResponse> productReviewsResponseList = productReviews.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        ProductDetail productDetail = productDetailRepository.findById(idProductDetail)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ProductReviewsListResponse reviews = new ProductReviewsListResponse();
        reviews.setReviews(productReviewsResponseList);
        reviews.setRatingSummaryResponse(calculateSummary(productReviews));
        reviews.setEvaluate(productReviews.size());

        Integer quantity = billRepository.getTotalQuantityByCustomerIdAndProductId(
                account != null ? account.getId() : null, idProductDetail, StatusBill.HOAN_THANH);
        Integer totalQuantity = billRepository.getTotalQuantity( idProductDetail, StatusBill.HOAN_THANH);

        if (account != null) {
            boolean hasSold = quantity != null && quantity > 0;
            reviews.setHasPurchased(hasSold);
        } else {
            reviews.setHasPurchased(false);
        }
            reviews.setProduct(productDetail.getProduct().getName()+" "+productDetail.getRam().getCapacity()+"/"+productDetail.getRom().getCapacity()+"GB"+"-"+productDetail.getColor().getName());
//        System.out.println(totalQuantity);
        reviews.setNumberSold(totalQuantity != null ? totalQuantity : 0);

        return reviews;
    }


    @Override
    public ProductReviewsResponse submitReview(ProductReviewsRequest request, Account account) {

        ProductDetail product = productDetailRepository.findById(request.getProductDetailId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ProductReviews review = new ProductReviews();
        review.setProductDetail(product);
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
