package com.example.be.core.admin.atribute_management.controller.product;


import com.example.be.core.admin.atribute_management.controller.FormatController;
import com.example.be.core.admin.atribute_management.service.product.CategoryService;
import com.example.be.entity.Category;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/admin/category")
public class CategoryController extends FormatController<Category, CategoryService> {

    public CategoryController(CategoryService categoryService) {
        super(categoryService);
    }

}
