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
    public Resolution create(Resolution resolution) throws Exception {
        Resolution newResolution = new Resolution();
        if (resolutionRepository.existsByHeightAndWidthAndResolutionTypeTrimmedIgnoreCase(resolution.getHeight(),resolution.getWidth(),resolution.getResolutionType())){
            throw new Exception("resolution type already exists");
        }
        newResolution.setWidth(resolution.getWidth());
        newResolution.setHeight(resolution.getHeight());
        newResolution.setResolutionType(resolution.getResolutionType());
        return resolutionRepository.save(newResolution);
    }

    @Override
    public void update(Integer id, Resolution entity) throws Exception {
        Resolution resolution = getById(id);
        if (resolution != null){
            if (!resolutionRepository.existsByHeightAndWidthAndResolutionTypeTrimmedIgnoreCaseAndNotId(entity.getHeight(),entity.getWidth(),resolution.getResolutionType(),resolution.getId())){
                resolution.setHeight(entity.getHeight());
                resolution.setWidth(entity.getWidth());
                resolution.setResolutionType(entity.getResolutionType());
                resolutionRepository.save(resolution);
            }else {
                throw new Exception("resolution type already exists");
            }
        }
    }

    @Override
    public Resolution getById(Integer id) throws Exception {
        return resolutionRepository.findById(id).orElseThrow(()->
                new Exception("resolution not found with id: " + id));
    }
}
