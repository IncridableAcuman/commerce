package com.commerce.backend.service;

import com.commerce.backend.dto.ProductCategoryDto.CategoryRequest;
import com.commerce.backend.dto.ProductCategoryDto.CategoryResponse;
import com.commerce.backend.entity.ProductCategoryEntity;
import com.commerce.backend.exception.CustomBadRequestException;
import com.commerce.backend.exception.CustomNotFoundException;
import com.commerce.backend.repository.ProductCategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductCategoryServiceTest {

    @Mock
    private ProductCategoryRepository productCategoryRepository;

    @InjectMocks
    private ProductCategoryService productCategoryService;

    private ProductCategoryEntity category;

    @BeforeEach
    void setUp() {
        category = ProductCategoryEntity.builder()
                .id(1L)
                .name("Elektronika")
                .description("Smartfonlar va kompyuterlar")
                .products(new ArrayList<>())
                .build();
    }

    @Test
    @DisplayName("Barcha kategoriyalarni olish: Muvaffaqiyatli")
    void testGetAllCategories_Success() {
        when(productCategoryRepository.findAll()).thenReturn(List.of(category));

        List<CategoryResponse> list = productCategoryService.getAllCategories();

        assertNotNull(list);
        assertEquals(1, list.size());
        assertEquals("Elektronika", list.get(0).name());
    }

    @Test
    @DisplayName("ID bo'yicha kategoriyani olish: Muvaffaqiyatli")
    void testGetCategoryById_Success() {
        when(productCategoryRepository.findById(1L)).thenReturn(Optional.of(category));

        CategoryResponse response = productCategoryService.getCategoryById(1L);

        assertNotNull(response);
        assertEquals(1L, response.id());
        assertEquals("Elektronika", response.name());
    }

    @Test
    @DisplayName("ID bo'yicha kategoriya topilmaganda CustomNotFoundException")
    void testGetCategoryById_NotFound() {
        when(productCategoryRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(CustomNotFoundException.class, () -> productCategoryService.getCategoryById(999L));
    }

    @Test
    @DisplayName("Yangi kategoriya yaratish: Muvaffaqiyatli")
    void testCreateCategory_Success() {
        CategoryRequest request = CategoryRequest.builder()
                .name("Kiyim-kechak")
                .description("Yangi kiyimlar")
                .build();

        when(productCategoryRepository.existsByNameIgnoreCase("Kiyim-kechak")).thenReturn(false);
        when(productCategoryRepository.save(any(ProductCategoryEntity.class))).thenAnswer(invocation -> {
            ProductCategoryEntity saved = invocation.getArgument(0);
            saved.setId(2L);
            return saved;
        });

        CategoryResponse response = productCategoryService.createCategory(request);

        assertNotNull(response);
        assertEquals("Kiyim-kechak", response.name());
        verify(productCategoryRepository, times(1)).save(any(ProductCategoryEntity.class));
    }

    @Test
    @DisplayName("Mavjud nom bilan kategoriya yaratishda CustomBadRequestException")
    void testCreateCategory_AlreadyExists_ThrowsException() {
        CategoryRequest request = CategoryRequest.builder()
                .name("Elektronika")
                .build();

        when(productCategoryRepository.existsByNameIgnoreCase("Elektronika")).thenReturn(true);

        assertThrows(CustomBadRequestException.class, () -> productCategoryService.createCategory(request));
        verify(productCategoryRepository, never()).save(any(ProductCategoryEntity.class));
    }

    @Test
    @DisplayName("Kategoriyani yangilash: Muvaffaqiyatli")
    void testUpdateCategory_Success() {
        CategoryRequest request = CategoryRequest.builder()
                .name("Smart Elektronika")
                .description("Yangilangan tavsif")
                .build();

        when(productCategoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(productCategoryRepository.existsByNameIgnoreCase("Smart Elektronika")).thenReturn(false);
        when(productCategoryRepository.save(any(ProductCategoryEntity.class))).thenAnswer(inv -> inv.getArgument(0));

        CategoryResponse response = productCategoryService.updateCategory(1L, request);

        assertNotNull(response);
        assertEquals("Smart Elektronika", response.name());
        assertEquals("Yangilangan tavsif", response.description());
    }

    @Test
    @DisplayName("Kategoriyani o'chirish: Muvaffaqiyatli")
    void testDeleteCategory_Success() {
        when(productCategoryRepository.existsById(1L)).thenReturn(true);
        doNothing().when(productCategoryRepository).deleteById(1L);

        assertDoesNotThrow(() -> productCategoryService.deleteCategory(1L));
        verify(productCategoryRepository, times(1)).deleteById(1L);
    }
}
