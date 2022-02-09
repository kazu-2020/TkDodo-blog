# 環境構築

**※terraform公式のDockerはまだないので、M1 macではdocker-compose runでterraformを実行すると不安定です。tfenvなどでローカルにterraformをインストールしてください。**

## terraform 構成

### 共通

~/.aws/config に下記の設定で switch role できるようにしておく

```
[profile sikmi-nhk]
region=ap-northeast-1
output=json

[profile nhk-tomigaya-dev]
mfa_serial=arn:aws:iam::363730604491:mfa/yoshitaka_nishiguchi
role_arn=arn:aws:iam::359601428599:role/tomigaya-dev-sikmi-role
source_profile=sikmi-nhk
```

mfa_serial は各自のユーザで。
また aws cli を実行するために `aws-vault` を導入しておいてください。
https://github.com/99designs/aws-vault

導入後、 sikmi-nhk profile に credentials を設定しておくこと。

```
aws-vault add sikmi-nhk
```

## ./global

global ディレクトリには、全環境共通の resource 作成用の terraform ファイルが置かれます。
ここで output.ts に設定されている resource が環境別（後述） terraform_remote_state から参照されます。

このため、以下のように環境別の workspace 設定は使いません。

**これらのコマンドは global ディレクトリ内で実行すること**

### 初期化

```
aws-vault exec nhk-tomigaya-dev -- docker-compose run --rm terraform init
```

### デプロイ

```
aws-vault exec nhk-tomigaya-dev -- docker-compose run --rm terraform plan
aws-vault exec nhk-tomigaya-dev -- docker-compose run --rm terraform apply
```

## ./environments

global ディレクトリには、環境別(dev, staging, production)それぞれ用のリソース作成用の terraform ファイルが置かれます。
environments/modules/terraform_remote_state.tf の設定で、 global で作成した resource を参照します。

**これらのコマンドは environments ディレクトリ内で実行すること**

### 初期化

```
aws-vault exec nhk-tomigaya-dev -- docker-compose run --rm terraform init
```

### 環境別初期化

```
aws-vault exec nhk-tomigaya-dev -- docker-compose run --rm terraform workspace new dev
```

### デプロイ

- まず環境を選択

```
aws-vault exec nhk-tomigaya-dev -- docker-compose run --rm terraform workspace select dev
```

- その後は下記の繰り返し

```
aws-vault exec nhk-tomigaya-dev -- docker-compose run --rm terraform plan
aws-vault exec nhk-tomigaya-dev -- docker-compose run --rm terraform apply
```

## 補足

### terraform の構成

variable.js に関しては、global, environments で共通にしたいため、各ディレクトリからの symlink になっている

上記してる通り、各コマンドは、global, environments の各ディレクトリ内で実行するが、variable 自体は一つ上のディレクトリにある variable.tf を参照するため、
docker-compose 上の working_dir 自体は、global, environments には出来ない。

このため、 /app を 一つ上のディレクトリに mapping (volume の設定を ..:/app に)した上で, working_dir を 各ディレクトリの docker-compose.override.yml で自分のディレクトリに上書きしている。

### ssm ユーティリティ

```
# ssm のparameter名一覧
aws-vault exec nhk-tomigaya-dev -- aws ssm describe-parameters | jq -r '.Parameters[].Name'

# ssm の parameterから /dev/ のものだけ抽出して、その値も表示する
aws-vault exec nhk-tomigaya-dev -- aws ssm describe-parameters | jq -r '.Parameters[].Name' | grep "/dev/"| xargs -I{} bash -c "echo {}; aws-vault exec nhk-tomigaya-dev -- aws ssm get-parameter --name {} --with-decrypt | jq -r '.Parameter.Value'"
```
