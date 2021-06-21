#! /bin/bash

# エラーで処理中断
set -ex

# build&deploy共通の環境変数取り込み
source ${BASH_SOURCE%/*}/env.sh

# バージョンタグ
export SHA1=$1
# デプロイ環境
export ENV=$2
export CACHE_ROOT=${3:-~/caches/bundle}

ls -l $CACHE_ROOT

# bundle install
BUNDLE_CACHE_PATH=${CACHE_ROOT}/bundle
time cd api-eh
time bundle install --path=${BUNDLE_CACHE_PATH}

yarn config set cache-folder ${CACHE_ROOT}/yarn
time yarn install

# assets precompile

# rails 自体は production build するものの、環境変数自体は dev 向けに設定
# source ./infra/dev/containers/ecs/${ENV}.env
source ./infra/dev/containers/ecs/dev.env
APP_DOMAIN=${APP_DOMAIN} ASSET_SYNC=true RAILS_ENV=${ENV} bundle exec rails webpacker:compile --trace

echo $SHA1 > vcs_version

# ecrログイン
$(aws ecr get-login --region ap-northeast-1 --no-include-email)
# Docker Hubログイン
echo ${DOCKERHUB_PASS} | docker login -u ${DOCKERHUB_USER} --password-stdin

# rails作成
build_rails_image() {
  echo start rails cotaniner build

  # 最新のイメージをpullしておいてキャッシュに使う
  # 本当はブランチも一致させたいが、キャッシュなのでよしとする
  local image_count=$(aws ecr describe-images --repository-name ${APP_NAME}-app --query 'length(imageDetails)')
  if [ "${image_count}" != "0" ] ; then
    local latest_image=${CONTAINER_REGISTRY}/${APP_NAME}-app:$(aws ecr describe-images --repository-name ${APP_NAME}-app --query 'max_by(imageDetails,&imagePushedAt)' | jq -r '.imageTags[0]')
    docker pull ${latest_image}
  fi

  local rails_image_name=${CONTAINER_REGISTRY}/${APP_NAME}-app:${ENV}_${SHA1}
  if [ "${image_count}" != "0" ] ; then
    # キャッシュがある場合はキャッシュも使う
    docker build --cache-from ${latest_image} -t ${rails_image_name} -f ./infra/dev/containers/ecs/rails/Dockerfile .
  else
    docker build -t ${rails_image_name} -f ./infra/dev/containers/ecs/rails/Dockerfile .
  fi
  # dir -p ~/caches/docker
  # ocker save -o ~/caches/docker/rails-dockerimage.tar $(docker history ${rails_image_name} -q | grep -v missing)
  time docker push ${rails_image_name}
  echo end rails container build
}
export -f build_rails_image

# # -P で並列にビルドを行う
# cat <<EOS | xargs -P 2 -Icommand bash -c "set -ex; \command"
# build_rails_image
# EOS

build_rails_image
