package com.quickman.ordermanagement.services;

import com.quickman.ordermanagement.dtos.LoginRequest;
import com.quickman.ordermanagement.dtos.RegisterRequest;
import com.quickman.ordermanagement.dtos.Response;
import com.quickman.ordermanagement.dtos.UserDTO;
import com.quickman.ordermanagement.models.User;

public interface UserService {
    Response registerUser(RegisterRequest registerRequest);
    Response loginUser(LoginRequest loginRequest);
    Response getAllUsers();
    User getCurrentLoggedInUser();
    Response getUserById(Long id);
    Response updateUser(Long id, UserDTO userDTO);
    Response deleteUser(Long id);
    Response getUserTransactions(Long id);
}