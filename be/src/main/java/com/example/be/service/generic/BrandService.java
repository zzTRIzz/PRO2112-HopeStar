package com.example.be.service;

import com.example.be.entity.Brand;

import java.util.List;

public interface BrandService {
    List<Brand> getAllBrand();
    Brand createBrand(Brand brand);
    Brand updateBrand(Integer idBrand,Brand brandNew);
    Brand getBrandById(Integer idBrand);
}
