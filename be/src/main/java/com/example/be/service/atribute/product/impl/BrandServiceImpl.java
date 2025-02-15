package com.example.be.service.atribute.product.impl;

import com.example.be.entity.Brand;
import com.example.be.entity.status.StatusCommon;
import com.example.be.repository.BrandRepository;
import com.example.be.service.atribute.product.BrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class BrandServiceImpl implements BrandService {

    private final BrandRepository brandRepository;


    @Override
    public List<Brand> getAll() {
        return brandRepository.findAll();
    }

    @Override
    public Brand create(Brand brand) {
        Brand newBrand = new Brand();
        newBrand.setCode("BRAN_"+brandRepository.getNewCode());
        newBrand.setName(brand.getName());
        newBrand.setImageUrl(brand.getImageUrl());
        newBrand.setStatus(StatusCommon.ACTIVE);
        return brandRepository.save(newBrand);
    }

    @Override
    public void update(Integer id, Brand entity) throws Exception {
        Brand brand = getById(id);
        if (brand != null){
            brandRepository.save(entity);
        }
    }

    @Override
    public Brand getById(Integer id) throws Exception {
        return brandRepository.findById(id).orElseThrow(()->
                new Exception("brand not found with id: " + id));
    }

    @Override
    public void remove(Integer id) throws Exception {
        Brand brand = getById(id);
        if (brand != null){
            if (brand.getStatus().equals(StatusCommon.ACTIVE)) {
                brand.setStatus(StatusCommon.IN_ACTIVE);
            } else {
                brand.setStatus(StatusCommon.ACTIVE);
            }
        }
        brandRepository.save(brand);
    }
}

