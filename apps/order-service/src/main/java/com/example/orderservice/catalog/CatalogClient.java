package com.example.orderservice.catalog;

import java.util.Optional;

/**
 * catalog-service への問い合わせ口。order-service から catalog-service への
 * サービス間通信(REST/JSON)をこのインターフェース越しに行う。
 */
public interface CatalogClient {

	Optional<ProductView> findProduct(Long productId);
}
