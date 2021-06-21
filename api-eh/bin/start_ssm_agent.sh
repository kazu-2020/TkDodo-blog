#!/bin/bash

# エラーで処理中断
set -ex

if [ "${RUN_SSM}" == "1" -a "${SSM_AGENT_ID}" != "" ]; then
  echo [START] ssm agent


  # TODO: やばいので直す
  # 起動のたびにActivationを一つ消費していく。一度activationを作った後、クライアント側のその情報の保存方法がわからなかったので
  # 仕方なしにコンテナ起動のたびに新規インスタンスをactivationする方式にしている。
  # この場合、Activation設定の登録済みインスタンス上限までしか登録できないのと、過去の登録済みインスタンスも残ってしまうので、
  # それらはcliまたはコンソールから消しておくこと（料金がかかってしまうはず)
  amazon-ssm-agent -register -code "${SSM_AGENT_CODE}" -id "${SSM_AGENT_ID}" -region "ap-northeast-1"

  # agent 起動
  amazon-ssm-agent &
else
  echo [CANCEL] run ssm agent
fi

