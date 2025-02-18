package com.example.be.core.admin.atribute_management.service;

import java.util.List;

public interface GenericService<T, ID> {
    List<T> getAll();
    T create(T entity);
    void update(ID id, T entity) throws Exception;
    T getById(ID id) throws Exception;
}
