package com.example.be.core.admin.atribute_management.controller.product;


import com.example.be.core.admin.atribute_management.controller.FormatController;
import com.example.be.entity.Resolution;
import com.example.be.core.admin.atribute_management.service.product.ResolutionService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/admin/resolution")
public class ResolutionController extends FormatController<Resolution, ResolutionService> {

    public ResolutionController(ResolutionService resolutionService) {
        super(resolutionService);
    }

}