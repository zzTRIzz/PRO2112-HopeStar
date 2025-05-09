package com.example.be.core.client.home.service.impl;


import com.example.be.core.client.home.dto.request.PhoneFilterRequest;
import com.example.be.core.client.home.dto.response.ProductDetailViewResponse;
import com.example.be.core.client.home.dto.response.ProductViewResponse;
import com.example.be.core.client.home.dto.response.ProductViewResponseAll;
import com.example.be.core.client.home.service.HomeService;
import com.example.be.entity.*;
import com.example.be.entity.status.ProductDetailStatus;
import com.example.be.entity.status.StatusCommon;
import com.example.be.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;


@RequiredArgsConstructor
@Service
public class HomeServiceImpl implements HomeService {
    private final ProductRepository productRepository;
    private final ProductDetailRepository productDetailRepository;
    private final ProductCategoryRepository productCategoryRepository;
    private final ProductSimRepository productSimRepository;
    private final FrontCameraProductRepository frontCameraProductRepository;
    private final RearCameraProductRepository rearCameraProductRepository;
    @Override
    public ProductViewResponseAll getProductView() {

        List<Product> products = productRepository.findByStatusOrderByCreatedAtDesc(StatusCommon.ACTIVE);
        List<Product> products2 = productRepository.findTop20SellingProducts(StatusCommon.ACTIVE);

        List<ProductViewResponse> newestProducts = handlerProductView(products,false,false,false);
        List<ProductViewResponse> bestSellingProducts = handlerProductView(products2,false,false,false);

        ProductViewResponseAll productViewResponseAll = new ProductViewResponseAll();
        productViewResponseAll.setNewestProducts(newestProducts);
        productViewResponseAll.setBestSellingProducts(bestSellingProducts);
        return productViewResponseAll;
    }

    public List<ProductViewResponse> handlerProductView(List<Product> products,Boolean priceMax, Boolean priceMin, Boolean priceSale){
        List<ProductViewResponse> productViewResponseList = new ArrayList<>();
        for (Product product:products) {
            ProductViewResponse productViewResponse = new ProductViewResponse();

            List<ProductDetail> productDetailList = productDetailRepository.findAllByProduct(product);
            List<ProductDetail> availableProducts = productDetailList.stream()
                    .filter(pd -> pd.getInventoryQuantity() != null && pd.getInventoryQuantity() > 0 && pd.getStatus().equals(ProductDetailStatus.ACTIVE))
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
                List<String> uniqueRamCapacities = availableProducts.stream()
                        .filter(pd -> pd.getRam() != null)         // Loại bỏ ProductDetail không có Ram
                        .map(pd -> pd.getRam().getCapacity()+pd.getRam().getDescription())      // Lấy capacity từ Ram
                        .filter(Objects::nonNull)                  // Loại bỏ capacity null
                        .distinct()                                // Chỉ giữ giá trị duy nhất
                        .collect(Collectors.toList());

                List<String> uniqueRomCapacities = availableProducts.stream()
                        .filter(pd -> pd.getRom() != null)
                        .map(pd -> pd.getRom().getCapacity()+pd.getRom().getDescription())
                        .filter(Objects::nonNull)
                        .distinct()
                        .collect(Collectors.toList());

                List<String> uniqueColorHex = availableProducts.stream()
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

        if (priceMax){
            productViewResponseList = productViewResponseList
                    .stream()
                    .sorted(Comparator.comparing(
                            p -> p.getPriceSeller(),
                            Comparator.reverseOrder() // Giảm dần
                    ))
                    .collect(Collectors.toList());
        }else if(priceMin){
            productViewResponseList = productViewResponseList
                    .stream()
                    .sorted(Comparator.comparing(
                            p -> p.getPriceSeller()
                    ))
                    .collect(Collectors.toList());
        }else if(priceSale){
            productViewResponseList = productViewResponseList
                    .stream()
                    .filter(p -> p.getPriceSeller().subtract(p.getPrice()).compareTo(BigDecimal.ZERO) < 0)
                    .sorted(Comparator.comparing(
                            p -> p.getPriceSeller().subtract(p.getPrice()),
                            Comparator.reverseOrder()
                    ))
                    .collect(Collectors.toList());
        }

        return productViewResponseList;
    }

    public ProductDetailViewResponse.Attribute handlerAttribute(Product product){
        ProductDetailViewResponse.Attribute attribute = new ProductDetailViewResponse.Attribute();
        List<ProductCategory> listPC = productCategoryRepository.findByProductId(product.getId());
        String categories = listPC.stream()
                .map(pc -> pc.getCategory().getName())
                .collect(Collectors.joining(","));
        attribute.setCategories(categories);
        attribute.setWeight(product.getWeight());
        attribute.setBrand(product.getName());
        attribute.setChip(product.getChip().getName());
        attribute.setBattery(product.getBattery().getType()+" - "+product.getBattery().getCapacity());
        attribute.setResolution(product.getScreen().getResolution().getResolutionType()+"("+ product.getScreen().getResolution().getWidth()+" - "+product.getScreen().getResolution().getHeight()+")");
        attribute.setScreen(product.getScreen().getType()+" - "+product.getScreen().getDisplaySize()+"''");
        attribute.setBluetooth(product.getBluetooth().getName());
        attribute.setCard(product.getCard().getType());
        attribute.setOs(product.getOs().getName());
        attribute.setWifi(product.getWifi().getName());
        attribute.setCharger(product.getChargerType());
        List<ProductSim> listPS = productSimRepository.findByProductId(product.getId());
        if (product.getNfc()){
            attribute.setNfc("Có");
        }else{
            attribute.setNfc("Không");
        }
        String sims = listPS.stream()
                .map(pc -> pc.getSim().getType())
                .collect(Collectors.joining(","));
        attribute.setSim(sims);
        List<FrontCameraProduct> listFC = frontCameraProductRepository.findByProductId(product.getId());
        String frontCameras = listFC.stream()
                .map(pc -> pc.getFrontCamera().getType()+" - "+pc.getFrontCamera().getResolution()+"MP")
                .collect(Collectors.joining(","));
        attribute.setFrontCamera(frontCameras);
        List<RearCameraProduct> listRC = rearCameraProductRepository.findByProductId(product.getId());
        String rearCamera = listRC.stream()
                .map(pc -> pc.getRearCamera().getType()+" - "+pc.getRearCamera().getResolution()+"MP")
                .collect(Collectors.joining(","));
        attribute.setRearCamera(rearCamera);
        return attribute;
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
        response.setAttribute(handlerAttribute(product));
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
                    ramRomOption.setRamSize(pd.getRam().getCapacity() + pd.getRam().getDescription());
                    ramRomOption.setRomId(pd.getRom().getId());
                    ramRomOption.setRomSize(pd.getRom().getCapacity() + pd.getRom().getDescription());

                    ramRomOptions.add(ramRomOption);
                    uniqueRamRomPairs.add(ramRomKey);
                }
            }
        }

        // Điền danh sách cặp RAM-ROM vào response
        response.setRamRomOptions(ramRomOptions);
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
        // Xây dựng danh sách màu sắc
        Map<String, List<ProductDetailViewResponse.ColorOption>> availableColors = new HashMap<>();

        // Duyệt qua danh sách productDetail để xây dựng map availableColors
        for (ProductDetail pd : productDetailList) {
            if (pd.getRam() != null && pd.getRom() != null && pd.getColor() != null) {
                String ramRomKey = pd.getRam().getId() + "-" + pd.getRom().getId();

                // Tạo ColorOption
                ProductDetailViewResponse.ColorOption colorOption = new ProductDetailViewResponse.ColorOption();
                colorOption.setId(pd.getColor().getId());
                colorOption.setColorName(pd.getColor().getName());
                colorOption.setColorCode(pd.getColor().getHex());

                // Thêm vào map availableColors
                availableColors.computeIfAbsent(ramRomKey, k -> new ArrayList<>())
                        .add(colorOption);
            }
        }

        // Loại bỏ các màu trùng lặp trong mỗi danh sách
        availableColors.forEach((key, colors) -> {
            List<ProductDetailViewResponse.ColorOption> uniqueColors = colors.stream()
                    .distinct()
                    .collect(Collectors.toList());
            availableColors.put(key, uniqueColors);
        });

        response.setAvailableColors(availableColors);


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
                ramRomOption.setRamSize(pd.getRam().getCapacity() + pd.getRam().getDescription());
                ramRomOption.setRomId(pd.getRom().getId());
                ramRomOption.setRomSize(pd.getRom().getCapacity() + pd.getRom().getDescription());

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
            defaultRamRomOption.setRamSize(defaultDetail.getRam().getCapacity() + defaultDetail.getRam().getDescription());
            defaultRamRomOption.setRomId(defaultDetail.getRom().getId());
            defaultRamRomOption.setRomSize(defaultDetail.getRom().getCapacity() + defaultDetail.getRom().getDescription());

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
        List<ProductViewResponse> test = handlerProductView(productList,false,false,false);
                if (phoneFilterRequest.getPriceMax() != null && phoneFilterRequest.getPriceMax()) {
                    test = handlerProductView(productList,true,false,false);
                }else if (phoneFilterRequest.getPriceMin() != null && phoneFilterRequest.getPriceMin()) {
                    test = handlerProductView(productList,false,true,false);
                }else if (phoneFilterRequest.getProductSale() != null && phoneFilterRequest.getProductSale()) {
                    test = handlerProductView(productList,false,false,true);
                }
        return test;
    }

    @Override
    public List<ProductViewResponse> getProductRelated(Integer id) throws Exception {
        Product product = productRepository.findById(id).orElseThrow(()->
                new Exception("Sản phẩm không tồn tại"));
        PhoneFilterRequest phoneFilterRequest = new PhoneFilterRequest();
        phoneFilterRequest.setChip(product.getChip().getId());
        phoneFilterRequest.setNfc(product.getNfc());
        phoneFilterRequest.setOs(product.getOs().getId());
        phoneFilterRequest.setTypeScreen(product.getScreen().getType());
        List<Product> productList = productRepository.filterProducts(phoneFilterRequest);
        int count =0;
        List<Product> productRelated = new ArrayList<>();
        for (Product product1: productList) {
            count++;
            if (count ==5){
                break;
            }
            if (product1.getId() == id){
                continue;
            }
            productRelated.add(product1);
        }
        List<ProductViewResponse> productViewResponseList = handlerProductView(productRelated,false,false,false);
        return productViewResponseList;
    }

}
