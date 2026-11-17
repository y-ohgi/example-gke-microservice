package com.example.orderservice.order;

/**
 * 注文対象の商品が catalog-service に存在しなかったことを表す。
 */
public class ProductNotFoundException extends RuntimeException {

	public ProductNotFoundException(Long productId) {
		super("product not found: " + productId);
	}
}
