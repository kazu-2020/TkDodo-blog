# aw-editorialhands

https://dev-eh.nr.nhk.jp/

## フロントエンド

Nuxt.js で構成されたアプリケーション。
AWS Amplify を用いて配信しています。

[README](https://github.com/d7lab/aw-editorialhands-ui/blob/master/frontend/README.md)

## バックエンド

Jets(like Rails) で構成されたアプリケーション。
AWS Lambda, API Gateway 等のサーバーレスで配信しています。

[README](https://github.com/d7lab/aw-editorialhands-ui/blob/master/backend/README.md)

## E2E テスト

Cypress.io による E2E テスト

[README](https://github.com/d7lab/aw-editorialhands-ui/blob/master/e2e/README.md)

## oEmbed
### API
https://dev-api-eh.nr.nhk.jp/oembed?url={NOLのURL}

### embed page
https://dev-api-eh.nr.nhk.jp/embed/te/{episode_id}/{type}/{type_id}

## 既知の不具合

### deploy後、APIが叩けなくなる
routingに影響のある変更（※1）をした際に、API Gatewayが同名で新たに追加される場合がある。
![image](https://user-images.githubusercontent.com/933867/115648016-c4912800-a35f-11eb-95f3-71220ffe5921.png)

この状態になると、空っぽになった古い方にカスタムドメインの設定やWAFの割当が残ったままになってしまい。APIが叩けなくなってしまう。

_※1: routes.rbの変更、controllerの追加、移動やリネームなどの変更、削除など_

### 暫定の解決方法
AWSコンソールから手動でWAFとカスタムドメインを割り当て直すようにしてAPIを叩けるように修正する方法を記載します。

1. API Gatewayのカスタムドメインのマッピングを新しく追加された方に設定し直す
![image](https://user-images.githubusercontent.com/933867/115648042-cc50cc80-a35f-11eb-92a2-4c0d85392550.png)

1. 同名（aw-editorialhands-prod）の古いAPI Gatewayを削除する
1. WAFのACL（tomigaya-developer-acl-an1）をAPI Gatewayに再設定する
![image](https://user-images.githubusercontent.com/933867/115648059-d07cea00-a35f-11eb-8e1b-bfbc35bba108.png)

