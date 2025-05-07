package com.example.be.repository;

import com.example.be.entity.Imei;
import com.example.be.entity.ImeiSold;
import com.example.be.entity.status.StatusImei;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImeiRepository extends JpaRepository<Imei, Integer> {
    Imei findImeiByImeiCode(String imeiCode);

    List<Imei> findByProductDetailId(Integer id);

    List<Imei> findByIdIn(List<Integer> idImei);


    @Query("select i from Imei i " +
            "where i.status = :status and i.productDetail.id = :id")
    List<Imei> getAllImeiChuaBan(@Param("status") StatusImei statusImei,
                                 @Param("id") Integer id);

    @Query("select i from Imei i " +
            "join ImeiSold iSold on iSold.id_Imei.id = i.id " +
            "where i.status = :status and i.productDetail.id = :idProduct " +
            "and iSold.idBillDetail.id = :idBillDetail")
    List<Imei> getAllImeiDaBan(@Param("status") StatusImei statusImei,
                               @Param("idProduct") Integer idProduct,
                               @Param("idBillDetail") Integer idBillDetail
    );

    @Query("SELECT i FROM Imei i " +
            "LEFT JOIN ImeiSold iSold ON i.id = iSold.id_Imei.id " +
            "WHERE  i.productDetail.id = :idProduct " +
            "AND (iSold.idBillDetail.id = :idBillDetail OR iSold.idBillDetail.id IS NULL)")
    List<Imei> findImeiByIdProductDetail(
            @Param("idProduct") Integer idProduct,
            @Param("idBillDetail") Integer idBillDetail);


    @Query("SELECT i FROM Imei i " +
            "WHERE i.imeiCode = :imei " +
            "AND i.status = :status")
    Imei findImeiByImeiCode(@Param("imei") String imei,
                            @Param("status") StatusImei statusImei);

    //    @Query("SELECT i.id_Imei FROM ImeiSold i " +
//            "WHERE i.id_Imei.id IN :imeiIds " +
//            "AND i.idBillDetail.id <> :currentBillDetailId")
//    List<Imei> findImeiSoldInOtherBillDetails(
//            @Param("imeiIds") List<Integer> imeiIds,
//            @Param("currentBillDetailId") Integer currentBillDetailId
//    );
    @Query("SELECT i.id_Imei FROM ImeiSold i " +
            "WHERE i.id_Imei.id IN :imeiIds " +
            "AND (:currentBillDetailId IS NULL OR i.idBillDetail.id <> :currentBillDetailId)")
    List<Imei> findImeiSoldInOtherBillDetails(
            @Param("imeiIds") List<Integer> imeiIds,
            @Param("currentBillDetailId") Integer currentBillDetailId
    );


}