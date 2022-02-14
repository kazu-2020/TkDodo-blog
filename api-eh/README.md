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

## Ruby のバージョンアップ

参考 PR: https://github.com/d7lab/aw-editorialhands/pull/644

## エンドポイント

### d6.6 API

- [Swagger](https://developer.nr.nhk.jp/api_doc/index.html?urls.primaryName=d6.6%20API) を参照

---

### oEmbed API

- [oEmbed](https://oembed.com/) に準拠したレスポンスを返します。

#### Parameters

| Parameter | Description                    | Example                                                                                                                                                                                    |
| --------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| url       | 埋め込まれるコンテンツの URL   | ・`https://www.nhk.jp/p/ts/6X8L7Z8VK8/episode/te/JP8Z34KPLL/`<br />・`https://dev-www-eh.nr.nhk.jp/p/pl/recommend-tep-0000000053`<br />・`https://dev-www-eh.nr.nhk.jp/p/pl/ts-WV5PLY8R43` |
| height    | 返却される iframe の高さ（px） | `300`                                                                                                                                                                                      |

#### Example Request

```example
GET https://dev-api-eh.nr.nhk.jp/oembed?url=https://www.nhk.jp/p/ts/6X8L7Z8VK8/episode/te/JP8Z34KPLL/
```

#### Example Response

```json
{
  "version": "1.0",
  "width": "100%",
  "height": 210,
  "type": "rich",
  "provider_name": "NHK",
  "provider_url": "https://www.nhk.jp",
  "url": "https://www.nhk.jp/p/ts/6X8L7Z8VK8/episode/te/JP8Z34KPLL/",
  "title": "Episode",
  "thumbnail_width": 640,
  "thumbnail_height": 360,
  "thumbnail_url": "https://placehold.jp/640x360.png",
  "html": "\u003ciframe width=\"100%\" height=\"210\" src=\"https://dev-api-eh.nr.nhk.jp/embed/ts/6X8L7Z8VK8/episode/te/JP8Z34KPLL\" style=\"border: 0;\"\u003e\u003c/iframe\u003e"
}
```

---

### /embed

- パスの情報から動的に構築した HTML を返します。
- oEmbed API では iframe 内にこのコンテンツを設定した HTML プロパティを返却します。
- example: https://dev-api-eh.nr.nhk.jp/embed/te/7MKRXXKMML/faqpage/20

#### Pathes

| Path                                     | Description | Example                                                                 |
| ---------------------------------------- | ----------- | ----------------------------------------------------------------------- |
| ts/{シリーズ ID}                         | Series      | https://dev-api-eh.nr.nhk.jp/embed/ts/6X8L7Z8VK8/                       |
| pl/{プレイリスト ID}                     | Playlist    | https://dev-api-eh.nr.nhk.jp/embed/pl/recommend-tep-0000000053/         |
| ts/:series_id/episode/te/{エピソード ID} | Episode     | https://dev-api-eh.nr.nhk.jp/embed/ts/6X8L7Z8VK8/episode/te/5LRX21QQJM/ |
| te/{エピソード ID}/howto/{HowTo ID}      | HowTo       | https://dev-api-eh.nr.nhk.jp/embed/te/G73XYP4QNL/howto/61               |
| te/{エピソード ID}/event/{Event ID}      | Event       | https://dev-api-eh.nr.nhk.jp/embed/te/7MKRXXKMML/event/1                |
| te/{エピソード ID}/faqpage/{FAQPage ID}  | FAQPage     | https://dev-api-eh.nr.nhk.jp/embed/te/7MKRXXKMML/faqpage/20             |

---

### /richlink

- **プレイリスト新標準プロトタイプ（aw-pl-web）専用の内部 API です。**
- パラメータの URL からカード化に必要な情報を ogp などから取得して JSON を返します。
  - ogp がなければ、メタの title, description から情報を取得します。
  - パラメータにプレイリスト新標準の URL が設定された場合は、DB から情報を取得します。
  - time_ago_in_words: レスポンスヘッダーの Last-Modified or プレイリスト新標準の URL の場合、published_at から計算した「N 分前」のような文字列を返します。

#### Parameters

| Parameter | Description          | Example                                                        |
| --------- | -------------------- | -------------------------------------------------------------- |
| url       | 取得するページの URL | ・`https://dev-www-eh.nr.nhk.jp/p/pl/recommend-tep-0000000053` |

#### Example Request

```
GET https://dev-api-eh.nr.nhk.jp/richlink?url=https://www3.nhk.or.jp/news/html/20220106/k10013417621000.html
```

#### Example Response

```json
{
  "title": "消防団員がびしょぬれで火災のない1年を願う「裸放水」 富山 | NHKニュース",
  "description": "【NHK】肌を刺すような寒さのなか、富山県入善町で下帯姿の消防団員たちが、びしょぬれになりながら火災のない1年を願う、恒例の「裸放…",
  "image": "https://www3.nhk.or.jp/news/html/20220106/K10013417621_2201061505_2201061510_01_03.jpg",
  "time_ago_in_words": "8分前"
}
```
