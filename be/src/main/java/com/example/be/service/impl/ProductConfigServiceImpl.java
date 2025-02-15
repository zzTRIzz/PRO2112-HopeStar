package com.example.be.service.impl;

import com.example.be.dto.ProductDTO;
import com.example.be.dto.ProductDetailDTO;
import com.example.be.dto.ProductImeiDTO;
import com.example.be.entity.*;
import com.example.be.entity.status.ProductDetailStatus;
import com.example.be.entity.status.StatusCommon;
import com.example.be.entity.status.StatusImei;
import com.example.be.mapper.ImeiMapper;
import com.example.be.mapper.ProductDetailMapper;
import com.example.be.mapper.ProductMapper;
import com.example.be.repository.*;
import com.example.be.request.product.ProductConfigRequest;
import com.example.be.request.product.ProductDetailRequest;
import com.example.be.request.product.ProductImeiRequest;
import com.example.be.response.ProductConfigResponse;
import com.example.be.response.ProductDetailResponse;
import com.example.be.response.ProductImeiResponse;
import com.example.be.response.ProductResponse;
import com.example.be.service.ProductConfigService;
import com.example.be.utils.BarcodeGenerator;
import com.google.zxing.BarcodeFormat;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductConfigServiceImpl implements ProductConfigService {

    private final ProductMapper productMapper;
    private final ProductRepository productRepository;
    private final FrontCameraRepository frontCameraRepository;
    private final RearCameraRepository rearCameraRepository;
    private final FrontCameraProductRepository frontCameraProductRepository;
    private final RearCameraProductRepository rearCameraProductRepository;
    private final CategoryRepository categoryRepository;
    private final ProductCategoryRepository productCategoryRepository;
    private final ProductDetailMapper productDetailMapper;
    private final ProductDetailRepository productDetailRepository;
    private final ImeiMapper imeiMapper;
    private final BarcodeGenerator barcodeGenerator;
    private final ImeiRepository imeiRepository;

    @Override
    public ProductConfigResponse create(ProductConfigRequest productConfigRequest) throws Exception {
        ProductDTO productDTO = productMapper.requestToDTO(productConfigRequest.getProductRequest());
        productDTO.setCode("PRDU_"+productRepository.getNewCode());
        productDTO.setStatus(StatusCommon.ACTIVE);

        Product product = productMapper.dtoToEntity(productDTO);

        Product createProduct = productRepository.save(product);

        productDTO.getFrontCamera().forEach((item) -> {
            FrontCameraProduct frontCameraProduct = new FrontCameraProduct();
            // Lấy phần số từ chuỗi
            String numberPart = item.replaceAll("[^0-9]", "");
            if (!numberPart.isEmpty()) {
                Integer value = Integer.parseInt(numberPart);
                frontCameraProduct.setProduct(createProduct);
                FrontCamera frontCamera = null;
                try {
                    frontCamera = frontCameraRepository.findById(value).orElseThrow(()->
                            new Exception("front-camera not found:"+value));
                } catch (Exception e) {
                    e.printStackTrace();
                }
                frontCameraProduct.setFrontCamera(frontCamera);

                // Kiểm tra nếu chuỗi có "main" thì gán làm camera chính
                if (item.toLowerCase().contains("main")) {
                    frontCameraProduct.setCameraMain(true);
                }else {
                    frontCameraProduct.setCameraMain(false);
                }
            }
            frontCameraProductRepository.save(frontCameraProduct);
        });

        productDTO.getRearCamera().forEach((item) -> {
            RearCameraProduct rearCameraProduct = new RearCameraProduct();
            // Lấy phần số từ chuỗi
            String numberPart = item.replaceAll("[^0-9]", "");
            if (!numberPart.isEmpty()) {
                Integer value = Integer.parseInt(numberPart);
                rearCameraProduct.setProduct(createProduct);
                RearCamera rearCamera = null;
                try {
                    rearCamera = rearCameraRepository.findById(value).orElseThrow(()->
                            new Exception("rear-camera not found:"+value));
                } catch (Exception e) {
                    e.printStackTrace();
                }
                rearCameraProduct.setRearCamera(rearCamera);

                // Kiểm tra nếu chuỗi có "main" thì gán làm camera chính
                if (item.toLowerCase().contains("main")) {
                    rearCameraProduct.setCameraMain(true);
                }else {
                    rearCameraProduct.setCameraMain(false);
                }
            }
            rearCameraProductRepository.save(rearCameraProduct);
        });

        productDTO.getCategory().forEach((item)->{
            ProductCategory productCategory = new ProductCategory();
            productCategory.setProduct(createProduct);
            Category category =null;
            try {
                category = categoryRepository.findById(Integer.parseInt(item)).orElseThrow(()->
                        new Exception("category not found:"+item));
            } catch (Exception e) {
                e.printStackTrace();
            }
            productCategory.setCategory(category);
            productCategoryRepository.save(productCategory);
        });

        ProductResponse productResponse = productMapper.dtoToResponse(productMapper.entityToDTO(createProduct));

        List<ProductDetailResponse> productDetailResponses = new ArrayList<>();
        if (productConfigRequest.getProductDetailRequests() !=null){
            for (ProductDetailRequest item:productConfigRequest.getProductDetailRequests()) {

                ProductDetailDTO productDetailDTO = productDetailMapper.requestToDTO(item);
                productDetailDTO.setCode("PRDE_"+productDetailRepository.getNewCode());
                productDetailDTO.setStatus(ProductDetailStatus.ACTIVE);
                ProductDetail productDetail = productDetailMapper.dtoToEntity(productDetailDTO);
                ProductDetail createProductDetail = productDetailRepository.save(productDetail);

                List<ProductImeiResponse> productImeiResponses = new ArrayList<>();
                if (item.getProductImeiRequests() !=null){
                    for (ProductImeiRequest imeiRequest : item.getProductImeiRequests()){
                        ProductImeiDTO productImeiDTO = imeiMapper.requestToDTO(imeiRequest);
                        productImeiDTO.setBarCode(barcodeGenerator.generateBarcodeImageBase64Url(imeiRequest.getImeiCode(), BarcodeFormat.CODE_128));
                        productImeiDTO.setStatusImei(StatusImei.NOT_SOLD);

                        Imei imei = imeiMapper.dtoToEntity(productImeiDTO);
                        imei.setProductDetail(createProductDetail);
                        Imei createImei = imeiRepository.save(imei);
                        productImeiResponses.add(imeiMapper.dtoToResponse(imeiMapper.entityToDTO(createImei)));
                    }
                }
                ProductDetailResponse productDetailResponse = productDetailMapper.dtoToResponse(productDetailMapper.entityToDTO(createProductDetail));
                productDetailResponse.setProductImeiResponses(productImeiResponses);
                productDetailResponses.add(productDetailResponse);


            }
        }

        ProductConfigResponse productConfigResponse = new ProductConfigResponse();
        productConfigResponse.setProductResponse(productResponse);
        productConfigResponse.setProductDetailResponses(productDetailResponses);

        return productConfigResponse;
    }
}
