package com.ordergo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ordergo.models.Vendor;
import java.util.List;

public interface VendorRepository extends JpaRepository<Vendor, Long> {

    List<Vendor> findByIsDeletedFalseOrderByIdDesc();

    List<Vendor> findByIsDeletedFalseAndNameContaining(String name);
}