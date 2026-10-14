package com.commerce.backend.elasticsearch.repository;

import com.commerce.backend.elasticsearch.document.ProductDocument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductElasticsearchRepository extends ElasticsearchRepository<ProductDocument, Long> {

    Page<ProductDocument> findByCategoryId(Long categoryId, Pageable pageable);

    Page<ProductDocument> findByTitleContainingOrContentContaining(String title, String content, Pageable pageable);

    List<ProductDocument> findByStockGreaterThan(int minStock);
}
