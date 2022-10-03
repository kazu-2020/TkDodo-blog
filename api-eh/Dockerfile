FROM ruby:3.0.2-slim-buster

ENV LANG ja_JP.UTF-8

SHELL ["/bin/bash", "-c"]

RUN apt update \
    && curl -sL https://deb.nodesource.com/setup_14.x | bash - \
    && apt install -y \
            build-essential \
            default-libmysqlclient-dev \
            imagemagick \
            unzip \
            nodejs \
            npm \
            fonts-vlgothic \
            locales \
            locales-all \
            vim \
            --no-install-recommends \
    && npm install -g yarn \
    && apt -y clean \
    && rm -rf /var/lib/apt/lists/*

ENV APP_HOME /app
RUN mkdir $APP_HOME

WORKDIR $APP_HOME

ADD Gemfile $APP_HOME/Gemfile
ADD Gemfile.lock $APP_HOME/Gemfile.lock

RUN gem install bundler && bundle install -j8

ADD . $APP_HOME

CMD ["bundle", "exec", "rails", "server", '-b', '0.0.0.0']
