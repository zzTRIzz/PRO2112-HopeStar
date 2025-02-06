package com.example.be.controller.admin.attribute.product;

import com.example.be.controller.admin.attribute.FormatController;
import com.example.be.entity.Os;
import com.example.be.service.generic.OsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/admin/os")
public class OsController extends FormatController<Os, OsService> {

    public OsController(OsService osService) {
        super(osService);
    }

}
