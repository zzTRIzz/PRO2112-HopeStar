package com.example.be.controller.admin.attribute.product;

import com.example.be.controller.admin.attribute.FormatController;
import com.example.be.entity.Screen;
import com.example.be.service.atribute.product.ScreenService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/admin/screen")
public class ScreenController extends FormatController<Screen, ScreenService> {

    public ScreenController(ScreenService screenService) {
        super(screenService);
    }

}
