package com.example.be.controller;

import com.example.be.entity.User;
import com.example.be.repository.Repo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("user")
public class UserController {
    @Autowired
    Repo repo;

    @PostMapping("add")
    public User add(@RequestBody User user){
        return repo.save(user);
    }
}
