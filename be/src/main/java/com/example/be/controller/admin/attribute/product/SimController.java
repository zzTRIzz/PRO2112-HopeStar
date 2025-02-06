package com.example.be.controller.admin.attribute.product;

import com.example.be.controller.admin.attribute.FormatController;
import com.example.be.entity.Sim;
import com.example.be.service.generic.SimService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/admin/sim")
public class SimController extends FormatController<Sim, SimService> {

    public SimController(SimService simService) {
        super(simService);
    }

}
