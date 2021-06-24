# このDockerfileはローカルのdocker-compse環境で動作します。
# 本番用のDockerfileとの整合性に注意して変更すること。
# containers/ecs/rails/Dockerfile
FROM ruby:2.7.2

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN set -ex \
    && wget -qO- https://deb.nodesource.com/setup_10.x | bash - \
    && apt-get update \
    && apt-get install -y \
    default-mysql-client \
    imagemagick \
    unzip \
    nodejs \
    fonts-vlgothic \
    locales \
    locales-all \
    vim \
    # for chrome packages
    fonts-liberation libxshmfence1 libappindicator3-1 libasound2 libnspr4 libxtst6 libnss3 libxss1 xdg-utils libx11-xcb1 libdrm2 libgbm1 libxcb-dri3-0 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && curl -O https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
    && dpkg -i google-chrome-stable_current_amd64.deb \
    && npm install -g yarn
ENV LANG ja_JP.UTF-8
ENV HISTFILE=/usr/src/app/.bash_history

# ローカルではGemはvolume、ソースはホスト側にマウントされるので不要
# ADD Gemfile /usr/src/app/
# ADD Gemfile.lock /usr/src/app/
# RUN bundle install --system
# ADD . /usr/src/app

EXPOSE 3000

CMD bin/start_server.sh
