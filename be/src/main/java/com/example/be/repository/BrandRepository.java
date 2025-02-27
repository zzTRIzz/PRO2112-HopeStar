package com.example.be.repository;

import com.example.be.entity.Brand;
import com.example.be.repository.base.BaseRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BrandRepository extends BaseRepository<Brand, Integer> {
    @Query("SELECT COUNT(b) > 0 FROM #{#entityName} b WHERE LOWER(TRIM(b.name)) = LOWER(TRIM(:name))") // trim ko hoat dong
    boolean existsByNameTrimmedIgnoreCase(@Param("name") String name);

    @Query("SELECT COUNT(b) > 0 FROM #{#entityName} b WHERE LOWER(TRIM(b.name)) = LOWER(TRIM(:name)) AND b.id <> :id")
    boolean existsByNameTrimmedIgnoreCaseAndNotId(@Param("name") String name, @Param("id") Integer id);
}