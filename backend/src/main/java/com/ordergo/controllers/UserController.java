package com.ordergo.controllers;

import com.ordergo.dtos.Response;
import com.ordergo.dtos.UserDTO;
import com.ordergo.models.User;
import com.ordergo.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/all")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<Response> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Response> updateUser(
            @PathVariable Long id,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "phoneNumber", required = false) String phoneNumber,
            @RequestParam(value = "role", required = false) String role,
            @RequestParam(value = "password", required = false) String password) {

        UserDTO userDTO = new UserDTO();
        userDTO.setName(name);
        userDTO.setEmail(email);
        userDTO.setPhoneNumber(phoneNumber);
        if (role != null) userDTO.setRole(com.ordergo.enums.UserRole.valueOf(role));
        userDTO.setPassword(password);

        return ResponseEntity.ok(userService.updateUser(id, userDTO, imageFile));
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> deleteUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.deleteUser(id));
    }

    @GetMapping("/deliveries/{userId}")
    public ResponseEntity<Response> getUserDeliveries(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserDeliveries(userId));
    }

    @GetMapping("/current")
    public ResponseEntity<User> getCurrentUser() {
        return ResponseEntity.ok(userService.getCurrentLoggedInUser());
    }
}