package com.example.ingestion_tool.controller;

import com.example.ingestion_tool.dto.User;
import com.example.ingestion_tool.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthService authService;

    // Endpoint for user registration (signup)
    @PostMapping("/register")
    public Map<String, String> register(@RequestBody User user) {
        return authService.registerUser(user);
    }

    // Endpoint for user login (authentication)
    @PostMapping("/login")
    public Map<String, String> login(@RequestBody User user) {
        return authService.loginUser(user);
    }
}
