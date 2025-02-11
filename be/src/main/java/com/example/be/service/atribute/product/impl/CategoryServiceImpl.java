package com.example.be.service.atribute.product.impl;

import com.example.be.entity.Category;
import com.example.be.repository.CategoryRepository;
import com.example.be.service.atribute.product.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;


    @Override
    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    @Override
    public Category create(Category category) {
        Category newCategory = new Category();
        newCategory.setCode("CATE_"+categoryRepository.getNewCode());
        newCategory.setName(category.getName());
        newCategory.setStatus((byte) 1);
        return categoryRepository.save(newCategory);
    }

    @Override
    public void update(Integer id, Category entity) throws Exception {
        Category category = getById(id);
        if (category != null){
            categoryRepository.save(entity);
        }
    }

    @Override
    public Category getById(Integer id) throws Exception {
        return categoryRepository.findById(id).orElseThrow(()->
                new Exception("category not found with id: " + id));
    }
}
