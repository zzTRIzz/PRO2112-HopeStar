package com.example.be.service.atribute.product;

import com.example.be.entity.Brand;
import com.example.be.service.base.GenericService;


public interface BrandService extends GenericService<Brand, Integer> {
    void remove(Integer id) throws Exception;
}
