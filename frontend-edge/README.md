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
http://localhost:5173/

#### local
- Node 18+
- pnpm 7+
```sh
pnpm install 
pnpm dev
```   

http://localhost:5173/

### 主な利用ライブラリ
- [Vite](https://ja.vitejs.dev/) + react-ts
- [React Router](https://reactrouter.com/)
- [React Query](https://react-query.tanstack.com/)
- [Chakra](https://chakra-ui.com/)
- [vitest](https://vitest.dev/)
- [Storybook](https://storybook.js.org/)
- [React Hook Form](https://github.com/react-hook-form/react-hook-form)
- [zustand](https://github.com/pmndrs/zustand)

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

- `features/misc` はNotFoundなど独立したroutesを置く場所とする。
- 機能になるものは `src/features/awesome-feature` として新しくディレクトリを作ってそこに良しなに切り分けたファイルを配置する。 [参考](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md#%EF%B8%8F-project-structure)
- 共通コンポーネントは `src/components` にディレクトリを作って配置する

### Storybook
http://localhost:6006/

```sh
pnpm storybook 
```

※ Node 18 環境で起動しない不具合があるため、 環境変数 `NODE_OPTIONS=--openssl-legacy-provider` で回避しています。
direnv用の `.envrc` に設定済み
※ `NODE_OPTIONS` を設定したままだと、 vitestが実行できないので、 `unser NODE_OPTIONS && pnpm test` のようにtest実行時は環境変数をunsetしてください
