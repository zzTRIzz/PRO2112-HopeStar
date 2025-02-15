package com.example.be.controller.admin.attribute.product;

import com.example.be.controller.admin.attribute.FormatController;
import com.example.be.entity.Brand;
import com.example.be.response.ApiResponse;
import com.example.be.service.atribute.product.BrandService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("api/admin/brand")
public class BrandController extends FormatController<Brand,BrandService> {

    public BrandController(BrandService brandService) {
        super(brandService);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> remove(@PathVariable Integer id) throws Exception {
        s.remove(id);
        ApiResponse res = new ApiResponse();
        res.setMessage("Remove successfully");
        return ResponseEntity.ok(res);
    }

}
