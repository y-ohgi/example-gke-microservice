# SPEC: GKE マイクロサービス サンプルアプリケーション

## 1. 概要・目的

GKE(Google Kubernetes Engine)上でマイクロサービス構成のアプリケーションを動かすサンプルリポジトリ。
フロントエンド・BFF・複数バックエンドという典型的な構成を、全てKubernetesのDeploymentとして稼働させることで、マイクロサービス間の責務分割・通信・Kubernetesマニフェストの書き方を学習・検証できる題材を提供する。

題材は簡易ECサイトとする。認証・ユーザー管理・決済は扱わない。

本ドキュメントはファーストステップの仕様を確定するものであり、確定後にコード・マニフェストの実装に着手する。

## 2. アーキテクチャ

### 2.1 コンポーネント構成(4 Deployment)

| コンポーネント | 役割 | 技術 | 公開範囲 |
|---|---|---|---|
| frontend | React SPA の配信 | Vite + TypeScript + React、nginxで配信 | 外部公開 |
| bff | フロントエンド向けAPI集約 | Next.js(App Router, Route Handlers)+ TypeScript | 外部公開 |
| catalog-service | 商品情報の提供 | Spring Boot 3 + Gradle(Kotlin DSL)+ Java 21 | クラスタ内部のみ |
| order-service | 注文の作成・参照 | Spring Boot 3 + Gradle(Kotlin DSL)+ Java 21 | クラスタ内部のみ |

### 2.2 通信経路

```
利用者
  │ HTTPS
  ▼
Ingress (/ → frontend, /api → bff)
  │
  ├─ frontend (nginx, React SPA)
  │     │ ブラウザから fetch
  │     ▼
  └─ bff (Next.js Route Handlers)
        │ REST/JSON (ClusterIP Service名で解決)
        ├──▶ catalog-service
        └──▶ order-service
                  │ REST/JSON
                  └──▶ catalog-service (注文作成時に商品情報を参照)
```

- 全経路の通信プロトコルは REST/JSON に統一する。
- クラスタ内部の名前解決は Kubernetes Service名を用いる(例: `http://catalog-service.ec-app.svc.cluster.local`)。
- catalog-service と order-service はクラスタ内部(ClusterIP)のみに公開し、外部から直接到達させない。

### 2.3 外部公開

- ファーストステップでは **GKE Ingress** を用いたパスベースルーティングで外部公開する。
  - `/` → frontend
  - `/api/*` → bff
- 将来的な **Gateway API** への本番切替えに備え、Gateway API版のマニフェスト(Gateway, HTTPRoute)も同梱する。ファーストステップでは参考実装として用意するのみで、実トラフィックはIngress経由とする。

## 3. 機能仕様(MVP)

カート機能は持たず、単品の即時注文のみを扱う。画面は3つ。

1. **商品一覧画面**
   - catalog-serviceが保持する商品の一覧を表示する(商品名・価格・在庫状況など)。
2. **注文作成**
   - 一覧から商品を1つ選び、数量を指定して注文を作成する。
   - order-serviceは注文作成時にcatalog-serviceへ商品情報(価格・存在確認)を問い合わせる。
3. **注文履歴画面**
   - これまでに作成した注文の一覧(商品名・数量・金額・注文日時)を表示する。

認証・ユーザー管理・決済・在庫の実減算処理はスコープ外とする。

## 4. API設計

### 4.1 bff(frontendから呼び出す公開API)

| Method | Path | 説明 |
|---|---|---|
| GET | `/api/products` | 商品一覧を取得(catalog-serviceへ中継) |
| GET | `/api/products/{id}` | 商品詳細を取得 |
| POST | `/api/orders` | 注文を作成(order-serviceへ中継) |
| GET | `/api/orders` | 注文履歴を取得 |

### 4.2 catalog-service(クラスタ内部API)

| Method | Path | 説明 |
|---|---|---|
| GET | `/products` | 商品一覧 |
| GET | `/products/{id}` | 商品詳細 |

### 4.3 order-service(クラスタ内部API)

| Method | Path | 説明 |
|---|---|---|
| POST | `/orders` | 注文作成(内部でcatalog-serviceの `/products/{id}` を呼び出す) |
| GET | `/orders` | 注文一覧 |

具体的なリクエスト/レスポンスのスキーマは実装時に定める。

## 5. 技術スタック

### 5.1 フロントエンド

- **frontend**: React + TypeScript、ビルドツールは Vite。ビルド成果物を nginxで配信する。
- **bff**: Next.js(App Router)+ TypeScript。Route Handlers で API のみを提供し、画面レンダリングは行わない。

### 5.2 バックエンド

- Spring Boot 3系、Gradle(Kotlin DSL)、Java 21(LTS)。
- 正確な Spring Boot / Gradle のバージョンは実装時に公式ドキュメントで確認し固定する。

### 5.3 データストア

- 設計としては Cloud SQL(PostgreSQL)への移行を前提とするが、**MVPでは未使用**。
- 各サービスはインメモリの Repository 実装を持ち、起動時にシードデータを投入する。
- Repository 層をインターフェースとして切り出し、将来 PostgreSQL 実装へ差し替え可能な構造にする。

### 5.4 マニフェスト管理

- 素の YAML で管理する(Kustomize・Helm は使用しない)。
- Ingress版とGateway API版のマニフェストをディレクトリで分けて並置する。

### 5.5 Google Cloud リソース構築

- Terraform 等の IaC は用いず、**gcloud コマンドによる手順**を README もしくは docs に記載する。
- 対象: GKE Autopilot クラスタ、Artifact Registry(Docker形式)。

### 5.6 ビルド・デプロイ

- CI/CD は構築せず、手動で以下を行う。
  1. `docker build` で各サービスのイメージをビルド
  2. Artifact Registry へ push
  3. `kubectl apply` でマニフェストを適用

### 5.7 ローカル開発環境

- docker composeで4サービス(frontend, bff, catalog-service, order-service)を一括起動できるようにする。
- GKEへのデプロイ前の結合確認、および Dockerfile の動作検証に用いる。

## 6. リポジトリ構成(案)

```
.
├── SPEC.md
├── README.md
├── compose.yaml
├── apps/
│   ├── frontend/          # React SPA (Vite + TypeScript)
│   ├── bff/                # Next.js (App Router)
│   ├── catalog-service/    # Spring Boot
│   └── order-service/      # Spring Boot
├── k8s/
│   ├── ingress/            # Deployment, Service, Ingress 一式
│   └── gateway/            # Deployment, Service, Gateway, HTTPRoute 一式
└── docs/
    └── gcp-setup.md         # gcloud によるGKE/Artifact Registry構築手順
```

Deployment・Service はIngress版・Gateway API版で共通のため、`k8s/` 配下での重複の扱い(共通化するか両方に書くか)は実装時に確認して決定する。

## 7. インフラ構成

- Google Cloud プロジェクト上に GKE **Autopilot** クラスタを構築する。
- リージョンは `asia-northeast1`(東京)を前提とする(未確認の前提。実装時に変更可)。
- イメージは Artifact Registry(Docker形式)に格納する。
- Kubernetes の namespace は専用のもの(例: `ec-app`)を切って運用する(未確認の前提)。
- 各Deploymentには liveness/readiness probe、resources(requests/limits)を定義する方針とする。

## 8. ファーストステップの完了条件(Done Criteria)

- [ ] 4つのDeployment(frontend, bff, catalog-service, order-service)がGKE Autopilot クラスタ上で起動する。
- [ ] Ingress経由でブラウザから商品一覧・注文作成・注文履歴の3画面が操作できる。
- [ ] order-serviceがcatalog-serviceへ商品参照のためのサービス間通信を行い、注文作成が成立する。
- [ ] docker composeでローカルに4サービスを一括起動し、同等の操作確認ができる。
- [ ] Gateway API版のマニフェスト(Gateway, HTTPRoute)が存在し、`kubectl apply --dry-run` 相当の検証が通る(実トラフィックの切替えは対象外)。

## 9. 将来ステップのロードマップ

本ドキュメントで決定するのはファーストステップのみ。以下は将来的な拡張の方向性であり、今回のスコープには含めない。

1. **データストアの永続化**: インメモリRepositoryからCloud SQL(PostgreSQL)実装への移行。マイグレーション管理(Flyway等)の導入。
2. **CI/CDの導入**: GitHub Actions等によるイメージビルド・push・デプロイの自動化。Workload Identity連携。
3. **Gateway APIへの本番切替え**: Ingressからの実トラフィック切替え。切替え完了後のIngressマニフェスト廃止判断。
4. **IaC化**: GKEクラスタ・Artifact RegistryのTerraform管理への移行。
5. **カート機能・認証・決済の追加**: スコープ拡大時の機能追加候補。
6. **Observability強化**: ログ・メトリクス・トレーシングの整備。
