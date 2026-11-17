# example-gke-microservice

GKE上でマイクロサービス構成のアプリケーションを動かすサンプルリポジトリ。仕様は [SPEC.md](./SPEC.md) を参照。

## ローカル開発

```
docker compose up --build
```

起動後、ブラウザで http://localhost:8000 を開く。`gateway` サービスがSPEC.mdのIngress相当のパスルーティング(`/` → frontend, `/api/*` → bff)をローカルで再現している。

各サービスは個別のポートにも直接アクセスできる(デバッグ用):

| サービス | ポート |
|---|---|
| catalog-service | 8080 |
| order-service | 8081 |
| bff | 3000 |
| frontend | 8082 |
