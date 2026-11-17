package com.example.orderservice.catalog;

/**
 * catalog-service への問い合わせが失敗した(商品が見つからない場合を除く)ことを表す。
 * タイムアウト・接続不可・5xxなど、呼び出し元が制御できない失敗はこの例外として扱う。
 */
public class CatalogServiceUnavailableException extends RuntimeException {

	public CatalogServiceUnavailableException(Throwable cause) {
		super("catalog-service is unavailable", cause);
	}
}
