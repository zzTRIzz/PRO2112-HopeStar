package com.example.be.core.admin.atribute_management.controller.product;

import com.example.be.core.admin.atribute_management.controller.FormatController;
import com.example.be.core.admin.atribute_management.service.product.ScreenService;
import com.example.be.entity.Screen;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/admin/screen")
public class ScreenController extends FormatController<Screen, ScreenService> {

    public ScreenController(ScreenService screenService) {
        super(screenService);
    }

}
