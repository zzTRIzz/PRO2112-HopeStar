package com.example.be.service.generic.impl;

import com.example.be.entity.RearCamera;
import com.example.be.repository.RearCameraRepository;
import com.example.be.service.generic.RearCameraService;
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
    public RearCamera create(RearCamera rearCamera) {
        RearCamera newRearCamera = new RearCamera();
        newRearCamera.setCode(rearCamera.getCode());
        newRearCamera.setType(rearCamera.getType());
        newRearCamera.setResolution(rearCamera.getResolution());
        return rearCameraRepository.save(newRearCamera);
    }

    @Override
    public void update(Integer id, RearCamera entity) throws Exception {
        RearCamera rearCamera = getById(id);
        if (rearCamera != null){
            rearCameraRepository.save(entity);
        }
    }

    @Override
    public RearCamera getById(Integer id) throws Exception {
        return rearCameraRepository.findById(id).orElseThrow(()->
                new Exception("rearCamera not found with id: " + id));
    }
}
