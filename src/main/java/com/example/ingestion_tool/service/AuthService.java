package com.example.ingestion_tool.service;

import com.example.ingestion_tool.dto.User;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private JwtUtil jwtUtil = new JwtUtil();

    // Simulating user registration (you can connect this with a database)
    public Map<String, String> registerUser(User user) {
        String token = jwtUtil.generateToken(user.getUsername());
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return response;
    }

    // Handle user login, validate credentials and generate JWT token
    public Map<String, String> loginUser(User user) {
        // Here, you should validate the username/password with a database or other
        // service
        String token = jwtUtil.generateToken(user.getUsername());
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return response;
    }
}
