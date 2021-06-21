# このDockerfileは本番のecs環境で動作します。
# ローカル用のDockerfileとの整合性に注意して変更すること。
# containers/local/rails/Dockerfile
FROM ruby:2.7.3

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN set -ex \
    && wget -qO- https://deb.nodesource.com/setup_12.x | bash - \
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
    sudo \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g yarn
ENV LANG ja_JP.UTF-8
ENV HISTFILE=/usr/src/app/.bash_history

ADD Gemfile /usr/src/app/
ADD Gemfile.lock /usr/src/app/
RUN bundle install --system
ADD . /usr/src/app


##############################
# 暫定の仕組みなので一旦Dockerfileの最後に

# ssmのインストール
# https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-install-managed-linux.html
RUN curl https://s3.ap-northeast-1.amazonaws.com/amazon-ssm-ap-northeast-1/latest/debian_amd64/amazon-ssm-agent.deb -o /tmp/amazon-ssm-agent.deb \
    && dpkg -i /tmp/amazon-ssm-agent.deb \
    && cp /etc/amazon/ssm/seelog.xml.template /etc/amazon/ssm/seelog.xml
##############################

EXPOSE 3000
