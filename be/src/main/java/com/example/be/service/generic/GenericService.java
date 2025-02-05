package com.example.be.service.generic;

import java.util.List;

public interface GenericService<T, ID> {
    List<T> getAll();
    T create(T entity);
    T update(ID id, T entity);
    T getById(ID id);
}
