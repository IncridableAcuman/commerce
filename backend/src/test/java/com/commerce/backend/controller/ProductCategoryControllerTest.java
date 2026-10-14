package com.commerce.backend.controller;

import com.commerce.backend.dto.ProductCategoryDto.CategoryRequest;
import com.commerce.backend.dto.ProductCategoryDto.CategoryResponse;
import com.commerce.backend.service.ProductCategoryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ProductCategoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private ProductCategoryService productCategoryService;

    @Test
    @DisplayName("GET /products/categories - Ommaviy ko'rish 200 OK")
    void testGetAllCategories_Public() throws Exception {
        CategoryResponse response = new CategoryResponse(
                1L,
                "Elektronika",
                "Gadjetlar",
                5,
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        when(productCategoryService.getAllCategories()).thenReturn(List.of(response));

        mockMvc.perform(get("/products/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].name").value("Elektronika"));
    }

    @Test
    @DisplayName("POST /products/categories - Autentifikatsiya bilan yaratish (201 Created)")
    @WithMockUser(username = "admin@example.com", roles = "ADMIN")
    void testCreateCategory_Authenticated() throws Exception {
        CategoryRequest request = CategoryRequest.builder()
                .name("Kiyim-kechak")
                .description("Yangi kiyimlar")
                .build();

        CategoryResponse response = new CategoryResponse(
                2L,
                "Kiyim-kechak",
                "Yangi kiyimlar",
                0,
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        when(productCategoryService.createCategory(any(CategoryRequest.class))).thenReturn(response);

        mockMvc.perform(post("/products/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(2L))
                .andExpect(jsonPath("$.name").value("Kiyim-kechak"));
    }
}
