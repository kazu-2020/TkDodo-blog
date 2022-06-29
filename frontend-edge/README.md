# editorialhands frontend app

| 環境 | URL |
| -------- | -------- |
| tomigaya-dev     | https://dev-eh.nr.nhk.jp/     |
| tomigaya-stg     | https://stg-eh.nr.nhk.jp/     |
| tomigaya-prd     | https://eh.nr.nhk.jp/     |

## 概要
- EditorialHandsのfrontend用のSPAアプリです

### アプリの起動
#### docker-compose
```sh
docker compose run --rm frontend-edge pnpm install
docker compose run --rm --service-ports frontend-edge pnpm dev --host
```
http://localhost:3000/

#### local
- Node 18+
- pnpm 7+
```sh
pnpm install 
pnpm dev
```   

http://localhost:3000/

### 主な利用ライブラリ
- [Vite](https://ja.vitejs.dev/) + react-ts
- [React Router](https://reactrouter.com/)
- [React Query](https://react-query.tanstack.com/)
- [Chakra](https://chakra-ui.com/)
- [vitest](https://vitest.dev/)
- [Storybook](https://storybook.js.org/)

### ディレクトリ構成
アプリケーションのコードは `src` ディレクトリ下に格納します。

```sh
src
|
+-- assets            # 画像やフォントなどの静的ファイル
|
+-- components        # アプリケーション全体で利用するコンポーネント
|
+-- config            # 設定ファイルなど
|
+-- features          # 機能別のディレクトリ
|
+-- hooks             # アプリケーション全体で利用するhooks
|
+-- lib               # ライブラリの設定再エクスポート
|
+-- providers         # Providerの設定
|
+-- routes            # Routeの設定
|
+-- types             # TypeScriptの型定義ファイル
|
+-- utils             # アプリケーション全体で利用するユーティリティ関数など
```
