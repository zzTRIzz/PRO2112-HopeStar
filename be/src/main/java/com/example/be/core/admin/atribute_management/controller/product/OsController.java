package com.example.be.core.admin.atribute_management.controller.product;

import com.example.be.core.admin.atribute_management.controller.FormatController;
import com.example.be.entity.Os;
import com.example.be.core.admin.atribute_management.service.product.OsService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/admin/os")
public class OsController extends FormatController<Os, OsService> {

    public OsController(OsService osService) {
        super(osService);
    }

}
