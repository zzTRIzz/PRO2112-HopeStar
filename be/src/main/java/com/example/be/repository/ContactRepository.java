package com.example.be.repository;

import com.example.be.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Integer> {

    List<Contact> findAllByIdIn(List<Integer> ids);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE Contact c SET c.reply = :reply WHERE c.id IN :contactIds")
    void updateReplyByIds(@Param("contactIds") List<Integer> ids, @Param("reply") String reply);
}
