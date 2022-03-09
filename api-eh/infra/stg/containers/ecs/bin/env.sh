#!/bin/bash

# アプリケーション名
export APP_PREFIX=tomigaya-
export APP_NAME=aw-editorialhands
export CLUSTER_APP_NAME=api-eh
export AWS_ACCOUNT_ID=312328096018
# ecrのリポジトリ
export CONTAINER_REGISTRY=${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com

# コマンド文字列から、json用の文字列配列を生成
# to_string_array bin/rails runner hoge
# => "bin/rails","runner","hoge"
function to_string_array () {
  ruby -e "puts ARGV.map(&:inspect).join(',')" $*
}

# 標準入力から受けたjsonをjavascriptの文字列表現に直す
#
# root@c86ec18f2788:/# to_json_string <<EOS
# {
#   "hoge": 1,
#   "foo": [
#     2,
#     3
#   ]
# }
# EOS
# => "{\"hoge\":1,\"foo\":[2,3]}"
function to_json_string () {
  ruby -rjson -e 'p JSON.parse(ARGF.read).to_json'
}

# タスク定義のprefixから最新のタスク定義のarnを返す
# latest_task_definition aw-cms1-stg
# => arn:aws:ecs:ap-northeast-1:360128825233:task-definition/aw-cms1-stg:43
function latest_task_definition () {
  local cluster_name=$1
  aws ecs list-task-definitions --family-prefix $cluster_name --sort DESC --max-items 1 | jq -r '.taskDefinitionArns[0]'
}

# バッチの起動コマンドを渡すと、ecsのrailsコンテナ起動用のjson(を文字列にした値)を出力
# generate_input_json bin/rails runner hoge.rb
# => "{\"containerOverrides\":[{\"name\":\"rails\",\"command\":[\"bin/rails\",\"runner\",\"hoge.rb\"]}]}"
#
# バッチ時に上書きしたい環境変数が動的になるならちょっと仕組み検討
function generate_input_json () {
  local exec_command=$(to_string_array $*)
  to_json_string <<EOS
  {
    "containerOverrides": [
      {
        "name": "sidekiq",
        "command": [
          ${exec_command}
        ],
        "environment": [
          {
            "name": "BATCH_MODE",
            "value": "1"
          },
          {
            "name": "RUN_SSM",
            "value": "0"
          }
        ]
      }
    ]
  }
EOS
}

# cloudwatch eventにバッチコマンドを紐付ける
# put_target ルール名 起動するコマンド
# 例)
# put_target aw-cms1-cron-test bin/rails runner hoge.rb
function put_target() {
  local cloudwatch_event_rule_name=$1
  shift
  local input_json=$(generate_input_json $*)
  local ecs_cluster_arn="arn:aws:ecs:ap-northeast-1:${AWS_ACCOUNT_ID}:cluster/${APP_PREFIX}${ENV}-${APP_NAME}-ecs-cluster"
  local latest_task_definition=$(latest_task_definition ${APP_PREFIX}${ENV}-${APP_NAME})
  cat <<EOS > put-target-input-json.json
  {
      "Rule": "${cloudwatch_event_rule_name}",
      "Targets": [
          {
              "Input": ${input_json},
              "RoleArn": "arn:aws:iam::${AWS_ACCOUNT_ID}:role/${APP_PREFIX}${ENV}-${APP_NAME}_ecs_event",
              "EcsParameters": {
                  "TaskDefinitionArn": "${latest_task_definition}",
                  "TaskCount": 1,
                  "LaunchType": "FARGATE",
                  "NetworkConfiguration": {
                    "awsvpcConfiguration": {
                      "Subnets": [
                          "subnet-0c0798cf0dedcb52b",
                          "subnet-0134f297a6631ae21"
                      ],
                      "SecurityGroups": [
                         "sg-0aeb9fe5497f55bce"
                      ],
                      "AssignPublicIp": "ENABLED"
                    }
                  },
                  "PlatformVersion": "LATEST"
              },
              "Id": "${APP_NAME}-batch-target",
              "Arn": "${ecs_cluster_arn}"
          }
      ]
  }
EOS
  # 実際に登録する
  cat put-target-input-json.json
  aws events put-targets --cli-input-json file://put-target-input-json.json
}

# cloudwatch eventのルールを生成する(現状はcron形式のみ)
# create_cron_rule ルール名 cron式 備考
#
# create_cron_rule aw-cms1-cron-test 'cron(0/5 * * * ? *)' '５分おきです'
function create_cron_rule() {
  cat <<EOS > put-rule-input-json.json
  {
     "Name": "$1",
     "ScheduleExpression": "$2",
     "Description": "$3"
  }
EOS
  aws events put-rule --cli-input-json file://put-rule-input-json.json
}
