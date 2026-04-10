package com.commerce.server.controller;

import com.commerce.server.dto.ProductRequest;
import com.commerce.server.dto.ProductResponse;
import com.commerce.server.enums.Category;
import com.commerce.server.enums.Status;
import com.commerce.server.service.ProductService;
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
    public ResponseEntity<ProductResponse> createProduct(@ModelAttribute ProductRequest request) throws IOException {
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
    public ResponseEntity<ProductResponse> editProduct(@PathVariable Long id, @ModelAttribute ProductRequest request) throws IOException {
        return ResponseEntity.ok(productService.editProduct(id,request));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id){
        productService.deleteProduct(id);
        return ResponseEntity.ok("Product deleted successfully");
    }
    @GetMapping("/categories/{category}")
    public ResponseEntity<ProductResponse> getProductByCategory(@PathVariable Category category){
        return ResponseEntity.ok(productService.findProductByCategory(category));
    }
    @GetMapping("/status/{status}")
    public ResponseEntity<ProductResponse> getProductByStatus(@PathVariable Status status){
        return ResponseEntity.ok(productService.findProductByStatus(status));
    }
}
