package com.example.be.core.admin.atribute_management.service.product.impl;

import com.example.be.entity.Resolution;
import com.example.be.repository.ResolutionRepository;
import com.example.be.core.admin.atribute_management.service.product.ResolutionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class ResolutionServiceImpl implements ResolutionService {
    private final ResolutionRepository resolutionRepository;


    @Override
    public List<Resolution> getAll() {
        return resolutionRepository.findAll();
    }

    @Override
    public Resolution create(Resolution resolution) {
        Resolution newResolution = new Resolution();
        newResolution.setWidth(resolution.getWidth());
        newResolution.setHeight(resolution.getHeight());
        newResolution.setResolutionType(resolution.getResolutionType());
        return resolutionRepository.save(newResolution);
    }

    @Override
    public void update(Integer id, Resolution entity) throws Exception {
        Resolution resolution = getById(id);
        if (resolution != null){
            resolutionRepository.save(entity);
        }
    }

    @Override
    public Resolution getById(Integer id) throws Exception {
        return resolutionRepository.findById(id).orElseThrow(()->
                new Exception("resolution not found with id: " + id));
    }
}
