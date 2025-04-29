package com.example.be.repository;

import com.example.be.core.admin.banhang.dto.ImeiSoldDto;
import com.example.be.entity.Imei;
import com.example.be.entity.ImeiSold;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImeiSoldRepository extends JpaRepository<ImeiSold, Integer> {

    @Modifying
    @Transactional
    @Query("delete from ImeiSold i " +
            "where i.idBillDetail.id = :idBillDetail")
    void deleteImeiSold(@Param("idBillDetail") Integer idBillDetail);

//    @Modifying
//    @Transactional
//    @Query("DELETE FROM ImeiSold i WHERE i.idBillDetail.id = :idBillDetail")
//    void deleteAllByIdBillDetail(@Param("idBillDetail") Integer idBillDetail);

    @Query("SELECT i FROM ImeiSold i WHERE i.id_Imei.id IN :idImei")
    List<ImeiSold> searchImeiSoldByIdImei(@Param("idImei") List<Integer> idImei);
//
//    @Query("select i from ImeiSold i " +
//            "where i.id_Imei.id =:idImei")
//    ImeiSold searchImeiSoldByIdImei(@Param("idImei") List<Integer> idImei);



    @Query("select i.id_Imei from ImeiSold i " +
            "where i.idBillDetail.id = :idBillDetail")
    List<Imei> searchImeiSold(@Param("idBillDetail") Integer idBillDetail);

    @Query("select i from ImeiSold i " +
            "where i.idBillDetail.id = :idBillDetail")
    List<ImeiSold> timkiem(@Param("idBillDetail") Integer idBillDetail);

//    List<ImeiSold> findByIdBillDetail(@Param("idBillDetail") Integer idBillDetail);

}
