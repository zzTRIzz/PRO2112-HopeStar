package com.example.be.core.admin.atribute_management.service.product;

import com.example.be.entity.Brand;
import com.example.be.core.admin.atribute_management.service.GenericService;


public interface BrandService extends GenericService<Brand, Integer> {
    void remove(Integer id) throws Exception;
}
