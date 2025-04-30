package com.example.be.core.admin.atribute_management.service.product.impl;

import com.example.be.core.admin.atribute_management.service.product.BrandService;
import com.example.be.entity.Brand;
import com.example.be.entity.status.StatusCommon;
import com.example.be.repository.BrandRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class BrandServiceImpl implements BrandService {

    private final BrandRepository brandRepository;


    @Override
    public List<Brand> getAll() {
        return brandRepository.findAll().stream()
                .sorted((s1, s2) -> Long.compare(s2.getId(), s1.getId()))
                .collect(Collectors.toList());
    }

    @Override
    public Brand create(Brand brand) throws Exception {
        Brand newBrand = new Brand();
        newBrand.setCode("BRAN_"+brandRepository.getNewCode());
        if (brandRepository.existsByNameTrimmedIgnoreCase(brand.getName())){
            throw new Exception("Tên thương hiệu đã tồn tại");
        }
        newBrand.setName(brand.getName());
        newBrand.setImageUrl(brand.getImageUrl());
        newBrand.setStatus(brand.getStatus());
        return brandRepository.save(newBrand);
    }

    @Override
    public void update(Integer id, Brand entity) throws Exception {
        Brand brand = getById(id);
        if (brand != null){
            if (!brandRepository.existsByNameTrimmedIgnoreCaseAndNotId(entity.getName(),brand.getId())){
                brand.setName(entity.getName());
                brand.setImageUrl(entity.getImageUrl());
                brand.setStatus(entity.getStatus());
                brandRepository.save(brand);
            }else {
                throw new Exception("Tên thương hiệu đã tồn tại");
            }
        }
    }

    @Override
    public Brand getById(Integer id) throws Exception {
        return brandRepository.findById(id).orElseThrow(()->
                new Exception("brand not found with id: " + id));
    }

    @Override
    public List<Brand> getAllActive() {
        return brandRepository.findByStatus(StatusCommon.ACTIVE).stream()
                .sorted((s1, s2) -> Long.compare(s2.getId(), s1.getId()))
                .collect(Collectors.toList());
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

