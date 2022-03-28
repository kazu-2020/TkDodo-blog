#!/bin/bash

# アプリケーション名
export APP_PREFIX=tomigaya-
export APP_NAME=editorialhands
export CLUSTER_APP_NAME=editorialhands
export AWS_ACCOUNT_ID=359601428599
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
# latest_task_definition aw-cms1-dev
# => arn:aws:ecs:ap-northeast-1:360128825233:task-definition/aw-cms1-dev:43
function latest_task_definition () {
  local cluster_name=$1
  aws ecs list-task-definitions --family-prefix $cluster_name --sort DESC --max-items 1 | jq -r '.taskDefinitionArns[0]'
}
