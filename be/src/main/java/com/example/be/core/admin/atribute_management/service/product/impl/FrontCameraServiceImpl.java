package com.example.be.core.admin.atribute_management.service.product.impl;

import com.example.be.entity.FrontCamera;
import com.example.be.entity.status.StatusCommon;
import com.example.be.repository.FrontCameraRepository;
import com.example.be.core.admin.atribute_management.service.product.FrontCameraService;
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
    public FrontCamera create(FrontCamera frontCamera) throws Exception {
        FrontCamera newFrontCamera = new FrontCamera();
        newFrontCamera.setCode("FRCA_"+frontCameraRepository.getNewCode());
        if (frontCameraRepository.existsByTypeAndResolution(frontCamera.getType(), frontCamera.getResolution())){
            throw new Exception("frontCamera type with resolution already exists");
        }
        newFrontCamera.setType(frontCamera.getType());
        newFrontCamera.setResolution(frontCamera.getResolution());
        newFrontCamera.setStatus(frontCamera.getStatus());

        return frontCameraRepository.save(newFrontCamera);
    }

    @Override
    public void update(Integer id, FrontCamera entity) throws Exception {
        FrontCamera frontCamera = getById(id);
        if (frontCamera != null){
            if (!frontCameraRepository.existsByTypeAndResolutionAndNotId(entity.getType(),entity.getResolution(),frontCamera.getId())){
                frontCamera.setType(entity.getType());
                frontCamera.setResolution(entity.getResolution());
                frontCamera.setStatus(entity.getStatus());
                frontCameraRepository.save(frontCamera);
            }else {
                throw new Exception("frontCamera type with resolution already exists");
            }
        }
    }

    @Override
    public FrontCamera getById(Integer id) throws Exception {
        return frontCameraRepository.findById(id).orElseThrow(()->
                new Exception("frontCamera not found with id: " + id));
    }

    @Override
    public List<FrontCamera> getAllActive() {
        return frontCameraRepository.findByStatus(StatusCommon.ACTIVE);
    }
}
