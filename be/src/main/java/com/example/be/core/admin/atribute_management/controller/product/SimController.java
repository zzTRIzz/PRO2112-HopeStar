package com.example.be.core.admin.atribute_management.controller.product;

import com.example.be.core.admin.atribute_management.controller.FormatController;
import com.example.be.entity.Sim;
import com.example.be.core.admin.atribute_management.service.product.SimService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/admin/sim")
public class SimController extends FormatController<Sim, SimService> {

    public SimController(SimService simService) {
        super(simService);
    }

}
