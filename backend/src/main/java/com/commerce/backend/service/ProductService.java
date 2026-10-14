package com.commerce.backend.service;

import com.commerce.backend.dto.ProductDto.ProductRequest;
import com.commerce.backend.dto.ProductDto.ProductResponse;
import com.commerce.backend.entity.ProductCategoryEntity;
import com.commerce.backend.entity.ProductEntity;
import com.commerce.backend.exception.CustomNotFoundException;
import com.commerce.backend.repository.ProductCategoryRepository;
import com.commerce.backend.repository.ProductRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductCategoryRepository productCategoryRepository;
    private final com.commerce.backend.elasticsearch.service.ProductSearchService productSearchService;

    public ProductService(
            ProductRepository productRepository,
            ProductCategoryRepository productCategoryRepository,
            @org.springframework.beans.factory.annotation.Autowired(required = false)
            com.commerce.backend.elasticsearch.service.ProductSearchService productSearchService
    ) {
        this.productRepository = productRepository;
        this.productCategoryRepository = productCategoryRepository;
        this.productSearchService = productSearchService;
    }

    @Transactional(readOnly = true)
    public Page<ProductResponse> getAllProducts(
            Long categoryId,
            String search,
            Double minPrice,
            Double maxPrice,
            Boolean inStock,
            Pageable pageable
    ) {
        String cleanSearch = (search != null && !search.trim().isEmpty()) ? search.trim() : null;

        // 1. Elasticsearch orqali qidiruv (mavjud bo'lsa)
        if (productSearchService != null) {
            Page<ProductResponse> esResult = productSearchService.searchProducts(
                    categoryId, cleanSearch, minPrice, maxPrice, inStock, pageable
            );
            if (esResult != null) {
                return esResult;
            }
        }

        // 2. Elasticsearch ishlamagan holda PostgreSQL ga avtomatik fallback
        log.info("PostgreSQL findWithFilters orqali qidirilmoqda (Elasticsearch fallback)");
        Page<ProductEntity> products = productRepository.findWithFilters(
                categoryId,
                cleanSearch,
                minPrice,
                maxPrice,
                inStock,
                pageable
        );
        return products.map(ProductResponse::from);
    }

    @Transactional(readOnly = true)
    public Page<ProductResponse> getAllProducts(
            Long categoryId,
            String search,
            Double minPrice,
            Double maxPrice,
            Pageable pageable
    ) {
        return getAllProducts(categoryId, search, minPrice, maxPrice, false, pageable);
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        ProductEntity product = productRepository.findById(id)
                .orElseThrow(() -> new CustomNotFoundException("Mahsulot topilmadi (ID: " + id + ")"));
        return ProductResponse.from(product);
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        ProductCategoryEntity category = null;
        if (request.getCategoryId() != null) {
            category = productCategoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new CustomNotFoundException("Kategoriya topilmadi (ID: " + request.getCategoryId() + ")"));
        }

        ProductEntity product = ProductEntity.builder()
                .title(request.getTitle().trim())
                .content(request.getContent().trim())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .stock(request.getStock() != null ? request.getStock() : 15)
                .rating(4.8)
                .category(category)
                .build();

        ProductEntity saved = productRepository.save(product);
        if (productSearchService != null) {
            productSearchService.indexProduct(saved);
        }
        log.info("Yangi mahsulot yaratildi va indekslandi: ID={}, Title='{}'", saved.getId(), saved.getTitle());
        return ProductResponse.from(saved);
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        ProductEntity product = productRepository.findById(id)
                .orElseThrow(() -> new CustomNotFoundException("Mahsulot topilmadi (ID: " + id + ")"));

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            product.setTitle(request.getTitle().trim());
        }
        if (request.getContent() != null && !request.getContent().isBlank()) {
            product.setContent(request.getContent().trim());
        }
        if (request.getPrice() != null) {
            product.setPrice(request.getPrice());
        }
        if (request.getImageUrl() != null) {
            product.setImageUrl(request.getImageUrl());
        }
        if (request.getStock() != null) {
            product.setStock(request.getStock());
        }
        if (request.getCategoryId() != null) {
            ProductCategoryEntity category = productCategoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new CustomNotFoundException("Kategoriya topilmadi (ID: " + request.getCategoryId() + ")"));
            product.setCategory(category);
        }

        ProductEntity updated = productRepository.save(product);
        if (productSearchService != null) {
            productSearchService.indexProduct(updated);
        }
        log.info("Mahsulot yangilandi va qayta indekslandi: ID={}", updated.getId());
        return ProductResponse.from(updated);
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new CustomNotFoundException("Mahsulot topilmadi (ID: " + id + ")");
        }
        productRepository.deleteById(id);
        if (productSearchService != null) {
            productSearchService.deleteProductIndex(id);
        }
        log.info("Mahsulot o'chirildi (ID: {})", id);
    }

    @Transactional(readOnly = true)
    public int reindexAll() {
        if (productSearchService == null) {
            log.warn("Elasticsearch xizmati faol emas, qayta indekslash o'tkazib yuborildi");
            return 0;
        }
        List<ProductEntity> allProducts = productRepository.findAll();
        log.info("Barcha mahsulotlarni Elasticsearch ga indekslash boshlandi (Jami: {})", allProducts.size());
        return productSearchService.reindexAll(allProducts);
    }

    @PostConstruct
    public void seedInitialData() {
        try {
            if (productCategoryRepository.count() == 0) {
                log.info("Boshlang'ich kategoriyalar kiritilmoqda...");
                ProductCategoryEntity electronics = productCategoryRepository.save(ProductCategoryEntity.builder()
                        .name("Elektronika")
                        .description("Eng so'nggi gadjetlar, noutbuklar va smartfonlar")
                        .build());

                ProductCategoryEntity clothing = productCategoryRepository.save(ProductCategoryEntity.builder()
                        .name("Kiyim-kechak")
                        .description("Zamonaviy va qulay uslubdagi kiyimlar")
                        .build());

                ProductCategoryEntity accessories = productCategoryRepository.save(ProductCategoryEntity.builder()
                        .name("Aksessuarlar")
                        .description("Sifatli soatlar, ko'zoynaklar va sumkalar")
                        .build());

                ProductCategoryEntity home = productCategoryRepository.save(ProductCategoryEntity.builder()
                        .name("Uy uchun jihozlar")
                        .description("Shinam xonadon va oshxona uchun kerakli buyumlar")
                        .build());

                ProductCategoryEntity sports = productCategoryRepository.save(ProductCategoryEntity.builder()
                        .name("Sport va Salomatlik")
                        .description("Faol turmush tarzi va mashg'ulotlar uchun anjomlar")
                        .build());

                if (productRepository.count() == 0) {
                    log.info("Boshlang'ich mahsulotlar kiritilmoqda...");
                    List<ProductEntity> demoProducts = List.of(
                            ProductEntity.builder()
                                    .title("Apple MacBook Pro 16\" M3 Max")
                                    .content("Apple M3 Max protsessor, 36GB birlashgan xotira, 1TB SSD xotira, Liquid Retina XDR displey. Yuqori unumdorlik va mukammal batareya muddati.")
                                    .price(2899.99)
                                    .imageUrl("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80")
                                    .stock(12)
                                    .rating(4.9)
                                    .category(electronics)
                                    .build(),
                            ProductEntity.builder()
                                    .title("Sony WH-1000XM5 Simsiz Quloqchin")
                                    .content("Sanoatda yetakchi faol shovqinni bekor qilish (ANC) texnologiyasi, 30 soatlik batareya va kristaldek toza ovoz uzatish.")
                                    .price(399.99)
                                    .imageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80")
                                    .stock(25)
                                    .rating(4.8)
                                    .category(electronics)
                                    .build(),
                            ProductEntity.builder()
                                    .title("Klassik Qora Teri Kurtka")
                                    .content("100% tabiiy teridan tayyorlangan zamonaviy qora kurtka. Shamol va sovuqdan ishonchli himoya.")
                                    .price(189.50)
                                    .imageUrl("https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=80")
                                    .stock(18)
                                    .rating(4.7)
                                    .category(clothing)
                                    .build(),
                            ProductEntity.builder()
                                    .title("Erkaklar Premium Paxta Xudi")
                                    .content("Yuqori zichlikdagi paxtadan tikilgan, issiq va qulay oversize uslubdagi premium xudi.")
                                    .price(65.00)
                                    .imageUrl("https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80")
                                    .stock(40)
                                    .rating(4.6)
                                    .category(clothing)
                                    .build(),
                            ProductEntity.builder()
                                    .title("Mexanik Shveytsariya Qo'l Soati")
                                    .content("Safir oyna, suvga chidamlilik 100m, zanglamaydigan po'lat korpus va avtomatik zavod mexanizmi.")
                                    .price(649.00)
                                    .imageUrl("https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80")
                                    .stock(8)
                                    .rating(4.9)
                                    .category(accessories)
                                    .build(),
                            ProductEntity.builder()
                                    .title("Klassik Polarizatsiyalangan Quyosh Ko'zoynagi")
                                    .content("UV400 ultrabinafsha nurlaridan 100% himoya, engil metall karkas va zamonaviy ergonomik dizayn.")
                                    .price(85.00)
                                    .imageUrl("https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1000&q=80")
                                    .stock(30)
                                    .rating(4.5)
                                    .category(accessories)
                                    .build(),
                            ProductEntity.builder()
                                    .title("Minimalist Smart Stol Chirog'i")
                                    .content("Sensorsensorli boshqaruv, yorqinlik va rang haroratini sozlash imkoniyati, simsiz quvvatlagich paneli.")
                                    .price(49.99)
                                    .imageUrl("https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80")
                                    .stock(22)
                                    .rating(4.8)
                                    .category(home)
                                    .build(),
                            ProductEntity.builder()
                                    .title("Proffesional Fitnes Smart Soati")
                                    .content("Puls, kislorod darajasi, uyqu sifati va 50+ sport rejimlarini aniq o'lchovchi suv o'tkazmaydigan smart bilaguzuk.")
                                    .price(129.90)
                                    .imageUrl("https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=1000&q=80")
                                    .stock(35)
                                    .rating(4.7)
                                    .category(sports)
                                    .build()
                    );
                    productRepository.saveAll(demoProducts);
                    if (productSearchService != null) {
                        productSearchService.reindexAll(demoProducts);
                    }
                    log.info("Boshlang'ich mahsulotlar muvaffaqiyatli saqlandi va indekslandi!");
                }
            }
        } catch (Exception e) {
            log.warn("Boshlang'ich ma'lumotlarni kiritishda xatolik (ehtimol allaqachon mavjud yoki test konteksti): {}", e.getMessage());
        }
    }
}
