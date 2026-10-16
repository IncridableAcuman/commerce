package com.commerce.backend.elasticsearch.service;

import com.commerce.backend.dto.ProductDto.ProductResponse;
import com.commerce.backend.elasticsearch.document.ProductDocument;
import com.commerce.backend.elasticsearch.repository.ProductElasticsearchRepository;
import com.commerce.backend.entity.ProductEntity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.Criteria;
import org.springframework.data.elasticsearch.core.query.CriteriaQuery;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@org.springframework.boot.autoconfigure.condition.ConditionalOnProperty(
        name = "elasticsearch.enabled",
        havingValue = "true"
)
@RequiredArgsConstructor
public class ProductSearchService {

    private final ProductElasticsearchRepository elasticsearchRepository;
    private final ElasticsearchOperations elasticsearchOperations;

    /**
     * Bitta mahsulotni Elasticsearch ga indekslash
     */
    public void indexProduct(ProductEntity product) {
        try {
            ProductDocument doc = ProductDocument.from(product);
            elasticsearchRepository.save(doc);
            log.info("Mahsulot Elasticsearch ga indekslandi: ID={}, Title='{}'", product.getId(), product.getTitle());
        } catch (Exception e) {
            log.warn("Elasticsearch ga indekslashda ogohlantirish (ID={}): {}", product.getId(), e.getMessage());
        }
    }

    /**
     * Mahsulotni Elasticsearch dan o'chirish
     */
    public void deleteProductIndex(Long productId) {
        try {
            elasticsearchRepository.deleteById(productId);
            log.info("Mahsulot Elasticsearch indeksidan o'chirildi: ID={}", productId);
        } catch (Exception e) {
            log.warn("Elasticsearch dan o'chirishda ogohlantirish (ID={}): {}", productId, e.getMessage());
        }
    }

    /**
     * Barcha mahsulotlarni Elasticsearch ga to'liq qayta indekslash
     */
    public int reindexAll(List<ProductEntity> products) {
        try {
            List<ProductDocument> docs = products.stream()
                    .map(ProductDocument::from)
                    .toList();
            elasticsearchRepository.saveAll(docs);
            log.info("Jami {} ta mahsulot Elasticsearch ga muvaffaqiyatli indekslandi", docs.size());
            return docs.size();
        } catch (Exception e) {
            log.error("Elasticsearch to'liq qayta indekslashda xatolik: {}", e.getMessage());
            return 0;
        }
    }

    /**
     * Elasticsearch orqali ko'p qirrali (multifaceted) qidiruv va filtrlar
     * @return Topilgan sahifa yoki Elasticsearch ulanmagan bo'lsa null (PostgreSQL ga fallback uchun)
     */
    public Page<ProductResponse> searchProducts(
            Long categoryId,
            String search,
            Double minPrice,
            Double maxPrice,
            Boolean inStock,
            Pageable pageable
    ) {
        try {
            Criteria criteria = new Criteria();
            boolean hasCriteria = false;

            if (search != null && !search.trim().isEmpty()) {
                String cleanSearch = search.trim();
                Criteria searchCriteria = new Criteria("title").contains(cleanSearch)
                        .or(new Criteria("content").contains(cleanSearch))
                        .or(new Criteria("categoryName").contains(cleanSearch));
                criteria = criteria.subCriteria(searchCriteria);
                hasCriteria = true;
            }

            if (categoryId != null) {
                criteria = hasCriteria ? criteria.and(new Criteria("categoryId").is(categoryId)) : new Criteria("categoryId").is(categoryId);
                hasCriteria = true;
            }

            if (minPrice != null) {
                criteria = hasCriteria ? criteria.and(new Criteria("price").greaterThanEqual(minPrice)) : new Criteria("price").greaterThanEqual(minPrice);
                hasCriteria = true;
            }

            if (maxPrice != null) {
                criteria = hasCriteria ? criteria.and(new Criteria("price").lessThanEqual(maxPrice)) : new Criteria("price").lessThanEqual(maxPrice);
                hasCriteria = true;
            }

            if (Boolean.TRUE.equals(inStock)) {
                criteria = hasCriteria ? criteria.and(new Criteria("stock").greaterThan(0)) : new Criteria("stock").greaterThan(0);
                hasCriteria = true;
            }

            CriteriaQuery query = hasCriteria ? new CriteriaQuery(criteria) : new CriteriaQuery(new Criteria());
            query.setPageable(pageable);

            SearchHits<ProductDocument> searchHits = elasticsearchOperations.search(query, ProductDocument.class);

            List<ProductResponse> content = searchHits.getSearchHits().stream()
                    .map(SearchHit::getContent)
                    .map(ProductDocument::toProductResponse)
                    .toList();

            log.info("Elasticsearch qidiruv natijasi: {} ta mahsulot topildi (Jami: {})", content.size(), searchHits.getTotalHits());
            return new PageImpl<>(content, pageable, searchHits.getTotalHits());
        } catch (Exception e) {
            log.warn("Elasticsearch qidiruvida xatolik yoki Elasticsearch xizmati ishlamayapti: {}. PostgreSQL fallback qo'llaniladi.", e.getMessage());
            return null; // Controller/Service da PostgreSQL ga fallback bo'ladi
        }
    }
}
