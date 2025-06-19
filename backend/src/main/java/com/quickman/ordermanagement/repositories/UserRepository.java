package com.quickman.ordermanagement.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.quickman.ordermanagement.models.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}