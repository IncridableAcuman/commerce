package com.commerce.backend.controller;

import com.commerce.backend.dto.ProductDto.ProductRequest;
import com.commerce.backend.dto.ProductDto.ProductResponse;
import com.commerce.backend.service.FileService;
import com.commerce.backend.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private ProductService productService;

    @MockitoBean
    private FileService fileService;

    @Test
    @DisplayName("GET /products - Ommaviy ko'rish (Autentifikatsiyasiz) 200 OK")
    void testGetAllProducts_Public() throws Exception {
        ProductResponse response = new ProductResponse(
                1L,
                "MacBook Pro",
                "Apple noutbuki",
                1999.99,
                "https://example.com/image.jpg",
                10,
                4.9,
                1L,
                "Elektronika",
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        when(productService.getAllProducts(any(), any(), any(), any(), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(response)));

        mockMvc.perform(get("/products")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1L))
                .andExpect(jsonPath("$.content[0].title").value("MacBook Pro"))
                .andExpect(jsonPath("$.content[0].price").value(1999.99));
    }

    @Test
    @DisplayName("GET /products/{id} - Ommaviy ko'rish (Autentifikatsiyasiz) 200 OK")
    void testGetProductById_Public() throws Exception {
        ProductResponse response = new ProductResponse(
                1L,
                "MacBook Pro",
                "Apple noutbuki",
                1999.99,
                "https://example.com/image.jpg",
                10,
                4.9,
                1L,
                "Elektronika",
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        when(productService.getProductById(1L)).thenReturn(response);

        mockMvc.perform(get("/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.title").value("MacBook Pro"));
    }

    @Test
    @DisplayName("POST /products - Autentifikatsiyasiz yaratishga urinish rad etilishi kerak (401/403)")
    void testCreateProduct_Unauthenticated_Fails() throws Exception {
        ProductRequest request = ProductRequest.builder()
                .title("iPhone 16")
                .content("Yangi iPhone")
                .price(999.0)
                .build();

        mockMvc.perform(post("/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /products - Autentifikatsiyadan o'tgan foydalanuvchi bilan yaratish (201 Created)")
    @WithMockUser(username = "admin@example.com", roles = "ADMIN")
    void testCreateProduct_Authenticated_Success() throws Exception {
        ProductRequest request = ProductRequest.builder()
                .title("iPhone 16 Pro")
                .content("Yangi avlod iPhone")
                .price(1199.0)
                .stock(15)
                .categoryId(1L)
                .build();

        ProductResponse response = new ProductResponse(
                10L,
                "iPhone 16 Pro",
                "Yangi avlod iPhone",
                1199.0,
                null,
                15,
                5.0,
                1L,
                "Elektronika",
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        when(productService.createProduct(any(ProductRequest.class))).thenReturn(response);

        mockMvc.perform(post("/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(10L))
                .andExpect(jsonPath("$.title").value("iPhone 16 Pro"));
    }

    @Test
    @DisplayName("PUT /products/{id} - Autentifikatsiyadan o'tgan foydalanuvchi bilan yangilash (200 OK)")
    @WithMockUser(username = "admin@example.com", roles = "ADMIN")
    void testUpdateProduct_Authenticated_Success() throws Exception {
        ProductRequest request = ProductRequest.builder()
                .title("iPhone 16 Pro Max")
                .content("Yangilangan tavsif")
                .price(1299.0)
                .build();

        ProductResponse response = new ProductResponse(
                10L,
                "iPhone 16 Pro Max",
                "Yangilangan tavsif",
                1299.0,
                null,
                15,
                5.0,
                1L,
                "Elektronika",
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        when(productService.updateProduct(eq(10L), any(ProductRequest.class))).thenReturn(response);

        mockMvc.perform(put("/products/10")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("iPhone 16 Pro Max"));
    }

    @Test
    @DisplayName("DELETE /products/{id} - Autentifikatsiyadan o'tgan foydalanuvchi bilan o'chirish (204 No Content)")
    @WithMockUser(username = "admin@example.com", roles = "ADMIN")
    void testDeleteProduct_Authenticated_Success() throws Exception {
        doNothing().when(productService).deleteProduct(10L);

        mockMvc.perform(delete("/products/10"))
                .andExpect(status().isNoContent());
    }
}
