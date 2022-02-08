#!/bin/bash

# エラーで処理中断
set -ex

if [ "${LOCAL_DOCKER_COMPOSE_MODE}" = "" ]; then
  ln -sf /dev/stdout /usr/src/app/log/${RAILS_ENV}.log
fi

if [ "${BATCH_MODE}" = "1" ]; then
  echo "sidekiq off (BATCH_MODE: ${BATCH_MODE})"
  tail -f /dev/null
else
  mkdir -p tmp
  bundle exec sidekiq &
  SIDEKIQ_PID=$!

  sidekiq_stopper() {
    # 新規ジョブの受付を停止する
    # https://github.com/mperham/sidekiq/wiki/Signals#tstp
    echo "[Sidekiq] Stopped queuing."
    kill -TSTP $SIDEKIQ_PID

    $(ps -f --pid $SIDEKIQ_PID | grep -v PID | grep -E "\[0 of [0-9]+ busy\]" > /dev/null) && :
    IS_RUNNING_QUEUE=$?
    if [ $IS_RUNNING_QUEUE -eq 0 ]; then
      echo '[Sidekiq] All queues completed.'
    else
      echo "[Sidekiq] Running queue..."
    fi

    # Sidekiqを停止する
    # https://github.com/mperham/sidekiq/wiki/Signals#term
    echo "[Sidekiq] Terminated."
    kill -TERM $SIDEKIQ_PID
    wait $SIDEKIQ_PID

    exit 0
  }

  trap sidekiq_stopper SIGTERM SIGINT

  wait $SIDEKIQ_PID
fi
