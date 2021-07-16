# deployer-docker

## ecr のリポジトリ作成

初回のみ

```
aws-vault exec nhk-tomigaya-dev -- aws ecr create-repository --repository-name aw-editorialhands-deployer
```

## ecr へのアップロード

### ecr にログイン

```
aws-vault exec nhk-tomigaya-dev -- aws ecr get-login-password --profile nhk-tomigaya-dev | docker login --username AWS --password-stdin https://359601428599.dkr.ecr.ap-northeast-1.amazonaws.com
```

### docker image push

aw-editorialhands/api-eh ディレクトリにいる状態で下記コマンド

```
#バージョンは適宜変更
export DEPLOYER_VERSION=v5

# build containerビルド
docker build -t 359601428599.dkr.ecr.ap-northeast-1.amazonaws.com/aw-editorialhands-deployer:${DEPLOYER_VERSION} infra/dev/containers/deployer
# build containerをecrにpush
docker push 359601428599.dkr.ecr.ap-northeast-1.amazonaws.com/aw-editorialhands-deployer:${DEPLOYER_VERSION}
```
