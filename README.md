# example-gke-microservice

GKE上でマイクロサービス構成のアプリケーションを動かすサンプルリポジトリ。仕様は [SPEC.md](./SPEC.md) を参照。

## ローカル開発

```
docker compose up --build
```

アプリ全体を使うときは、必ず http://localhost:8000 を開く。`gateway` サービスがSPEC.mdのIngress相当のパスルーティング(`/` → frontend, `/api/*` → bff)をローカルで再現しており、画面からのAPI呼び出し(`/api/*`)はここを経由して初めて成立する。

各サービス自身のAPIを個別に確認したいとき(デバッグ用)は、以下のポートに直接アクセスできる。ただし `frontend`(8082)は静的ファイルを配信するだけで `/api` を中継しないため、`http://localhost:8082` を直接開いても画面はAPI呼び出しに失敗する。画面の動作確認は常に8000を使うこと。

| サービス | ポート | 用途 |
|---|---|---|
| catalog-service | 8080 | `GET /products` などを直接確認 |
| order-service | 8081 | `GET /orders` などを直接確認 |
| bff | 3000 | `GET /api/products` などを直接確認 |
| frontend | 8082 | 静的ファイルの配信のみ確認(API呼び出しは失敗する) |
