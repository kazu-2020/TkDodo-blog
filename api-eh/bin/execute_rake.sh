#!/bin/bash

# エラーで処理中断
set -ex

if [ "${LOCAL_DOCKER_COMPOSE_MODE}" = "" ]; then
  ln -sf /dev/stdout /usr/src/app/log/${RAILS_ENV}.log
fi

bundle exec rake $0
