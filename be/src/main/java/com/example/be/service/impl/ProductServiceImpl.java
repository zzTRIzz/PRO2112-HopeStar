package com.example.be.service.impl;

import com.example.be.dto.ProductDTO;
import com.example.be.entity.*;
import com.example.be.entity.status.StatusCommon;
import com.example.be.mapper.ProductMapper;
import com.example.be.repository.*;
import com.example.be.request.product.ProductRequest;
import com.example.be.response.ProductResponse;
import com.example.be.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductMapper productMapper;
    private final ProductRepository productRepository;
    private final FrontCameraRepository frontCameraRepository;
    private final RearCameraRepository rearCameraRepository;
    private final FrontCameraProductRepository frontCameraProductRepository;
    private final RearCameraProductRepository rearCameraProductRepository;
    private final CategoryRepository categoryRepository;
    private final ProductCategoryRepository productCategoryRepository;


    @Override
    public List<ProductResponse> getAll() {
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(product -> productMapper.dtoToResponse(productMapper.entityToDTO(product)))
                .collect(Collectors.toList());
    }

    @Override
    public ProductResponse add(ProductRequest productRequest) throws Exception {

        ProductDTO productDTO = productMapper.requestToDTO(productRequest);
        productDTO.setCode("PRDU_"+productRepository.getNewCode());
        productDTO.setStatus(StatusCommon.ACTIVE);

        Product product = productMapper.dtoToEntity(productDTO);

        productRepository.save(product);

        productDTO.getFrontCamera().forEach((item) -> {
            FrontCameraProduct frontCameraProduct = new FrontCameraProduct();
            // Lấy phần số từ chuỗi
            String numberPart = item.replaceAll("[^0-9]", "");
            if (!numberPart.isEmpty()) {
                Integer value = Integer.parseInt(numberPart);
                frontCameraProduct.setProduct(product);
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
                rearCameraProduct.setProduct(product);
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
            productCategory.setProduct(product);
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

        return productMapper.dtoToResponse(productMapper.entityToDTO(product));
    }
}
