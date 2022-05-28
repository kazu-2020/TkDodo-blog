## 稼働中の ECS fargate へのログイン方法

### 前準備

- brew 等で、awscli, peco, jq を実行環境にインストールしてください
  - AWS CLI は v2.1.35~ を利用してください
- AWS の [SessionManager プラグイン](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html) もインストールをお願いしします

### ログイン

infra ディレクトリ配下で以下のコマンドを実行してください。
#{env} にはログインしたい環境の aws-profile 名を入れてください。

```
$ aws-vault exec #{env} -- bin/ecs-exec
```
