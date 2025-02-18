package com.example.be.core.admin.atribute_management.controller.product;

import com.example.be.core.admin.atribute_management.controller.FormatController;
import com.example.be.entity.FrontCamera;
import com.example.be.core.admin.atribute_management.service.product.FrontCameraService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/admin/front-camera")
public class FrontCameraController extends FormatController<FrontCamera, FrontCameraService> {

    public FrontCameraController(FrontCameraService frontCameraService) {
        super(frontCameraService);
    }

}
