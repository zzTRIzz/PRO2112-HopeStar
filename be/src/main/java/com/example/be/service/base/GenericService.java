package com.example.be.service.base;

import java.util.List;
/*
Đây là một generic interface dùng để định nghĩa các thao tác CRUD cho bất kỳ entity nào trong ứng dụng.
Sử dụng generics (<T, ID>) để linh hoạt với mọi loại entity và khóa chính.
T: Đại diện cho kiểu dữ liệu của entity (ví dụ: User, Product, Order...).
ID: Đại diện cho kiểu dữ liệu của khóa chính (primary key) của entity (ví dụ: Long, Integer, String...).
*/
public interface GenericService<T, ID> {
    List<T> getAll();
    T create(T entity);
    void update(ID id, T entity) throws Exception;
    T getById(ID id) throws Exception;
}
