FROM ruby:3.0.2-slim-buster

ENV LANG ja_JP.UTF-8

RUN apt update \
    && apt install -y \
            build-essential \
            curl \
            default-libmysqlclient-dev \
            imagemagick \
            unzip \
            fonts-vlgothic \
            locales \
            locales-all \
            vim \
            --no-install-recommends \
    && curl -sL https://deb.nodesource.com/setup_16.x | bash - \
    && apt update  \
    && apt install -y --no-install-recommends \
            nodejs \
    && apt -y clean \
    && rm -rf /var/cache/apt/archives/* \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
    && truncate -s 0 /var/log/*log \
    && npm install -g yarn \
    && gem update --system && gem install bundler

ENV APP_HOME /app
RUN mkdir -p $APP_HOME
WORKDIR $APP_HOME

ADD Gemfile $APP_HOME/Gemfile
ADD Gemfile.lock $APP_HOME/Gemfile.lock

CMD ["/usr/bin/bash"]
