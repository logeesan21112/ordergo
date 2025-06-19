package com.quickman.ordermanagement.services;

import org.springframework.web.multipart.MultipartFile;

import com.quickman.ordermanagement.dtos.ProductDTO;
import com.quickman.ordermanagement.dtos.Response;

public interface ProductService {
    Response saveProduct(ProductDTO productDTO, MultipartFile imageFile);
    Response updateProduct(ProductDTO productDTO, MultipartFile imageFile);
    Response getAllProducts();
    Response getProductById(Long id);
    Response deleteProduct(Long id);
}