# GCPセットアップ手順

SPEC.mdのファーストステップでは、IaCを使わず、gcloudコマンドによる手動構築を前提とする。この手順はGKE Autopilotクラスタ・Artifact Registryリポジトリの作成から、イメージのビルド・push、k8s Ingress版manifestの適用までをカバーする。

## 前提

- `gcloud` CLIがインストール済みであること。
- `gcloud auth login` で認証済みであること。
- 課金が有効なGoogle Cloudプロジェクトが存在すること(Autopilotクラスタ・Artifact Registryはいずれも課金対象)。
- 以降の手順では、プロジェクトIDを `PROJECT_ID` として表記する。実行時は自分のプロジェクトIDに置き換える。

## 1. プロジェクト・リージョンの設定

SPEC.mdの前提どおり、リージョンは `asia-northeast1`(東京)を使う。

```
gcloud config set project PROJECT_ID
gcloud config set compute/region asia-northeast1
```

## 2. 必要なAPIの有効化

```
gcloud services enable container.googleapis.com artifactregistry.googleapis.com
```

## 3. Artifact Registryリポジトリの作成

```
gcloud artifacts repositories create example-gke-microservice \
  --repository-format=docker \
  --location=asia-northeast1 \
  --description="example-gke-microservice container images"
```

## 4. Dockerの認証設定

ローカルからArtifact Registryへ `docker push` できるよう、認証を設定する。

```
gcloud auth configure-docker asia-northeast1-docker.pkg.dev
```

## 5. GKE Autopilotクラスタの作成

```
gcloud container clusters create-auto example-gke-microservice \
  --region=asia-northeast1
```

数分かかる。完了後、kubectlの認証情報を取得する。

```
gcloud container clusters get-credentials example-gke-microservice \
  --region=asia-northeast1
```

## 6. イメージのビルド・push

4サービスそれぞれをビルドし、Artifact Registryへpushする。

```
for service in catalog-service order-service bff frontend; do
  docker build -t asia-northeast1-docker.pkg.dev/PROJECT_ID/example-gke-microservice/$service:latest \
    apps/$service
  docker push asia-northeast1-docker.pkg.dev/PROJECT_ID/example-gke-microservice/$service:latest
done
```

## 7. k8s manifestの適用

`k8s/ingress/*.yaml` 内の `PROJECT_ID` を実際のプロジェクトIDに置き換えてから適用する。namespaceは他のリソースより先に適用する(詳細は [k8s/ingress/README.md](../k8s/ingress/README.md) を参照)。

```
kubectl apply -f k8s/ingress/namespace.yaml
kubectl apply -f k8s/ingress/
```

## 8. 動作確認

IngressにExternal IPが割り当てられるまで数分かかる。

```
kubectl get ingress -n ec-app
```

`ADDRESS` 列にIPが表示されたら、そのIPへブラウザでアクセスし、商品一覧→注文作成→注文履歴の一連の操作を確認する。

## 9. 後片付け(課金停止)

クラスタを削除する前に、必ずIngressを削除する。GKEのIngress Controllerは、Ingressオブジェクトの削除をきっかけに外部ロードバランサ(転送ルール・バックエンドサービス・ヘルスチェック・ファイアウォールルールなど)を後片付けする。先にクラスタを削除するとこの後片付けが走らず、ロードバランサのリソースが残って課金が続く。

```
kubectl delete -f k8s/ingress/ingress.yaml
```

Ingressに紐づくリソースが消えたことを確認してから、クラスタを削除する。

```
gcloud container clusters delete example-gke-microservice --region=asia-northeast1
```

Artifact Registryリポジトリも不要であれば削除する。

```
gcloud artifacts repositories delete example-gke-microservice --location=asia-northeast1
```
