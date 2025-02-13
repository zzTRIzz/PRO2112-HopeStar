package com.example.be.controller.admin.attribute.product;

import com.example.be.controller.admin.attribute.FormatController;
import com.example.be.entity.FrontCamera;
import com.example.be.service.atribute.product.FrontCameraService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/admin/front-camera")
public class FrontCameraController extends FormatController<FrontCamera, FrontCameraService> {

    public FrontCameraController(FrontCameraService frontCameraService) {
        super(frontCameraService);
    }

}
