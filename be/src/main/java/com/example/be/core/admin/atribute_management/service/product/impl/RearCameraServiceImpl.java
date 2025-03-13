package com.example.be.core.admin.atribute_management.service.product.impl;

import com.example.be.entity.RearCamera;
import com.example.be.entity.status.StatusCommon;
import com.example.be.repository.RearCameraRepository;
import com.example.be.core.admin.atribute_management.service.product.RearCameraService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class RearCameraServiceImpl implements RearCameraService {
    private final RearCameraRepository rearCameraRepository;


    @Override
    public List<RearCamera> getAll() {
        return rearCameraRepository.findAll();
    }

    @Override
    public RearCamera create(RearCamera rearCamera) throws Exception {
        RearCamera newRearCamera = new RearCamera();
        newRearCamera.setCode("RECA_"+rearCameraRepository.getNewCode());
        if (rearCameraRepository.existsByTypeAndResolution(rearCamera.getType(), rearCamera.getResolution())){
            throw new Exception("rearCamera type with resolution already exists");
        }
        newRearCamera.setType(rearCamera.getType());
        newRearCamera.setResolution(rearCamera.getResolution());
        newRearCamera.setStatus(rearCamera.getStatus());
        return rearCameraRepository.save(newRearCamera);
    }

    @Override
    public void update(Integer id, RearCamera entity) throws Exception {
        RearCamera rearCamera = getById(id);
        if (rearCamera != null){
            if (!rearCameraRepository.existsByTypeAndResolutionAndNotId(entity.getType(),entity.getResolution(),rearCamera.getId())){
                rearCamera.setType(entity.getType());
                rearCamera.setResolution(entity.getResolution());
                rearCamera.setStatus(entity.getStatus());
                rearCameraRepository.save(rearCamera);
            }else {
                throw new Exception("rearCamera type with resolution already exists");
            }
        }
    }

    @Override
    public RearCamera getById(Integer id) throws Exception {
        return rearCameraRepository.findById(id).orElseThrow(()->
                new Exception("rearCamera not found with id: " + id));
    }

    @Override
    public List<RearCamera> getAllActive() {
        return rearCameraRepository.findByStatus(StatusCommon.ACTIVE);
    }
}
