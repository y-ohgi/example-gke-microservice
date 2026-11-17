package com.example.orderservice.catalog;

/**
 * catalog-service の GET /products/{id} レスポンスに対応する読み取り専用ビュー。
 *
 * @param id    商品ID
 * @param name  商品名
 * @param price 価格(円、税込)
 * @param stock 在庫数
 */
public record ProductView(Long id, String name, long price, int stock) {
}
