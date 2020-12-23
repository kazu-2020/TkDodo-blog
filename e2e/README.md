# e2e test

## docker-compose で実行する

ルートディレクトリにて、以下のコマンドを実行してください。

### 準備

```
$ docker-compose build
$ docker-compose run frontend yarn install
$ docker-compose run web bin/setup
```

### 実行

```
$ docker-compose up --abort-on-container-exit --exit-code-from e2e
```

## ローカルで実行する

ローカルで実行する場合には個別にフロントエンド(port: 3000)及び、バックエンド(port: 8888)のアプリケーションを起動してください。
(※) テストを実行する度に起動している環境に直接レコードが保存されていきます。

```
$ cd e2e
$ yarn install
```

### 実行

```
$ npx cypress run --browser chrome --headless
```
