package com.ordergo.services.impl;

import com.ordergo.dtos.LoginRequest;
import com.ordergo.dtos.RegisterRequest;
import com.ordergo.dtos.Response;
import com.ordergo.dtos.UserDTO;
import com.ordergo.enums.UserRole;
import com.ordergo.exceptions.InvalidCredentialsException;
import com.ordergo.exceptions.NotFoundException;
import com.ordergo.models.User;
import com.ordergo.repositories.UserRepository;
import com.ordergo.security.JwtUtils;
import com.ordergo.services.UserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;
    private final JwtUtils jwtUtils;

    private static final String IMAGE_DIRECTORY = "E:/quickman-order-management/frontend/public/riders/";

    @Override
    public Response registerUser(RegisterRequest registerRequest, MultipartFile imageFile) {
        UserRole role = registerRequest.getRole() != null ? registerRequest.getRole() : UserRole.USER;

        User user = User.builder()
                .name(registerRequest.getName())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .phoneNumber(registerRequest.getPhoneNumber())
                .role(role)
                .build();

        if (imageFile != null && !imageFile.isEmpty()) {
            String imagePath = saveImage(imageFile);
            user.setImageUrl(imagePath);
        }

        userRepository.save(user);

        return Response.builder()
                .status(200)
                .message("User registered successfully")
                .build();
    }

    @Override
    public Response loginUser(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new NotFoundException("Email not found"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Password does not match");
        }

        String token = jwtUtils.generateToken(user.getEmail());

        return Response.builder()
                .status(200)
                .message("User logged in successfully")
                .role(user.getRole())
                .token(token)
                .expirationTime("6 months")
                .build();
    }

    @Override
    public Response getAllUsers() {
        List<User> users = userRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
        users.forEach(user -> user.setDeliveries(null));
        List<UserDTO> userDTOs = modelMapper.map(users, new TypeToken<List<UserDTO>>() {}.getType());

        return Response.builder()
                .status(200)
                .message("success")
                .users(userDTOs)
                .build();
    }

    @Override
    public User getCurrentLoggedInUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));
        user.setDeliveries(null);
        return user;
    }

    @Override
    public Response getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found"));
        UserDTO userDTO = modelMapper.map(user, UserDTO.class);
        userDTO.setDeliveries(null);

        return Response.builder()
                .status(200)
                .message("success")
                .user(userDTO)
                .build();
    }

    @Override
    public Response updateUser(Long id, UserDTO userDTO, MultipartFile imageFile) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (userDTO.getEmail() != null) user.setEmail(userDTO.getEmail());
        if (userDTO.getPhoneNumber() != null) user.setPhoneNumber(userDTO.getPhoneNumber());
        if (userDTO.getName() != null) user.setName(userDTO.getName());
        if (userDTO.getRole() != null) user.setRole(userDTO.getRole());
        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }

        if (imageFile != null && !imageFile.isEmpty()) {
            String imagePath = saveImage(imageFile);
            user.setImageUrl(imagePath);
        }

        userRepository.save(user);

        return Response.builder()
                .status(200)
                .message("User updated successfully")
                .build();
    }

    @Override
    public Response deleteUser(Long id) {
        userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found"));
        userRepository.deleteById(id);

        return Response.builder()
                .status(200)
                .message("User deleted successfully")
                .build();
    }

    @Override
    public Response getUserDeliveries(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found"));
        UserDTO userDTO = modelMapper.map(user, UserDTO.class);
        userDTO.getDeliveries().forEach(deliveryDTO -> deliveryDTO.setUser(null));

        return Response.builder()
                .status(200)
                .message("success")
                .user(userDTO)
                .build();
    }

    private String saveImage(MultipartFile imageFile) {
        if (!imageFile.getContentType().startsWith("image/") || imageFile.getSize() > 1024 * 1024 * 10) {
            throw new IllegalArgumentException("Only image files under 10MB are allowed");
        }

        File directory = new File(IMAGE_DIRECTORY);
        if (!directory.exists()) directory.mkdir();

        String uniqueFileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();

        try {
            imageFile.transferTo(new File(IMAGE_DIRECTORY + uniqueFileName));
        } catch (Exception e) {
            throw new IllegalArgumentException("Error saving image: " + e.getMessage());
        }

        return "riders/" + uniqueFileName;
    }
}