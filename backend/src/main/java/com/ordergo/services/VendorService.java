package com.ordergo.services;

import org.springframework.web.multipart.MultipartFile;
import com.ordergo.dtos.VendorDTO;
import com.ordergo.dtos.Response;

public interface VendorService {

    Response saveVendor(VendorDTO vendorDTO, MultipartFile imageFile);
    Response updateVendor(VendorDTO vendorDTO, MultipartFile imageFile);
    Response getAllVendors();
    Response getVendorById(Long id);
    Response deleteVendor(Long id);
}