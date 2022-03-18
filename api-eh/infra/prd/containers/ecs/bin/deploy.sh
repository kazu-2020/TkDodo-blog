#! /bin/bash

# エラーで処理中断
set -ex

# build&deploy共通の環境変数取り込み
source ${BASH_SOURCE%/*}/env.sh

# バージョンタグ
export SHA1=$1
# デプロイ環境
export ENV=$2

if [ -n "$ENV" -a "$ENV" = "production" ]; then
  export RAILS_CPU=512     # .5 vCPU
  export TOTAL_MEMORY=2048 # 1024 MB
  export RAILS_MEMORY=2048
  export SIDEKIQ_MEMORY=2048
  export ALB_TARGET_ARN=arn:aws:elasticloadbalancing:ap-northeast-1:312328096018:targetgroup/tomigaya-prd-editorialhands-tg/17fdc9864f166436
  export DESIRED_COUNT=2
  export DESIRED_COUNT_SIDEKIQ=1
  export ENV_KEY=prd

  # コンテナに渡す環境変数(circleciで設定)
  cat < ./api-eh/infra/${ENV_KEY}/containers/ecs/common.env > ./api-eh/infra/${ENV_KEY}/containers/ecs/${ENV}.env.gen
  cat < ./api-eh/infra/${ENV_KEY}/containers/ecs/${ENV}.env >> ./api-eh/infra/${ENV_KEY}/containers/ecs/${ENV}.env.gen
  cat >> ./api-eh/infra/${ENV_KEY}/containers/ecs/${ENV}.env.gen  <<FIN
RAILS_ENV=${ENV}
RAILS_MASTER_KEY=${RAILS_MASTER_KEY_PRODUCTION}
FIN
fi

# デプロイ
# コマンドのタイムアウトを30分に設定
up_web() {
  echo start up web
  # タスク定義生成
  ruby ./api-eh/infra/${ENV_KEY}/containers/ecs/gen_task_def.rb \
    --env_file ./api-eh/infra/${ENV_KEY}/containers/ecs/${ENV}.env.gen \
    --secrets-file ./api-eh/infra/${ENV_KEY}/containers/ecs/secrets.yml \
    --task-definition-template ./api-eh/infra/${ENV_KEY}/containers/ecs/task-definition-template.json | jq '.' > task-definitions.json
  cat task-definitions.json

  # タスク定義登録
  aws ecs register-task-definition \
    --cli-input-json file://task-definitions.json

  # 最新のタスク定義確認
  local latest_task_definition=$(latest_task_definition ${APP_PREFIX}${ENV_KEY}-${CLUSTER_APP_NAME})

  # 最新のタスク定義でサービス更新
  aws ecs update-service \
    --cluster ${APP_PREFIX}${ENV_KEY}-${CLUSTER_APP_NAME}-ecs-cluster \
    --service ${APP_PREFIX}${ENV_KEY}-${CLUSTER_APP_NAME}-service \
    --enable-execute-command \
    --deployment-configuration "deploymentCircuitBreaker={enable=true,rollback=true}" \
    --task-definition ${latest_task_definition} \
    --desired-count ${DESIRED_COUNT}

  echo end up web

  ###############################################################################
  # sidekiq
  echo sidekiq serivce update start
  # sidekiqのタスク定義生成
  ruby ./api-eh/infra/${ENV_KEY}/containers/ecs/gen_task_def.rb \
    --env_file ./api-eh/infra/${ENV_KEY}/containers/ecs/${ENV}.env.gen \
    --secrets-file ./api-eh/infra/${ENV_KEY}/containers/ecs/secrets.yml \
    --task-definition-template ./api-eh/infra/${ENV_KEY}/containers/ecs/task-definition-template-sidekiq.json | jq '.' > task-definitions-sidekiq.json
  cat task-definitions-sidekiq.json

  # sidekiqタスク定義登録
  aws ecs register-task-definition \
    --cli-input-json file://task-definitions-sidekiq.json

  # sidekiqの最新のタスク定義確認
  local latest_task_definition_sidekiq=$(latest_task_definition ${APP_PREFIX}${ENV_KEY}-${CLUSTER_APP_NAME})

  # 最新のタスク定義でsidekiqのサービス更新
  aws ecs update-service \
    --cluster ${APP_PREFIX}${ENV_KEY}-${CLUSTER_APP_NAME}-ecs-cluster \
    --service ${APP_PREFIX}${ENV_KEY}-${CLUSTER_APP_NAME}-service-sidekiq \
    --enable-execute-command \
    --deployment-configuration "deploymentCircuitBreaker={enable=true,rollback=true}" \
    --task-definition ${latest_task_definition_sidekiq} \
    --desired-count ${DESIRED_COUNT_SIDEKIQ}

  echo sidekiq service update end
}
export -f up_web

up_web
