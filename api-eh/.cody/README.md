# Cody

https://cody.run/

[コマンドラインリファレンス](https://cody.run/reference/)

## CodeBuild の設定変更

`.cody` 以下にある `project.rb` や `role.rb` に変更を加えた場合、以下のコマンドを実行し、AWS CloudFormation を通して CodeBuild の設定を変更します。

具体的には、CodeBuild で用いている環境変数を追加/変更/削除したい。といった場合に、利用する可能性があります。

```
$ bundle exec cody deploy
```

## CodeBuild の実行

このプロジェクトでは、CodePipeline により CodeBuild が走ることを前提としていますが、単体で CodeBuild を走らせたい場合には、以下のコマンドで実行可能です。

```
$ bundle exec cody start
```

## コマンド実行時の環境変数の設定

`develop` `staging` `production` の環境が用意されており、それぞれの環境に CodeBuild の設定をデプロイするときには、以下の環境変数を設定の上、コマンドを実行してください。

- CODY_ENV
  - enum: `development`, `staging`, `production`
  - default: `development`
  - note: `variables` のどのファイルを参照するかを決めるための環境変数

### 各環境へのデプロイ例

```
# For development
$ aws-vault exec nhk-tomigaya-dev bundle exec cody deploy
# For staging
$ CODY_ENV=staging aws-vault exec nhk-tomigaya-stg bundle exec cody deploy
# For production
$ CODY_ENV=production aws-vault exec nhk-tomigaya-prd bundle exec cody deploy
```

### 新たな環境用の CodeBuild を増やしたい場合

新たに `develop2` というブランチを対象にした CodeBuild を用意する場合で説明します。

#### settings.yml の編集

https://github.com/d7lab/aw-editorialhands/blob/develop/api-eh/.pipedream/settings.yml

新しい環境(CODY_ENV)を定義します。

```yml
develop2:
  # aws_profile: tomigaya-dev
```

#### variables にファイルを追加

`.cody/variables` のディレクトリに `develop2.rb` というファイルを置きます。
`TARGET_BRANCH` には、CodeBuild でビルドの対象にしたいブランチ名を記載します。
また、その他環境変数の追加があれば、こちらのファイルに記載してください。

```ruby
# .cody/variables/develop2.rb
# frozen_string_literal: true

@target_linux_image = '359601428599.dkr.ecr.ap-northeast-1.amazonaws.com/aw-editorialhands-deployer:v1'
@env_values = {
  AWS_DEFAULT_REGION: 'ap-northeast-1',
  SLACK_NOTIFICATION_URL: 'https://hooks.slack.com/services/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',
  TARGET_BRANCH: 'develop2' # <- Docker Image をビルドするための対象ブランチをココに書きます
}
```

#### CodeBuild をデプロイする

```
$ CODY_ENV=develop2 aws-vault exec tomigaya-prd bundle exec cody deploy
```

これで新しい環境用の CodeBuild が用意完了となります。

EHでは api-eh/ 以下にbackendアプリケーションが存在するため
AWSコンソールから、ビルドプロジェクトを選択して編集->BuildspecからBuildspec名に `api-eh/.cody/buildspec.yml` を設定してください。

## MFA や AssumeRole を用いる場合

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
