package com.commerce.backend.service;

import com.commerce.backend.dto.ProductCategoryDto.CategoryRequest;
import com.commerce.backend.dto.ProductCategoryDto.CategoryResponse;
import com.commerce.backend.entity.ProductCategoryEntity;
import com.commerce.backend.exception.CustomBadRequestException;
import com.commerce.backend.exception.CustomNotFoundException;
import com.commerce.backend.repository.ProductCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductCategoryService {
    private final ProductCategoryRepository productCategoryRepository;

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return productCategoryRepository.findAll()
                .stream()
                .map(CategoryResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Long id) {
        ProductCategoryEntity category = productCategoryRepository.findById(id)
                .orElseThrow(() -> new CustomNotFoundException("Kategoriya topilmadi (ID: " + id + ")"));
        return CategoryResponse.from(category);
    }

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        if (productCategoryRepository.existsByNameIgnoreCase(request.getName().trim())) {
            throw new CustomBadRequestException("Bunday nomli kategoriya allaqachon mavjud");
        }

        ProductCategoryEntity category = ProductCategoryEntity.builder()
                .name(request.getName().trim())
                .description(request.getDescription())
                .build();

        ProductCategoryEntity saved = productCategoryRepository.save(category);
        return CategoryResponse.from(saved);
    }

    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        ProductCategoryEntity category = productCategoryRepository.findById(id)
                .orElseThrow(() -> new CustomNotFoundException("Kategoriya topilmadi (ID: " + id + ")"));

        String newName = request.getName().trim();
        if (!category.getName().equalsIgnoreCase(newName) && productCategoryRepository.existsByNameIgnoreCase(newName)) {
            throw new CustomBadRequestException("Bunday nomli kategoriya allaqachon mavjud");
        }

        category.setName(newName);
        category.setDescription(request.getDescription());

        ProductCategoryEntity saved = productCategoryRepository.save(category);
        return CategoryResponse.from(saved);
    }

    @Transactional
    public void deleteCategory(Long id) {
        if (!productCategoryRepository.existsById(id)) {
            throw new CustomNotFoundException("Kategoriya topilmadi (ID: " + id + ")");
        }
        productCategoryRepository.deleteById(id);
    }
}
