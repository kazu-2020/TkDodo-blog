# aw-editorialhands

https://dev-eh.nr.nhk.jp/

## フロントエンド

Nuxt.js で構成されたアプリケーション。
AWS Amplify を用いて配信しています。

[README](https://github.com/d7lab/aw-editorialhands-ui/blob/develop/frontend/README.md)

## バックエンド

Rails で構成されたアプリケーション。
AWS 上では ECS を用いて運用しています。

[README](https://github.com/d7lab/aw-editorialhands-ui/blob/develop/api-eh/README.md)

## E2E テスト

Cypress.io による E2E テスト

[README](https://github.com/d7lab/aw-editorialhands-ui/blob/develop/e2e/README.md)

## oEmbed

### API

https://dev-api-eh.nr.nhk.jp/oembed?url={NOLのURL}

### embed page

https://dev-api-eh.nr.nhk.jp/embed/te/{episode_id}/{type}/{type_id}
