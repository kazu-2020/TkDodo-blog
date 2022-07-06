FROM node:18-alpine

ENV APP_HOME /app

RUN mkdir $APP_HOME
WORKDIR $APP_HOME

RUN npm install -g pnpm@7

COPY package.json pnpm-lock.yaml $APP_HOME

COPY . .

EXPOSE 3000
