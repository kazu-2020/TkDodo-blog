# e2e test

## docker-compose で実行する

e2eディレクトリにて、以下のコマンドを実行してください。

### 準備

```
$ docker compose build
$ docker compose run frontend yarn install
$ docker compose run backend bin/setup
```

### 実行

```
$ docker compose up --abort-on-container-exit --exit-code-from e2e
```

### 注意
apple silicon系のmacではcypressのdocker imageが動作しないのでcypressだけlocalで実行する

```bash
$ docker compose up frontend db backend sidekiq redis r6 r6.0

// Cypressの実行
$ npx cypress run --browser chrome --headless

// or

$ npx cypress open 
```


## ローカルで実行する

ローカルで実行する場合には個別にフロントエンド(port: 5173)及び、バックエンド(port: 8888)のアプリケーションを起動してください。
(※) テストを実行する度に起動している環境に直接レコードが保存されていきます。

```
$ cd e2e
$ npm install
```

### 実行

```
$ npx cypress run --browser chrome --headless
```
