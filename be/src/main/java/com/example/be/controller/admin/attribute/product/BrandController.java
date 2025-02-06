package com.example.be.controller.admin.attribute.product;

import com.example.be.controller.admin.attribute.FormatController;
import com.example.be.entity.Brand;
import com.example.be.service.generic.BrandService;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("api/admin/brand")
public class BrandController extends FormatController<Brand,BrandService> {

    public BrandController(BrandService brandService) {
        super(brandService);
    }

}
