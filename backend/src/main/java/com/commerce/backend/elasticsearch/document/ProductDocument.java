package com.commerce.backend.elasticsearch.document;

import com.commerce.backend.dto.ProductDto;
import com.commerce.backend.entity.ProductEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(indexName = "products")
public class ProductDocument {

    @Id
    private Long id;

    @Field(type = FieldType.Text, analyzer = "standard")
    private String title;

    @Field(type = FieldType.Text, analyzer = "standard")
    private String content;

    @Field(type = FieldType.Double)
    private Double price;

    @Field(type = FieldType.Keyword)
    private String imageUrl;

    @Field(type = FieldType.Integer)
    private Integer stock;

    @Field(type = FieldType.Double)
    private Double rating;

    @Field(type = FieldType.Long)
    private Long categoryId;

    @Field(type = FieldType.Text, analyzer = "standard")
    private String categoryName;

    @Field(type = FieldType.Date, format = DateFormat.date_hour_minute_second_millis)
    private LocalDateTime createdAt;

    public static ProductDocument from(ProductEntity entity) {
        if (entity == null) return null;
        return ProductDocument.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .content(entity.getContent())
                .price(entity.getPrice())
                .imageUrl(entity.getImageUrl())
                .stock(entity.getStock())
                .rating(entity.getRating())
                .categoryId(entity.getCategory() != null ? entity.getCategory().getId() : null)
                .categoryName(entity.getCategory() != null ? entity.getCategory().getName() : null)
                .createdAt(entity.getCreatedAt() != null ? entity.getCreatedAt() : LocalDateTime.now())
                .build();
    }

    public ProductDto.ProductResponse toProductResponse() {
        return new ProductDto.ProductResponse(
                this.id,
                this.title,
                this.content,
                this.price != null ? this.price : 0.0,
                this.imageUrl,
                this.stock != null ? this.stock : 0,
                this.rating != null ? this.rating : 5.0,
                this.categoryId,
                this.categoryName,
                this.createdAt,
                this.createdAt
        );
    }
}
