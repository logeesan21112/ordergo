package com.ordergo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ordergo.models.User;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}