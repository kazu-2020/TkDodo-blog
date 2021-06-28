# Pipedream

https://pipedream.run/

## CodePipeline の設定変更

`.pipedream` 以下にある `pipeline.rb` や `role.rb` に変更を加えた場合、以下のコマンドを実行し、AWS CloudFormation を通して CodePipeline の設定を変更します。

具体的には、CodePipeline で用いている環境変数を追加/変更/削除したい場合や、CodePipeline で stage を追加/変更/削除といった場合に、利用する可能性があります。

```
$ bundle exec pipe deploy
```

## CodePipeline の実行

このプロジェクトでは、GitHub の Webhook をトリガーにして走ることを前提としていますが、手動で CodePipeline を走らせたいという場合には、以下のコマンドで実行可能です。

```
$ bundle exec pipe start
```

## コマンド実行時の環境変数の設定

CMS1 では `develop` `staging` `production` の環境が用意されており、それぞれの環境に CodePipeline の設定をデプロイするときには、以下の環境変数を設定の上、コマンドを実行してください。

- PIPE_ENV
  - enum: `development`, `staging`, `production`
  - default: `development`
  - note: CodeBuild の project を指定するための環境変数
- PIPELINE_TARGET_BRANCH
  - enum: `develop`, `staging`, `master`
  - default: `develop`
  - note: CodePipeline の開始フックを指定するためのブランチ

これらの環境変数は `pipeline.rb` で参照しています。

### 各環境へのデプロイ例

```
# For development
$ PIPE_ENV=development PIPELINE_TARGET_BRANCH=develop aws-vault exec tomigaya-dev bundle exec pipe deploy
# For staging
$ PIPE_ENV=staging PIPELINE_TARGET_BRANCH=staging aws-vault exec tomigaya-stg bundle exec pipe deploy
# For production
$ PIPE_ENV=production PIPELINE_TARGET_BRANCH=master aws-vault exec tomigaya-prd bundle exec pipe deploy
```

### 新たな環境用の CodePipeline を増やしたい場合

新たに `develop2` という環境を用意して、`develop2` ブランチがマージされたときに動く CodePipeline を新たに追加する場合で説明します。

### settings.yml の編集

https://github.com/d7lab/aw-editorialhands/blob/master/api-eh/.pipedream/settings.yml

新しい環境(PIPE_ENV)を定義します。

```yml
develop2:
  # aws_profile: tomigaya-dev
```

### CodePipeline で使用する CodeBuild を追加する

新しい環境と同名の環境を Cody 側にも用意してください

[新たな環境用の CodeBuild を増やしたい場合](https://github.com/d7lab/aw-editorialhands#)

### CodePipeline をデプロイする

```
$ PIPE_ENV=develop2 PIPELINE_TARGET_BRANCH=develop2 aws-vault exec tomigaya-dev bundle exec pipe deploy
```

これで新しい環境用の CodePipeline が用意完了となります。

### MFA や AssumeRole を用いる場合

MFA を用いて AWS CLI を実行する場合には、以下のような設定ファイルを用意します。
`mfa_serial` については、各個人ごとに arn を書き換えてください。

```
# ~/.aws/config

[profile sikmi-nhk]
region=ap-northeast-1
output=json

[profile tomigaya-dev]
role_arn=arn:aws:iam::359601428599:role/tomigaya-dev-sikmi-role
mfa_serial=arn:aws:iam::363730604491:mfa/ryusuke_sekiguchi
source_profile=sikmi-nhk

[profile tomigaya-stg]
role_arn=arn:aws:iam::312328096018:role/tomigaya-stg-sikmi-role
mfa_serial=arn:aws:iam::363730604491:mfa/ryusuke_sekiguchi
source_profile=sikmi-nhk

[profile tomigaya-prd]
role_arn=arn:aws:iam::312328096018:role/tomigaya-prd-sikmi-role
mfa_serial=arn:aws:iam::363730604491:mfa/ryusuke_sekiguchi
source_profile=sikmi-nhk
```
