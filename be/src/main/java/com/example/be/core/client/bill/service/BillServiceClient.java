package com.example.be.core.client.bill.service;

import com.example.be.core.client.bill.respones.BillRespones;

import java.util.List;

public interface BillServiceClient {
    List<BillRespones> getBillsByAccount(Integer idAccount);

  BillRespones getAllBillByAccount(Integer idAccount);
}
