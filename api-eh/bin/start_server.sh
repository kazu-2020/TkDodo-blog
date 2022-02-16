#!/bin/bash

# エラーで処理中断
set -ex

if [ "${LOCAL_DOCKER_COMPOSE_MODE}" = "" ]; then
  ln -sf /dev/stdout /usr/src/app/log/${RAILS_ENV}.log
fi

bundle exec rails db:create
bundle exec rails db:migrate

if [ "${MANUAL}" = "1" ] ; then
  echo "[MANUAL MODE]"
  tail -f /dev/null
else

  ##########################################
  # 一旦調査用 TODO: もっといい組み込み方探す
  ###########################################
  # ${BASH_SOURCE%/*}/start_ssm_agent.sh

  ${BASH_SOURCE%/*}/start_rails
fi
