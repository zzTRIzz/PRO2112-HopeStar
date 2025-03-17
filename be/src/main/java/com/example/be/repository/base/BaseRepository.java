package com.example.be.repository.base;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

@NoRepositoryBean  // Để Spring không tạo bean cho interface này
public interface BaseRepository<E,ID> extends JpaRepository<E,ID> {
    @Query(value = """
    SELECT COALESCE(MAX(CAST(SUBSTRING(code, 6) AS UNSIGNED)), 0) + 1 
    FROM #{#entityName}
    """, nativeQuery = true)
    String getNewCode();

    //#{#entityName}: Biến đổi tên thực thể (entity) thành tên bảng tương ứng trong SQL.

}
