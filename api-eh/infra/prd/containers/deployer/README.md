# deployer-docker

## ecr のリポジトリ作成

初回のみ

```
aws-vault exec nhk-tomigaya-prd -- aws ecr create-repository --repository-name editorialhands-app
```

## ecr へのアップロード

### ecr にログイン

```
aws-vault exec nhk-tomigaya-prd -- aws ecr get-login-password --profile nhk-tomigaya-prd | docker login --username AWS --password-stdin https://312328096018.dkr.ecr.ap-northeast-1.amazonaws.com
```

### docker image push

aw-editorialhands/api-eh ディレクトリにいる状態で下記コマンド

```
#バージョンは適宜変更
export DEPLOYER_VERSION=v6

# build containerビルド
docker build -t 312328096018.dkr.ecr.ap-northeast-1.amazonaws.com/editorialhands-app:${DEPLOYER_VERSION} infra/prd/containers/deployer
# build containerをecrにpush
docker push 312328096018.dkr.ecr.ap-northeast-1.amazonaws.com/editorialhands-app:${DEPLOYER_VERSION}
```
