FROM node:22-slim AS build
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
# Next.jsのstandaloneサーバーはHOSTNAME環境変数をbindアドレスとして使う。
# Docker/KubernetesはHOSTNAMEをコンテナ/Pod名に自動設定するため、
# 明示的に0.0.0.0を指定しないと外部から到達できないアドレスにbindしてしまう。
ENV HOSTNAME=0.0.0.0
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
