# aw-editorialhands

## Data Structure

EditorialHands で扱うデータ構造については以下をご参照ください

[データ構造について](https://github.com/d7lab/aw-editorialhands/wiki/%E3%83%87%E3%83%BC%E3%82%BF%E6%A7%8B%E9%80%A0%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6)

## Dependencies

- Jets
- ruby2.5

## Development

### Copy .env files

```
$ mv .env.sample .env
```

秘匿値は sample ファイルの中に含まれていません。
適宜設定するか、既存の PJ メンバーまで問い合わせてください。

### On local

```
$ bundle install
$ bundle exec jets db:create
$ bundle exec jets db:migrate
$ bundle exec jets server
```

### On docker

```
$ docker-compose build
$ docker-compose run web bundle exec jets db:create
$ docker-compose run web bundle exec jets db:migrate
$ docker-compose up
```

## Test

```
$ bundle exec rspec
```

OR

```
$ JETS_ENV=test docker-compose run web bundle exec rspec
```

## Deployment

デプロイ先は DigitalLabo の AWS 環境になります。
以下の設定を `~/.aws/config` に追加してください。

```
# ~/.aws/config

[profile sikmi-nhk]
region=ap-northeast-1
output=json

[profile tomigaya-dev]
role_arn=arn:aws:iam::359601428599:role/tomigaya-dev-sikmi-role
mfa_serial=arn:aws:iam::363730604491:mfa/ryusuke_sekiguchi
source_profile=sikmi-nhk
region=ap-northeast-1
```

また、以下に続くコマンドを実行できるように、 [aws-vault](https://github.com/99designs/aws-vault) を導入してください。

```
$ brew cask install aws-vault
$ aws-vault add sikmi-nhk
Enter Access Key Id: ABDCDEFDASDASF
Enter Secret Key: %%%
```

### Deploy command

CodePipeline にて、docker-build -> db:migrate -> deploy の流れを設定しているため、基本的には CodePipeline 経由でデプロイをしてください。
手元で、CodePipeline をキックするには、以下のコマンドを実行してください。

以下コマンドは、ECR へ最新の Docker Image を push した後、デプロイします。

```
$ aws-vault exec tomigaya-dev -- bundle exec pipe start
```

緊急でどうしても手元からデプロイをしたい場合には、以下のコマンドを使用します。

```
$ aws-vault exec tomigaya-dev -- bundle exec jets deploy production
```

## CodePipeline

このプロジェクトでは、[pipedream](https://pipedream.run/) を使用して、CodePipeline の環境を整えています。
CodePipeline の環境変数やステージに変更を加える場合には、 `.pipedream` 以下のファイルを変更して、以下のコマンドを実行してください。

```
$ aws-vault exec tomigaya-dev -- bundle exec pipe deploy
```

## CodeBuild

CodePipeline 内で使っている CodeBuild は [cody](https://cody.run/) を用いて、管理しています。

### docker-build

最新のコードから docker build を行い、ビルド後にECRにイメージをpush するためのタスクです。

Dockerイメージをビルドする用のタスク定義が、 `.cody/docker-build` 配下に置いてあります。
環境変数等に変更を加える場合には、`.cody` 以下のファイルを変更して、以下のコマンドを実行してください。

```
$ aws-vault exec tomigaya-dev -- bundle exec cody deploy --type docker-build
```

### deploy

ECRの最新のイメージを用いて、本番デプロイを行うためのタスクです。

Dockerイメージをビルドする用のタスク定義が、 `.cody/deploy` 配下に置いてあります。
環境変数等に変更を加える場合には、`.cody` 以下のファイルを変更して、以下のコマンドを実行してください。

```
$ aws-vault exec tomigaya-dev -- bundle exec cody deploy --type deploy
```

## DB migration on AWS

https://ap-northeast-1.console.aws.amazon.com/lambda/home?region=ap-northeast-1#/functions/aw-editorialhands-prod-command_job-migrate?tab=configuration

上記ページにアクセスの後、 「テスト」ボタンを押して lambda function を動かしてください。

通常は、CodePipeline の `Deploy` ステージでマイグレーションが走ります。

