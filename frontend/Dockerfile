FROM node:12.16-alpine

ENV APP_HOME /app
ENV HOST 0.0.0.0

RUN mkdir $APP_HOME
WORKDIR $APP_HOME

RUN apk update && \
	yarn install && \
	yarn global add @vue/cli && \
	rm -rf /var/cache/apk/*

COPY package.json yarn.lock $APP_HOME/
RUN yarn install

COPY . .
RUN yarn build

EXPOSE 8080
CMD ["yarn", "start"]
