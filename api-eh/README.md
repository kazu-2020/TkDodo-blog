# README

## ローカル環境のセットアップ

```
$ bundle exec bin/setup
```

## サーバーの起動

フロントエンドでポートが `8888` で使われているので、オプションが必要になります

```
$ bundle exec rails s -p 8888
```

## テストの実行

```
$ bundle exec rspec
```

## 定期 Job の登録方法

ECS タスクスケジューラーを用いて、ジョブを定期実行しています。

新たな Job を追加する場合には、terraform を編集し、apply をすることになります。

### Terraform へジョブを定義

https://github.com/d7lab/aw-editorialhands/blob/master/api-eh/infra/dev/terraform/environments/modules/cloudwatch_event_target.tf

EventBridge(旧 CloudWatchEvent)を通して、ECS タスクスケジューラーに登録します。
該当ファイルに、あるような記述をコピーし、 `aws_cloudwatch_event_rule` `aws_cloudwatch_event_target` のリソースを定義してください。

また、実際に実行するコマンドについては、

https://github.com/d7lab/aw-editorialhands/tree/master/api-eh/infra/dev/terraform/environments/modules/cloudwatch_event_targets

に json ファイルとして設置してください

### Terraform で反映

[Terrafrom README](https://github.com/d7lab/aw-editorialhands/blob/master/api-eh/infra/dev/terraform/README.md) を参照してください。

## Rubyのバージョンアップ
参考PR: https://github.com/d7lab/aw-editorialhands/pull/644

## エンドポイントについて
**/d6.6**
- TBD

**/oembed**
- [oEmbed](https://oembed.com/) に準拠したレスポンスを返します。
- example:  https://dev-api-eh.nr.nhk.jp/oembed?url=https://www.nhk.jp/p/ts/6X8L7Z8VK8/episode/te/JP8Z34KPLL/

**/embed**
- パスの情報から動的に構築したHTMLを返します。
- oEmbed APIではiframe内にこのコンテンツを設定したHTMLプロパティを返却します。
- example: https://dev-api-eh.nr.nhk.jp/embed/te/7MKRXXKMML/faqpage/20

**/ogp**
- プレイリスト新標準専用
- パラメータのURLからカード化に必要な情報をogpなどから取得してJSONを返します。
  - ogpがなければ、メタのtitle, descriptionから情報を取得します。
  - パラメータにプレイリスト新標準のURLが設定された場合は、DBから情報を取得します。
- example: https://dev-api-eh.nr.nhk.jp/ogp?url=https://psychic-eureka-90cdb0a4.pages.github.io/p/pl/eh-0000000030
