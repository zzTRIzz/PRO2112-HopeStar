package com.example.be.controller.admin.attribute.product;

import com.example.be.controller.admin.attribute.FormatController;
import com.example.be.entity.Category;
import com.example.be.service.atribute.product.CategoryService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/admin/category")
public class CategoryController extends FormatController<Category, CategoryService> {

    public CategoryController(CategoryService categoryService) {
        super(categoryService);
    }

}
