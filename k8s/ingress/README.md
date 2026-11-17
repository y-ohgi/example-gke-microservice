# k8s/ingress

GKE Autopilotクラスタへの適用を想定したIngress版manifest一式。

## 適用前に

各Deploymentの `image:` にある `asia-northeast1-docker.pkg.dev/PROJECT_ID/example-gke-microservice/<service>:latest` の `PROJECT_ID` を、実際のGoogle CloudプロジェクトIDに置き換える(`docs/gcp-setup.md` 相当の手順を参照)。

## 適用

`namespace.yaml` を他のリソースより先に適用する。同時に適用すると、namespace作成が完了する前に他のリソースの作成リクエストが先に処理され、エラーになることがある。

```
kubectl apply -f k8s/ingress/namespace.yaml
kubectl apply -f k8s/ingress/
```

## 検証内容・未検証のこと

- ローカルの使い捨てKubernetesクラスタ(kind)に実際にapplyし、Deployment・Service・Ingressが構文的に正しく、Service selectorとPodラベルが一致することを確認済み(イメージは実在しないプレースホルダーのためPod自体は起動しない)。
- 実際のGKE Autopilotクラスタ上でのIngress経由の動作確認は行っていない(GCPの認証情報・課金を伴うため、この作業では対象外)。実クラスタでの検証はユーザー自身のGCP環境で行うこと。
