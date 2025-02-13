package com.example.be.controller.admin.attribute.product_detail;

import com.example.be.controller.admin.attribute.FormatController;
import com.example.be.entity.Color;
import com.example.be.service.atribute.product_detail.ColorService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/admin/color")
public class ColorController extends FormatController<Color, ColorService> {

    public ColorController(ColorService colorService) {
        super(colorService);
    }

}
