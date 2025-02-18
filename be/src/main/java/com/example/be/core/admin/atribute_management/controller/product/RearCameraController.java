package com.example.be.core.admin.atribute_management.controller.product;

import com.example.be.core.admin.atribute_management.controller.FormatController;
import com.example.be.entity.RearCamera;
import com.example.be.core.admin.atribute_management.service.product.RearCameraService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/admin/rear-camera")
public class RearCameraController extends FormatController<RearCamera, RearCameraService> {

    public RearCameraController(RearCameraService rearCameraService) {
        super(rearCameraService);
    }

}
