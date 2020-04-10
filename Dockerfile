FROM node:12.16-alpine

ENV APP_HOME /playlist
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

RUN apk update && \
	yarn install && \
	yarn global add @vue/cli && \
    rm -rf /var/cache/apk/*

COPY package.json $APP_HOME/
RUN yarn install
