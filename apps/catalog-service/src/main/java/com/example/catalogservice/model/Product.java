package com.example.catalogservice.model;

/**
 * 商品情報。
 *
 * @param id    商品ID
 * @param name  商品名
 * @param price 価格(円、税込)
 * @param stock 在庫数
 */
public record Product(Long id, String name, long price, int stock) {
}
