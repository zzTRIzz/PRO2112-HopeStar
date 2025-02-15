package com.example.be.controller.admin.attribute.product;


import com.example.be.controller.admin.attribute.FormatController;
import com.example.be.entity.Resolution;
import com.example.be.service.atribute.product.ResolutionService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/admin/resolution")
public class ResolutionController extends FormatController<Resolution, ResolutionService> {

    public ResolutionController(ResolutionService resolutionService) {
        super(resolutionService);
    }

}