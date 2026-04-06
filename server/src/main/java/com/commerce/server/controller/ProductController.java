package com.commerce.server.controller;

import com.commerce.server.dto.ProductRequest;
import com.commerce.server.dto.ProductResponse;
import com.commerce.server.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/product")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@Valid @ModelAttribute ProductRequest request) throws IOException {
        return ResponseEntity.ok(productService.createProduct(request));
    }
    @GetMapping("/list")
    public ResponseEntity<List<ProductResponse>> getList(){
        return ResponseEntity.ok(productService.getList());
    }
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProduct(@PathVariable Long id){
        return ResponseEntity.ok(productService.getProduct(id));
    }
    @PatchMapping("/{id}")
    public ResponseEntity<ProductResponse> editProduct(@PathVariable Long id,@Valid @RequestBody ProductRequest request) throws IOException {
        return ResponseEntity.ok(productService.editProduct(id,request));
    }
}
