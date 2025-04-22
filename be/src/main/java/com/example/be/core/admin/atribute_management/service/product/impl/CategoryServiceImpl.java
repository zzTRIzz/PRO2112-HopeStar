package com.example.be.core.admin.atribute_management.service.product.impl;

import com.example.be.core.admin.atribute_management.service.product.CategoryService;
import com.example.be.entity.Category;
import com.example.be.entity.status.StatusCommon;
import com.example.be.repository.CategoryRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;


    @Override
    public List<Category> getAll() {
        return categoryRepository.findAll().stream()
                .sorted((s1, s2) -> Long.compare(s2.getId(), s1.getId()))
                .collect(Collectors.toList());
    }

    @Override
    public Category create(Category category) throws Exception {
        Category newCategory = new Category();
        newCategory.setCode("CATE_"+categoryRepository.getNewCode());
        if (categoryRepository.existsByNameTrimmedIgnoreCase(category.getName())){
            throw new Exception("Tên danh mục đã tồn tại");
        }
        newCategory.setName(category.getName());
        newCategory.setStatus(category.getStatus());
        return categoryRepository.save(newCategory);
    }

    @Override
    public void update(Integer id, Category entity) throws Exception {
        Category category = getById(id);
        if (category != null){
            if (!categoryRepository.existsByNameTrimmedIgnoreCaseAndNotId(entity.getName(),category.getId())){
                category.setName(entity.getName());
                category.setStatus(entity.getStatus());
                categoryRepository.save(category);
            }else {
                throw new Exception("Tên danh mục đã tồn tại");
            }
        }
    }

    @Override
    public Category getById(Integer id) throws Exception {
        return categoryRepository.findById(id).orElseThrow(()->
                new Exception("category not found with id: " + id));
    }

    @Override
    public List<Category> getAllActive() {
        return categoryRepository.findByStatus(StatusCommon.ACTIVE).stream()
                .sorted((s1, s2) -> Long.compare(s2.getId(), s1.getId()))
                .collect(Collectors.toList());
    }
}
