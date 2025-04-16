package com.example.be.core.admin.banhang.service;

import com.example.be.core.admin.banhang.request.BillHistoryRequest;
import com.example.be.core.admin.banhang.respones.BillHistoryRespones;

import java.util.List;

public interface BillHistoryService {
    List<BillHistoryRespones> hienThiBillHistory();

    BillHistoryRespones addBillHistory(BillHistoryRequest billHistoryRequest);
}
