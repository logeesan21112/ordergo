package com.quickman.ordermanagement.services.impl;

import com.quickman.ordermanagement.dtos.ProductDTO;
import com.quickman.ordermanagement.dtos.Response;
import com.quickman.ordermanagement.exceptions.NotFoundException;
import com.quickman.ordermanagement.models.Product;
import com.quickman.ordermanagement.repositories.ProductRepository;
import com.quickman.ordermanagement.services.ProductService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;
    private static final String IMAGE_DIRECTORY_2 = "E:/quickman-order-management/frontend/public/products/";

    @Override
    public Response saveProduct(ProductDTO productDTO, MultipartFile imageFile) {
        Product productToSave = Product.builder()
                .name(productDTO.getName())
                .email(productDTO.getEmail())
                .address(productDTO.getAddress())
                .phoneNumber(productDTO.getPhoneNumber())
                .build();

        if (imageFile != null && !imageFile.isEmpty()) {
            String imagePath = saveImage2(imageFile);
            productToSave.setImageUrl(imagePath);
        }

        productRepository.save(productToSave);

        return Response.builder()
                .status(200)
                .message("Product successfully saved")
                .build();
    }

    @Override
    public Response updateProduct(ProductDTO productDTO, MultipartFile imageFile) {
        Product existingProduct = productRepository.findById(productDTO.getProductId())
                .orElseThrow(() -> new NotFoundException("Product Not Found"));

        if (imageFile != null && !imageFile.isEmpty()) {
            String imagePath = saveImage2(imageFile);
            existingProduct.setImageUrl(imagePath);
        }

        if (productDTO.getName() != null && !productDTO.getName().isBlank()) {
            existingProduct.setName(productDTO.getName());
        }

        if (productDTO.getEmail() != null && !productDTO.getEmail().isBlank()) {
            existingProduct.setEmail(productDTO.getEmail());
        }

        if (productDTO.getAddress() != null && !productDTO.getAddress().isBlank()) {
            existingProduct.setAddress(productDTO.getAddress());
        }

        if (productDTO.getPhoneNumber() != null && productDTO.getPhoneNumber().matches("\\d{10}")) {
            existingProduct.setPhoneNumber(productDTO.getPhoneNumber());
        }

        productRepository.save(existingProduct);

        return Response.builder()
                .status(200)
                .message("Product Updated successfully")
                .build();
    }

    @Override
    public Response getAllProducts() {
        List<Product> productList = productRepository.findByDeletedFalseOrderByIdDesc();
        List<ProductDTO> productDTOList = modelMapper.map(productList, new TypeToken<List<ProductDTO>>() {}.getType());

        return Response.builder()
                .status(200)
                .message("success")
                .products(productDTOList)
                .build();
    }

    @Override
    public Response getProductById(Long id) {
        Product product = productRepository.findById(id)
                .filter(p -> !p.isDeleted())
                .orElseThrow(() -> new NotFoundException("Product Not Found"));

        return Response.builder()
                .status(200)
                .message("success")
                .product(modelMapper.map(product, ProductDTO.class))
                .build();
    }

    @Override
    public Response deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found with ID: " + id));

        product.setDeleted(true);
        product.setName(product.getName() + " [deleted]");
        product.setEmail(product.getEmail() + " [deleted]");
        productRepository.save(product);

        return Response.builder()
                .status(200)
                .message("Product deleted successfully (soft deleted)")
                .build();
    }

    private String saveImage2(MultipartFile imageFile) {
        if (!imageFile.getContentType().startsWith("image/") || imageFile.getSize() > 1024 * 1024 * 1024) {
            throw new IllegalArgumentException("Only image files under 1GIG is allowed");
        }

        File directory = new File(IMAGE_DIRECTORY_2);
        if (!directory.exists()) {
            directory.mkdir();
        }

        String uniqueFileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
        String imagePath = IMAGE_DIRECTORY_2 + uniqueFileName;

        try {
            imageFile.transferTo(new File(imagePath));
        } catch (Exception e) {
            throw new IllegalArgumentException("Error saving Image: " + e.getMessage());
        }

        return "products/" + uniqueFileName;
    }
}
