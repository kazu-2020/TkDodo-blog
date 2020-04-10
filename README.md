# labo-playlist-editor

## Build Setup (for Local)

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

## Build Setup (for docker-compose)

```bash
$ docker-compose build
$ docker-compose up
$ open http://localhost:8080
# コンテナ内に入る場合
$ docker exec -it labo-playlist-editor_frontend_1 sh
```

## Lint

prettier による自動コードフォーマットと、
eslint による, js, vue の Lint、
stylelint による css, scss の Lint を行っています。

```bash
# Lint のみ
$ yarn lint

# Lint + fix
$ yarn lint --fix
```
