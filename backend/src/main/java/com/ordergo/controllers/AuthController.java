package com.ordergo.controllers;

import com.ordergo.dtos.LoginRequest;
import com.ordergo.dtos.RegisterRequest;
import com.ordergo.dtos.Response;
import com.ordergo.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<Response> registerUser(
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile,
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("phoneNumber") String phoneNumber,
            @RequestParam(value = "role", required = false) String role) {

        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setName(name);
        registerRequest.setEmail(email);
        registerRequest.setPassword(password);
        registerRequest.setPhoneNumber(phoneNumber);
        if (role != null) {
            registerRequest.setRole(com.ordergo.enums.UserRole.valueOf(role));
        }

        return ResponseEntity.ok(userService.registerUser(registerRequest, imageFile));
    }

    @PostMapping("/login")
    public ResponseEntity<Response> loginUser(@RequestBody @Valid LoginRequest loginRequest) {
        return ResponseEntity.ok(userService.loginUser(loginRequest));
    }
}