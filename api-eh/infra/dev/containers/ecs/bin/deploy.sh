#! /bin/bash

# エラーで処理中断
set -ex

# build&deploy共通の環境変数取り込み
source ${BASH_SOURCE%/*}/env.sh

# バージョンタグ
export SHA1=$1
# デプロイ環境
export ENV=$2

if [ -n "$ENV" -a "$ENV" = "dev" ]; then
  export RAILS_CPU=512     # .5 vCPU
  export TOTAL_MEMORY=2048 # 1024 MB
  export RAILS_MEMORY=2048
  export ALB_TARGET_ARN=dummy
  export DESIRED_COUNT=1

  # コンテナに渡す環境変数(circleciで設定)
  cat < ./api-eh/infra/dev/containers/ecs/common.env > ./api-eh/infra/dev/containers/ecs/${ENV}.env.gen
  cat < ./api-eh/infra/dev/containers/ecs/${ENV}.env >> ./api-eh/infra/dev/containers/ecs/${ENV}.env.gen
  cat >> ./api-eh/infra/dev/containers/ecs/${ENV}.env.gen  <<FIN
RAILS_ENV=production
RAILS_MASTER_KEY=${RAILS_MASTER_KEY_PRODUCTION}
FIN
fi

# デプロイ
# コマンドのタイムアウトを30分に設定
up_web() {
  echo start up web
  # タスク定義生成
  ruby ./api-eh/infra/dev/containers/ecs/gen_task_def.rb \
    --env_file ./api-eh/infra/dev/containers/ecs/${ENV}.env.gen \
    --secrets-file ./api-eh/infra/dev/containers/ecs/secrets.yml \
    --task-definition-template ./api-eh/infra/dev/containers/ecs/task-definition-template.json | jq '.' > task-definitions.json
  cat task-definitions.json

  # タスク定義登録
  aws ecs register-task-definition \
    --cli-input-json file://task-definitions.json

  # 最新のタスク定義確認
  local latest_task_definition=$(latest_task_definition ${APP_PREFIX}${ENV}-${APP_NAME})

  # 最新のタスク定義でサービス更新
  aws ecs update-service \
    --cluster ${APP_PREFIX}${ENV}-${APP_NAME}-ecs-cluster \
    --service ${APP_PREFIX}${ENV}-${APP_NAME}-service \
    --task-definition ${latest_task_definition} \
    --desired-count ${DESIRED_COUNT}

  echo end up web
}
export -f up_web

up_web
