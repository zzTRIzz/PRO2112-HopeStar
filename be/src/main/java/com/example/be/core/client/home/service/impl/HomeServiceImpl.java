package com.example.be.core.client.home.service.impl;


import com.example.be.core.client.home.dto.request.PhoneFilterRequest;
import com.example.be.core.client.home.dto.response.ProductDetailViewResponse;
import com.example.be.core.client.home.dto.response.ProductViewResponse;
import com.example.be.core.client.home.dto.response.ProductViewResponseAll;
import com.example.be.core.client.home.service.HomeService;
import com.example.be.entity.Product;
import com.example.be.entity.ProductDetail;
import com.example.be.entity.status.StatusCommon;
import com.example.be.repository.ProductDetailRepository;
import com.example.be.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


@RequiredArgsConstructor
@Service
public class HomeServiceImpl implements HomeService {
    private final ProductRepository productRepository;
    private final ProductDetailRepository productDetailRepository;
    @Override
    public ProductViewResponseAll getProductView() {

        List<Product> products = productRepository.findByStatusOrderByCreatedAtDesc(StatusCommon.ACTIVE);
        List<Product> products2 = productRepository.findTop10SellingProducts(StatusCommon.ACTIVE);

        List<ProductViewResponse> newestProducts = handlerProductView(products);
        List<ProductViewResponse> bestSellingProducts = handlerProductView(products2);

        ProductViewResponseAll productViewResponseAll = new ProductViewResponseAll();
        productViewResponseAll.setNewestProducts(newestProducts);
        productViewResponseAll.setBestSellingProducts(bestSellingProducts);
        return productViewResponseAll;
    }

    public List<ProductViewResponse> handlerProductView(List<Product> products){
        List<ProductViewResponse> productViewResponseList = new ArrayList<>();
        for (Product product:products) {
            ProductViewResponse productViewResponse = new ProductViewResponse();

            List<ProductDetail> productDetailList = productDetailRepository.findAllByProduct(product);
            List<ProductDetail> availableProducts = productDetailList.stream()
                    .filter(pd -> pd.getInventoryQuantity() != null && pd.getInventoryQuantity() > 0)
                    .collect(Collectors.toList());
            ProductDetail productDetail;
            if (availableProducts.size() !=0){
                productDetail = availableProducts.get(0);
                productViewResponse.setIdProduct(product.getId());
                productViewResponse.setName(product.getName());
                productViewResponse.setIdProductDetail(productDetail.getId());
                productViewResponse.setPrice(productDetail.getPrice());
                productViewResponse.setPriceSeller(productDetail.getPriceSell());
                productViewResponse.setImage(productDetail.getImageUrl());
                // Lấy danh sách capacity duy nhất
                List<Integer> uniqueRamCapacities = productDetailList.stream()
                        .filter(pd -> pd.getRam() != null)         // Loại bỏ ProductDetail không có Ram
                        .map(pd -> pd.getRam().getCapacity())      // Lấy capacity từ Ram
                        .filter(Objects::nonNull)                  // Loại bỏ capacity null
                        .distinct()                                // Chỉ giữ giá trị duy nhất
                        .collect(Collectors.toList());

                List<Integer> uniqueRomCapacities = productDetailList.stream()
                        .filter(pd -> pd.getRom() != null)
                        .map(pd -> pd.getRom().getCapacity())
                        .filter(Objects::nonNull)
                        .distinct()
                        .collect(Collectors.toList());

                List<String> uniqueColorHex = productDetailList.stream()
                        .filter(pd -> pd.getColor() != null)
                        .map(pd -> pd.getColor().getHex())
                        .filter(Objects::nonNull)
                        .distinct()
                        .collect(Collectors.toList());


                productViewResponse.setRam(uniqueRamCapacities);
                productViewResponse.setRom(uniqueRomCapacities);
                productViewResponse.setHex(uniqueColorHex);
                productViewResponseList.add(productViewResponse);
            }
        }
        return productViewResponseList;
    }

    @Override
    public ProductDetailViewResponse getProductDetailView(Integer idProduct) throws Exception {
        // Lấy thông tin sản phẩm từ repository
        Product product = productRepository.findById(idProduct)
                .orElseThrow(() -> new Exception("Product not found with id: " + idProduct));

        // Lấy danh sách ProductDetail liên quan đến sản phẩm
        List<ProductDetail> productDetailList = productDetailRepository.findAllByProduct(product).stream()
                .filter(pd -> pd.getInventoryQuantity() != null && pd.getInventoryQuantity() > 0)
                .collect(Collectors.toList());

        // Tạo đối tượng ProductDetailViewResponse
        ProductDetailViewResponse response = new ProductDetailViewResponse();
        response.setId(product.getId());
        response.setProductName(product.getName());
        response.setProductDescription(product.getDescription());

        // Xây dựng danh sách các cặp RAM-ROM
        List<ProductDetailViewResponse.RamRomOption> ramRomOptions = new ArrayList<>();
        Set<String> uniqueRamRomPairs = new HashSet<>(); // Để đảm bảo không trùng lặp

        for (ProductDetail pd : productDetailList) {
            if (pd.getRam() != null && pd.getRom() != null) {
                String ramRomKey = pd.getRam().getId() + "-" + pd.getRom().getId();

                // Kiểm tra xem cặp RAM-ROM đã tồn tại chưa
                if (!uniqueRamRomPairs.contains(ramRomKey)) {
                    ProductDetailViewResponse.RamRomOption ramRomOption = new ProductDetailViewResponse.RamRomOption();
                    ramRomOption.setRamId(pd.getRam().getId());
                    ramRomOption.setRamSize(pd.getRam().getCapacity() + "GB");
                    ramRomOption.setRomId(pd.getRom().getId());
                    ramRomOption.setRomSize(pd.getRom().getCapacity() + "GB");

                    ramRomOptions.add(ramRomOption);
                    uniqueRamRomPairs.add(ramRomKey);
                }
            }
        }

        // Điền danh sách cặp RAM-ROM vào response
        response.setRamRomOptions(ramRomOptions);

        // Xây dựng danh sách màu sắc
        List<ProductDetailViewResponse.ColorOption> colorOptions = productDetailList.stream()
                .filter(pd -> pd.getColor() != null)
                .map(pd -> {
                    ProductDetailViewResponse.ColorOption colorOption = new ProductDetailViewResponse.ColorOption();
                    colorOption.setId(pd.getColor().getId());
                    colorOption.setColorName(pd.getColor().getName());
                    colorOption.setColorCode(pd.getColor().getHex());
                    return colorOption;
                })
                .distinct()
                .collect(Collectors.toList());

        response.setColorOptions(colorOptions);

        List<String> imageUrls = productDetailList.stream()
                .map(pd->pd.getImageUrl())
                .distinct()
                .collect(Collectors.toList());
        response.setImageUrls(imageUrls);


        // Xây dựng Map productDetails
        Map<String, ProductDetailViewResponse.ProductDetailInfo> productDetails = new HashMap<>();
        for (ProductDetail pd : productDetailList) {
            if (pd.getRam() != null && pd.getRom() != null && pd.getColor() != null) {
                String key = pd.getRam().getId() + "-" + pd.getRom().getId() + "-" + pd.getColor().getId();

                // Tạo đối tượng RamRomOption và ColorOption
                ProductDetailViewResponse.RamRomOption ramRomOption = new ProductDetailViewResponse.RamRomOption();
                ramRomOption.setRamId(pd.getRam().getId());
                ramRomOption.setRamSize(pd.getRam().getCapacity() + "GB");
                ramRomOption.setRomId(pd.getRom().getId());
                ramRomOption.setRomSize(pd.getRom().getCapacity() + "GB");

                ProductDetailViewResponse.ColorOption colorOption = new ProductDetailViewResponse.ColorOption();
                colorOption.setId(pd.getColor().getId());
                colorOption.setColorName(pd.getColor().getName());
                colorOption.setColorCode(pd.getColor().getHex());

                // Tạo đối tượng ProductDetailInfo
                ProductDetailViewResponse.ProductDetailInfo detailInfo = new ProductDetailViewResponse.ProductDetailInfo();
                detailInfo.setProductDetailId(pd.getId());
                detailInfo.setPrice(pd.getPrice());
                detailInfo.setPriceSell(pd.getPriceSell());
                detailInfo.setInventoryQuantity(pd.getInventoryQuantity());
                detailInfo.setImageUrl(pd.getImageUrl());
                detailInfo.setRamRomOption(ramRomOption);
                detailInfo.setColorOption(colorOption);

                productDetails.put(key, detailInfo);
            }
        }

        response.setProductDetails(productDetails);

        // Chọn sản phẩm chi tiết mặc định (ví dụ: sản phẩm đầu tiên)
        if (!productDetailList.isEmpty()) {
            ProductDetail defaultDetail = productDetailList.get(0);

            // Tạo đối tượng RamRomOption và ColorOption cho sản phẩm mặc định
            ProductDetailViewResponse.RamRomOption defaultRamRomOption = new ProductDetailViewResponse.RamRomOption();
            defaultRamRomOption.setRamId(defaultDetail.getRam().getId());
            defaultRamRomOption.setRamSize(defaultDetail.getRam().getCapacity() + "GB");
            defaultRamRomOption.setRomId(defaultDetail.getRom().getId());
            defaultRamRomOption.setRomSize(defaultDetail.getRom().getCapacity() + "GB");

            ProductDetailViewResponse.ColorOption defaultColorOption = new ProductDetailViewResponse.ColorOption();
            defaultColorOption.setId(defaultDetail.getColor().getId());
            defaultColorOption.setColorName(defaultDetail.getColor().getName());
            defaultColorOption.setColorCode(defaultDetail.getColor().getHex());

            // Tạo đối tượng ProductDetailInfo cho sản phẩm mặc định
            ProductDetailViewResponse.ProductDetailInfo defaultDetailInfo = new ProductDetailViewResponse.ProductDetailInfo();
            defaultDetailInfo.setProductDetailId(defaultDetail.getId());
            defaultDetailInfo.setPrice(defaultDetail.getPrice());
            defaultDetailInfo.setPriceSell(defaultDetail.getPriceSell());
            defaultDetailInfo.setInventoryQuantity(defaultDetail.getInventoryQuantity());
            defaultDetailInfo.setImageUrl(defaultDetail.getImageUrl());
            defaultDetailInfo.setRamRomOption(defaultRamRomOption);
            defaultDetailInfo.setColorOption(defaultColorOption);

            response.setDefaultProductDetail(defaultDetailInfo);
        }

        return response;
    }

    @Override
    public List<ProductViewResponse> phoneFilter(PhoneFilterRequest phoneFilterRequest) {
        List<Product> productList = productRepository.filterProducts(phoneFilterRequest);
        List<ProductViewResponse> test = handlerProductView(productList);
        return test;
    }

}
