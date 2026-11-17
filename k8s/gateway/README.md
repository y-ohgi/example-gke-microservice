# k8s/gateway

Gateway APIによる外部公開の参考実装。SPEC.md「2.3 外部公開」のとおり、ファーストステップでは実トラフィックはIngress(`k8s/ingress/`)経由とし、ここにあるのはGateway・HTTPRouteのみ。

## Deployment・Serviceの扱い

`k8s/ingress/`と`k8s/gateway/`はDeployment・Serviceを共有する(SPEC.md 6章)。重複を避けるため、このディレクトリにはDeployment・Serviceを置かない。適用する場合は `k8s/ingress/` のDeployment・Service一式(Ingressリソース自体は除く)を先に適用してから、ここのGateway・HTTPRouteを適用する。

## 適用(参考実装としての構文検証)

```
kubectl apply -f k8s/ingress/namespace.yaml
kubectl apply -f k8s/ingress/catalog-service.yaml -f k8s/ingress/order-service.yaml -f k8s/ingress/bff.yaml -f k8s/ingress/frontend.yaml
kubectl apply -f k8s/gateway/
```

## 検証内容・未検証のこと

- Gateway API CRD(`gateway-api v1.3.0` 標準インストール)をローカルの使い捨てKubernetesクラスタ(kind)に導入し、`Gateway`・`HTTPRoute`が実際にapplyできることを確認済み。`HTTPRoute`のルール(`/api` → bff:3000、`/` → frontend:80)も意図どおりに登録されることを確認した。
- `gatewayClassName: gke-l7-global-external-managed` はGKEが提供するGatewayClassで、kind環境には存在しないため `PROGRAMMED: Unknown` のままになる。これは想定内の挙動。
- 実際のGKE Autopilotクラスタ上での動作確認、および実トラフィックのGateway API側への切替えは行っていない(SPEC.mdのロードマップにある将来ステップであり、本milestoneのdone criteriaにも含まれない)。
