package com.example.be.repository;

import com.example.be.entity.Verification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VerificationRepository extends JpaRepository<Verification,Integer> {
    Verification findByEmail(String email);
    Verification findByOtp(String otp);
}
