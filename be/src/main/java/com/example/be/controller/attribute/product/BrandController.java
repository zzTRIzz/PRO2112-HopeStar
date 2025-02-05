package com.example.be.controller.attribute.product;

import com.example.be.entity.Brand;
import com.example.be.service.generic.BrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/brand")
@RequiredArgsConstructor
public class BrandController {

    private final BrandService brandService;

    @GetMapping()
    public ResponseEntity<List<Brand>> getAll(){
        List<Brand> list =brandService.getAll();
//        System.out.println(list);
       return ResponseEntity.ok(list);
    }
}
