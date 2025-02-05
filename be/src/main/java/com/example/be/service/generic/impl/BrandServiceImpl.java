package com.example.be.service.generic.impl;

import com.example.be.entity.Brand;
import com.example.be.repository.BrandRepository;
import com.example.be.service.generic.BrandService;
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
        newBrand.setCode("cc");
        newBrand.setName(brand.getName());
        newBrand.setImageUrl(brand.getImageUrl());
        newBrand.setStatus((byte) 1);
        return brandRepository.save(newBrand);
    }

    @Override
    public Brand update(Integer integer, Brand entity) {
        return null;
    }

    @Override
    public Brand getById(Integer integer) {
        return null;
    }
}

