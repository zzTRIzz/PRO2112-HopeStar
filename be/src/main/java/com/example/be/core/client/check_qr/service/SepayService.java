package com.example.be.core.client.check_qr.service;

import java.io.IOException;

public interface SepayService {

    boolean  fetchTransactions(String description, String transactionDateMin) throws IOException;
}
