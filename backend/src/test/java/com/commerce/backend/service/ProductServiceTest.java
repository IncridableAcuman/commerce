package com.commerce.backend.service;

import com.commerce.backend.dto.ProductDto.ProductRequest;
import com.commerce.backend.dto.ProductDto.ProductResponse;
import com.commerce.backend.entity.ProductCategoryEntity;
import com.commerce.backend.entity.ProductEntity;
import com.commerce.backend.exception.CustomNotFoundException;
import com.commerce.backend.repository.ProductCategoryRepository;
import com.commerce.backend.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductCategoryRepository productCategoryRepository;

    @Mock
    private com.commerce.backend.elasticsearch.service.ProductSearchService productSearchService;

    @InjectMocks
    private ProductService productService;

    private ProductCategoryEntity category;
    private ProductEntity product;

    @BeforeEach
    void setUp() {
        category = ProductCategoryEntity.builder()
                .id(1L)
                .name("Elektronika")
                .description("Gadjetlar")
                .build();

        product = ProductEntity.builder()
                .id(100L)
                .title("MacBook Pro")
                .content("Apple noutbuki")
                .price(1999.99)
                .imageUrl("https://example.com/macbook.jpg")
                .stock(10)
                .rating(4.9)
                .category(category)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("Barcha mahsulotlarni filtrlash va sahifalash bilan olish: Muvaffaqiyatli")
    void testGetAllProducts_Success() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<ProductEntity> productPage = new PageImpl<>(List.of(product), pageable, 1);

        when(productRepository.findWithFilters(eq(1L), eq("macbook"), eq(1000.0), eq(3000.0), eq(false), eq(pageable)))
                .thenReturn(productPage);

        Page<ProductResponse> result = productService.getAllProducts(1L, "macbook", 1000.0, 3000.0, pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("MacBook Pro", result.getContent().get(0).title());
        assertEquals(1999.99, result.getContent().get(0).price());
        assertEquals("Elektronika", result.getContent().get(0).categoryName());
    }

    @Test
    @DisplayName("ID bo'yicha mahsulotni olish: Muvaffaqiyatli")
    void testGetProductById_Success() {
        when(productRepository.findById(100L)).thenReturn(Optional.of(product));

        ProductResponse response = productService.getProductById(100L);

        assertNotNull(response);
        assertEquals(100L, response.id());
        assertEquals("MacBook Pro", response.title());
        assertEquals("Elektronika", response.categoryName());
    }

    @Test
    @DisplayName("ID bo'yicha mahsulot topilmaganda CustomNotFoundException tashlash")
    void testGetProductById_NotFound() {
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(CustomNotFoundException.class, () -> productService.getProductById(999L));
    }

    @Test
    @DisplayName("Yangi mahsulot yaratish: Kategoriya bilan muvaffaqiyatli")
    void testCreateProduct_Success() {
        ProductRequest request = ProductRequest.builder()
                .title("iPhone 16 Pro")
                .content("Yangi avlod smartfoni")
                .price(1199.0)
                .imageUrl("https://example.com/iphone.jpg")
                .stock(20)
                .categoryId(1L)
                .build();

        when(productCategoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(productRepository.save(any(ProductEntity.class))).thenAnswer(invocation -> {
            ProductEntity entity = invocation.getArgument(0);
            entity.setId(101L);
            return entity;
        });

        ProductResponse response = productService.createProduct(request);

        assertNotNull(response);
        assertEquals("iPhone 16 Pro", response.title());
        assertEquals(1199.0, response.price());
        assertEquals(20, response.stock());
        assertEquals("Elektronika", response.categoryName());
        verify(productRepository, times(1)).save(any(ProductEntity.class));
    }

    @Test
    @DisplayName("Yangi mahsulot yaratish: Kategoriya topilmaganda CustomNotFoundException")
    void testCreateProduct_CategoryNotFound() {
        ProductRequest request = ProductRequest.builder()
                .title("iPhone 16 Pro")
                .content("Yangi avlod smartfoni")
                .price(1199.0)
                .categoryId(999L)
                .build();

        when(productCategoryRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(CustomNotFoundException.class, () -> productService.createProduct(request));
        verify(productRepository, never()).save(any(ProductEntity.class));
    }

    @Test
    @DisplayName("Mahsulotni yangilash: Muvaffaqiyatli")
    void testUpdateProduct_Success() {
        ProductRequest updateRequest = ProductRequest.builder()
                .title("MacBook Pro M3 Max")
                .content("Yangilangan tavsif")
                .price(2199.0)
                .stock(5)
                .build();

        when(productRepository.findById(100L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(ProductEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ProductResponse response = productService.updateProduct(100L, updateRequest);

        assertNotNull(response);
        assertEquals("MacBook Pro M3 Max", response.title());
        assertEquals(2199.0, response.price());
        assertEquals(5, response.stock());
        verify(productRepository, times(1)).save(product);
    }

    @Test
    @DisplayName("Mavjud bo'lmagan mahsulotni yangilashda CustomNotFoundException")
    void testUpdateProduct_NotFound() {
        ProductRequest updateRequest = ProductRequest.builder()
                .title("MacBook Pro")
                .build();

        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(CustomNotFoundException.class, () -> productService.updateProduct(999L, updateRequest));
        verify(productRepository, never()).save(any(ProductEntity.class));
    }

    @Test
    @DisplayName("Mahsulotni o'chirish: Muvaffaqiyatli")
    void testDeleteProduct_Success() {
        when(productRepository.existsById(100L)).thenReturn(true);
        doNothing().when(productRepository).deleteById(100L);

        assertDoesNotThrow(() -> productService.deleteProduct(100L));
        verify(productRepository, times(1)).deleteById(100L);
    }

    @Test
    @DisplayName("Mavjud bo'lmagan mahsulotni o'chirishda CustomNotFoundException")
    void testDeleteProduct_NotFound() {
        when(productRepository.existsById(999L)).thenReturn(false);

        assertThrows(CustomNotFoundException.class, () -> productService.deleteProduct(999L));
        verify(productRepository, never()).deleteById(anyLong());
    }
}
