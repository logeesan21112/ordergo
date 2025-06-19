package com.quickman.ordermanagement.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.quickman.ordermanagement.models.Product;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByDeletedFalseOrderByIdDesc();
    List<Product> findByDeletedFalseAndNameContaining(String name);
}