# README

## Docker環境
### 準備

```
$ docker compose build
$ docker compose run rails bin/setup
```

## ローカル環境
### 準備
```
$ bundle exec bin/setup
```

### サーバーの起動

フロントエンドでポートが `8888` で使われているので、オプションが必要になります

```
$ bundle exec rails s -p 8888
```

### テストの実行

```
$ bundle exec rspec
```

## 定期 Job の登録方法
- 定時のバッチ処理など、 sidekiq schedulerを利用しています。

## Ruby のバージョンアップ

参考 PR: https://github.com/d7lab/aw-editorialhands/pull/644

## エンドポイント

### /embed

- パスの情報から動的に構築した HTML を返します。
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

### /people
人物情報の詳細取得、追加、更新を行うAPIです

#### Path
GET `/people/:person_id`

#### Description
指定された人物IDの情報を取得します

#### Query Parameters
なし

#### Path Parameters
人物ID。必須

#### Request Body
なし

#### Example Request
```
GET https://dev-api-eh.nr.nhk.jp/people/1
```

#### Example Response
```
{
  id: 1,
  role: 'Person',
  nameFormat: 1,
  name: '西川貴教',
  familyName: '西川',
  givenName: '貴教',
  additionalName: '',
  nameRuby: 'にしかわたかのり',
  familyNameRuby: 'にしかわ',
  givenNameRuby: 'たかのり',
  additionalNameRuby: '',
  occupation: '歌手,声優,俳優,レコード・プロデューサー,ラジオパーソナリティ,作詞家,タレント',
  description: '日本の歌手、タレント (1970- )',
  thumbnail: '{"id":" people/local/hero_ce9b9f9987028240f782ca2f272702a0.jpg","storage":"store","metadata":{"filename":"6Y2Kao2Xnm8SjP3p.jpeg","size":63460,"mime_type":"image/jpeg","width":1199,"height":399},"derivatives":{"default":{"id":" people/local/hero_f71b2e9bef7158bf01739e57be872474.jpg","storage":"store","metadata":{"filename":"image_processing20220815-1-eckgu7.jpg","size":121389,"mime_type":"image/jpeg","width":1920,"height":640}},"medium":{"id":" people/local/hero_be0887b359abc8cca2f439d21331d680.jpg","storage":"store","metadata":{"filename":"image_processing20220815-1-dznmrt.jpg","size":56538,"mime_type":"image/jpeg","width":1080,"height":360}}}}',
  uuid:'89678CF2-2863-29F6-6079-721C96A104A0',
  qid:'Q187553',
  viafid:'44068140',
}
```
---

#### Path
POST `/people`

#### Description
フォームに入力された値で人物のデータを新規作成します

#### Query Parameters
なし

#### Path Parameters
なし

#### Request Body

|Properties|Description|Example|
|:----|:----|:----|
|id|人物 ID|2|
|role|分類|Person|
|nameFormat|名前の形式|1|
|name|人物名|山田太郎|
|familyName|苗字|山田|
|givenName|名前|太郎|
|additionalName|ミドルネーム||
|nameRuby|人物名のルビ|やまだたろう|
|familyNameRuby|苗字のルビ|やまだ|
|givenNameRuby|名前のルビ|たろう|
|additionalNameRuby|ミドルネームのルビ||
|occupation|職業|エンジニア|
|description|人物詳細|Wikidata,Viafに登録さていない人物|
|thumbnail|サムネイル画像|data:image/png;base64,iVBORw0K...|
|uuid|個人識別 ID||
|qid|Wikidata ID||
|viafid|Viaf ID||
#### Error
|Properties|Description|Example|
|:----|:----|:----|
|message|エラーメッセージ|Nameを入力してください|

|HTTP Status Code|Description|
|:----|:----|
|422|Unprocessable Entity|

#### Example Request
```
POST https://dev-api-eh.nr.nhk.jp/people
```
#### Example Response
* Success
```
{
  id: 2,
  role: 'Person',
  name_format: 1,
  name: '山田太郎',
  family_name: '山田',
  given_name: '太郎',
  additional_name: '',
  name_ruby: 'やまだたろう',
  family_name_ruby: 'やまだ',
  given_name_ruby: 'たろう',
  additional_name_ruby: '',
  occupation: 'エンジニア',
  description: 'Wikidata,Viafに登録さていない人物 ',
  thumbnail: '{"id":" people/local/hero_ce9b9f9987028240f782ca2f272702a0.jpg","storage":"store","metadata":{"filename":"6Y2Kao2Xnm8SjP3p.jpeg","size":63460,"mime_type":"image/jpeg","width":1199,"height":399},"derivatives":{"default":{"id":" people/local/hero_f71b2e9bef7158bf01739e57be872474.jpg","storage":"store","metadata":{"filename":"image_processing20220815-1-eckgu7.jpg","size":121389,"mime_type":"image/jpeg","width":1920,"height":640}},"medium":{"id":" people/local/hero_be0887b359abc8cca2f439d21331d680.jpg","storage":"store","metadata":{"filename":"image_processing20220815-1-dznmrt.jpg","size":56538,"mime_type":"image/jpeg","width":1080,"height":360}}}}',
  uuid:'45632CF2-23456-35F6-35342-721C96A213D2',
  qid:'',
  viafid:'',
}
```
* Failed
```
{"messages":["Nameを入力してください"]}
```
---

#### Path
PUT `/people/:person_id`

#### Description
指定された人物IDの情報を更新します

#### Query Parameters
なし

#### Path Parameters
人物ID。必須

#### Request Body
|Properties|Description|Example|
|:----|:----|:----|
|id|人物 ID|1|
|role|分類|Person|
|nameFormat|名前の形式|1|
|name|人物名|西川★貴教|
|familyName|苗字|にしかわ|
|givenName|名前|たかのり|
|additionalName|ミドルネーム||
|nameRuby|人物名のルビ|にしかわ★たかのり|
|familyNameRuby|苗字のルビ|にしかわ|
|givenNameRuby|名前のルビ|たかのり|
|additionalNameRuby|ミドルネームのルビ||
|occupation|職業|'歌手,声優,俳優,レコード・プロデューサー,ラジオパーソナリティ,作詞家,タレント'|
|description|人物詳細|日本の歌手、タレント (1970- )|
|thumbnail|サムネイル画像|data:image/jpeg;base64,fGKETh2J...|
|uuid|個人識別 ID|89678CF2-2863-29F6-6079-721C96A104A0|
|qid|Wikidata ID|Q187553|
|viafid|Viaf ID|44068140|

#### Error
|Properties|Description|Example|
|:----|:----|:----|
|message|エラーメッセージ|Nameを入力してください|

|HTTP Status Code|Description|
|:----|:----|
|422|Unprocessable Entity|


#### Example Request
```
PUT https://dev-api-eh.nr.nhk.jp/people/1
```

#### Example Response
* Success
```
{
  id: 1,
  role: 'Person',
  nameFormat: 1,
  name: '西川★貴教',
  familyName: '西川',
  givenName: '貴教',
  additionalName: '',
  nameRuby: 'にしかわ★たかのり',
  familyNameRuby: 'にしかわ',
  givenNameRuby: 'たかのり',
  additionalNameRuby: '',
  occupation: '歌手,声優,俳優,レコード・プロデューサー,ラジオパーソナリティ,作詞家,タレント',
  description: '日本の歌手、タレント (1970- )',
  thumbnail: '{"id":" people/local/hero_ce9b9f9987028240f782ca2f272702a0.jpg","storage":"store","metadata":{"filename":"6Y2Kao2Xnm8SjP3p.jpeg","size":63460,"mime_type":"image/jpeg","width":1199,"height":399},"derivatives":{"default":{"id":" people/local/hero_f71b2e9bef7158bf01739e57be872474.jpg","storage":"store","metadata":{"filename":"image_processing20220815-1-eckgu7.jpg","size":121389,"mime_type":"image/jpeg","width":1920,"height":640}},"medium":{"id":" people/local/hero_be0887b359abc8cca2f439d21331d680.jpg","storage":"store","metadata":{"filename":"image_processing20220815-1-dznmrt.jpg","size":56538,"mime_type":"image/jpeg","width":1080,"height":360}}}}',
  uuid:'89678CF2-2863-29F6-6079-721C96A104A0',
  qid:'Q187553',
  viafid:'44068140',
}
```

* Failed
```
{"messages":["Nameを入力してください"]}
```

---

### /people/search
EH内部の人物検索用APIです

#### Path
GET `/people/search`

#### Description
検索ワードに該当する人物の一覧をEHまたは人物DBから取得します


#### Query Parameters
| Parameter |Description|Required|
|:----------|:----|:----|
| word      |検索ワード|false|
| type  |取得したい人物データの種別 <br><br>opendata：wikidata,viafから取得した人物データ<br>internal： システム内部の人物データ<br>デフォルト: internal|true|


#### Path Parameters
なし

#### Request Body
なし

#### Example Request
```
GET https://dev-api-eh.nr.nhk.jp/people/search?word=西川貴教&type=internal
```
#### Example Response
```
{
  id: 1,
  name: '西川貴教',
  description: '日本の歌手、タレント (1970- )',
  uuid : '89678CF2-2863-29F6-6079-721C96A104A0',
  qid: 'Q187553',
  viafid: '44068140',
  thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/T.M._Revolution_at_MTV_VMAJ_2014.jpg/300px-T.M._Revolution_at_MTV_VMAJ_2014.jpg',
  totalCount: 15,
}
```
