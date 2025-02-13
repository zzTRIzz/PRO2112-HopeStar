package com.example.be.controller.admin.attribute.product;

import com.example.be.controller.admin.attribute.FormatController;
import com.example.be.entity.RearCamera;
import com.example.be.service.atribute.product.RearCameraService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/admin/rear-camera")
public class RearCameraController extends FormatController<RearCamera, RearCameraService> {

    public RearCameraController(RearCameraService rearCameraService) {
        super(rearCameraService);
    }

}
