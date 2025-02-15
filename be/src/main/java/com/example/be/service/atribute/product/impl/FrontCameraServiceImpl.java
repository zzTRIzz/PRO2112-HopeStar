package com.example.be.service.atribute.product.impl;

import com.example.be.entity.FrontCamera;
import com.example.be.repository.FrontCameraRepository;
import com.example.be.service.atribute.product.FrontCameraService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class FrontCameraServiceImpl implements FrontCameraService {
    private final FrontCameraRepository frontCameraRepository;


    @Override
    public List<FrontCamera> getAll() {
        return frontCameraRepository.findAll();
    }

    @Override
    public FrontCamera create(FrontCamera frontCamera) {
        FrontCamera newFrontCamera = new FrontCamera();
        newFrontCamera.setCode("FRCA_"+frontCameraRepository.getNewCode());
        newFrontCamera.setType(frontCamera.getType());
        newFrontCamera.setResolution(frontCamera.getResolution());

        return frontCameraRepository.save(newFrontCamera);
    }

    @Override
    public void update(Integer id, FrontCamera entity) throws Exception {
        FrontCamera frontCamera = getById(id);
        if (frontCamera != null){
            frontCameraRepository.save(entity);
        }
    }

    @Override
    public FrontCamera getById(Integer id) throws Exception {
        return frontCameraRepository.findById(id).orElseThrow(()->
                new Exception("frontCamera not found with id: " + id));
    }
}
