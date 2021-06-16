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
  export ALB_TARGET_ARN=dummy
  export DESIRED_COUNT=1
  export DESIRED_COUNT_SIDEKIQ=1

  # コンテナに渡す環境変数(circleciで設定)
  cat < ./containers/dev/ecs/common.env > ./containers/dev/ecs/${ENV}.env.gen
  cat < ./containers/dev/ecs/${ENV}.env >> ./containers/dev/ecs/${ENV}.env.gen
  cat >> ./containers/dev/ecs/${ENV}.env.gen  <<FIN
RAILS_ENV=${ENV}
RAILS_MASTER_KEY=${RAILS_MASTER_KEY_PRODUCTION}
FIN
elif [ -n "$ENV" -a "$ENV" = "dev" ]; then
  export RAILS_CPU=512     # .5 vCPU
  export TOTAL_MEMORY=2048 # 1024 MB
  export RAILS_MEMORY=2048
  export SIDEKIQ_MEMORY=2048
  export ALB_TARGET_ARN=arn:aws:elasticloadbalancing:ap-northeast-1:359601428599:targetgroup/tomigaya-dev-cms1-tg/7341b8cef22808e5
  export DESIRED_COUNT=1
  export DESIRED_COUNT_SIDEKIQ=1
  export ENV_KEY=dev

  # コンテナに渡す環境変数(circleciで設定)
  cat < ./containers/dev/ecs/common.env > ./containers/dev/ecs/${ENV}.env.gen
  cat < ./containers/dev/ecs/${ENV}.env >> ./containers/dev/ecs/${ENV}.env.gen
  cat >> ./containers/dev/ecs/${ENV}.env.gen  <<FIN
RAILS_ENV=${ENV}
RAILS_MASTER_KEY_DEV=${RAILS_MASTER_KEY_DEV}
FIN
elif [ -n "$ENV" -a "$ENV" = "staging" ]; then
  export RAILS_CPU=512     # .5 vCPU
  export TOTAL_MEMORY=2048 # 1024 MB
  export RAILS_MEMORY=2048
  export SIDEKIQ_MEMORY=2048
  export ALB_TARGET_ARN=dummy
  export DESIRED_COUNT=1
  export DESIRED_COUNT_SIDEKIQ=1

  # コンテナに渡す環境変数(circleciで設定)
  cat < ./containers/dev/ecs/common.env > ./containers/dev/ecs/${ENV}.env.gen
  cat < ./containers/dev/ecs/${ENV}.env >> ./containers/dev/ecs/${ENV}.env.gen
  cat >> ./containers/dev/ecs/${ENV}.env.gen  <<FIN
RAILS_ENV=${ENV}
RAILS_MASTER_KEY_STAGING=${RAILS_MASTER_KEY_STAGING}
FIN
fi

# デプロイ
# コマンドのタイムアウトを30分に設定
up_web() {
  echo start up web
  # タスク定義生成
  ruby ./containers/dev/ecs/gen_task_def.rb \
    --env_file ./containers/dev/ecs/${ENV}.env.gen \
    --secrets-file ./containers/dev/ecs/secrets.yml \
    --task-definition-template ./containers/dev/ecs/task-definition-template.json | jq '.' > task-definitions.json
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

  # timeout 60m ecs-cli compose \
  #   --file ./containers/dev/ecs/docker-compose.${ENV}.yml \
  #   --ecs-params ./containers/dev/ecs/ecs-param.${ENV}.yml \
  #   --project-name ${APP_PREFIX}${ENV}-${APP_NAME} \
  #   --cluster ${APP_PREFIX}${ENV}-${APP_NAME}-ecs-cluster \
  #  service up --launch-type FARGATE \
  #  --container-name rails \
  #  --container-port 3000 \
  #  --target-group-arn ${ALB_TARGET_ARN}\
  #  --region ap-northeast-1 \
  #  --timeout 60 \
  #  --health-check-grace-period 180 \
  #  --deployment-max-percent 200
  echo end up web

  ###############################################################################
  # sidekiq
  echo sidekiq serivce update start
  # sidekiqのタスク定義生成
  ruby ./containers/dev/ecs/gen_task_def.rb \
    --env_file ./containers/dev/ecs/${ENV}.env.gen \
    --secrets-file ./containers/dev/ecs/secrets.yml \
    --task-definition-template ./containers/dev/ecs/task-definition-template-sidekiq.json | jq '.' > task-definitions-sidekiq.json
  # cat task-definitions-sidekiq.json

  # sidekiqタスク定義登録
  aws ecs register-task-definition \
    --cli-input-json file://task-definitions-sidekiq.json

  # sidekiqの最新のタスク定義確認
  local latest_task_definition_sidekiq=$(latest_task_definition ${APP_PREFIX}${ENV}-${APP_NAME})

  # 最新のタスク定義でsidekiqのサービス更新
  aws ecs update-service \
    --cluster ${APP_PREFIX}${ENV}-${APP_NAME}-ecs-cluster \
    --service ${APP_PREFIX}${ENV}-${APP_NAME}-service-sidekiq \
    --task-definition ${latest_task_definition_sidekiq} \
    --desired-count ${DESIRED_COUNT_SIDEKIQ}

  echo sidekiq service update end
}
export -f up_web

up_web

