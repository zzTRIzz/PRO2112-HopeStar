package com.example.be.repository;

import com.example.be.entity.BillDetail;
import com.example.be.entity.BillHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillHistoryRepository extends JpaRepository<BillHistory,Integer> {

    @Query("SELECT bh FROM BillHistory bh WHERE bh.bill.id = :idBill")
    List<BillHistory> findBillHistoryByIdBill(@Param("idBill") Integer idBill);
}
