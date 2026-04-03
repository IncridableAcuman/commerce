package com.commerce.server.service;

import com.commerce.server.dto.ProductRequest;
import com.commerce.server.dto.ProductResponse;
import com.commerce.server.entity.Product;
import com.commerce.server.exception.NotFoundException;
import com.commerce.server.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final FileService fileService;

    public ProductResponse createProduct(ProductRequest request) throws IOException {
        Product product = new Product();
        product.setTitle(request.getTitle());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());
        product.setSize(request.getSize());
        product.setImage(fileService.saveFile(request.getImage()));
        product.setStatus(request.getStatus());
        Product savedProduct = productRepository.save(product);
        return ProductResponse.from(savedProduct);
    }
    public List<ProductResponse> getList(){
        List<Product> products = productRepository.findAll();
        return products.stream().map(ProductResponse::from).toList();
    }
    public ProductResponse getProduct(Long id){
        Product product = productRepository.findById(id).orElseThrow(()-> new NotFoundException("Product not found"));
        return ProductResponse.from(product);
    }
    public void deleteProduct(Long id){
        Product product = productRepository.findById(id).orElseThrow(()->new NotFoundException("Product not foud"));
        productRepository.delete(product);
    }
    public ProductResponse editProduct(Long id,ProductRequest request) throws IOException {
        Product product = productRepository.findById(id).orElseThrow(()->new NotFoundException("Product not found"));
        product.setTitle(request.getTitle());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());
        product.setSize(request.getSize());
        product.setImage(fileService.saveFile(request.getImage()));
        product.setStatus(request.getStatus());
        Product savedProduct = productRepository.save(product);
        return ProductResponse.from(savedProduct);
    }
}
