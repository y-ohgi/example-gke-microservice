package com.example.orderservice.order;

/**
 * 注文作成リクエスト。
 *
 * @param productId 注文する商品のID
 * @param quantity  数量(1以上)
 */
public record CreateOrderRequest(Long productId, Integer quantity) {
}
