# aw-editorialhands
## 概要

| 環境 | URL | ブランチ |
| -------- | -------- | -------- |
| tomigaya-dev     | https://dev-eh.nr.nhk.jp/   | develop     |
| tomigaya-stg     | https://stg-eh.nr.nhk.jp/   | staging     |
| tomigaya-prd     | https://eh.nr.nhk.jp/   | master     |

### ブランチ
各ブランチへのマージをトリガーにCodePipelineでデプロイ処理が実行されます。
stg環境へのリリースは、git-pr-releaseを実行するための [action](https://github.com/d7lab/aw-editorialhands/actions/workflows/stg-release.yml) を用意しています。 

### 旧フロントエンド （削除予定）

Nuxt2で構成されたシングルページアプリケーション

[README](https://github.com/d7lab/aw-editorialhands/blob/develop/frontend/README.md)

### フロントエンド

Reactで構成されたシングルページアプリケーション

[README](https://github.com/d7lab/aw-editorialhands/blob/develop/frontend-edge/README.md)

### バックエンド

Rails で構成されたアプリケーション。
AWS 上では ECS を用いて運用しています。

[README](https://github.com/d7lab/aw-editorialhands-ui/blob/develop/api-eh/README.md)

### E2E テスト

Cypress.io による E2E テスト

[README](https://github.com/d7lab/aw-editorialhands-ui/blob/develop/e2e/README.md)

### oEmbed

#### API

https://dev-api-eh.nr.nhk.jp/oembed?url={NOLのURL}

#### embed page

https://dev-api-eh.nr.nhk.jp/embed/te/{episode_id}/{type}/{type_id}
