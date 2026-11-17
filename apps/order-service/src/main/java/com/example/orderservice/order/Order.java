package com.example.orderservice.order;

import java.time.Instant;

/**
 * 注文。注文作成時点の商品名・単価をスナップショットとして保持する
 * (後から商品側の価格が変わっても過去の注文内容は変化しない)。
 *
 * @param id          注文ID
 * @param productId   商品ID
 * @param productName 注文時点の商品名
 * @param quantity    数量
 * @param unitPrice   注文時点の単価(円、税込)
 * @param totalPrice  合計金額(円、税込) = unitPrice * quantity
 * @param createdAt   注文日時
 */
public record Order(
		Long id,
		Long productId,
		String productName,
		int quantity,
		long unitPrice,
		long totalPrice,
		Instant createdAt) {
}
