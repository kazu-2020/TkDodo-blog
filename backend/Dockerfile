FROM ruby:2.7.2-alpine3.12

ENV LANG C.UTF-8
RUN apk upgrade && \
    apk add --no-cache \
    bash \
    build-base \
    curl-dev \
    git \
    imagemagick \
    imagemagick-dev \
    less \
    libxml2-dev \
    libxslt-dev \
    mysql-client \
    mysql-dev \
    nodejs \
    yarn \
    openssl \
    readline \
    readline-dev \
    rsync \
    tar \
    ttf-freefont \
    tzdata \
    udev \
    wget \
    yaml \
    yaml-dev\
    zip \
    zlib \
    zlib-dev

RUN gem install bundler
RUN gem update

ENV APP_HOME /app
RUN mkdir $APP_HOME

WORKDIR $APP_HOME

ADD Gemfile $APP_HOME/Gemfile
ADD Gemfile.lock $APP_HOME/Gemfile.lock

RUN bundle install -j8
RUN yarn install
ADD . $APP_HOME

CMD ["bundle", "exec", "jets", "server", '--host', '0.0.0.0']
