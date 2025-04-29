package com.example.be.core.chatbot.service;

import com.example.be.core.chatbot.dto.ProductAIDTO;
import com.example.be.core.chatbot.mapper.ProductAIMapper;
import com.example.be.entity.Product;
import com.example.be.entity.ProductDetail;
import com.example.be.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AiService {

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ProductAIMapper productAIMapper;
//    @Autowired
//    VectorStore vectorStore;

    public List<ProductAIDTO> getAll() {
        List<Product> products = productRepository.findAll();
        List<ProductAIDTO> dtoList = new ArrayList<>();

        for (Product product:products) {
            Integer totalVersion = product.getProductDetails().size();
            Integer totalNumber =0;
            for (ProductDetail productDetail: product.getProductDetails()) {
                totalNumber +=productDetail.getInventoryQuantity();
            }
            ProductAIDTO productDTO = productAIMapper.entityToDTO(product);
            productDTO.setTotalVersion(totalVersion);
            productDTO.setTotalNumber(totalNumber);

            String link = URI.create("http://localhost:5173/product/" + product.getId()).toString();
            productDTO.setLink(link);
            dtoList.add(productDTO);
        }

//        List<ProductAIResponse> responseList = new ArrayList<>();
//
//        for (ProductAIDTO productDTO:dtoList) {
//            ProductAIResponse productResponse = productAIMapper.dtoToResponse(productDTO);
//            responseList.add(productResponse);
//        }
        return dtoList.stream()
                .sorted((p1, p2) -> Long.compare(p2.getId(), p1.getId())) // Sắp xếp giảm dần
                .collect(Collectors.toList());
    }

    public void loadDataVectorStore(){

    }
    public static void main(String[] args) {
        Integer id = 2;
        String link = URI.create("http://localhost:5173/product/" + id).toString();
        System.out.println(                "Link: " + link);
        System.out.println("http://localhost:5173/product/" + id);
    }
}
