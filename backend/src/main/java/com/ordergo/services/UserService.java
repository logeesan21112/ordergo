package com.ordergo.services;

import com.ordergo.dtos.LoginRequest;
import com.ordergo.dtos.RegisterRequest;
import com.ordergo.dtos.Response;
import com.ordergo.dtos.UserDTO;
import com.ordergo.models.User;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {

    Response registerUser(RegisterRequest registerRequest, MultipartFile imageFile);
    Response loginUser(LoginRequest loginRequest);
    Response getAllUsers();
    User getCurrentLoggedInUser();
    Response getUserById(Long id);
    Response updateUser(Long id, UserDTO userDTO, MultipartFile imageFile);
    Response deleteUser(Long id);
    Response getUserDeliveries(Long id);
}